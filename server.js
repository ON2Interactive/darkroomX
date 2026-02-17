const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = __dirname;

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, "utf8");
  content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .forEach((line) => {
      const idx = line.indexOf("=");
      if (idx <= 0) return;
      const key = line.slice(0, idx).trim();
      let value = line.slice(idx + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (!(key in process.env)) {
        process.env[key] = value;
      }
    });
}

loadEnvFile(path.join(ROOT, ".env"));

const PORT = Number(process.env.PORT || 4174);
const printAssets = new Map();
const subscriptionAccessCache = new Map();

const MIME_BY_EXT = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};
const RAW_FILE_EXTENSIONS = new Set(["dng", "cr2", "cr3", "nef", "arw", "rw2", "orf", "raf", "pef", "srw", "x3f"]);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    "Cache-Control": "no-store",
  });
  res.end(body);
}

function normalizeEnvValue(value) {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

function isValidHttpUrl(value) {
  if (!value) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

function buildGoogleGenerateEndpoint(model) {
  return `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
}

function normalizeModelName(value) {
  const normalized = normalizeEnvValue(value);
  if (!normalized) return "nano-banana-pro-preview";
  if (!/^[a-zA-Z0-9._-]+$/.test(normalized)) return "nano-banana-pro-preview";
  return normalized;
}

function isLikelyGoogleApiKey(value) {
  return /^AIza[0-9A-Za-z_-]{20,}$/.test(value || "");
}

function normalizeGoogleApiKey(value) {
  const normalized = normalizeEnvValue(value);
  // Vercel copy/paste can accidentally include hidden newlines/spaces.
  const noWhitespace = normalized.replace(/\s+/g, "");
  // Keep only characters valid for Google API keys to avoid hidden unicode/control chars.
  return noWhitespace.replace(/[^A-Za-z0-9_-]/g, "");
}

function getImageEditSystemInstruction() {
  const fromEnv = normalizeEnvValue(process.env.GOOGLE_IMAGE_EDIT_SYSTEM_INSTRUCTION);
  if (fromEnv) return fromEnv;
  return [
    "You are a professional photo retoucher and colorist.",
    "Apply only the user's explicit edit request to the provided image.",
    "Preserve all other image content, composition, subject identity, camera angle, framing, background, and objects unless the user explicitly asks to change them.",
    "Do not add, remove, or alter unrelated regions.",
    "Keep results photorealistic, clean, and high quality.",
  ].join(" ");
}

function getPublicBaseUrl(req) {
  const fromEnv = process.env.PEECHO_PUBLIC_BASE_URL || process.env.PUBLIC_BASE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  const host = req.headers.host;
  if (!host) return "";
  const forwardedProto = String(req.headers["x-forwarded-proto"] || "").split(",")[0].trim().toLowerCase();
  const protocol = forwardedProto === "https" ? "https" : "http";
  return `${protocol}://${host}`;
}

function decodeDataUrl(dataUrl) {
  const match = /^data:(.*?);base64,(.*)$/.exec(dataUrl || "");
  if (!match) return null;
  return {
    mimeType: match[1] || "image/png",
    buffer: Buffer.from(match[2], "base64"),
  };
}

function getPeechoSecretHash(orderId) {
  const raw = `${orderId || ""}${process.env.PEECHO_API_SECRET || ""}`;
  return crypto.createHash("sha256").update(raw).digest("hex");
}

function getSupabaseConfig(req) {
  const url = normalizeEnvValue(process.env.SUPABASE_URL || "");
  const anonKey = normalizeEnvValue(process.env.SUPABASE_ANON_KEY || "");
  const serviceRoleKey = normalizeEnvValue(process.env.SUPABASE_SERVICE_ROLE_KEY || "");
  const redirectFromEnv = normalizeEnvValue(process.env.SUPABASE_AUTH_REDIRECT_URL || "");
  const signupCreditsRaw = Number(process.env.SUPABASE_SIGNUP_CREDITS || "1000");
  const signupCredits = Number.isFinite(signupCreditsRaw) ? Math.max(0, Math.floor(signupCreditsRaw)) : 1000;
  const derivedRedirect = `${getPublicBaseUrl(req)}/auth/callback`.replace(/([^:]\/)\/+/g, "$1");
  const redirectUrl = isValidHttpUrl(redirectFromEnv) ? redirectFromEnv : derivedRedirect;
  return { url: url.replace(/\/$/, ""), anonKey, serviceRoleKey, redirectUrl, signupCredits };
}

function getStripeConfig(req) {
  const secretKey = normalizeEnvValue(process.env.STRIPE_SECRET_KEY || "");
  const publishableKey = normalizeEnvValue(process.env.STRIPE_PUBLISHABLE_KEY || "");
  const subscriptionPriceId = normalizeEnvValue(process.env.STRIPE_SUBSCRIPTION_PRICE_ID || "");
  const topupPriceId = normalizeEnvValue(process.env.STRIPE_TOPUP_PRICE_ID || "");
  const topupCreditsRaw = Number(process.env.STRIPE_TOPUP_CREDITS || "100");
  const topupCredits = Number.isFinite(topupCreditsRaw) ? Math.max(1, Math.floor(topupCreditsRaw)) : 100;
  const baseUrl = getPublicBaseUrl(req);
  const successUrl = normalizeEnvValue(process.env.STRIPE_SUCCESS_URL || `${baseUrl}/pricing?success=1`);
  const cancelUrl = normalizeEnvValue(process.env.STRIPE_CANCEL_URL || `${baseUrl}/pricing?canceled=1`);
  const billingPortalReturnUrl = normalizeEnvValue(process.env.STRIPE_BILLING_PORTAL_RETURN_URL || `${baseUrl}/editor`);
  return {
    secretKey,
    publishableKey,
    subscriptionPriceId,
    topupPriceId,
    topupCredits,
    successUrl,
    cancelUrl,
    billingPortalReturnUrl,
  };
}

function getCloudConvertConfig() {
  const apiKey = normalizeEnvValue(process.env.CLOUDCONVERT_API_KEY || "");
  const outputFormatRaw = normalizeEnvValue(process.env.CLOUDCONVERT_RAW_OUTPUT_FORMAT || "jpg").toLowerCase();
  const outputFormat = /^[a-z0-9]+$/.test(outputFormatRaw) ? outputFormatRaw : "jpg";
  const jpgQualityRaw = Number(process.env.CLOUDCONVERT_RAW_JPG_QUALITY || "100");
  const jpgQuality = Number.isFinite(jpgQualityRaw) ? Math.max(1, Math.min(100, Math.floor(jpgQualityRaw))) : 100;
  const timeoutMsRaw = Number(process.env.CLOUDCONVERT_RAW_TIMEOUT_MS || "120000");
  const timeoutMs = Number.isFinite(timeoutMsRaw) ? Math.max(10_000, Math.min(600_000, Math.floor(timeoutMsRaw))) : 120_000;
  return { apiKey, outputFormat, jpgQuality, timeoutMs };
}

function getTrialWindowMs() {
  const hoursRaw = Number(process.env.TRIAL_HOURS || "24");
  const hours = Number.isFinite(hoursRaw) ? Math.max(1, Math.min(168, Math.floor(hoursRaw))) : 24;
  return hours * 60 * 60 * 1000;
}

function getAccessBypassEmailSet() {
  const csv = normalizeEnvValue(process.env.ACCESS_BYPASS_EMAILS || "");
  const set = new Set(
    csv
      .split(",")
      .map((value) => String(value || "").trim().toLowerCase())
      .filter(Boolean),
  );
  const adminEmail = normalizeEnvValue(process.env.ADMIN_LOGIN_EMAIL || "").toLowerCase();
  if (adminEmail) set.add(adminEmail);
  return set;
}

function userHasAccessBypass(user) {
  const email = String(user?.email || "").trim().toLowerCase();
  if (!email) return false;
  return getAccessBypassEmailSet().has(email);
}

function isSubscriptionActiveStatus(status) {
  return status === "active" || status === "trialing";
}

function getCachedSubscriptionAccess(userId) {
  const key = String(userId || "").trim();
  if (!key) return null;
  const cached = subscriptionAccessCache.get(key);
  if (!cached) return null;
  if (Date.now() > cached.expiresAt) {
    subscriptionAccessCache.delete(key);
    return null;
  }
  return cached;
}

function setCachedSubscriptionAccess(userId, active, customerId = "") {
  const key = String(userId || "").trim();
  if (!key) return;
  subscriptionAccessCache.set(key, {
    active: Boolean(active),
    customerId: String(customerId || "").trim(),
    expiresAt: Date.now() + 60 * 1000,
  });
}

function clearCachedSubscriptionAccess(userId) {
  const key = String(userId || "").trim();
  if (!key) return;
  subscriptionAccessCache.delete(key);
}

function parseStripeSignatureHeader(headerValue) {
  const parts = String(headerValue || "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  const parsed = {};
  parts.forEach((part) => {
    const idx = part.indexOf("=");
    if (idx <= 0) return;
    const key = part.slice(0, idx);
    const value = part.slice(idx + 1);
    if (!parsed[key]) parsed[key] = [];
    parsed[key].push(value);
  });
  return parsed;
}

function verifyStripeWebhookSignature(rawBody, signatureHeader, webhookSecret) {
  if (!webhookSecret) return false;
  const parsed = parseStripeSignatureHeader(signatureHeader);
  const timestamp = parsed.t?.[0];
  const signatures = parsed.v1 || [];
  if (!timestamp || signatures.length === 0) return false;

  const expected = crypto.createHmac("sha256", webhookSecret).update(`${timestamp}.${rawBody}`).digest("hex");
  const expectedBuffer = Buffer.from(expected, "utf8");
  const signatureMatches = signatures.some((sig) => {
    const actualBuffer = Buffer.from(String(sig), "utf8");
    if (actualBuffer.length !== expectedBuffer.length) return false;
    return crypto.timingSafeEqual(actualBuffer, expectedBuffer);
  });
  if (!signatureMatches) return false;

  const timestampSeconds = Number(timestamp);
  if (!Number.isFinite(timestampSeconds)) return false;
  const ageSeconds = Math.abs(Math.floor(Date.now() / 1000) - timestampSeconds);
  return ageSeconds <= 300;
}

async function stripeApiRequest(secretKey, endpoint, { method = "GET", params = null } = {}) {
  const url = new URL(`https://api.stripe.com/v1/${endpoint.replace(/^\//, "")}`);
  const requestMethod = String(method || "GET").toUpperCase();
  const headers = {
    Authorization: `Bearer ${secretKey}`,
  };
  const options = {
    method: requestMethod,
    headers,
  };

  if (requestMethod === "GET" && params) {
    for (const [key, value] of params.entries()) {
      url.searchParams.append(key, value);
    }
  } else if (params) {
    headers["Content-Type"] = "application/x-www-form-urlencoded";
    options.body = params.toString();
  }

  const response = await fetch(url.toString(), options);
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const message = payload?.error?.message || `Stripe request failed (${response.status}).`;
    return { ok: false, status: response.status || 502, error: message, payload };
  }
  return { ok: true, payload };
}

async function findStripeCustomerByEmail(secretKey, email, userId = "") {
  const params = new URLSearchParams();
  params.set("email", email);
  params.set("limit", "10");
  const customerResponse = await stripeApiRequest(secretKey, "customers", { method: "GET", params });
  if (!customerResponse.ok) return customerResponse;
  const customers = Array.isArray(customerResponse.payload?.data) ? customerResponse.payload.data : [];
  if (customers.length === 0) return { ok: true, customer: null };
  const matchedByUserId = customers.find((customer) => String(customer?.metadata?.supabase_user_id || "") === userId);
  return { ok: true, customer: matchedByUserId || customers[0] };
}

async function getOrCreateStripeCustomerForUser(secretKey, user) {
  const email = String(user?.email || "").trim().toLowerCase();
  const userId = String(user?.id || "").trim();
  if (!email || !userId) {
    return { ok: false, status: 400, error: "Missing user fields for Stripe customer." };
  }

  const found = await findStripeCustomerByEmail(secretKey, email, userId);
  if (!found.ok) return found;
  if (found.customer?.id) return { ok: true, customerId: found.customer.id };

  const params = new URLSearchParams();
  params.set("email", email);
  params.set("metadata[supabase_user_id]", userId);
  const displayName = getUsernameFromSupabaseUser(user);
  if (displayName) params.set("name", displayName);

  const createResponse = await stripeApiRequest(secretKey, "customers", { method: "POST", params });
  if (!createResponse.ok) return createResponse;
  return { ok: true, customerId: String(createResponse.payload?.id || "") };
}

async function hasActiveSubscriptionForCustomer(secretKey, customerId, subscriptionPriceId = "") {
  const params = new URLSearchParams();
  params.set("customer", customerId);
  params.set("status", "all");
  params.set("limit", "20");
  const subscriptionResponse = await stripeApiRequest(secretKey, "subscriptions", { method: "GET", params });
  if (!subscriptionResponse.ok) return subscriptionResponse;

  const subscriptions = Array.isArray(subscriptionResponse.payload?.data) ? subscriptionResponse.payload.data : [];
  const active = subscriptions.some((subscription) => {
    if (!isSubscriptionActiveStatus(String(subscription?.status || ""))) return false;
    if (!subscriptionPriceId) return true;
    const items = Array.isArray(subscription?.items?.data) ? subscription.items.data : [];
    return items.some((item) => String(item?.price?.id || "") === subscriptionPriceId);
  });
  return { ok: true, active };
}

async function ensureUserHasActiveSubscription(req, user) {
  const config = getStripeConfig(req);
  if (!config.secretKey || !config.subscriptionPriceId) {
    return { ok: true, active: false, enforced: true };
  }

  const userId = String(user?.id || "").trim();
  const cached = getCachedSubscriptionAccess(userId);
  if (cached) {
    return { ok: true, active: cached.active, customerId: cached.customerId, enforced: true };
  }

  const found = await findStripeCustomerByEmail(config.secretKey, String(user?.email || "").trim().toLowerCase(), userId);
  if (!found.ok) return found;
  if (!found.customer?.id) {
    setCachedSubscriptionAccess(userId, false, "");
    return { ok: true, active: false, customerId: "", enforced: true };
  }

  const customerId = String(found.customer.id || "");
  const subscriptionState = await hasActiveSubscriptionForCustomer(config.secretKey, customerId, config.subscriptionPriceId);
  if (!subscriptionState.ok) return subscriptionState;

  setCachedSubscriptionAccess(userId, subscriptionState.active, customerId);
  return { ok: true, active: Boolean(subscriptionState.active), customerId, enforced: true };
}

async function getUserProfileCreatedAt(req, userId) {
  const service = getSupabaseServiceHeaders(req);
  if (!service.ok) {
    return { ok: false, status: 500, error: service.error };
  }
  const { config, headers } = service;
  const response = await fetch(
    `${config.url}/rest/v1/profiles?select=id,created_at&id=eq.${encodeURIComponent(userId)}&limit=1`,
    {
      method: "GET",
      headers,
    },
  );
  if (!response.ok) {
    const reason = await response.text().catch(() => "");
    return { ok: false, status: 502, error: `Unable to read profile for trial status.${reason ? ` ${reason}` : ""}` };
  }
  const rows = await response.json().catch(() => []);
  const profile = Array.isArray(rows) ? rows[0] : null;
  if (!profile) {
    return { ok: false, status: 404, error: "Profile not found." };
  }
  const createdAt = String(profile?.created_at || "");
  const createdAtMs = Date.parse(createdAt);
  if (!Number.isFinite(createdAtMs)) {
    return { ok: false, status: 500, error: "Profile created_at is invalid." };
  }
  return { ok: true, createdAt, createdAtMs };
}

async function getUserAccessStatus(req, user) {
  const userId = String(user?.id || "").trim();
  if (!userId) {
    return { ok: false, status: 401, error: "Unauthorized." };
  }

  if (userHasAccessBypass(user)) {
    const nowMs = Date.now();
    return {
      ok: true,
      enforced: false,
      bypassed: true,
      subscriptionActive: true,
      trialActive: true,
      accessAllowed: true,
      trialStartsAt: new Date(nowMs).toISOString(),
      trialEndsAt: new Date(nowMs + getTrialWindowMs()).toISOString(),
      now: new Date(nowMs).toISOString(),
    };
  }

  const subscriptionAccess = await ensureUserHasActiveSubscription(req, user);
  if (!subscriptionAccess.ok) return subscriptionAccess;

  const created = await getUserProfileCreatedAt(req, userId);
  if (!created.ok) return created;

  const trialWindowMs = getTrialWindowMs();
  const trialEndsAtMs = created.createdAtMs + trialWindowMs;
  const nowMs = Date.now();
  const trialActive = nowMs < trialEndsAtMs;
  const subscriptionActive = Boolean(subscriptionAccess.active);
  const accessAllowed = subscriptionActive || trialActive;

  return {
    ok: true,
    enforced: true,
    subscriptionActive,
    trialActive,
    accessAllowed,
    trialStartsAt: new Date(created.createdAtMs).toISOString(),
    trialEndsAt: new Date(trialEndsAtMs).toISOString(),
    now: new Date(nowMs).toISOString(),
  };
}

function createSupabaseRequestHeaders({ apiKey, bearerToken, prefer } = {}) {
  const headers = {
    "Content-Type": "application/json",
  };
  if (apiKey) headers.apikey = apiKey;
  if (bearerToken) headers.Authorization = `Bearer ${bearerToken}`;
  if (prefer) headers.Prefer = prefer;
  return headers;
}

function getUsernameFromSupabaseUser(user) {
  const email = String(user?.email || "").trim();
  const fallback = email.includes("@") ? email.split("@")[0] : "darkroomx-user";
  const fromMeta =
    String(
      user?.user_metadata?.preferred_username ||
        user?.user_metadata?.user_name ||
        user?.user_metadata?.name ||
        user?.user_metadata?.full_name ||
        "",
    ).trim() || fallback;
  return fromMeta.slice(0, 64);
}

async function fetchSupabaseUserByAccessToken(accessToken, req) {
  const config = getSupabaseConfig(req);
  if (!config.url || !config.anonKey) {
    return { ok: false, status: 500, error: "Supabase auth is not configured." };
  }

  try {
    const response = await fetch(`${config.url}/auth/v1/user`, {
      method: "GET",
      headers: createSupabaseRequestHeaders({ apiKey: config.anonKey, bearerToken: accessToken }),
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok || !payload?.id) {
      return { ok: false, status: 401, error: "Invalid or expired auth session." };
    }
    return { ok: true, user: payload };
  } catch {
    return { ok: false, status: 502, error: "Unable to validate Supabase session." };
  }
}

async function bootstrapSupabaseUserData(user, req) {
  const config = getSupabaseConfig(req);
  if (!config.url || !config.serviceRoleKey) {
    return { ok: false, status: 500, error: "Supabase service role is not configured." };
  }

  const userId = String(user?.id || "").trim();
  const email = String(user?.email || "").trim();
  if (!userId || !email) {
    return { ok: false, status: 400, error: "Supabase user payload is missing required fields." };
  }

  const serviceHeaders = createSupabaseRequestHeaders({
    apiKey: config.serviceRoleKey,
    bearerToken: config.serviceRoleKey,
  });

  const profileUpsertPayload = [
    {
      id: userId,
      email,
      username: getUsernameFromSupabaseUser(user),
      last_sign_in_at: new Date().toISOString(),
    },
  ];

  const profileUpsertResponse = await fetch(`${config.url}/rest/v1/profiles?on_conflict=id`, {
    method: "POST",
    headers: {
      ...serviceHeaders,
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify(profileUpsertPayload),
  });

  if (!profileUpsertResponse.ok) {
    const reason = await profileUpsertResponse.text().catch(() => "");
    return { ok: false, status: 502, error: `Unable to upsert profile.${reason ? ` ${reason}` : ""}` };
  }

  const signupBonusCheckResponse = await fetch(
    `${config.url}/rest/v1/credit_ledger?select=id&user_id=eq.${encodeURIComponent(userId)}&reason=eq.signup_bonus&limit=1`,
    {
      method: "GET",
      headers: serviceHeaders,
    },
  );

  if (!signupBonusCheckResponse.ok) {
    const reason = await signupBonusCheckResponse.text().catch(() => "");
    return { ok: false, status: 502, error: `Unable to inspect credit history.${reason ? ` ${reason}` : ""}` };
  }

  const signupBonusRows = await signupBonusCheckResponse.json().catch(() => []);
  const hasSignupBonus = Array.isArray(signupBonusRows) && signupBonusRows.length > 0;
  let createdSignupMarker = false;

  if (!hasSignupBonus) {
    const ledgerInsertResponse = await fetch(`${config.url}/rest/v1/credit_ledger`, {
      method: "POST",
      headers: {
        ...serviceHeaders,
        Prefer: "return=minimal",
      },
      body: JSON.stringify([
        {
          user_id: userId,
          project_id: null,
          delta: config.signupCredits,
          reason: "signup_bonus",
          source: "signup_bootstrap",
        },
      ]),
    });

    if (!ledgerInsertResponse.ok && ledgerInsertResponse.status !== 409) {
      const reason = await ledgerInsertResponse.text().catch(() => "");
      return { ok: false, status: 502, error: `Unable to create starter credits.${reason ? ` ${reason}` : ""}` };
    }
    if (ledgerInsertResponse.ok) {
      createdSignupMarker = true;
    }
  }

  const creditsResponse = await fetch(`${config.url}/rest/v1/credit_ledger?select=delta&user_id=eq.${encodeURIComponent(userId)}`, {
    method: "GET",
    headers: serviceHeaders,
  });
  if (!creditsResponse.ok) {
    const reason = await creditsResponse.text().catch(() => "");
    return { ok: false, status: 502, error: `Unable to read credits.${reason ? ` ${reason}` : ""}` };
  }
  const creditRows = await creditsResponse.json().catch(() => []);
  const creditsBalance = Array.isArray(creditRows)
    ? creditRows.reduce((sum, row) => sum + Number(row?.delta || 0), 0)
    : 0;

  const profileCreditsUpdateResponse = await fetch(`${config.url}/rest/v1/profiles?id=eq.${encodeURIComponent(userId)}`, {
    method: "PATCH",
    headers: {
      ...serviceHeaders,
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ credits_balance: creditsBalance }),
  });

  if (!profileCreditsUpdateResponse.ok) {
    const reason = await profileCreditsUpdateResponse.text().catch(() => "");
    return { ok: false, status: 502, error: `Unable to update profile credits.${reason ? ` ${reason}` : ""}` };
  }

  const activeProjectResponse = await fetch(
    `${config.url}/rest/v1/projects?select=id,name,status&user_id=eq.${encodeURIComponent(userId)}&status=eq.active&order=started_at.desc&limit=1`,
    {
      method: "GET",
      headers: serviceHeaders,
    },
  );

  if (!activeProjectResponse.ok) {
    const reason = await activeProjectResponse.text().catch(() => "");
    return { ok: false, status: 502, error: `Unable to read active session.${reason ? ` ${reason}` : ""}` };
  }

  const activeProjects = await activeProjectResponse.json().catch(() => []);
  let activeProject = Array.isArray(activeProjects) && activeProjects[0] ? activeProjects[0] : null;

  if (!activeProject) {
    const sessionName = `Session ${new Date().toISOString().slice(0, 10)}`;
    const createProjectResponse = await fetch(`${config.url}/rest/v1/projects`, {
      method: "POST",
      headers: {
        ...serviceHeaders,
        Prefer: "return=representation",
      },
      body: JSON.stringify([
        {
          user_id: userId,
          name: sessionName,
          status: "active",
        },
      ]),
    });
    if (!createProjectResponse.ok) {
      const reason = await createProjectResponse.text().catch(() => "");
      return { ok: false, status: 502, error: `Unable to create initial session.${reason ? ` ${reason}` : ""}` };
    }
    const created = await createProjectResponse.json().catch(() => []);
    activeProject = Array.isArray(created) && created[0] ? created[0] : null;
  }

  if (createdSignupMarker) {
    sendSignupWelcomeAndNotificationEmail({
      userName: getUsernameFromSupabaseUser(user),
      userEmail: email,
    }).catch((error) => {
      console.error("Signup welcome email failed:", error?.message || error);
    });
  }

  return {
    ok: true,
    profile: {
      id: userId,
      email,
      username: getUsernameFromSupabaseUser(user),
      creditsBalance,
    },
    activeProject,
  };
}

function getGoogleAuthStartUrl(req) {
  const supabaseConfig = getSupabaseConfig(req);
  if (supabaseConfig.url && supabaseConfig.anonKey && supabaseConfig.redirectUrl) {
    const params = new URLSearchParams({
      provider: "google",
      redirect_to: supabaseConfig.redirectUrl,
      scopes: "openid email profile",
      prompt: "select_account",
    });
    return `${supabaseConfig.url}/auth/v1/authorize?${params.toString()}`;
  }

  const explicitStartUrl = normalizeEnvValue(process.env.GOOGLE_AUTH_START_URL || process.env.GOOGLE_OAUTH_START_URL || "");
  if (isValidHttpUrl(explicitStartUrl)) return explicitStartUrl;

  const clientId = normalizeEnvValue(process.env.GOOGLE_OAUTH_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || "");
  const redirectUri = normalizeEnvValue(process.env.GOOGLE_OAUTH_REDIRECT_URI || process.env.GOOGLE_REDIRECT_URI || "");
  if (!clientId || !redirectUri) return "";

  const scope = normalizeEnvValue(process.env.GOOGLE_OAUTH_SCOPE || "openid email profile");
  const state =
    normalizeEnvValue(process.env.GOOGLE_OAUTH_STATE) ||
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope,
    access_type: "offline",
    include_granted_scopes: "true",
    prompt: "select_account",
    state,
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

function isValidEmailAddress(value) {
  const email = String(value || "").trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getRecaptchaConfig() {
  const siteKey = normalizeEnvValue(process.env.RECAPTCHA_SITE_KEY || "");
  const secretKey = normalizeEnvValue(process.env.RECAPTCHA_SECRET_KEY || "");
  const action = normalizeEnvValue(process.env.RECAPTCHA_ACTION || "contact_submit");
  const minScoreRaw = Number(process.env.RECAPTCHA_MIN_SCORE || "0.5");
  const minScore = Number.isFinite(minScoreRaw) ? Math.max(0, Math.min(1, minScoreRaw)) : 0.5;
  return { siteKey, secretKey, action, minScore };
}

function getAdminAuthConfig() {
  return {
    email: normalizeEnvValue(process.env.ADMIN_LOGIN_EMAIL || ""),
    password: normalizeEnvValue(process.env.ADMIN_LOGIN_PASSWORD || ""),
    secret: normalizeEnvValue(process.env.ADMIN_AUTH_SECRET || "darkroomx-admin-secret"),
    cookieName: "drx_admin_auth",
  };
}

function parseCookies(req) {
  const header = String(req.headers.cookie || "");
  if (!header) return {};
  return header.split(";").reduce((acc, part) => {
    const idx = part.indexOf("=");
    if (idx <= 0) return acc;
    const key = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    acc[key] = decodeURIComponent(value);
    return acc;
  }, {});
}

function buildAdminSessionToken() {
  const { email, password, secret } = getAdminAuthConfig();
  return crypto.createHash("sha256").update(`${email}|${password}|${secret}`).digest("hex");
}

function isAdminAuthenticated(req) {
  const { cookieName, email, password } = getAdminAuthConfig();
  if (!email || !password) return false;
  const cookies = parseCookies(req);
  return cookies[cookieName] === buildAdminSessionToken();
}

function setAdminAuthCookie(res) {
  const { cookieName } = getAdminAuthConfig();
  const token = buildAdminSessionToken();
  const isLocal = String(process.env.NODE_ENV || "").toLowerCase() !== "production";
  const secureFlag = isLocal ? "" : "; Secure";
  res.setHeader("Set-Cookie", `${cookieName}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800${secureFlag}`);
}

function clearAdminAuthCookie(res) {
  const { cookieName } = getAdminAuthConfig();
  res.setHeader("Set-Cookie", `${cookieName}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
}

function handleAdminLogin(req, res) {
  let raw = "";
  req.on("data", (chunk) => {
    raw += chunk;
    if (raw.length > 64 * 1024) req.destroy();
  });

  req.on("end", () => {
    try {
      const payload = JSON.parse(raw || "{}");
      const email = String(payload?.email || "").trim();
      const password = String(payload?.password || "");
      const config = getAdminAuthConfig();

      if (!config.email || !config.password) {
        return sendJson(res, 500, { error: "Admin login is not configured." });
      }
      if (email !== config.email || password !== config.password) {
        return sendJson(res, 401, { error: "Invalid credentials." });
      }

      setAdminAuthCookie(res);
      return sendJson(res, 200, { ok: true });
    } catch (error) {
      return sendJson(res, 400, { error: error?.message || "Invalid request payload." });
    }
  });
}

function handleAdminLogout(_req, res) {
  clearAdminAuthCookie(res);
  return sendJson(res, 200, { ok: true });
}

function parseJsonBody(req, maxBytes = 64 * 1024) {
  return new Promise((resolve, reject) => {
    let raw = "";
    let closed = false;
    req.on("data", (chunk) => {
      if (closed) return;
      raw += chunk;
      if (raw.length > maxBytes) {
        closed = true;
        reject(new Error("Request payload too large."));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (closed) return;
      try {
        resolve(JSON.parse(raw || "{}"));
      } catch (error) {
        reject(new Error(error?.message || "Invalid JSON payload."));
      }
    });
    req.on("error", (error) => {
      if (closed) return;
      reject(new Error(error?.message || "Request stream error."));
    });
  });
}

async function cloudConvertApiRequest(endpoint, apiKey, { method = "GET", payload = null, timeoutMs = 120_000, baseUrl = "https://api.cloudconvert.com/v2" } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        ...(payload ? { "Content-Type": "application/json" } : {}),
      },
      body: payload ? JSON.stringify(payload) : undefined,
      signal: controller.signal,
    });
    const json = await response.json().catch(() => ({}));
    if (!response.ok) {
      return { ok: false, status: response.status || 502, error: String(json?.message || json?.error || `CloudConvert request failed (${response.status}).`) };
    }
    return { ok: true, data: json?.data ?? json };
  } catch (error) {
    return { ok: false, status: 502, error: error?.name === "AbortError" ? "CloudConvert request timed out." : String(error?.message || "CloudConvert request failed.") };
  } finally {
    clearTimeout(timer);
  }
}

function parseBinaryBody(req, maxBytes = 80 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;
    let closed = false;
    req.on("data", (chunk) => {
      if (closed) return;
      const part = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      total += part.length;
      if (total > maxBytes) {
        closed = true;
        reject(new Error("Request payload too large."));
        req.destroy();
        return;
      }
      chunks.push(part);
    });
    req.on("end", () => {
      if (closed) return;
      resolve(Buffer.concat(chunks));
    });
    req.on("error", (error) => {
      if (closed) return;
      reject(new Error(error?.message || "Request stream error."));
    });
  });
}

function getFileExtension(value = "") {
  const normalized = String(value || "").trim().toLowerCase();
  const idx = normalized.lastIndexOf(".");
  return idx >= 0 ? normalized.slice(idx + 1) : "";
}

function isLikelyRawFileName(value = "") {
  return RAW_FILE_EXTENSIONS.has(getFileExtension(value));
}

function sanitizeFileName(value = "") {
  const normalized = String(value || "").trim().replace(/[\\/:*?"<>|]+/g, "-");
  return normalized.slice(0, 180) || "raw-image";
}

function buildPreviewFileName(rawName = "") {
  const safe = sanitizeFileName(rawName);
  const dot = safe.lastIndexOf(".");
  const stem = dot > 0 ? safe.slice(0, dot) : safe;
  return `${stem}-preview.jpg`;
}

function extractLargestEmbeddedJpeg(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 4) return null;

  let largestStart = -1;
  let largestEnd = -1;
  let cursor = 0;

  while (cursor < buffer.length - 1) {
    const soi = buffer.indexOf(Buffer.from([0xff, 0xd8]), cursor);
    if (soi < 0) break;
    const eoi = buffer.indexOf(Buffer.from([0xff, 0xd9]), soi + 2);
    if (eoi < 0) break;
    const endExclusive = eoi + 2;
    if (largestStart < 0 || endExclusive - soi > largestEnd - largestStart) {
      largestStart = soi;
      largestEnd = endExclusive;
    }
    cursor = endExclusive;
  }

  if (largestStart < 0 || largestEnd <= largestStart) return null;
  return buffer.slice(largestStart, largestEnd);
}

function getTaskByNameOrOperation(tasks, name, operation) {
  if (!Array.isArray(tasks)) return null;
  return (
    tasks.find((task) => String(task?.name || "") === String(name || "")) ||
    tasks.find((task) => String(task?.operation || "") === String(operation || ""))
  );
}

async function cloudConvertConvertRawToImage(buffer, fileName, { apiKey, outputFormat = "jpg", jpgQuality = 100, timeoutMs = 120_000 } = {}) {
  if (!apiKey) {
    return { ok: false, status: 500, error: "CloudConvert API key is not configured." };
  }
  const inputFormat = getFileExtension(fileName);
  if (!inputFormat) {
    return { ok: false, status: 400, error: "Missing RAW input format." };
  }

  const convertTask = {
    operation: "convert",
    input: "import_raw",
    input_format: inputFormat,
    output_format: outputFormat,
  };
  if (outputFormat === "jpg" || outputFormat === "jpeg") {
    convertTask.quality = Number.isFinite(jpgQuality) ? Math.max(1, Math.min(100, Math.floor(jpgQuality))) : 100;
  }

  const createJob = await cloudConvertApiRequest(
    "/jobs",
    apiKey,
    {
      method: "POST",
      timeoutMs,
      payload: {
        tasks: {
          import_raw: {
            operation: "import/upload",
          },
          convert_raw: convertTask,
          export_converted: {
            operation: "export/url",
            input: "convert_raw",
            inline: true,
          },
        },
      },
    },
  );
  if (!createJob.ok) return createJob;

  const job = createJob.data || {};
  const jobId = String(job?.id || "").trim();
  if (!jobId) {
    return { ok: false, status: 502, error: "CloudConvert job creation returned no job id." };
  }

  const importTask = getTaskByNameOrOperation(job?.tasks, "import_raw", "import/upload");
  let uploadForm = importTask?.result?.form || null;
  let importTaskId = String(importTask?.id || "").trim();

  if (!uploadForm && importTaskId) {
    const taskResult = await cloudConvertApiRequest(`/tasks/${encodeURIComponent(importTaskId)}`, apiKey, { timeoutMs });
    if (!taskResult.ok) return taskResult;
    uploadForm = taskResult.data?.result?.form || null;
  }
  if (!uploadForm?.url || typeof uploadForm?.parameters !== "object") {
    return { ok: false, status: 502, error: "CloudConvert upload form is missing." };
  }

  const formData = new FormData();
  Object.entries(uploadForm.parameters).forEach(([key, value]) => {
    formData.append(key, String(value));
  });
  formData.append("file", new Blob([buffer], { type: "application/octet-stream" }), fileName);

  const uploadResponse = await fetch(String(uploadForm.url), {
    method: "POST",
    body: formData,
    redirect: "follow",
  }).catch(() => null);

  if (!uploadResponse || !uploadResponse.ok) {
    return { ok: false, status: uploadResponse?.status || 502, error: "CloudConvert upload step failed." };
  }

  const waitJob = await cloudConvertApiRequest(
    `/jobs/${encodeURIComponent(jobId)}`,
    apiKey,
    { baseUrl: "https://sync.api.cloudconvert.com/v2", timeoutMs },
  );
  if (!waitJob.ok) return waitJob;
  const finishedJob = waitJob.data || {};
  if (String(finishedJob?.status || "").toLowerCase() === "error") {
    return { ok: false, status: 502, error: "CloudConvert conversion job failed." };
  }

  const exportTask = getTaskByNameOrOperation(finishedJob?.tasks, "export_converted", "export/url");
  const exportFile = Array.isArray(exportTask?.result?.files) ? exportTask.result.files[0] : null;
  const downloadUrl = String(exportFile?.url || "").trim();
  if (!downloadUrl) {
    return { ok: false, status: 502, error: "CloudConvert did not return an output file URL." };
  }

  const outputResponse = await fetch(downloadUrl).catch(() => null);
  if (!outputResponse || !outputResponse.ok) {
    return { ok: false, status: outputResponse?.status || 502, error: "Unable to download CloudConvert output file." };
  }
  const outputBuffer = Buffer.from(await outputResponse.arrayBuffer());
  if (!outputBuffer.length) {
    return { ok: false, status: 502, error: "CloudConvert output file was empty." };
  }
  return {
    ok: true,
    buffer: outputBuffer,
    mimeType: String(outputResponse.headers.get("content-type") || `image/${outputFormat}`),
    fileName: String(exportFile?.filename || buildPreviewFileName(fileName)),
  };
}

async function cloudConvertCreateRawJob(fileName, { apiKey, outputFormat = "jpg", jpgQuality = 100, timeoutMs = 120_000 } = {}) {
  if (!apiKey) {
    return { ok: false, status: 500, error: "CloudConvert API key is not configured." };
  }
  const inputFormat = getFileExtension(fileName);
  if (!inputFormat) {
    return { ok: false, status: 400, error: "Missing RAW input format." };
  }

  const convertTask = {
    operation: "convert",
    input: "import_raw",
    input_format: inputFormat,
    output_format: outputFormat,
  };
  if (outputFormat === "jpg" || outputFormat === "jpeg") {
    convertTask.quality = Number.isFinite(jpgQuality) ? Math.max(1, Math.min(100, Math.floor(jpgQuality))) : 100;
  }

  const createJob = await cloudConvertApiRequest(
    "/jobs",
    apiKey,
    {
      method: "POST",
      timeoutMs,
      payload: {
        tasks: {
          import_raw: {
            operation: "import/upload",
          },
          convert_raw: convertTask,
          export_converted: {
            operation: "export/url",
            input: "convert_raw",
            inline: true,
          },
        },
      },
    },
  );
  if (!createJob.ok) return createJob;

  const job = createJob.data || {};
  const jobId = String(job?.id || "").trim();
  if (!jobId) {
    return { ok: false, status: 502, error: "CloudConvert job creation returned no job id." };
  }

  const importTask = getTaskByNameOrOperation(job?.tasks, "import_raw", "import/upload");
  let uploadForm = importTask?.result?.form || null;
  const importTaskId = String(importTask?.id || "").trim();

  if (!uploadForm && importTaskId) {
    const taskResult = await cloudConvertApiRequest(`/tasks/${encodeURIComponent(importTaskId)}`, apiKey, { timeoutMs });
    if (!taskResult.ok) return taskResult;
    uploadForm = taskResult.data?.result?.form || null;
  }

  if (!uploadForm?.url || typeof uploadForm?.parameters !== "object") {
    return { ok: false, status: 502, error: "CloudConvert upload form is missing." };
  }

  return {
    ok: true,
    jobId,
    uploadForm: {
      url: String(uploadForm.url),
      parameters: uploadForm.parameters,
    },
  };
}

async function cloudConvertFinalizeRawJob(jobId, fileName, { apiKey, outputFormat = "jpg", timeoutMs = 120_000 } = {}) {
  if (!apiKey) {
    return { ok: false, status: 500, error: "CloudConvert API key is not configured." };
  }
  const normalizedJobId = String(jobId || "").trim();
  if (!normalizedJobId) {
    return { ok: false, status: 400, error: "Missing CloudConvert job id." };
  }

  const waitJob = await cloudConvertApiRequest(
    `/jobs/${encodeURIComponent(normalizedJobId)}`,
    apiKey,
    { baseUrl: "https://sync.api.cloudconvert.com/v2", timeoutMs },
  );
  if (!waitJob.ok) return waitJob;
  const finishedJob = waitJob.data || {};
  if (String(finishedJob?.status || "").toLowerCase() === "error") {
    return { ok: false, status: 502, error: "CloudConvert conversion job failed." };
  }

  const exportTask = getTaskByNameOrOperation(finishedJob?.tasks, "export_converted", "export/url");
  const exportFile = Array.isArray(exportTask?.result?.files) ? exportTask.result.files[0] : null;
  const downloadUrl = String(exportFile?.url || "").trim();
  if (!downloadUrl) {
    return { ok: false, status: 502, error: "CloudConvert did not return an output file URL." };
  }

  const outputResponse = await fetch(downloadUrl).catch(() => null);
  if (!outputResponse || !outputResponse.ok) {
    return { ok: false, status: outputResponse?.status || 502, error: "Unable to download CloudConvert output file." };
  }
  const outputBuffer = Buffer.from(await outputResponse.arrayBuffer());
  if (!outputBuffer.length) {
    return { ok: false, status: 502, error: "CloudConvert output file was empty." };
  }

  return {
    ok: true,
    buffer: outputBuffer,
    mimeType: String(outputResponse.headers.get("content-type") || `image/${outputFormat}`),
    fileName: String(exportFile?.filename || buildPreviewFileName(fileName)),
  };
}

async function handleRawPreviewStart(req, res) {
  const auth = await getAuthenticatedSupabaseUser(req);
  if (!auth.ok) {
    return sendJson(res, auth.status || 401, { error: auth.error || "Unauthorized." });
  }
  const accessStatus = await getUserAccessStatus(req, auth.user);
  if (!accessStatus.ok) {
    return sendJson(res, accessStatus.status || 502, { error: accessStatus.error || "Unable to verify access." });
  }
  if (!accessStatus.subscriptionActive && !accessStatus.bypassed) {
    return sendJson(res, 403, { error: "RAW uploads require an active subscription." });
  }
  try {
    const payload = await parseJsonBody(req, 64 * 1024);
    const fileName = sanitizeFileName(String(payload?.fileName || "raw-image"));
    if (!isLikelyRawFileName(fileName)) {
      return sendJson(res, 400, { error: "Unsupported RAW filename." });
    }
    const cloudConvertConfig = getCloudConvertConfig();
    if (!cloudConvertConfig.apiKey) {
      return sendJson(res, 500, { error: "CloudConvert API key is not configured." });
    }

    const start = await cloudConvertCreateRawJob(fileName, cloudConvertConfig);
    if (!start.ok) {
      return sendJson(res, start.status || 502, { error: start.error || "Unable to start RAW conversion." });
    }
    return sendJson(res, 200, {
      ok: true,
      jobId: start.jobId,
      upload: start.uploadForm,
    });
  } catch (error) {
    return sendJson(res, 400, { error: error?.message || "Invalid request payload." });
  }
}

async function handleRawPreviewComplete(req, res) {
  const auth = await getAuthenticatedSupabaseUser(req);
  if (!auth.ok) {
    return sendJson(res, auth.status || 401, { error: auth.error || "Unauthorized." });
  }
  const accessStatus = await getUserAccessStatus(req, auth.user);
  if (!accessStatus.ok) {
    return sendJson(res, accessStatus.status || 502, { error: accessStatus.error || "Unable to verify access." });
  }
  if (!accessStatus.subscriptionActive && !accessStatus.bypassed) {
    return sendJson(res, 403, { error: "RAW uploads require an active subscription." });
  }
  try {
    const payload = await parseJsonBody(req, 64 * 1024);
    const fileName = sanitizeFileName(String(payload?.fileName || "raw-image"));
    const jobId = String(payload?.jobId || "").trim();
    if (!isLikelyRawFileName(fileName)) {
      return sendJson(res, 400, { error: "Unsupported RAW filename." });
    }
    if (!jobId) {
      return sendJson(res, 400, { error: "Missing conversion job id." });
    }

    const cloudConvertConfig = getCloudConvertConfig();
    if (!cloudConvertConfig.apiKey) {
      return sendJson(res, 500, { error: "CloudConvert API key is not configured." });
    }

    const complete = await cloudConvertFinalizeRawJob(jobId, fileName, cloudConvertConfig);
    if (!complete.ok || !complete.buffer?.length) {
      return sendJson(res, complete.status || 502, { error: complete.error || "RAW preview conversion failed." });
    }

    const mimeType = String(complete.mimeType || "image/jpeg");
    const dataUrl = `data:${mimeType};base64,${complete.buffer.toString("base64")}`;
    return sendJson(res, 200, {
      ok: true,
      fileName: sanitizeFileName(complete.fileName || buildPreviewFileName(fileName)),
      mimeType,
      dataUrl,
    });
  } catch (error) {
    return sendJson(res, 400, { error: error?.message || "Invalid request payload." });
  }
}

function extractJpegFromTiffPreview(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 16) return null;
  const byteOrder = buffer.toString("ascii", 0, 2);
  const littleEndian = byteOrder === "II";
  const bigEndian = byteOrder === "MM";
  if (!littleEndian && !bigEndian) return null;

  const readUInt16 = (offset) => (littleEndian ? buffer.readUInt16LE(offset) : buffer.readUInt16BE(offset));
  const readUInt32 = (offset) => (littleEndian ? buffer.readUInt32LE(offset) : buffer.readUInt32BE(offset));

  const magic = readUInt16(2);
  if (magic !== 42) return null;

  const firstIfd = readUInt32(4);
  if (!Number.isFinite(firstIfd) || firstIfd <= 0 || firstIfd >= buffer.length - 2) return null;

  const TYPE_SIZE = {
    1: 1, // BYTE
    2: 1, // ASCII
    3: 2, // SHORT
    4: 4, // LONG
    5: 8, // RATIONAL
    7: 1, // UNDEFINED
    9: 4, // SLONG
    10: 8, // SRATIONAL
  };

  const readEntryValues = (type, count, valueFieldOffset) => {
    const size = TYPE_SIZE[type];
    if (!size || !count) return [];
    const byteLength = size * count;
    let dataOffset = valueFieldOffset;
    if (byteLength > 4) {
      dataOffset = readUInt32(valueFieldOffset);
    }
    if (!Number.isFinite(dataOffset) || dataOffset < 0 || dataOffset + byteLength > buffer.length) return [];

    const values = [];
    for (let i = 0; i < count; i += 1) {
      const itemOffset = dataOffset + i * size;
      if (itemOffset + size > buffer.length) break;
      if (type === 3) {
        values.push(littleEndian ? buffer.readUInt16LE(itemOffset) : buffer.readUInt16BE(itemOffset));
      } else if (type === 4 || type === 9) {
        values.push(littleEndian ? buffer.readUInt32LE(itemOffset) : buffer.readUInt32BE(itemOffset));
      } else if (type === 1 || type === 7) {
        values.push(buffer[itemOffset]);
      }
    }
    return values;
  };

  const extractJpegAt = (offset, length) => {
    if (!Number.isFinite(offset) || !Number.isFinite(length)) return null;
    if (offset < 0 || length <= 0 || offset + length > buffer.length) return null;
    const slice = buffer.slice(offset, offset + length);
    if (slice.length < 1024) return null;
    const soi = slice.indexOf(Buffer.from([0xff, 0xd8]));
    if (soi < 0) return null;
    const eoi = slice.lastIndexOf(Buffer.from([0xff, 0xd9]));
    if (eoi > soi) {
      return slice.slice(soi, eoi + 2);
    }
    return slice.slice(soi);
  };

  const visited = new Set();
  const queue = [firstIfd];
  let best = null;
  let safety = 0;

  while (queue.length > 0 && safety < 128) {
    safety += 1;
    const ifdOffset = queue.shift();
    if (!Number.isFinite(ifdOffset) || ifdOffset <= 0 || ifdOffset >= buffer.length - 2) continue;
    if (visited.has(ifdOffset)) continue;
    visited.add(ifdOffset);

    const entryCount = readUInt16(ifdOffset);
    const tableStart = ifdOffset + 2;
    const tableEnd = tableStart + entryCount * 12;
    if (tableEnd + 4 > buffer.length) continue;

    const tags = new Map();
    for (let i = 0; i < entryCount; i += 1) {
      const entryOffset = tableStart + i * 12;
      const tag = readUInt16(entryOffset);
      const type = readUInt16(entryOffset + 2);
      const count = readUInt32(entryOffset + 4);
      const valueFieldOffset = entryOffset + 8;
      tags.set(tag, { type, count, valueFieldOffset });
    }

    const jpegOffsetTag = tags.get(513);
    const jpegLengthTag = tags.get(514);
    if (jpegOffsetTag && jpegLengthTag) {
      const offsetValues = readEntryValues(jpegOffsetTag.type, jpegOffsetTag.count, jpegOffsetTag.valueFieldOffset);
      const lengthValues = readEntryValues(jpegLengthTag.type, jpegLengthTag.count, jpegLengthTag.valueFieldOffset);
      const candidate = extractJpegAt(Number(offsetValues[0] || 0), Number(lengthValues[0] || 0));
      if (candidate && (!best || candidate.length > best.length)) {
        best = candidate;
      }
    }

    const subIfdTag = tags.get(330);
    if (subIfdTag) {
      const subOffsets = readEntryValues(subIfdTag.type, subIfdTag.count, subIfdTag.valueFieldOffset);
      subOffsets.forEach((off) => {
        if (Number.isFinite(off) && off > 0) queue.push(off);
      });
    }

    const exifIfdTag = tags.get(34665);
    if (exifIfdTag) {
      const exifOffsets = readEntryValues(exifIfdTag.type, exifIfdTag.count, exifIfdTag.valueFieldOffset);
      exifOffsets.forEach((off) => {
        if (Number.isFinite(off) && off > 0) queue.push(off);
      });
    }

    const nextIfdOffset = readUInt32(tableEnd);
    if (Number.isFinite(nextIfdOffset) && nextIfdOffset > 0) {
      queue.push(nextIfdOffset);
    }
  }

  return best;
}

async function handleRawPreview(req, res) {
  const auth = await getAuthenticatedSupabaseUser(req);
  if (!auth.ok) {
    return sendJson(res, auth.status || 401, { error: auth.error || "Unauthorized." });
  }
  const accessStatus = await getUserAccessStatus(req, auth.user);
  if (!accessStatus.ok) {
    return sendJson(res, accessStatus.status || 502, { error: accessStatus.error || "Unable to verify access." });
  }
  if (!accessStatus.subscriptionActive && !accessStatus.bypassed) {
    return sendJson(res, 403, { error: "RAW uploads require an active subscription." });
  }

  try {
    const rawFileNameHeader = String(req.headers["x-file-name"] || "");
    const fileName = sanitizeFileName(decodeURIComponent(rawFileNameHeader || "raw-image"));
    if (!isLikelyRawFileName(fileName)) {
      return sendJson(res, 400, { error: "Unsupported RAW filename." });
    }

    const rawMaxBytesFromEnv = Number(process.env.RAW_UPLOAD_MAX_BYTES || "");
    const rawMaxBytes = Number.isFinite(rawMaxBytesFromEnv) && rawMaxBytesFromEnv > 0
      ? Math.floor(rawMaxBytesFromEnv)
      : 200 * 1024 * 1024;
    const body = await parseBinaryBody(req, rawMaxBytes);
    if (!body || body.length === 0) {
      return sendJson(res, 400, { error: "Missing RAW payload." });
    }

    const cloudConvertConfig = getCloudConvertConfig();
    let cloudConvertError = "";
    if (cloudConvertConfig.apiKey) {
      const converted = await cloudConvertConvertRawToImage(body, fileName, cloudConvertConfig);
      if (converted.ok && converted.buffer?.length) {
        const mimeType = String(converted.mimeType || "image/jpeg");
        const dataUrl = `data:${mimeType};base64,${converted.buffer.toString("base64")}`;
        return sendJson(res, 200, {
          ok: true,
          fileName: sanitizeFileName(converted.fileName || buildPreviewFileName(fileName)),
          mimeType,
          dataUrl,
        });
      }
      cloudConvertError = String(converted?.error || "").trim();
    }

    const jpegPreview = extractLargestEmbeddedJpeg(body) || extractJpegFromTiffPreview(body);
    if (!jpegPreview || jpegPreview.length < 1024) {
      const errorMessage = cloudConvertError
        ? `Could not extract preview image from RAW file. CloudConvert: ${cloudConvertError}`
        : "Could not extract preview image from RAW file.";
      return sendJson(res, 415, { error: errorMessage });
    }

    const dataUrl = `data:image/jpeg;base64,${jpegPreview.toString("base64")}`;
    return sendJson(res, 200, {
      ok: true,
      fileName: buildPreviewFileName(fileName),
      mimeType: "image/jpeg",
      dataUrl,
    });
  } catch (error) {
    return sendJson(res, 500, { error: error?.message || "Unable to process RAW file." });
  }
}

function getSupabaseServiceHeaders(req, prefer = "") {
  const config = getSupabaseConfig(req);
  if (!config.url || !config.serviceRoleKey) {
    return { ok: false, error: "Supabase service role is not configured." };
  }
  return {
    ok: true,
    config,
    headers: createSupabaseRequestHeaders({
      apiKey: config.serviceRoleKey,
      bearerToken: config.serviceRoleKey,
      prefer,
    }),
  };
}

function isLikelyUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || "").trim());
}

function getAccessTokenFromRequest(req) {
  const authHeader = String(req?.headers?.authorization || "").trim();
  const match = /^Bearer\s+(.+)$/i.exec(authHeader);
  return match ? String(match[1] || "").trim() : "";
}

async function getAuthenticatedSupabaseUser(req) {
  const accessToken = getAccessTokenFromRequest(req);
  if (!accessToken) {
    return { ok: false, status: 401, error: "Missing auth token." };
  }
  return fetchSupabaseUserByAccessToken(accessToken, req);
}

async function readProfileForCredits(req, userId) {
  const service = getSupabaseServiceHeaders(req);
  if (!service.ok) {
    return { ok: false, status: 500, error: service.error };
  }

  const { config, headers } = service;
  const profileResponse = await fetch(
    `${config.url}/rest/v1/profiles?select=id,credits_balance&id=eq.${encodeURIComponent(userId)}&limit=1`,
    {
      method: "GET",
      headers,
    },
  );
  if (!profileResponse.ok) {
    const reason = await profileResponse.text().catch(() => "");
    return { ok: false, status: 502, error: `Unable to read credits.${reason ? ` ${reason}` : ""}` };
  }
  const rows = await profileResponse.json().catch(() => []);
  const profile = Array.isArray(rows) ? rows[0] : null;
  if (!profile) {
    return { ok: false, status: 404, error: "Profile not found." };
  }

  const currentCredits = Math.max(0, Math.floor(Number(profile?.credits_balance || 0)));
  return { ok: true, config, headers, currentCredits };
}

async function applyCreditDelta({ req, userId, delta, reason, source = "studio", meta = null }) {
  const parsedDelta = Math.trunc(Number(delta || 0));
  if (!Number.isFinite(parsedDelta) || parsedDelta === 0) {
    return { ok: false, status: 400, error: "Invalid credit delta." };
  }

  const profileResult = await readProfileForCredits(req, userId);
  if (!profileResult.ok) return profileResult;
  const { config, headers, currentCredits } = profileResult;

  if (parsedDelta < 0 && currentCredits < Math.abs(parsedDelta)) {
    return { ok: false, status: 402, error: "Insufficient credits.", creditsBalance: currentCredits };
  }

  const nextCredits = Math.max(0, currentCredits + parsedDelta);
  const ledgerResponse = await fetch(`${config.url}/rest/v1/credit_ledger`, {
    method: "POST",
    headers: {
      ...headers,
      Prefer: "return=minimal",
    },
    body: JSON.stringify([
      {
        user_id: userId,
        project_id: null,
        delta: parsedDelta,
        reason,
        source,
        meta: meta && typeof meta === "object" ? meta : null,
      },
    ]),
  });
  if (!ledgerResponse.ok) {
    const ledgerReason = await ledgerResponse.text().catch(() => "");
    return { ok: false, status: 502, error: `Unable to record credit charge.${ledgerReason ? ` ${ledgerReason}` : ""}` };
  }

  const patchResponse = await fetch(`${config.url}/rest/v1/profiles?id=eq.${encodeURIComponent(userId)}`, {
    method: "PATCH",
    headers: {
      ...headers,
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ credits_balance: nextCredits }),
  });
  if (!patchResponse.ok) {
    const patchReason = await patchResponse.text().catch(() => "");
    return { ok: false, status: 502, error: `Unable to update profile credits.${patchReason ? ` ${patchReason}` : ""}` };
  }

  return { ok: true, creditsBalance: nextCredits };
}

async function handleAdminUsersList(req, res) {
  if (!isAdminAuthenticated(req)) {
    return sendJson(res, 401, { error: "Unauthorized." });
  }

  const service = getSupabaseServiceHeaders(req);
  if (!service.ok) {
    return sendJson(res, 500, { error: service.error });
  }

  const { config, headers } = service;
  try {
    const profilesResponse = await fetch(
      `${config.url}/rest/v1/profiles?select=id,email,username,credits_balance,created_at&order=created_at.desc&limit=500`,
      {
        method: "GET",
        headers,
      },
    );
    if (!profilesResponse.ok) {
      const reason = await profilesResponse.text().catch(() => "");
      return sendJson(res, 502, { error: `Unable to fetch profiles.${reason ? ` ${reason}` : ""}` });
    }
    const profiles = await profilesResponse.json().catch(() => []);

    const projectsResponse = await fetch(`${config.url}/rest/v1/projects?select=user_id,status&limit=2000`, {
      method: "GET",
      headers,
    });
    if (!projectsResponse.ok) {
      const reason = await projectsResponse.text().catch(() => "");
      return sendJson(res, 502, { error: `Unable to fetch projects.${reason ? ` ${reason}` : ""}` });
    }
    const projects = await projectsResponse.json().catch(() => []);

    const projectCountByUser = new Map();
    const activeProjectCountByUser = new Map();
    if (Array.isArray(projects)) {
      projects.forEach((item) => {
        const userId = String(item?.user_id || "");
        if (!userId) return;
        projectCountByUser.set(userId, (projectCountByUser.get(userId) || 0) + 1);
        if (item?.status === "active") {
          activeProjectCountByUser.set(userId, (activeProjectCountByUser.get(userId) || 0) + 1);
        }
      });
    }

    const users = Array.isArray(profiles)
      ? profiles.map((profile) => {
          const userId = String(profile?.id || "");
          return {
            id: userId,
            email: String(profile?.email || ""),
            username: String(profile?.username || ""),
            creditsBalance: Number(profile?.credits_balance || 0),
            projectCount: projectCountByUser.get(userId) || 0,
            activeProjectCount: activeProjectCountByUser.get(userId) || 0,
            createdAt: profile?.created_at || null,
          };
        })
      : [];

    return sendJson(res, 200, { users });
  } catch (error) {
    return sendJson(res, 500, { error: error?.message || "Unable to load users." });
  }
}

async function handleAdminUserUpdate(req, res, userId) {
  if (!isAdminAuthenticated(req)) {
    return sendJson(res, 401, { error: "Unauthorized." });
  }
  if (!isLikelyUuid(userId)) {
    return sendJson(res, 400, { error: "Invalid user id." });
  }

  const service = getSupabaseServiceHeaders(req);
  if (!service.ok) {
    return sendJson(res, 500, { error: service.error });
  }

  const { config, headers } = service;

  try {
    const payload = await parseJsonBody(req);
    const nextUsername = String(payload?.username || "").trim();
    const hasUsername = typeof payload?.username === "string";
    const hasCredits = payload?.creditsBalance != null && payload?.creditsBalance !== "";
    const nextCreditsRaw = Number(payload?.creditsBalance);
    const nextCredits = Number.isFinite(nextCreditsRaw) ? Math.max(0, Math.floor(nextCreditsRaw)) : NaN;

    if (hasUsername && !nextUsername) {
      return sendJson(res, 400, { error: "Username cannot be empty." });
    }
    if (hasUsername && nextUsername.length > 64) {
      return sendJson(res, 400, { error: "Username is too long." });
    }
    if (hasCredits && !Number.isFinite(nextCredits)) {
      return sendJson(res, 400, { error: "Credits value is invalid." });
    }

    const profileResponse = await fetch(
      `${config.url}/rest/v1/profiles?select=id,email,username,credits_balance&id=eq.${encodeURIComponent(userId)}&limit=1`,
      {
        method: "GET",
        headers,
      },
    );
    if (!profileResponse.ok) {
      const reason = await profileResponse.text().catch(() => "");
      return sendJson(res, 502, { error: `Unable to read user profile.${reason ? ` ${reason}` : ""}` });
    }
    const profileRows = await profileResponse.json().catch(() => []);
    const profile = Array.isArray(profileRows) ? profileRows[0] : null;
    if (!profile) {
      return sendJson(res, 404, { error: "User not found." });
    }

    const updates = {};
    if (hasUsername && nextUsername !== String(profile?.username || "")) {
      updates.username = nextUsername;
    }
    const currentCredits = Number(profile?.credits_balance || 0);
    if (hasCredits && nextCredits !== currentCredits) {
      updates.credits_balance = nextCredits;
      const delta = nextCredits - currentCredits;
      const ledgerResponse = await fetch(`${config.url}/rest/v1/credit_ledger`, {
        method: "POST",
        headers: {
          ...headers,
          Prefer: "return=minimal",
        },
        body: JSON.stringify([
          {
            user_id: userId,
            project_id: null,
            delta,
            reason: "admin_adjustment",
            source: "admin_panel",
            meta: {
              previous: currentCredits,
              next: nextCredits,
            },
          },
        ]),
      });
      if (!ledgerResponse.ok) {
        const reason = await ledgerResponse.text().catch(() => "");
        return sendJson(res, 502, { error: `Unable to record credit adjustment.${reason ? ` ${reason}` : ""}` });
      }
    }

    if (Object.keys(updates).length > 0) {
      const patchResponse = await fetch(`${config.url}/rest/v1/profiles?id=eq.${encodeURIComponent(userId)}`, {
        method: "PATCH",
        headers: {
          ...headers,
          Prefer: "return=minimal",
        },
        body: JSON.stringify(updates),
      });
      if (!patchResponse.ok) {
        const reason = await patchResponse.text().catch(() => "");
        return sendJson(res, 502, { error: `Unable to update user.${reason ? ` ${reason}` : ""}` });
      }
    }

    return sendJson(res, 200, { ok: true });
  } catch (error) {
    return sendJson(res, 400, { error: error?.message || "Invalid request." });
  }
}

async function handleAdminUserDelete(req, res, userId) {
  if (!isAdminAuthenticated(req)) {
    return sendJson(res, 401, { error: "Unauthorized." });
  }
  if (!isLikelyUuid(userId)) {
    return sendJson(res, 400, { error: "Invalid user id." });
  }

  const service = getSupabaseServiceHeaders(req);
  if (!service.ok) {
    return sendJson(res, 500, { error: service.error });
  }

  const { config, headers } = service;

  try {
    const authDeleteResponse = await fetch(`${config.url}/auth/v1/admin/users/${encodeURIComponent(userId)}`, {
      method: "DELETE",
      headers,
    });
    if (!authDeleteResponse.ok) {
      const reason = await authDeleteResponse.text().catch(() => "");
      return sendJson(res, 502, { error: `Unable to delete auth user.${reason ? ` ${reason}` : ""}` });
    }
    return sendJson(res, 200, { ok: true });
  } catch (error) {
    return sendJson(res, 500, { error: error?.message || "Unable to delete user." });
  }
}

async function handleAdminUserEmail(req, res) {
  if (!isAdminAuthenticated(req)) {
    return sendJson(res, 401, { error: "Unauthorized." });
  }

  const service = getSupabaseServiceHeaders(req);
  if (!service.ok) {
    return sendJson(res, 500, { error: service.error });
  }

  const { config, headers } = service;

  try {
    const payload = await parseJsonBody(req);
    const userId = String(payload?.userId || "").trim();
    const toEmail = String(payload?.email || "").trim().toLowerCase();
    const subject = String(payload?.subject || "").trim();
    const message = String(payload?.message || "").trim();
    const userName = String(payload?.name || "").trim();

    if (!isLikelyUuid(userId)) {
      return sendJson(res, 400, { error: "Invalid user id." });
    }
    if (!subject || !message) {
      return sendJson(res, 400, { error: "Subject and message are required." });
    }
    if (subject.length > 180 || message.length > 8000 || userName.length > 120) {
      return sendJson(res, 400, { error: "Input is too long." });
    }

    const profileResponse = await fetch(
      `${config.url}/rest/v1/profiles?select=id,email,username&id=eq.${encodeURIComponent(userId)}&limit=1`,
      {
        method: "GET",
        headers,
      },
    );
    if (!profileResponse.ok) {
      const reason = await profileResponse.text().catch(() => "");
      return sendJson(res, 502, { error: `Unable to read user profile.${reason ? ` ${reason}` : ""}` });
    }
    const profileRows = await profileResponse.json().catch(() => []);
    const profile = Array.isArray(profileRows) ? profileRows[0] : null;
    if (!profile) {
      return sendJson(res, 404, { error: "User not found." });
    }

    const profileEmail = String(profile?.email || "").trim().toLowerCase();
    if (!profileEmail || !isValidEmailAddress(profileEmail)) {
      return sendJson(res, 400, { error: "User email is invalid." });
    }
    if (toEmail && toEmail !== profileEmail) {
      return sendJson(res, 400, { error: "Email must match the selected user." });
    }

    const sendgridApiKey = normalizeEnvValue(process.env.SENDGRID_API_KEY || "");
    const fromEmail = normalizeEnvValue(process.env.CONTACT_FROM_EMAIL || "");
    if (!sendgridApiKey || !fromEmail) {
      return sendJson(res, 500, { error: "Email is not configured. Set SENDGRID_API_KEY and CONTACT_FROM_EMAIL." });
    }

    const safeName = userName || String(profile?.username || "").trim() || "there";
    const textBody = [`Hi ${safeName},`, "", message, "", "The DarkroomX Team"].join("\n");
    const htmlBody = `
      <p>Hi ${String(safeName).replace(/[<>&"]/g, "")},</p>
      <p>${String(message).replace(/[<>&"]/g, "").replace(/\n/g, "<br />")}</p>
      <p>The DarkroomX Team</p>
    `;

    const sendResult = await sendSendgridMail({
      sendgridApiKey,
      fromEmail,
      toEmail: profileEmail,
      subject,
      textBody,
      htmlBody,
    });
    if (!sendResult.ok) {
      return sendJson(res, sendResult.status || 502, { error: sendResult.error || "Failed to send email." });
    }

    return sendJson(res, 200, { ok: true });
  } catch (error) {
    return sendJson(res, 400, { error: error?.message || "Invalid request." });
  }
}

const PROJECT_SESSIONS_BUCKET = "project-sessions";

function buildProjectSessionObjectPath(userId, projectId) {
  return `${encodeURIComponent(String(userId || "").trim())}/${encodeURIComponent(String(projectId || "").trim())}.json`;
}

function isStorageObjectMissingReason(reason = "") {
  const text = String(reason || "").toLowerCase();
  if (!text) return false;
  return (
    text.includes("object not found") ||
    text.includes('"error":"not_found"') ||
    text.includes('"error":"object_not_found"')
  );
}

async function ensureProjectSessionsBucket(service) {
  const { config, headers } = service;
  const checkResponse = await fetch(`${config.url}/storage/v1/bucket/${PROJECT_SESSIONS_BUCKET}`, {
    method: "GET",
    headers,
  });
  if (checkResponse.ok) return { ok: true };
  const reason = await checkResponse.text().catch(() => "");
  const bucketMissing = checkResponse.status === 404 || String(reason || "").toLowerCase().includes("bucket not found");
  if (!bucketMissing) {
    return { ok: false, status: 502, error: `Unable to check project bucket.${reason ? ` ${reason}` : ""}` };
  }

  const createResponse = await fetch(`${config.url}/storage/v1/bucket`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      id: PROJECT_SESSIONS_BUCKET,
      name: PROJECT_SESSIONS_BUCKET,
      public: false,
      allowed_mime_types: ["application/json"],
    }),
  });
  if (!createResponse.ok && createResponse.status !== 409) {
    const reason = await createResponse.text().catch(() => "");
    return { ok: false, status: 502, error: `Unable to create project bucket.${reason ? ` ${reason}` : ""}` };
  }
  return { ok: true };
}

async function getOwnedProject(req, userId, projectId) {
  if (!isLikelyUuid(projectId)) {
    return { ok: false, status: 400, error: "Invalid project id." };
  }
  const service = getSupabaseServiceHeaders(req);
  if (!service.ok) return { ok: false, status: 500, error: service.error };
  const { config, headers } = service;
  const response = await fetch(
    `${config.url}/rest/v1/projects?select=id,name,status,cover_image_url,created_at,last_opened_at,updated_at&id=eq.${encodeURIComponent(projectId)}&user_id=eq.${encodeURIComponent(userId)}&limit=1`,
    {
      method: "GET",
      headers,
    },
  );
  if (!response.ok) {
    const reason = await response.text().catch(() => "");
    return { ok: false, status: 502, error: `Unable to read project.${reason ? ` ${reason}` : ""}` };
  }
  const rows = await response.json().catch(() => []);
  const project = Array.isArray(rows) ? rows[0] : null;
  if (!project) return { ok: false, status: 404, error: "Project not found." };
  return { ok: true, service, project };
}

async function handleProjectsList(req, res) {
  const authResult = await getAuthenticatedSupabaseUser(req);
  if (!authResult.ok) {
    return sendJson(res, authResult.status || 401, { error: authResult.error || "Unauthorized." });
  }

  const service = getSupabaseServiceHeaders(req);
  if (!service.ok) {
    return sendJson(res, 500, { error: service.error });
  }

  const userId = String(authResult.user?.id || "").trim();
  const { config, headers } = service;
  const response = await fetch(
    `${config.url}/rest/v1/projects?select=id,name,status,cover_image_url,created_at,last_opened_at,updated_at&user_id=eq.${encodeURIComponent(userId)}&order=last_opened_at.desc.nullslast&order=created_at.desc&limit=200`,
    {
      method: "GET",
      headers,
    },
  );
  if (!response.ok) {
    const reason = await response.text().catch(() => "");
    return sendJson(res, 502, { error: `Unable to load projects.${reason ? ` ${reason}` : ""}` });
  }
  const rows = await response.json().catch(() => []);
  const projects = Array.isArray(rows)
    ? rows.map((row) => ({
        id: String(row?.id || ""),
        name: String(row?.name || ""),
        status: String(row?.status || "active"),
        coverImageUrl: String(row?.cover_image_url || ""),
        createdAt: row?.created_at || null,
        lastOpenedAt: row?.last_opened_at || null,
        updatedAt: row?.updated_at || null,
      }))
    : [];
  return sendJson(res, 200, { projects });
}

async function handleProjectsCreate(req, res) {
  const authResult = await getAuthenticatedSupabaseUser(req);
  if (!authResult.ok) {
    return sendJson(res, authResult.status || 401, { error: authResult.error || "Unauthorized." });
  }

  const service = getSupabaseServiceHeaders(req);
  if (!service.ok) {
    return sendJson(res, 500, { error: service.error });
  }

  try {
    const payload = await parseJsonBody(req);
    const fallbackName = `Session ${new Date().toISOString().slice(0, 10)}`;
    const name = String(payload?.name || fallbackName).trim().replace(/\s+/g, " ").slice(0, 120) || fallbackName;
    const userId = String(authResult.user?.id || "").trim();

    const { config, headers } = service;
    const response = await fetch(`${config.url}/rest/v1/projects`, {
      method: "POST",
      headers: {
        ...headers,
        Prefer: "return=representation",
      },
      body: JSON.stringify([
        {
          user_id: userId,
          name,
          status: "active",
          last_opened_at: new Date().toISOString(),
        },
      ]),
    });
    if (!response.ok) {
      const reason = await response.text().catch(() => "");
      return sendJson(res, 502, { error: `Unable to create project.${reason ? ` ${reason}` : ""}` });
    }
    const rows = await response.json().catch(() => []);
    const project = Array.isArray(rows) ? rows[0] : null;
    if (!project) {
      return sendJson(res, 500, { error: "Project create response was empty." });
    }
    return sendJson(res, 200, {
      project: {
        id: String(project.id || ""),
        name: String(project.name || name),
        status: String(project.status || "active"),
        coverImageUrl: String(project.cover_image_url || ""),
        createdAt: project.created_at || null,
        lastOpenedAt: project.last_opened_at || null,
        updatedAt: project.updated_at || null,
      },
    });
  } catch (error) {
    return sendJson(res, 400, { error: error?.message || "Invalid request payload." });
  }
}

async function handleProjectSessionLoad(req, res, projectId) {
  const authResult = await getAuthenticatedSupabaseUser(req);
  if (!authResult.ok) {
    return sendJson(res, authResult.status || 401, { error: authResult.error || "Unauthorized." });
  }
  const userId = String(authResult.user?.id || "").trim();
  const owned = await getOwnedProject(req, userId, projectId);
  if (!owned.ok) {
    return sendJson(res, owned.status || 500, { error: owned.error || "Unable to load project." });
  }

  const { service, project } = owned;
  const bucketReady = await ensureProjectSessionsBucket(service);
  if (!bucketReady.ok) {
    return sendJson(res, bucketReady.status || 500, { error: bucketReady.error || "Unable to prepare project bucket." });
  }
  const { config, headers } = service;
  const objectPath = buildProjectSessionObjectPath(userId, projectId);
  const response = await fetch(`${config.url}/storage/v1/object/${PROJECT_SESSIONS_BUCKET}/${objectPath}`, {
    method: "GET",
    headers,
  });

  if (response.status === 404) {
    return sendJson(res, 200, { project, session: null });
  }
  if (!response.ok) {
    const reason = await response.text().catch(() => "");
    if (String(reason || "").toLowerCase().includes("bucket not found") || isStorageObjectMissingReason(reason)) {
      return sendJson(res, 200, { project, session: null });
    }
    return sendJson(res, 502, { error: `Unable to load project session.${reason ? ` ${reason}` : ""}` });
  }

  const raw = await response.text().catch(() => "");
  if (!raw) return sendJson(res, 200, { project, session: null });
  try {
    const parsed = JSON.parse(raw);
    return sendJson(res, 200, { project, session: parsed });
  } catch {
    return sendJson(res, 200, { project, session: null });
  }
}

async function handleProjectSessionSave(req, res, projectId) {
  const authResult = await getAuthenticatedSupabaseUser(req);
  if (!authResult.ok) {
    return sendJson(res, authResult.status || 401, { error: authResult.error || "Unauthorized." });
  }
  const userId = String(authResult.user?.id || "").trim();
  const owned = await getOwnedProject(req, userId, projectId);
  if (!owned.ok) {
    return sendJson(res, owned.status || 500, { error: owned.error || "Unable to save project." });
  }

  try {
    const payload = await parseJsonBody(req, 120 * 1024 * 1024);
    if (!payload || typeof payload?.session !== "object" || payload.session == null) {
      return sendJson(res, 400, { error: "Missing session payload." });
    }
    const nextName = String(payload?.name || "").trim().replace(/\s+/g, " ").slice(0, 120);
    const nextCoverImageUrlRaw = String(payload?.coverImageUrl || "").trim();
    const nextCoverImageUrl = nextCoverImageUrlRaw.startsWith("data:image/") ? nextCoverImageUrlRaw : "";

    const { service } = owned;
    const bucketReady = await ensureProjectSessionsBucket(service);
    if (!bucketReady.ok) {
      return sendJson(res, bucketReady.status || 500, { error: bucketReady.error || "Unable to prepare project bucket." });
    }

    const { config, headers } = service;
    const objectPath = buildProjectSessionObjectPath(userId, projectId);
    const saveResponse = await fetch(`${config.url}/storage/v1/object/${PROJECT_SESSIONS_BUCKET}/${objectPath}`, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
        "x-upsert": "true",
      },
      body: JSON.stringify(payload.session),
    });
    if (!saveResponse.ok) {
      const reason = await saveResponse.text().catch(() => "");
      return sendJson(res, 502, { error: `Unable to save session file.${reason ? ` ${reason}` : ""}` });
    }

    const updates = {
      last_opened_at: new Date().toISOString(),
    };
    if (nextName) updates.name = nextName;
    if (nextCoverImageUrl) updates.cover_image_url = nextCoverImageUrl;
    const updateResponse = await fetch(
      `${config.url}/rest/v1/projects?id=eq.${encodeURIComponent(projectId)}&user_id=eq.${encodeURIComponent(userId)}`,
      {
        method: "PATCH",
        headers: {
          ...headers,
          Prefer: "return=representation",
        },
        body: JSON.stringify(updates),
      },
    );
    if (!updateResponse.ok) {
      const reason = await updateResponse.text().catch(() => "");
      return sendJson(res, 502, { error: `Unable to update project metadata.${reason ? ` ${reason}` : ""}` });
    }
    const rows = await updateResponse.json().catch(() => []);
    const project = Array.isArray(rows) ? rows[0] : null;
    return sendJson(res, 200, {
      ok: true,
      project: project
        ? {
            id: String(project.id || ""),
            name: String(project.name || ""),
            status: String(project.status || "active"),
            coverImageUrl: String(project.cover_image_url || ""),
            createdAt: project.created_at || null,
            lastOpenedAt: project.last_opened_at || null,
            updatedAt: project.updated_at || null,
          }
        : null,
    });
  } catch (error) {
    const message = String(error?.message || "Invalid request payload.");
    const isTooLarge = message.toLowerCase().includes("payload too large");
    return sendJson(res, isTooLarge ? 413 : 400, { error: message });
  }
}

async function handleStripeSubscriptionCheckout(req, res) {
  const authResult = await getAuthenticatedSupabaseUser(req);
  if (!authResult.ok) {
    return sendJson(res, authResult.status || 401, { error: authResult.error || "Unauthorized." });
  }

  const stripeConfig = getStripeConfig(req);
  if (!stripeConfig.secretKey || !stripeConfig.subscriptionPriceId) {
    return sendJson(res, 500, { error: "Stripe subscription checkout is not configured." });
  }

  const customerResult = await getOrCreateStripeCustomerForUser(stripeConfig.secretKey, authResult.user);
  if (!customerResult.ok || !customerResult.customerId) {
    return sendJson(res, customerResult.status || 502, { error: customerResult.error || "Unable to create Stripe customer." });
  }

  const userId = String(authResult.user?.id || "").trim();
  const params = new URLSearchParams();
  params.set("mode", "subscription");
  params.set("customer", customerResult.customerId);
  params.set("line_items[0][price]", stripeConfig.subscriptionPriceId);
  params.set("line_items[0][quantity]", "1");
  params.set("success_url", stripeConfig.successUrl);
  params.set("cancel_url", stripeConfig.cancelUrl);
  params.set("client_reference_id", userId);
  params.set("metadata[type]", "subscription");
  params.set("metadata[supabase_user_id]", userId);
  params.set("subscription_data[metadata][supabase_user_id]", userId);
  params.set("allow_promotion_codes", "true");

  const sessionResponse = await stripeApiRequest(stripeConfig.secretKey, "checkout/sessions", {
    method: "POST",
    params,
  });
  if (!sessionResponse.ok) {
    return sendJson(res, sessionResponse.status || 502, { error: sessionResponse.error || "Unable to create Stripe checkout session." });
  }

  return sendJson(res, 200, {
    ok: true,
    checkoutUrl: String(sessionResponse.payload?.url || ""),
    sessionId: String(sessionResponse.payload?.id || ""),
  });
}

async function handleStripeTopupCheckout(req, res) {
  const authResult = await getAuthenticatedSupabaseUser(req);
  if (!authResult.ok) {
    return sendJson(res, authResult.status || 401, { error: authResult.error || "Unauthorized." });
  }

  const stripeConfig = getStripeConfig(req);
  if (!stripeConfig.secretKey || !stripeConfig.topupPriceId || !stripeConfig.subscriptionPriceId) {
    return sendJson(res, 500, { error: "Stripe top-up checkout is not configured." });
  }

  const customerResult = await getOrCreateStripeCustomerForUser(stripeConfig.secretKey, authResult.user);
  if (!customerResult.ok || !customerResult.customerId) {
    return sendJson(res, customerResult.status || 502, { error: customerResult.error || "Unable to create Stripe customer." });
  }

  const subscriptionCheck = await hasActiveSubscriptionForCustomer(
    stripeConfig.secretKey,
    customerResult.customerId,
    stripeConfig.subscriptionPriceId,
  );
  if (!subscriptionCheck.ok) {
    return sendJson(res, subscriptionCheck.status || 502, { error: subscriptionCheck.error || "Unable to verify subscription." });
  }
  if (!subscriptionCheck.active) {
    return sendJson(res, 403, { error: "Active subscription required before buying credits." });
  }

  const userId = String(authResult.user?.id || "").trim();
  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("customer", customerResult.customerId);
  params.set("line_items[0][price]", stripeConfig.topupPriceId);
  params.set("line_items[0][quantity]", "1");
  params.set("success_url", stripeConfig.successUrl);
  params.set("cancel_url", stripeConfig.cancelUrl);
  params.set("client_reference_id", userId);
  params.set("metadata[type]", "credit_topup");
  params.set("metadata[supabase_user_id]", userId);
  params.set("metadata[credits]", String(stripeConfig.topupCredits));
  params.set("allow_promotion_codes", "true");

  const sessionResponse = await stripeApiRequest(stripeConfig.secretKey, "checkout/sessions", {
    method: "POST",
    params,
  });
  if (!sessionResponse.ok) {
    return sendJson(res, sessionResponse.status || 502, { error: sessionResponse.error || "Unable to create Stripe checkout session." });
  }

  return sendJson(res, 200, {
    ok: true,
    checkoutUrl: String(sessionResponse.payload?.url || ""),
    sessionId: String(sessionResponse.payload?.id || ""),
  });
}

async function handleStripeBillingPortal(req, res) {
  const authResult = await getAuthenticatedSupabaseUser(req);
  if (!authResult.ok) {
    return sendJson(res, authResult.status || 401, { error: authResult.error || "Unauthorized." });
  }

  const stripeConfig = getStripeConfig(req);
  if (!stripeConfig.secretKey) {
    return sendJson(res, 500, { error: "Stripe billing portal is not configured." });
  }

  const customerResult = await getOrCreateStripeCustomerForUser(stripeConfig.secretKey, authResult.user);
  if (!customerResult.ok || !customerResult.customerId) {
    return sendJson(res, customerResult.status || 502, { error: customerResult.error || "Unable to load Stripe customer." });
  }

  const params = new URLSearchParams();
  params.set("customer", customerResult.customerId);
  params.set("return_url", stripeConfig.billingPortalReturnUrl);

  const sessionResponse = await stripeApiRequest(stripeConfig.secretKey, "billing_portal/sessions", {
    method: "POST",
    params,
  });
  if (!sessionResponse.ok) {
    return sendJson(res, sessionResponse.status || 502, { error: sessionResponse.error || "Unable to open billing portal." });
  }

  return sendJson(res, 200, {
    ok: true,
    portalUrl: String(sessionResponse.payload?.url || ""),
  });
}

async function hasStripeTopupBeenApplied(req, userId, checkoutSessionId) {
  const service = getSupabaseServiceHeaders(req);
  if (!service.ok) {
    return { ok: false, status: 500, error: service.error };
  }
  const { config, headers } = service;
  const endpoint = new URL(`${config.url}/rest/v1/credit_ledger`);
  endpoint.searchParams.set("select", "id");
  endpoint.searchParams.set("user_id", `eq.${userId}`);
  endpoint.searchParams.set("reason", "eq.stripe_topup");
  endpoint.searchParams.set("meta->>stripe_checkout_session_id", `eq.${checkoutSessionId}`);
  endpoint.searchParams.set("limit", "1");
  const response = await fetch(endpoint.toString(), {
    method: "GET",
    headers,
  });
  if (!response.ok) {
    const reason = await response.text().catch(() => "");
    return { ok: false, status: 502, error: `Unable to inspect top-up ledger.${reason ? ` ${reason}` : ""}` };
  }
  const rows = await response.json().catch(() => []);
  return { ok: true, applied: Array.isArray(rows) && rows.length > 0 };
}

function extractStripeUserIdFromEvent(event) {
  const obj = event?.data?.object || {};
  const fromObject = String(obj?.metadata?.supabase_user_id || obj?.client_reference_id || "").trim();
  if (fromObject) return fromObject;
  if (event?.type?.startsWith("customer.subscription")) {
    return String(obj?.metadata?.supabase_user_id || "").trim();
  }
  return "";
}

function handleStripeWebhook(req, res) {
  const stripeConfig = getStripeConfig(req);
  const webhookSecret = normalizeEnvValue(process.env.STRIPE_WEBHOOK_SECRET || "");
  if (!stripeConfig.secretKey || !webhookSecret) {
    return sendJson(res, 500, { error: "Stripe webhook is not configured." });
  }

  let raw = "";
  req.on("data", (chunk) => {
    raw += chunk;
    if (raw.length > 2 * 1024 * 1024) req.destroy();
  });

  req.on("end", async () => {
    try {
      const signatureHeader = String(req.headers["stripe-signature"] || "");
      const valid = verifyStripeWebhookSignature(raw, signatureHeader, webhookSecret);
      if (!valid) {
        return sendJson(res, 400, { error: "Invalid Stripe webhook signature." });
      }

      const event = JSON.parse(raw || "{}");
      const eventType = String(event?.type || "");
      const eventObject = event?.data?.object || {};
      const userId = extractStripeUserIdFromEvent(event);
      if (isLikelyUuid(userId)) {
        clearCachedSubscriptionAccess(userId);
      }

      if (eventType === "checkout.session.completed") {
        const mode = String(eventObject?.mode || "");
        const eventUserId = String(eventObject?.metadata?.supabase_user_id || eventObject?.client_reference_id || "").trim();
        if (mode === "payment" && eventObject?.metadata?.type === "credit_topup" && isLikelyUuid(eventUserId)) {
          const checkoutSessionId = String(eventObject?.id || "").trim();
          if (!checkoutSessionId) return sendJson(res, 200, { ok: true });

          const alreadyApplied = await hasStripeTopupBeenApplied(req, eventUserId, checkoutSessionId);
          if (!alreadyApplied.ok) {
            return sendJson(res, alreadyApplied.status || 500, { error: alreadyApplied.error || "Unable to verify top-up event." });
          }
          if (!alreadyApplied.applied) {
            const creditsFromMeta = Number(eventObject?.metadata?.credits || stripeConfig.topupCredits);
            const topupCredits = Number.isFinite(creditsFromMeta) ? Math.max(1, Math.floor(creditsFromMeta)) : stripeConfig.topupCredits;
            const applyResult = await applyCreditDelta({
              req,
              userId: eventUserId,
              delta: topupCredits,
              reason: "stripe_topup",
              source: "stripe",
              meta: {
                stripe_event_id: String(event?.id || ""),
                stripe_checkout_session_id: checkoutSessionId,
                stripe_customer_id: String(eventObject?.customer || ""),
                stripe_price_id: String(stripeConfig.topupPriceId || ""),
              },
            });
            if (!applyResult.ok) {
              return sendJson(res, applyResult.status || 500, { error: applyResult.error || "Unable to apply top-up credits." });
            }
          }
        }
      }

      return sendJson(res, 200, { ok: true });
    } catch (error) {
      return sendJson(res, 500, { error: error?.message || "Stripe webhook processing failed." });
    }
  });
}

function handleSupabaseAuthBootstrap(req, res) {
  let raw = "";
  req.on("data", (chunk) => {
    raw += chunk;
    if (raw.length > 64 * 1024) req.destroy();
  });

  req.on("end", async () => {
    try {
      const payload = JSON.parse(raw || "{}");
      const accessToken = String(payload?.accessToken || "").trim();
      if (!accessToken) {
        return sendJson(res, 400, { error: "Missing access token." });
      }

      const supabaseUserResult = await fetchSupabaseUserByAccessToken(accessToken, req);
      if (!supabaseUserResult.ok) {
        return sendJson(res, supabaseUserResult.status || 401, { error: supabaseUserResult.error || "Invalid session." });
      }

      const bootstrapResult = await bootstrapSupabaseUserData(supabaseUserResult.user, req);
      if (!bootstrapResult.ok) {
        return sendJson(res, bootstrapResult.status || 500, { error: bootstrapResult.error || "Unable to bootstrap user." });
      }

      let redirectTo = "/pricing";
      const accessStatus = await getUserAccessStatus(req, supabaseUserResult.user);
      if (accessStatus.ok && accessStatus.accessAllowed) {
        redirectTo = "/studio";
      }

      return sendJson(res, 200, {
        ok: true,
        redirectTo,
        profile: bootstrapResult.profile,
        activeProject: bootstrapResult.activeProject,
        access: accessStatus.ok
          ? {
              subscriptionActive: accessStatus.subscriptionActive,
              trialActive: accessStatus.trialActive,
              accessAllowed: accessStatus.accessAllowed,
              trialEndsAt: accessStatus.trialEndsAt,
            }
          : null,
      });
    } catch (error) {
      return sendJson(res, 400, { error: error?.message || "Invalid request payload." });
    }
  });
}

function handleSupabaseAuthRefresh(req, res) {
  let raw = "";
  req.on("data", (chunk) => {
    raw += chunk;
    if (raw.length > 64 * 1024) req.destroy();
  });

  req.on("end", async () => {
    try {
      const payload = JSON.parse(raw || "{}");
      const refreshToken = String(payload?.refreshToken || "").trim();
      if (!refreshToken) {
        return sendJson(res, 400, { error: "Missing refresh token." });
      }

      const config = getSupabaseConfig(req);
      if (!config.url || !config.anonKey) {
        return sendJson(res, 500, { error: "Supabase auth is not configured." });
      }

      const response = await fetch(`${config.url}/auth/v1/token?grant_type=refresh_token`, {
        method: "POST",
        headers: createSupabaseRequestHeaders({ apiKey: config.anonKey }),
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        return sendJson(res, response.status || 401, { error: data?.error_description || data?.error || "Unable to refresh auth session." });
      }

      return sendJson(res, 200, {
        ok: true,
        accessToken: String(data?.access_token || ""),
        refreshToken: String(data?.refresh_token || ""),
        expiresIn: Number(data?.expires_in || 0),
      });
    } catch (error) {
      return sendJson(res, 400, { error: error?.message || "Invalid request payload." });
    }
  });
}

async function handleAccessStatus(req, res) {
  const authResult = await getAuthenticatedSupabaseUser(req);
  if (!authResult.ok) {
    return sendJson(res, authResult.status || 401, { error: authResult.error || "Unauthorized." });
  }

  const accessStatus = await getUserAccessStatus(req, authResult.user);
  if (!accessStatus.ok) {
    return sendJson(res, accessStatus.status || 500, { error: accessStatus.error || "Unable to resolve access status." });
  }

  return sendJson(res, 200, {
    ok: true,
    enforced: accessStatus.enforced,
    bypassed: Boolean(accessStatus.bypassed),
    subscriptionActive: accessStatus.subscriptionActive,
    trialActive: accessStatus.trialActive,
    accessAllowed: accessStatus.accessAllowed,
    trialStartsAt: accessStatus.trialStartsAt,
    trialEndsAt: accessStatus.trialEndsAt,
    now: accessStatus.now,
  });
}

async function verifyRecaptchaToken(token, remoteIp) {
  const { secretKey, action, minScore } = getRecaptchaConfig();
  if (!secretKey) {
    return { ok: true, configured: false };
  }
  if (!token) {
    return { ok: false, status: 400, error: "Missing reCAPTCHA token." };
  }

  const body = new URLSearchParams();
  body.set("secret", secretKey);
  body.set("response", token);
  if (remoteIp) body.set("remoteip", remoteIp);

  let payload = null;
  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
    payload = await response.json().catch(() => null);
    if (!response.ok) {
      return { ok: false, status: 502, error: "reCAPTCHA verification failed." };
    }
  } catch {
    return { ok: false, status: 502, error: "Unable to verify reCAPTCHA." };
  }

  const success = Boolean(payload?.success);
  const score = Number(payload?.score ?? 0);
  const receivedAction = String(payload?.action || "");
  if (!success) {
    return { ok: false, status: 400, error: "reCAPTCHA challenge failed." };
  }
  if (receivedAction !== action) {
    return { ok: false, status: 400, error: "Invalid reCAPTCHA action." };
  }
  if (!Number.isFinite(score) || score < minScore) {
    return { ok: false, status: 400, error: "reCAPTCHA score too low." };
  }
  return { ok: true, configured: true };
}

async function sendContactEmail({ name, email, subject, message }) {
  const sendgridApiKey = normalizeEnvValue(process.env.SENDGRID_API_KEY || "");
  const toEmail = normalizeEnvValue(process.env.CONTACT_TO_EMAIL || "hello@darkroomx.com");
  const fromEmail = normalizeEnvValue(process.env.CONTACT_FROM_EMAIL || "");
  if (!sendgridApiKey || !fromEmail) {
    return { ok: false, status: 500, error: "Contact email is not configured. Set SENDGRID_API_KEY and CONTACT_FROM_EMAIL." };
  }

  const textBody = [
    "New DarkroomX contact form submission",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Subject: ${subject}`,
    "",
    "Message:",
    message,
  ].join("\n");

  const htmlBody = `
    <h2>New DarkroomX contact form submission</h2>
    <p><strong>Name:</strong> ${String(name).replace(/[<>&"]/g, "")}</p>
    <p><strong>Email:</strong> ${String(email).replace(/[<>&"]/g, "")}</p>
    <p><strong>Subject:</strong> ${String(subject).replace(/[<>&"]/g, "")}</p>
    <p><strong>Message:</strong></p>
    <p>${String(message).replace(/[<>&"]/g, "").replace(/\n/g, "<br />")}</p>
  `;

  const sendResult = await sendSendgridMail({
    sendgridApiKey,
    fromEmail,
    toEmail,
    replyTo: { email, name },
    subject: `[DarkroomX Contact] ${subject}`,
    textBody,
    htmlBody,
  });
  if (!sendResult.ok) return sendResult;
  return { ok: true };
}

async function sendSendgridMail({ sendgridApiKey, fromEmail, toEmail, subject, textBody, htmlBody, replyTo = null }) {
  if (!sendgridApiKey || !fromEmail || !toEmail) {
    return { ok: false, status: 500, error: "Missing SendGrid mail configuration." };
  }

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${sendgridApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: toEmail }], subject }],
      from: { email: fromEmail, name: "DarkroomX" },
      ...(replyTo ? { reply_to: replyTo } : {}),
      content: [
        { type: "text/plain", value: textBody || "" },
        { type: "text/html", value: htmlBody || "" },
      ],
    }),
  });

  if (!response.ok) {
    let errorText = "";
    try {
      errorText = await response.text();
    } catch {
      errorText = "";
    }
    return { ok: false, status: response.status || 502, error: errorText || "Failed to send email." };
  }
  return { ok: true };
}

async function sendSignupWelcomeAndNotificationEmail({ userName, userEmail }) {
  const sendgridApiKey = normalizeEnvValue(process.env.SENDGRID_API_KEY || "");
  const fromEmail = normalizeEnvValue(process.env.CONTACT_FROM_EMAIL || "");
  const notifyEmail = normalizeEnvValue(process.env.SIGNUP_NOTIFY_EMAIL || process.env.CONTACT_TO_EMAIL || "hello@darkroomx.com");
  if (!sendgridApiKey || !fromEmail || !userEmail) return;

  const safeName = String(userName || "").trim() || "there";
  const welcomeSubject = "Welcome to DarkroomX";
  const welcomeText = [
    `Hi ${safeName},`,
    "",
    "Welcome to DarkroomX - we're glad you're here.",
    "",
    "DarkroomX is built for photographers and creators who want a focused, modern editing experience without unnecessary distractions. Edit, generate, and reimagine images using powerful tools and AI, all within a clean, session-based workflow that never touches your original files.",
    "",
    "Here’s what you can do right away:",
    "- Upload an image and start editing instantly",
    "- Use AI to generate or reimagine images at up to 4K resolution",
    "- Experiment freely - sessions are non-destructive",
    "- Export only when you’re ready",
    "",
    "There are no catalogs to manage, no lock-in, and no pressure to commit. Work at your own pace and use DarkroomX however it fits your workflow.",
    "",
    "If you have questions, feedback, or ideas, we'd genuinely love to hear from you. DarkroomX is shaped by photographers who use it every day.",
    "",
    "Thanks for being here,",
    "The DarkroomX Team",
  ].join("\n");

  const welcomeHtml = `
    <p>Hi ${String(safeName).replace(/[<>&"]/g, "")},</p>
    <p>Welcome to DarkroomX - we're glad you're here.</p>
    <p>DarkroomX is built for photographers and creators who want a focused, modern editing experience without unnecessary distractions. Edit, generate, and reimagine images using powerful tools and AI, all within a clean, session-based workflow that never touches your original files.</p>
    <p>Here’s what you can do right away:</p>
    <ul>
      <li>Upload an image and start editing instantly</li>
      <li>Use AI to generate or reimagine images at up to 4K resolution</li>
      <li>Experiment freely - sessions are non-destructive</li>
      <li>Export only when you’re ready</li>
    </ul>
    <p>There are no catalogs to manage, no lock-in, and no pressure to commit. Work at your own pace and use DarkroomX however it fits your workflow.</p>
    <p>If you have questions, feedback, or ideas, we'd genuinely love to hear from you. DarkroomX is shaped by photographers who use it every day.</p>
    <p>Thanks for being here,<br />The DarkroomX Team</p>
  `;

  const internalSubject = "DarkroomX: New user signup";
  const internalText = [
    "A new user signed up for DarkroomX.",
    "",
    `Name: ${safeName}`,
    `Email: ${userEmail}`,
    `Signed up at: ${new Date().toISOString()}`,
  ].join("\n");
  const internalHtml = `
    <p>A new user signed up for DarkroomX.</p>
    <p><strong>Name:</strong> ${String(safeName).replace(/[<>&"]/g, "")}</p>
    <p><strong>Email:</strong> ${String(userEmail).replace(/[<>&"]/g, "")}</p>
    <p><strong>Signed up at:</strong> ${new Date().toISOString()}</p>
  `;

  await sendSendgridMail({
    sendgridApiKey,
    fromEmail,
    toEmail: userEmail,
    subject: welcomeSubject,
    textBody: welcomeText,
    htmlBody: welcomeHtml,
  });

  await sendSendgridMail({
    sendgridApiKey,
    fromEmail,
    toEmail: notifyEmail,
    subject: internalSubject,
    textBody: internalText,
    htmlBody: internalHtml,
  });
}

function handleContactSubmit(req, res) {
  let raw = "";
  req.on("data", (chunk) => {
    raw += chunk;
    if (raw.length > 256 * 1024) {
      req.destroy();
    }
  });

  req.on("end", async () => {
    try {
      const payload = JSON.parse(raw || "{}");
      const name = String(payload?.name || "").trim();
      const email = String(payload?.email || "").trim();
      const subject = String(payload?.subject || "").trim();
      const message = String(payload?.message || "").trim();
      const company = String(payload?.company || "").trim();
      const recaptchaToken = String(payload?.recaptchaToken || "").trim();

      if (company) {
        return sendJson(res, 200, { ok: true });
      }
      if (!name || !email || !subject || !message) {
        return sendJson(res, 400, { error: "Missing required fields." });
      }
      if (!isValidEmailAddress(email)) {
        return sendJson(res, 400, { error: "Invalid email address." });
      }
      if (name.length > 120 || email.length > 180 || subject.length > 160 || message.length > 4000) {
        return sendJson(res, 400, { error: "Input is too long." });
      }

      const recaptcha = await verifyRecaptchaToken(recaptchaToken, req.socket?.remoteAddress || "");
      if (!recaptcha.ok) {
        return sendJson(res, recaptcha.status || 400, { error: "Unable to verify request." });
      }

      const result = await sendContactEmail({ name, email, subject, message });
      if (!result.ok) {
        return sendJson(res, result.status || 502, { error: result.error || "Failed to send message." });
      }
      return sendJson(res, 200, { ok: true });
    } catch (error) {
      return sendJson(res, 500, { error: error?.message || "Unexpected contact form error." });
    }
  });
}

function getFramedOfferingsConfig() {
  const raw = process.env.PEECHO_FRAMED_OFFERINGS_JSON || "[]";
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => ({
        key: String(item?.key || "").trim(),
        label: String(item?.label || "").trim(),
        offeringId: String(item?.offeringId || "").trim(),
      }))
      .filter((item) => item.key && item.offeringId);
  } catch {
    return [];
  }
}

async function postJsonWithFallback(urls, body) {
  let lastResponse = null;
  for (const url of urls) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      let payload = null;
      try {
        payload = await response.json();
      } catch {
        payload = null;
      }
      if (response.ok) return { response, payload, url };
      lastResponse = { response, payload, url };
      if (response.status !== 404 && response.status !== 405) {
        return lastResponse;
      }
    } catch (error) {
      lastResponse = { response: null, payload: { error: error.message }, url };
    }
  }
  return lastResponse;
}

