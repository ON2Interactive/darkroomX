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

  if (!hasSignupBonus && config.signupCredits > 0) {
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

    if (!ledgerInsertResponse.ok) {
      const reason = await ledgerInsertResponse.text().catch(() => "");
      return { ok: false, status: 502, error: `Unable to create starter credits.${reason ? ` ${reason}` : ""}` };
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

      return sendJson(res, 200, {
        ok: true,
        redirectTo: "/studio",
        profile: bootstrapResult.profile,
        activeProject: bootstrapResult.activeProject,
      });
    } catch (error) {
      return sendJson(res, 400, { error: error?.message || "Invalid request payload." });
    }
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

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${sendgridApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: toEmail }], subject: `[DarkroomX Contact] ${subject}` }],
      from: { email: fromEmail, name: "DarkroomX Contact Form" },
      reply_to: { email, name },
      content: [
        { type: "text/plain", value: textBody },
        { type: "text/html", value: htmlBody },
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
    return { ok: false, status: response.status || 502, error: errorText || "Failed to send contact email." };
  }
  return { ok: true };
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
  req.on("data", (chunk) => {
    raw += chunk;
    if (raw.length > 30 * 1024 * 1024) {
      req.destroy();
    }
  });

  req.on("end", async () => {
    try {
      const { prompt, imageDataUrl } = JSON.parse(raw || "{}");
      if (!prompt || !imageDataUrl) {
        return sendJson(res, 400, { error: "Missing prompt or imageDataUrl." });
      }

      const match = /^data:(.*?);base64,(.*)$/.exec(imageDataUrl);
      if (!match) {
        return sendJson(res, 400, { error: "Invalid imageDataUrl." });
      }

      const googleApiKey = normalizeGoogleApiKey(process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || "");
      if (!googleApiKey) {
        return sendJson(res, 500, { error: "Server missing GOOGLE_API_KEY or GEMINI_API_KEY in environment." });
      }
      if (!isLikelyGoogleApiKey(googleApiKey)) {
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
              return sendJson(res, 200, { imageDataUrl: editedImageDataUrl });
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

      return sendJson(res, lastStatusCode, { error: lastError });
    } catch (error) {
      return sendJson(res, 500, { error: error?.message || "Unexpected server error." });
    }
  });
}

async function handleNanoBananaGenerate(req, res) {
  let raw = "";
  req.on("data", (chunk) => {
    raw += chunk;
    if (raw.length > 2 * 1024 * 1024) {
      req.destroy();
    }
  });

  req.on("end", async () => {
    try {
      const { prompt, resolution, aspectRatio } = JSON.parse(raw || "{}");
      if (!prompt) {
        return sendJson(res, 400, { error: "Missing prompt." });
      }

      const googleApiKey = normalizeGoogleApiKey(process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || "");
      if (!googleApiKey) {
        return sendJson(res, 500, { error: "Server missing GOOGLE_API_KEY or GEMINI_API_KEY in environment." });
      }
      if (!isLikelyGoogleApiKey(googleApiKey)) {
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
              return sendJson(res, 200, { imageDataUrl: generatedImageDataUrl });
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

      return sendJson(res, lastStatusCode, { error: lastError });
    } catch (error) {
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
  if (req.method === "GET" && req.url === "/api/recaptcha/site-key") {
    const { siteKey, action } = getRecaptchaConfig();
    return sendJson(res, 200, { siteKey, action });
  }
  if (req.method === "GET" && req.url === "/api/auth/google") {
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
  if (req.method === "POST" && req.url === "/api/auth/bootstrap") {
    handleSupabaseAuthBootstrap(req, res);
    return;
  }
  if (req.method === "POST" && req.url === "/api/contact") {
    handleContactSubmit(req, res);
    return;
  }
  if (req.method === "POST" && req.url === "/api/admin/login") {
    handleAdminLogin(req, res);
    return;
  }
  if (req.method === "POST" && req.url === "/api/admin/logout") {
    handleAdminLogout(req, res);
    return;
  }
  if (req.method === "POST" && req.url === "/api/image-edit") {
    handleNanoBananaEdit(req, res);
    return;
  }
  if (req.method === "POST" && req.url === "/api/image-generate") {
    handleNanoBananaGenerate(req, res);
    return;
  }
  if (req.method === "POST" && req.url === "/api/peecho/print-order") {
    handlePeechoPrintOrder(req, res);
    return;
  }
  if (req.method === "GET" && req.url === "/api/peecho/framed-offerings") {
    handlePeechoFramedOfferings(req, res);
    return;
  }
  if (req.method === "GET" && req.url.startsWith("/api/print-assets/")) {
    const assetId = req.url.split("/api/print-assets/")[1]?.split("?")[0];
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