function extractImageDataFromNanoBananaResponse(payload) {
  const candidates = Array.isArray(payload?.candidates) ? payload.candidates : [];
  for (const candidate of candidates) {
    const parts = candidate?.content?.parts;
    if (!Array.isArray(parts)) continue;
    for (const part of parts) {
      const inline = part?.inlineData || part?.inline_data;
      if (inline?.data) {
        const mime = inline.mimeType || inline.mime_type || "image/png";
        return `data:${mime};base64,${inline.data}`;
      }
    }
  }
  return null;
}

async function handleNanoBananaEdit(req, res) {
  let raw = "";
  let chargedUserId = "";
  let chargedCost = 0;
  req.on("data", (chunk) => {
    raw += chunk;
    if (raw.length > 30 * 1024 * 1024) {
      req.destroy();
    }
  });

  req.on("end", async () => {
    try {
      const authResult = await getAuthenticatedSupabaseUser(req);
      if (!authResult.ok) {
        return sendJson(res, authResult.status || 401, { error: authResult.error || "Unauthorized." });
      }
      const userId = String(authResult.user?.id || "").trim();
      if (!userId) {
        return sendJson(res, 401, { error: "Unauthorized." });
      }
      const accessStatus = await getUserAccessStatus(req, authResult.user);
      if (!accessStatus.ok) {
        return sendJson(res, accessStatus.status || 502, { error: accessStatus.error || "Unable to verify access." });
      }
      if (!accessStatus.subscriptionActive) {
        return sendJson(res, 403, { error: "AI tools require an active subscription. Trial access includes manual editing only." });
      }

      const cost = 1;
      const chargeResult = await applyCreditDelta({
        req,
        userId,
        delta: -cost,
        reason: "ai_edit",
        source: "studio",
      });
      if (!chargeResult.ok) {
        if (chargeResult.status === 402) {
          return sendJson(res, 402, {
            error: "Insufficient credits.",
            creditsBalance: Number(chargeResult.creditsBalance || 0),
          });
        }
        return sendJson(res, chargeResult.status || 500, { error: chargeResult.error || "Unable to charge credits." });
      }
      chargedUserId = userId;
      chargedCost = cost;

      const { prompt, imageDataUrl } = JSON.parse(raw || "{}");
      if (!prompt || !imageDataUrl) {
        await applyCreditDelta({
          req,
          userId,
          delta: cost,
          reason: "ai_edit_refund",
          source: "studio",
          meta: { reason: "validation_failed" },
        }).catch(() => {});
        return sendJson(res, 400, { error: "Missing prompt or imageDataUrl." });
      }

      const match = /^data:(.*?);base64,(.*)$/.exec(imageDataUrl);
      if (!match) {
        await applyCreditDelta({
          req,
          userId,
          delta: cost,
          reason: "ai_edit_refund",
          source: "studio",
          meta: { reason: "invalid_image_payload" },
        }).catch(() => {});
        return sendJson(res, 400, { error: "Invalid imageDataUrl." });
      }

      const googleApiKey = normalizeGoogleApiKey(process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || "");
      if (!googleApiKey) {
        await applyCreditDelta({
          req,
          userId,
          delta: cost,
          reason: "ai_edit_refund",
          source: "studio",
          meta: { reason: "missing_api_key" },
        }).catch(() => {});
        return sendJson(res, 500, { error: "Server missing GOOGLE_API_KEY or GEMINI_API_KEY in environment." });
      }
      if (!isLikelyGoogleApiKey(googleApiKey)) {
        await applyCreditDelta({
          req,
          userId,
          delta: cost,
          reason: "ai_edit_refund",
          source: "studio",
          meta: { reason: "invalid_api_key" },
        }).catch(() => {});
        return sendJson(res, 500, { error: "Invalid Google API key format in environment." });
      }

      const model = normalizeModelName(process.env.GOOGLE_IMAGE_EDIT_MODEL);
      const endpoint = buildGoogleGenerateEndpoint(model);

      const mimeType = match[1] || "image/png";
      const base64Data = match[2];
      const maxAttempts = Math.max(1, Number(process.env.GOOGLE_IMAGE_EDIT_RETRIES || 4) + 1);
      const requestBody = JSON.stringify({
        system_instruction: {
          parts: [{ text: getImageEditSystemInstruction() }],
        },
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              { inlineData: { mimeType, data: base64Data } },
            ],
          },
        ],
        generationConfig: {
          responseModalities: ["IMAGE", "TEXT"],
        },
      });

      let lastError = "Image edit request failed.";
      let lastStatusCode = 502;

      for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
        try {
          const response = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": googleApiKey,
            },
            body: requestBody,
          });

          let payload = null;
          try {
            payload = await response.json();
          } catch {
            payload = null;
          }

          if (response.ok) {
            const editedImageDataUrl = extractImageDataFromNanoBananaResponse(payload);
            if (editedImageDataUrl) {
              chargedUserId = "";
              chargedCost = 0;
              return sendJson(res, 200, {
                imageDataUrl: editedImageDataUrl,
                creditsBalance: Number(chargeResult.creditsBalance || 0),
              });
            }
            lastError = "No image returned from editor response.";
            lastStatusCode = 502;
            if (attempt < maxAttempts) {
              await sleep(350 * attempt);
              continue;
            }
            break;
          }

          const reason = payload?.error?.message || payload?.error || "Image edit request failed.";
          const reasonText = String(reason);
          const retryable =
            response.status === 429 ||
            response.status >= 500 ||
            /internal error/i.test(reasonText) ||
            /temporar/i.test(reasonText);

          lastError = reasonText;
          lastStatusCode = response.status || 502;

          if (retryable && attempt < maxAttempts) {
            await sleep(500 * attempt);
            continue;
          }
          break;
        } catch (error) {
          lastError = error?.message || "Unexpected server error.";
          lastStatusCode = 502;
          if (attempt < maxAttempts) {
            await sleep(500 * attempt);
            continue;
          }
          break;
        }
      }

      await applyCreditDelta({
        req,
        userId,
        delta: cost,
        reason: "ai_edit_refund",
        source: "studio",
        meta: { reason: "upstream_failed" },
      }).catch(() => {});
      chargedUserId = "";
      chargedCost = 0;
      return sendJson(res, lastStatusCode, { error: lastError });
    } catch (error) {
      if (chargedUserId && chargedCost > 0) {
        await applyCreditDelta({
          req,
          userId: chargedUserId,
          delta: chargedCost,
          reason: "ai_edit_refund",
          source: "studio",
          meta: { reason: "unexpected_server_error" },
        }).catch(() => {});
      }
      return sendJson(res, 500, { error: error?.message || "Unexpected server error." });
    }
  });
}

async function handleNanoBananaGenerate(req, res) {
  let raw = "";
  let chargedUserId = "";
  let chargedCost = 0;
  req.on("data", (chunk) => {
    raw += chunk;
    if (raw.length > 2 * 1024 * 1024) {
      req.destroy();
    }
  });

  req.on("end", async () => {
    try {
      const authResult = await getAuthenticatedSupabaseUser(req);
      if (!authResult.ok) {
        return sendJson(res, authResult.status || 401, { error: authResult.error || "Unauthorized." });
      }
      const userId = String(authResult.user?.id || "").trim();
      if (!userId) {
        return sendJson(res, 401, { error: "Unauthorized." });
      }
      const accessStatus = await getUserAccessStatus(req, authResult.user);
      if (!accessStatus.ok) {
        return sendJson(res, accessStatus.status || 502, { error: accessStatus.error || "Unable to verify access." });
      }
      if (!accessStatus.subscriptionActive) {
        return sendJson(res, 403, { error: "AI tools require an active subscription. Trial access includes manual editing only." });
      }

      const cost = 1;
      const chargeResult = await applyCreditDelta({
        req,
        userId,
        delta: -cost,
        reason: "ai_generate",
        source: "studio",
      });
      if (!chargeResult.ok) {
        if (chargeResult.status === 402) {
          return sendJson(res, 402, {
            error: "Insufficient credits.",
            creditsBalance: Number(chargeResult.creditsBalance || 0),
          });
        }
        return sendJson(res, chargeResult.status || 500, { error: chargeResult.error || "Unable to charge credits." });
      }
      chargedUserId = userId;
      chargedCost = cost;

      const { prompt, resolution, aspectRatio } = JSON.parse(raw || "{}");
      if (!prompt) {
        await applyCreditDelta({
          req,
          userId,
          delta: cost,
          reason: "ai_generate_refund",
          source: "studio",
          meta: { reason: "validation_failed" },
        }).catch(() => {});
        return sendJson(res, 400, { error: "Missing prompt." });
      }

      const googleApiKey = normalizeGoogleApiKey(process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || "");
      if (!googleApiKey) {
        await applyCreditDelta({
          req,
          userId,
          delta: cost,
          reason: "ai_generate_refund",
          source: "studio",
          meta: { reason: "missing_api_key" },
        }).catch(() => {});
        return sendJson(res, 500, { error: "Server missing GOOGLE_API_KEY or GEMINI_API_KEY in environment." });
      }
      if (!isLikelyGoogleApiKey(googleApiKey)) {
        await applyCreditDelta({
          req,
          userId,
          delta: cost,
          reason: "ai_generate_refund",
          source: "studio",
          meta: { reason: "invalid_api_key" },
        }).catch(() => {});
        return sendJson(res, 500, { error: "Invalid Google API key format in environment." });
      }

      const model = normalizeModelName(process.env.GOOGLE_IMAGE_EDIT_MODEL);
      const endpoint = buildGoogleGenerateEndpoint(model);

      const outputHints = [];
      if (resolution) outputHints.push(`target resolution ${resolution}`);
      if (aspectRatio) outputHints.push(`aspect ratio ${aspectRatio}`);
      const effectivePrompt = outputHints.length > 0
        ? `${prompt}\n\nOutput requirements: ${outputHints.join(", ")}.`
        : prompt;
      const allowedImageSizes = new Set(["1K", "2K", "4K"]);
      const allowedAspectRatios = new Set(["1:1", "2:3", "3:2", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9", "21:9"]);
      const imageConfig = {};
      if (allowedImageSizes.has(String(resolution))) {
        imageConfig.imageSize = String(resolution);
      }
      if (allowedAspectRatios.has(String(aspectRatio))) {
        imageConfig.aspectRatio = String(aspectRatio);
      }

      const maxAttempts = Math.max(1, Number(process.env.GOOGLE_IMAGE_EDIT_RETRIES || 4) + 1);
      const requestBody = JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: effectivePrompt }],
          },
        ],
        generationConfig: {
          responseModalities: ["IMAGE", "TEXT"],
          ...(Object.keys(imageConfig).length > 0 ? { imageConfig } : {}),
        },
      });

      let lastError = "Image generation request failed.";
      let lastStatusCode = 502;

      for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
        try {
          const response = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": googleApiKey,
            },
            body: requestBody,
          });

          let payload = null;
          try {
            payload = await response.json();
          } catch {
            payload = null;
          }

          if (response.ok) {
            const generatedImageDataUrl = extractImageDataFromNanoBananaResponse(payload);
            if (generatedImageDataUrl) {
              chargedUserId = "";
              chargedCost = 0;
              return sendJson(res, 200, {
                imageDataUrl: generatedImageDataUrl,
                creditsBalance: Number(chargeResult.creditsBalance || 0),
              });
            }
            lastError = "No image returned from generation response.";
            lastStatusCode = 502;
            if (attempt < maxAttempts) {
              await sleep(350 * attempt);
              continue;
            }
            break;
          }

          const reason = payload?.error?.message || payload?.error || "Image generation request failed.";
          const reasonText = String(reason);
          const retryable =
            response.status === 429 ||
            response.status >= 500 ||
            /internal error/i.test(reasonText) ||
            /temporar/i.test(reasonText);

          lastError = reasonText;
          lastStatusCode = response.status || 502;
          if (retryable && attempt < maxAttempts) {
            await sleep(500 * attempt);
            continue;
          }
          break;
        } catch (error) {
          lastError = error?.message || "Unexpected server error.";
          lastStatusCode = 502;
          if (attempt < maxAttempts) {
            await sleep(500 * attempt);
            continue;
          }
          break;
        }
      }

      await applyCreditDelta({
        req,
        userId,
        delta: cost,
        reason: "ai_generate_refund",
        source: "studio",
        meta: { reason: "upstream_failed" },
      }).catch(() => {});
      chargedUserId = "";
      chargedCost = 0;
      return sendJson(res, lastStatusCode, { error: lastError });
    } catch (error) {
      if (chargedUserId && chargedCost > 0) {
        await applyCreditDelta({
          req,
          userId: chargedUserId,
          delta: chargedCost,
          reason: "ai_generate_refund",
          source: "studio",
          meta: { reason: "unexpected_server_error" },
        }).catch(() => {});
      }
      return sendJson(res, 500, { error: error?.message || "Unexpected server error." });
    }
  });
}

async function handlePeechoPrintOrder(req, res) {
  let raw = "";
  req.on("data", (chunk) => {
    raw += chunk;
    if (raw.length > 30 * 1024 * 1024) req.destroy();
  });

  req.on("end", async () => {
    try {
      const {
        imageDataUrl,
        fileName,
        width,
        height,
        offeringKey,
        quantity,
        currency,
        email,
        address,
      } = JSON.parse(raw || "{}");

      if (!imageDataUrl || !offeringKey || !email || !address?.line1 || !address?.city || !address?.postalCode || !address?.countryCode) {
        return sendJson(res, 400, { error: "Missing required print fields." });
      }

      const framedOfferings = getFramedOfferingsConfig();
      const selectedOffering = framedOfferings.find((offering) => offering.key === String(offeringKey));
      if (!selectedOffering) {
        return sendJson(res, 400, { error: "Invalid framed offering selected." });
      }

      const peechoApiKey = process.env.PEECHO_API_KEY;
      if (!peechoApiKey) {
        return sendJson(res, 500, { error: "Server missing PEECHO_API_KEY in .env." });
      }

      const decoded = decodeDataUrl(imageDataUrl);
      if (!decoded) {
        return sendJson(res, 400, { error: "Invalid image payload." });
      }

      const baseUrl = getPublicBaseUrl(req);
      if (!baseUrl) {
        return sendJson(res, 500, { error: "Server missing PUBLIC_BASE_URL/PEECHO_PUBLIC_BASE_URL." });
      }

      const assetId = crypto.randomBytes(12).toString("hex");
      printAssets.set(assetId, {
        mimeType: decoded.mimeType,
        buffer: decoded.buffer,
        createdAt: Date.now(),
      });
      const contentUrl = `${baseUrl}/api/print-assets/${assetId}`;

      const peechoBaseUrl = (process.env.PEECHO_BASE_URL || "https://test.www.peecho.com").replace(/\/$/, "");
      const orderPayload = {
        merchant_api_key: peechoApiKey,
        currency: currency || "USD",
        email,
        item_details: [
          {
            item_reference: fileName || `darkroomx-${Date.now()}`,
            offering_id: selectedOffering.offeringId,
            quantity: Math.max(1, Number(quantity) || 1),
            file_details: {
              content_url: contentUrl,
              content_width: Number(width) || 1000,
              content_height: Number(height) || 1000,
              number_of_pages: 1,
            },
          },
        ],
        address_details: {
          full_name: address.fullName || "",
          address_line1: address.line1,
          address_line2: address.line2 || "",
          city: address.city,
          state: address.state || "",
          postal_code: address.postalCode,
          country_code: String(address.countryCode || "").toUpperCase(),
        },
      };

      const orderResult = await postJsonWithFallback(
        [`${peechoBaseUrl}/rest/v3/order/`, `${peechoBaseUrl}/rest/v3/orders/`],
        orderPayload,
      );
      if (!orderResult?.response?.ok) {
        const reason = orderResult?.payload?.error || orderResult?.payload?.message || "Unable to create Peecho order.";
        return sendJson(res, orderResult?.response?.status || 502, { error: String(reason), details: orderResult?.payload || null });
      }

      const order = orderResult.payload || {};
      const orderId = order.order_id || order.orderId || order.id || order.order?.id || null;

      let payment = null;
      if (orderId && process.env.PEECHO_API_SECRET) {
        const paymentPayload = {
          merchant_api_key: peechoApiKey,
          order_id: orderId,
          orderId,
          secret: getPeechoSecretHash(orderId),
        };
        const paymentResult = await postJsonWithFallback(
          [`${peechoBaseUrl}/rest/v3/payment/`, `${peechoBaseUrl}/rest/v3/payments/`],
          paymentPayload,
        );
        if (paymentResult?.response?.ok) {
          payment = paymentResult.payload || null;
        }
      }

      return sendJson(res, 200, { orderId, order, payment, contentUrl });
    } catch (error) {
      return sendJson(res, 500, { error: error?.message || "Unexpected print server error." });
    }
  });
}

function handlePeechoFramedOfferings(_req, res) {
  const offerings = getFramedOfferingsConfig().map((item) => ({
    key: item.key,
    label: item.label || item.key,
  }));
  return sendJson(res, 200, { offerings });
}

function serveStatic(req, res) {
  const rawPath = decodeURIComponent(req.url.split("?")[0] || "/");
  if (rawPath === "/admin" && !isAdminAuthenticated(req)) {
    res.writeHead(302, { Location: "/adminlogin", "Cache-Control": "no-store" });
    res.end();
    return;
  }
  if (rawPath === "/adminlogin" && isAdminAuthenticated(req)) {
    res.writeHead(302, { Location: "/admin", "Cache-Control": "no-store" });
    res.end();
    return;
  }

  const reqPath =
    rawPath === "/"
      ? "/index.html"
      : rawPath === "/studio"
        ? "/studio.html"
        : rawPath === "/signup"
          ? "/signup.html"
          : rawPath === "/faqs"
            ? "/faqs.html"
            : rawPath === "/help"
              ? "/help.html"
              : rawPath === "/contact"
                ? "/contact.html"
                : rawPath === "/404"
                  ? "/404.html"
                  : rawPath === "/privacy"
                    ? "/privacy.html"
                    : rawPath === "/terms"
                      ? "/terms.html"
                      : rawPath === "/pricing"
                        ? "/pricing.html"
                        : rawPath === "/auth/callback"
                          ? "/auth-callback.html"
                        : rawPath === "/adminlogin"
                          ? "/adminlogin.html"
                          : rawPath === "/admin"
                            ? "/admin.html"
              : rawPath;
  const safePath = path.normalize(path.join(ROOT, reqPath));
  if (!safePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(safePath, (err, data) => {
    if (err) {
      const fallbackPath = path.join(ROOT, "404.html");
      fs.readFile(fallbackPath, (fallbackErr, fallbackData) => {
        if (fallbackErr) {
          res.writeHead(404);
          res.end("Not Found");
          return;
        }
        res.writeHead(404, {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store",
        });
        res.end(fallbackData);
      });
      return;
    }

    const ext = path.extname(safePath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": MIME_BY_EXT[ext] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    res.end(data);
  });
}

function requestHandler(req, res) {
  const parsedUrl = new URL(req.url, "http://127.0.0.1");
  const pathname = parsedUrl.pathname;
  const adminUserPathMatch = /^\/api\/admin\/users\/([0-9a-f-]+)$/i.exec(pathname || "");
  const projectSessionPathMatch = /^\/api\/projects\/([0-9a-f-]+)\/session$/i.exec(pathname || "");

  if (req.method === "GET" && pathname === "/api/recaptcha/site-key") {
    const { siteKey, action } = getRecaptchaConfig();
    return sendJson(res, 200, { siteKey, action });
  }
  if (req.method === "GET" && pathname === "/api/auth/google") {
    const authUrl = getGoogleAuthStartUrl(req);
    if (!authUrl) {
      return sendJson(res, 500, {
        error:
          "Google OAuth is not configured. Set Supabase keys (SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_AUTH_REDIRECT_URL) or legacy GOOGLE_OAUTH_* variables.",
      });
    }
    res.writeHead(302, { Location: authUrl, "Cache-Control": "no-store" });
    res.end();
    return;
  }
  if (req.method === "POST" && pathname === "/api/auth/bootstrap") {
    handleSupabaseAuthBootstrap(req, res);
    return;
  }
  if (req.method === "POST" && pathname === "/api/auth/refresh") {
    handleSupabaseAuthRefresh(req, res);
    return;
  }
  if (req.method === "GET" && pathname === "/api/access/status") {
    handleAccessStatus(req, res);
    return;
  }
  if (req.method === "POST" && pathname === "/api/contact") {
    handleContactSubmit(req, res);
    return;
  }
  if (req.method === "POST" && pathname === "/api/admin/login") {
    handleAdminLogin(req, res);
    return;
  }
  if (req.method === "POST" && pathname === "/api/admin/logout") {
    handleAdminLogout(req, res);
    return;
  }
  if (req.method === "GET" && pathname === "/api/admin/users") {
    handleAdminUsersList(req, res);
    return;
  }
  if (req.method === "PATCH" && adminUserPathMatch) {
    handleAdminUserUpdate(req, res, adminUserPathMatch[1]);
    return;
  }
  if (req.method === "DELETE" && adminUserPathMatch) {
    handleAdminUserDelete(req, res, adminUserPathMatch[1]);
    return;
  }
  if (req.method === "POST" && pathname === "/api/admin/email") {
    handleAdminUserEmail(req, res);
    return;
  }
  if (req.method === "GET" && pathname === "/api/projects") {
    handleProjectsList(req, res);
    return;
  }
  if (req.method === "POST" && pathname === "/api/projects") {
    handleProjectsCreate(req, res);
    return;
  }
  if (req.method === "GET" && projectSessionPathMatch) {
    handleProjectSessionLoad(req, res, projectSessionPathMatch[1]);
    return;
  }
  if (req.method === "PUT" && projectSessionPathMatch) {
    handleProjectSessionSave(req, res, projectSessionPathMatch[1]);
    return;
  }
  if (req.method === "POST" && pathname === "/api/stripe/checkout/subscription") {
    handleStripeSubscriptionCheckout(req, res);
    return;
  }
  if (req.method === "POST" && pathname === "/api/stripe/checkout/topup") {
    handleStripeTopupCheckout(req, res);
    return;
  }
  if (req.method === "POST" && pathname === "/api/stripe/billing-portal") {
    handleStripeBillingPortal(req, res);
    return;
  }
  if (req.method === "POST" && pathname === "/api/stripe/webhook") {
    handleStripeWebhook(req, res);
    return;
  }
  if (req.method === "POST" && pathname === "/api/image-edit") {
    handleNanoBananaEdit(req, res);
    return;
  }
  if (req.method === "POST" && pathname === "/api/image-generate") {
    handleNanoBananaGenerate(req, res);
    return;
  }
  if (req.method === "POST" && pathname === "/api/raw-preview") {
    handleRawPreview(req, res);
    return;
  }
  if (req.method === "POST" && pathname === "/api/raw-preview/start") {
    handleRawPreviewStart(req, res);
    return;
  }
  if (req.method === "POST" && pathname === "/api/raw-preview/complete") {
    handleRawPreviewComplete(req, res);
    return;
  }
  if (req.method === "POST" && pathname === "/api/peecho/print-order") {
    handlePeechoPrintOrder(req, res);
    return;
  }
  if (req.method === "GET" && pathname === "/api/peecho/framed-offerings") {
    handlePeechoFramedOfferings(req, res);
    return;
  }
  if (req.method === "GET" && pathname.startsWith("/api/print-assets/")) {
    const assetId = pathname.split("/api/print-assets/")[1]?.split("?")[0];
    const asset = printAssets.get(assetId);
    if (!asset) {
      res.writeHead(404);
      res.end("Not Found");
      return;
    }
    res.writeHead(200, {
      "Content-Type": asset.mimeType || "application/octet-stream",
      "Cache-Control": "public, max-age=300",
    });
    res.end(asset.buffer);
    return;
  }

  if (req.method === "GET") {
    serveStatic(req, res);
    return;
  }

  res.writeHead(405);
  res.end("Method Not Allowed");
}

if (require.main === module) {
  const server = http.createServer(requestHandler);
  server.listen(PORT, "127.0.0.1", () => {
    console.log(`Server running at http://127.0.0.1:${PORT}`);
  });
}

module.exports = requestHandler;
