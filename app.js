const photosInput = document.getElementById("photosInput");
const folderInput = document.getElementById("folderInput");
const projectInput = document.getElementById("projectInput");
const appShell = document.querySelector(".app-shell");
const filmstrip = document.getElementById("filmstrip");
const filmstripHandle = document.getElementById("filmstripHandle");
const filmstripSelectAllBtn = document.getElementById("filmstripSelectAllBtn");
const filmstripClearSelectionBtn = document.getElementById("filmstripClearSelectionBtn");
const layersPanelList = document.getElementById("layersPanelList");
const mainPreview = document.getElementById("mainPreview");
const previewWrap = document.getElementById("previewWrap");
const overlayLayer = document.getElementById("overlayLayer");
const cropOverlay = document.getElementById("cropOverlay");
const cropBox = document.getElementById("cropBox");
const cropControlsTopbar = document.getElementById("cropControlsTopbar");
const cropAspectSelect = document.getElementById("cropAspectSelect");
const cropCustomRatioInputs = document.getElementById("cropCustomRatioInputs");
const cropCustomWidth = document.getElementById("cropCustomWidth");
const cropCustomHeight = document.getElementById("cropCustomHeight");
const cropRotateLeftBtn = document.getElementById("cropRotateLeftBtn");
const cropRotateRightBtn = document.getElementById("cropRotateRightBtn");
const cropResetRotationBtn = document.getElementById("cropResetRotationBtn");
const cropApplyBtn = document.getElementById("cropApplyBtn");
const cropCancelBtn = document.getElementById("cropCancelBtn");
const emptyState = document.getElementById("emptyState");
const emptyUploadPhotosBtn = document.getElementById("emptyUploadPhotosBtn");
const emptyUploadFolderBtn = document.getElementById("emptyUploadFolderBtn");
const emptyGenerateBtn = document.getElementById("emptyGenerateBtn");
const metaBlock = document.getElementById("photoMeta");
const selectionPanels = document.querySelectorAll(".selection-panel");

const textPropertiesPanel = document.getElementById("textPropertiesPanel");
const textFontFamily = document.getElementById("textFontFamily");
const textFontWeight = document.getElementById("textFontWeight");
const textFontStyle = document.getElementById("textFontStyle");
const textAlign = document.getElementById("textAlign");
const textFontSize = document.getElementById("textFontSize");
const textFontSizeVal = document.getElementById("textFontSizeVal");
const textLetterSpacing = document.getElementById("textLetterSpacing");
const textLetterSpacingVal = document.getElementById("textLetterSpacingVal");
const textWordSpacing = document.getElementById("textWordSpacing");
const textWordSpacingVal = document.getElementById("textWordSpacingVal");
const textLineHeight = document.getElementById("textLineHeight");
const textLineHeightVal = document.getElementById("textLineHeightVal");
const textRotation = document.getElementById("textRotation");
const textRotationVal = document.getElementById("textRotationVal");
const textOpacity = document.getElementById("textOpacity");
const textOpacityVal = document.getElementById("textOpacityVal");
const textColor = document.getElementById("textColor");
const shapePropertiesPanel = document.getElementById("shapePropertiesPanel");
const shapeFillColor = document.getElementById("shapeFillColor");
const shapeStrokeColor = document.getElementById("shapeStrokeColor");
const shapeStrokeWidth = document.getElementById("shapeStrokeWidth");
const shapeStrokeWidthVal = document.getElementById("shapeStrokeWidthVal");
const shapeBorderRadius = document.getElementById("shapeBorderRadius");
const shapeBorderRadiusVal = document.getElementById("shapeBorderRadiusVal");
const shapeOpacity = document.getElementById("shapeOpacity");
const shapeOpacityVal = document.getElementById("shapeOpacityVal");
const shapeRotation = document.getElementById("shapeRotation");
const shapeRotationVal = document.getElementById("shapeRotationVal");
const shapeSidesRow = document.getElementById("shapeSidesRow");
const shapeSides = document.getElementById("shapeSides");
const shapeSidesVal = document.getElementById("shapeSidesVal");
const shapeFlyout = document.getElementById("shapeFlyout");
const shapeOptionButtons = Array.from(document.querySelectorAll(".shape-option-btn"));
const filmLookSelect = document.getElementById("filmLookSelect");
const filmLookStrength = document.getElementById("filmLookStrength");
const filmLookStrengthVal = document.getElementById("filmLookStrengthVal");
const filmLookResetBtn = document.getElementById("filmLookResetBtn");

const toolSelectBtn = document.getElementById("toolSelectBtn");
const toolUploadBtn = document.getElementById("toolUploadBtn");
const toolCropBtn = document.getElementById("toolCropBtn");
const toolTextBtn = document.getElementById("toolTextBtn");
const toolGenerateBtn = document.getElementById("toolGenerateBtn");
const toolPrintBtn = document.getElementById("toolPrintBtn");
const toolLibraryBtn = document.getElementById("toolLibraryBtn");
const toolSettingsBtn = document.getElementById("toolSettingsBtn");
const toolShapesBtn = document.getElementById("toolShapesBtn");
const toolEditBtn = document.getElementById("toolEditBtn");

const editModal = document.getElementById("editModal");
const editModalThumb = document.getElementById("editModalThumb");
const editModalStrip = document.getElementById("editModalStrip");
const editPromptInput = document.getElementById("editPromptInput");
const editModalStatus = document.getElementById("editModalStatus");
const editModalCloseBtn = document.getElementById("editModalCloseBtn");
const editCancelBtn = document.getElementById("editCancelBtn");
const editSubmitBtn = document.getElementById("editSubmitBtn");
const editProcessingOverlay = document.getElementById("editProcessingOverlay");
const editProcessingStatus = document.getElementById("editProcessingStatus");
const rawProcessingOverlay = document.getElementById("rawProcessingOverlay");
const rawProcessingStatus = document.getElementById("rawProcessingStatus");
const generateModal = document.getElementById("generateModal");
const generatePromptInput = document.getElementById("generatePromptInput");
const generateResolutionSelect = document.getElementById("generateResolutionSelect");
const generateAspectRatioSelect = document.getElementById("generateAspectRatioSelect");
const generateModalStatus = document.getElementById("generateModalStatus");
const generateModalCloseBtn = document.getElementById("generateModalCloseBtn");
const generateCancelBtn = document.getElementById("generateCancelBtn");
const generateSubmitBtn = document.getElementById("generateSubmitBtn");
const printModal = document.getElementById("printModal");
const printModalCloseBtn = document.getElementById("printModalCloseBtn");
const printCancelBtn = document.getElementById("printCancelBtn");
const printSubmitBtn = document.getElementById("printSubmitBtn");
const printModalStatus = document.getElementById("printModalStatus");
const wallartModal = document.getElementById("wallartModal");
const wallartModalCloseBtn = document.getElementById("wallartModalCloseBtn");
const wallartPreview = document.getElementById("wallartPreview");
const wallartProduct = document.getElementById("wallartProduct");
const wallartMeta = document.getElementById("wallartMeta");
const wallartStatus = document.getElementById("wallartStatus");
const wallartCancelBtn = document.getElementById("wallartCancelBtn");
const wallartPrintspaceBtn = document.getElementById("wallartPrintspaceBtn");
const wallartContinueBtn = document.getElementById("wallartContinueBtn");
const creditsModal = document.getElementById("creditsModal");
const creditsModalTitle = document.getElementById("creditsModalTitle");
const creditsModalCloseBtn = document.getElementById("creditsModalCloseBtn");
const creditsModalBuyBtn = document.getElementById("creditsModalBuyBtn");
const settingsModal = document.getElementById("settingsModal");
const settingsModalCloseBtn = document.getElementById("settingsModalCloseBtn");
const settingsManageSubscriptionBtn = document.getElementById("settingsManageSubscriptionBtn");
const settingsBuyCreditsBtn = document.getElementById("settingsBuyCreditsBtn");
const settingsHelpBtn = document.getElementById("settingsHelpBtn");
const settingsShareBtn = document.getElementById("settingsShareBtn");
const libraryModal = document.getElementById("libraryModal");
const libraryModalCloseBtn = document.getElementById("libraryModalCloseBtn");
const settingsProjectNameInput = document.getElementById("settingsProjectNameInput");
const settingsProjectNewBtn = document.getElementById("settingsProjectNewBtn");
const settingsProjectSaveBtn = document.getElementById("settingsProjectSaveBtn");
const settingsProjectRefreshBtn = document.getElementById("settingsProjectRefreshBtn");
const settingsProjectsStatus = document.getElementById("settingsProjectsStatus");
const settingsProjectsList = document.getElementById("settingsProjectsList");
const settingsLinkButtons = [settingsManageSubscriptionBtn, settingsBuyCreditsBtn, settingsHelpBtn].filter(Boolean);
const trialLockModal = document.getElementById("trialLockModal");
const trialLockMessage = document.getElementById("trialLockMessage");
const trialLockSubscribeBtn = document.getElementById("trialLockSubscribeBtn");
const trialLockRefreshBtn = document.getElementById("trialLockRefreshBtn");
const printOfferingSelect = document.getElementById("printOfferingSelect");
const printQuantityInput = document.getElementById("printQuantityInput");
const printCurrencyInput = document.getElementById("printCurrencyInput");
const printEmailInput = document.getElementById("printEmailInput");
const printFullNameInput = document.getElementById("printFullNameInput");
const printAddress1Input = document.getElementById("printAddress1Input");
const printAddress2Input = document.getElementById("printAddress2Input");
const printCityInput = document.getElementById("printCityInput");
const printStateInput = document.getElementById("printStateInput");
const printPostalInput = document.getElementById("printPostalInput");
const printCountryInput = document.getElementById("printCountryInput");

const zoomInBtn = document.getElementById("zoomInBtn");
const zoomOutBtn = document.getElementById("zoomOutBtn");
const zoomResetBtn = document.getElementById("zoomResetBtn");
const undoBtn = document.getElementById("undoBtn");
const redoBtn = document.getElementById("redoBtn");
const loadProjectBtn = document.getElementById("loadProjectBtn");
const saveProjectBtn = document.getElementById("saveProjectBtn");
const exportTopBtn = document.getElementById("exportTopBtn");
const creditsBtn = document.getElementById("creditsBtn");
const creditsBtnLabel = document.getElementById("creditsBtnLabel");
const zoomLevel = document.getElementById("zoomLevel");
const compareBtn = document.getElementById("compareBtn");
const compareBtnLabel = document.getElementById("compareBtnLabel");
const resetBtn = document.getElementById("resetBtn");
const orderPrintBtn = document.getElementById("orderPrintBtn");
const rotateLeftBtn = document.getElementById("rotateLeftBtn");
const rotateRightBtn = document.getElementById("rotateRightBtn");
const resetRotationBtn = document.getElementById("resetRotationBtn");
const histogramCanvas = document.getElementById("histogramCanvas");
const levelsChannelSelect = document.getElementById("levelsChannel");
const curvesChannelSelect = document.getElementById("curvesChannel");
const levelsCanvas = document.getElementById("levelsCanvas");
const curvesCanvas = document.getElementById("curvesCanvas");
const levelsReadout = document.getElementById("levelsReadout");
const levelsResetBtn = document.getElementById("levelsResetBtn");
const curvesResetBtn = document.getElementById("curvesResetBtn");
const toneCurveFuncR = document.getElementById("toneCurveFuncR");
const toneCurveFuncG = document.getElementById("toneCurveFuncG");
const toneCurveFuncB = document.getElementById("toneCurveFuncB");

const sliderIds = [
  "exposure",
  "brightness",
  "contrast",
  "blackPoint",
  "clarity",
  "saturation",
  "temperature",
  "tint",
];

const toolButtons = {
  select: toolSelectBtn,
  crop: toolCropBtn,
  text: toolTextBtn,
};

const defaultAdjustments = {
  exposure: 0,
  brightness: 0,
  contrast: 0,
  blackPoint: 0,
  clarity: 0,
  saturation: 0,
  temperature: 0,
  tint: 0,
  levelsChannel: "rgb",
  levelsByChannel: {
    rgb: { black: 0, mid: 128, white: 255 },
    red: { black: 0, mid: 128, white: 255 },
    green: { black: 0, mid: 128, white: 255 },
    blue: { black: 0, mid: 128, white: 255 },
  },
  curvesChannel: "rgb",
  curvesByChannel: {
    rgb: [{ x: 0, y: 0 }, { x: 128, y: 128 }, { x: 255, y: 255 }],
    red: [{ x: 0, y: 0 }, { x: 128, y: 128 }, { x: 255, y: 255 }],
    green: [{ x: 0, y: 0 }, { x: 128, y: 128 }, { x: 255, y: 255 }],
    blue: [{ x: 0, y: 0 }, { x: 128, y: 128 }, { x: 255, y: 255 }],
  },
};
const TONE_CHANNELS = ["rgb", "red", "green", "blue"];
const MAX_BATCH_EDIT_COUNT = 4;
const LAYER_TEXT_PREFIX = "text:";
const LAYER_SHAPE_PREFIX = "shape:";
const SNAP_THRESHOLD_PX = 8;
const DEFAULT_CREDITS = 1000;
const CREDITS_STORAGE_KEY = "darkroomx_credits";
const PROFILE_STORAGE_KEY = "darkroomx_profile";
const AUTH_TOKEN_STORAGE_KEY = "darkroomx_auth_token";
const REFRESH_TOKEN_STORAGE_KEY = "darkroomx_refresh_token";
const AUTH_EXPIRES_AT_STORAGE_KEY = "darkroomx_auth_expires_at";
const APP_SESSION_STARTED_AT_STORAGE_KEY = "darkroomx_app_session_started_at";
const SESSION_RECOVERY_STORAGE_KEY = "darkroomx_session_recovery";
const PROJECT_META_STORAGE_KEY = "darkroomx_active_project";
const APP_SESSION_TTL_MS = 24 * 60 * 60 * 1000;
const CLOUD_AUTOSAVE_INTERVAL_MS = 15 * 1000;
const APP_SESSION_EXPIRED_MESSAGE = "Your 24-hour app session ended. Please sign in again to continue.";
const RAW_FILE_EXTENSIONS = new Set(["dng", "cr2", "cr3", "nef", "arw", "rw2", "orf", "raf", "pef", "srw", "x3f"]);
const CREDIT_COSTS = {
  generate: 1,
  edit: 1,
};
const CROP_ASPECT_MAP = {
  "1:1": 1,
  "4:5": 4 / 5,
  "8:10": 8 / 10,
  "5:7": 5 / 7,
  "3:2": 3 / 2,
  "16:9": 16 / 9,
};
const MIN_CROP_SIZE_PX = 40;
const SESSION_SAVE_MAX_DIMENSION = 2048;
const SESSION_SAVE_JPEG_QUALITY_START = 0.88;
const SESSION_SAVE_JPEG_QUALITY_MIN = 0.55;
const SESSION_SAVE_TARGET_BYTES = 1_400_000;
const CLOUD_SESSION_REQUEST_SOFT_LIMIT_BYTES = 4_000_000;
const toneDragState = {
  levelsHandle: null,
  curvesHandleIndex: null,
};

const FALLBACK_FONT_OPTIONS = [
  { label: "Helvetica", value: "Helvetica, Arial, sans-serif" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Verdana", value: "Verdana, sans-serif" },
  { label: "Times New Roman", value: "'Times New Roman', serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Courier New", value: "'Courier New', monospace" },
];

const FILM_LOOK_PROFILES = [
  { id: "none", name: "None", brightness: 100, contrast: 100, saturation: 100, sepia: 0, hueRotate: 0, warm: 0, cool: 0, tint: 0 },
  { id: "kodachrome-64", name: "Kodachrome 64", brightness: 103, contrast: 118, saturation: 92, sepia: 14, hueRotate: -3, warm: 11, cool: 0, tint: 2 },
  { id: "kodachrome-25", name: "Kodachrome 25", brightness: 101, contrast: 122, saturation: 90, sepia: 18, hueRotate: -4, warm: 13, cool: 0, tint: 3 },
  { id: "ektachrome-e100", name: "Ektachrome E100", brightness: 102, contrast: 112, saturation: 108, sepia: 4, hueRotate: -2, warm: 4, cool: 0, tint: 1 },
  { id: "astia-100f", name: "Fujichrome Astia 100F", brightness: 102, contrast: 104, saturation: 106, sepia: 2, hueRotate: 1, warm: 2, cool: 0, tint: -1 },
  { id: "velvia-50", name: "Fujichrome Velvia 50", brightness: 100, contrast: 120, saturation: 132, sepia: 2, hueRotate: -4, warm: 3, cool: 0, tint: -1 },
  { id: "provia-100f", name: "Fujichrome Provia 100F", brightness: 101, contrast: 110, saturation: 112, sepia: 1, hueRotate: -1, warm: 2, cool: 0, tint: 0 },
  { id: "portra-160", name: "Kodak Portra 160", brightness: 106, contrast: 96, saturation: 94, sepia: 7, hueRotate: 2, warm: 8, cool: 0, tint: 1 },
  { id: "portra-400", name: "Kodak Portra 400", brightness: 107, contrast: 102, saturation: 98, sepia: 8, hueRotate: 2, warm: 9, cool: 0, tint: 1 },
  { id: "gold-200", name: "Kodak Gold 200", brightness: 105, contrast: 108, saturation: 106, sepia: 10, hueRotate: -2, warm: 10, cool: 0, tint: 1 },
  { id: "ektar-100", name: "Kodak Ektar 100", brightness: 101, contrast: 114, saturation: 126, sepia: 3, hueRotate: -5, warm: 2, cool: 0, tint: -1 },
  { id: "ultramax-400", name: "Kodak UltraMax 400", brightness: 104, contrast: 106, saturation: 110, sepia: 6, hueRotate: -1, warm: 7, cool: 0, tint: 1 },
  { id: "superia-400", name: "Fuji Superia 400", brightness: 102, contrast: 108, saturation: 116, sepia: 2, hueRotate: 3, warm: 1, cool: 2, tint: -1 },
  { id: "natura-1600", name: "Fuji Natura 1600", brightness: 105, contrast: 101, saturation: 102, sepia: 3, hueRotate: 1, warm: 2, cool: 2, tint: -1 },
  { id: "cinestill-800t", name: "CineStill 800T", brightness: 103, contrast: 110, saturation: 105, sepia: 1, hueRotate: 6, warm: 0, cool: 8, tint: -2 },
  { id: "agfa-vista-200", name: "Agfa Vista 200", brightness: 103, contrast: 104, saturation: 108, sepia: 5, hueRotate: 1, warm: 5, cool: 0, tint: 0 },
  { id: "orwo-nc500", name: "ORWO NC500", brightness: 100, contrast: 116, saturation: 88, sepia: 6, hueRotate: -3, warm: 4, cool: 0, tint: 0 },
  { id: "ilford-hp5", name: "Ilford HP5 Mono", brightness: 101, contrast: 124, saturation: 0, sepia: 0, hueRotate: 0, warm: 0, cool: 0, tint: 0 },
  { id: "bw-neutral", name: "B&W Neutral", brightness: 102, contrast: 112, saturation: 0, sepia: 0, hueRotate: 0, warm: 0, cool: 0, tint: 0 },
  { id: "bw-hard-contrast", name: "B&W Hard Contrast", brightness: 100, contrast: 138, saturation: 0, sepia: 0, hueRotate: 0, warm: 0, cool: 0, tint: 0 },
  { id: "bw-soft-matte", name: "B&W Soft Matte", brightness: 106, contrast: 92, saturation: 0, sepia: 0, hueRotate: 0, warm: 0, cool: 0, tint: 0 },
  { id: "bw-silver-rich", name: "B&W Silver Rich", brightness: 101, contrast: 128, saturation: 0, sepia: 0, hueRotate: 0, warm: 0, cool: 0, tint: 0 },
  { id: "bw-cool-graphite", name: "B&W Cool Graphite", brightness: 102, contrast: 118, saturation: 0, sepia: 0, hueRotate: 0, warm: 0, cool: 8, tint: -2 },
  { id: "bw-warm-fiber", name: "B&W Warm Fiber", brightness: 103, contrast: 116, saturation: 0, sepia: 7, hueRotate: 0, warm: 8, cool: 0, tint: 1 },
  { id: "bw-noir", name: "B&W Noir", brightness: 98, contrast: 145, saturation: 0, sepia: 0, hueRotate: 0, warm: 0, cool: 0, tint: 0 },
  { id: "bw-faded-print", name: "B&W Faded Print", brightness: 108, contrast: 88, saturation: 0, sepia: 4, hueRotate: 0, warm: 4, cool: 0, tint: 0 },
  { id: "bw-documentary", name: "B&W Documentary", brightness: 100, contrast: 122, saturation: 0, sepia: 0, hueRotate: 0, warm: 1, cool: 0, tint: 0 },
  { id: "bw-platinum", name: "B&W Platinum", brightness: 104, contrast: 102, saturation: 0, sepia: 5, hueRotate: 0, warm: 5, cool: 0, tint: 0 },
];

const state = {
  photos: [],
  selectedIndex: -1,
  selectedPhotoIds: [],
  lastSelectedPhotoId: null,
  zoom: 1,
  filmstripHeight: 136,
  activeTool: "select",
  selectedTextIds: [],
  selectedShapeIds: [],
  editingTextId: null,
  nextTextId: 1,
  nextShapeId: 1,
  nextPhotoId: 1,
  editModalPreviewPhotoId: null,
  isSubmittingEdit: false,
  isSubmittingGenerate: false,
  isSubmittingPrint: false,
  compareMode: false,
  photoHistory: {},
  draggingLayerKey: null,
  snapGuideNodes: null,
  printOfferings: [],
  isSpacePressed: false,
  isPanningWorkspace: false,
  hasShownExportFallbackHint: false,
  credits: DEFAULT_CREDITS,
  accessCheckTimer: null,
  trialLocked: false,
  subscriptionActive: false,
  trialActive: false,
  accessBypassed: false,
  cropRect: null,
  cropAspect: "original",
  cropDrag: null,
  currentProjectId: null,
  currentProjectName: "",
  projectsLoaded: false,
  projectAutosaveTimer: null,
  autosaveInFlight: false,
  lastAutosaveDigest: "",
};

if (cropAspectSelect?.value) {
  state.cropAspect = String(cropAspectSelect.value || "original");
}

const hydrateIcons = () => {
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const lerp = (a, b, t) => a + (b - a) * t;
const toCssFamilyValue = (familyName) => `'${String(familyName).replace(/'/g, "\\'")}'`;

const formatBytes = (bytes) => {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, index);
  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
};

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to read image file."));
    reader.readAsDataURL(file);
  });

const dataUrlToBlob = (dataUrl) => {
  const match = /^data:(.*?);base64,(.*)$/.exec(dataUrl);
  if (!match) {
    throw new Error("Invalid edited image payload.");
  }
  const mimeType = match[1] || "image/png";
  const binary = atob(match[2]);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mimeType });
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const dataUrlToFile = (dataUrl, fileName = `photo-${Date.now()}.png`) => {
  const blob = dataUrlToBlob(dataUrl);
  return new File([blob], fileName, { type: blob.type, lastModified: Date.now() });
};

const blobToDataUrl = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Failed to serialize image blob."));
    reader.readAsDataURL(blob);
  });

const disposePhotoResources = (photo) => {
  if (photo?.url) URL.revokeObjectURL(photo.url);
};

const disposeAllPhotos = () => {
  state.photos.forEach((photo) => disposePhotoResources(photo));
};

const getFileExtension = (name = "") => {
  const normalized = String(name || "").trim().toLowerCase();
  const idx = normalized.lastIndexOf(".");
  return idx >= 0 ? normalized.slice(idx + 1) : "";
};

const isAllowedUploadFile = (file) => {
  if (!file) return false;
  const mimeType = String(file.type || "").toLowerCase();
  if (mimeType.startsWith("image/")) return true;
  return RAW_FILE_EXTENSIONS.has(getFileExtension(file.name));
};

const isRawUploadFile = (file) => RAW_FILE_EXTENSIONS.has(getFileExtension(file?.name || ""));

const probeDecodableImageFile = (file) =>
  new Promise((resolve) => {
    if (!file) {
      resolve(false);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(true);
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(false);
    };
    img.src = objectUrl;
  });

const convertRawToPreviewFile = async (file) => {
  if (!file || !isRawUploadFile(file)) return { file: null, error: "Not a RAW file." };
  try {
    const startResponse = await authFetch("/api/raw-preview/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileName: file.name || "raw-image" }),
    });
    const startPayload = await startResponse.json().catch(() => ({}));
    if (!startResponse.ok) {
      const startError = String(startPayload?.error || "").trim();
      return { file: null, error: startError || `RAW conversion start failed (${startResponse.status}).` };
    }

    const uploadUrl = String(startPayload?.upload?.url || "").trim();
    const uploadParameters = startPayload?.upload?.parameters;
    const jobId = String(startPayload?.jobId || "").trim();
    if (!uploadUrl || !uploadParameters || !jobId) {
      return { file: null, error: "RAW conversion start returned invalid upload details." };
    }

    const uploadFormData = new FormData();
    Object.entries(uploadParameters).forEach(([key, value]) => {
      uploadFormData.append(key, String(value));
    });
    uploadFormData.append("file", file, file.name || "raw-image");

    const uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      body: uploadFormData,
      redirect: "follow",
    }).catch(() => null);

    if (!uploadResponse || !uploadResponse.ok) {
      return { file: null, error: `RAW upload to conversion service failed (${uploadResponse?.status || "network"}).` };
    }

    const completeResponse = await authFetch("/api/raw-preview/complete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileName: file.name || "raw-image",
        jobId,
      }),
    });
    const payload = await completeResponse.json().catch(() => ({}));
    if (!completeResponse.ok) {
      const completeError = String(payload?.error || "").trim();
      return { file: null, error: completeError || `RAW preview conversion failed (${completeResponse.status}).` };
    }

    const dataUrl = String(payload?.dataUrl || "");
    if (!dataUrl.startsWith("data:image/")) return { file: null, error: "RAW preview was missing image data." };

    const fileName = String(payload?.fileName || "").trim() || `${getFileExtension(file.name) || "raw"}-preview.jpg`;
    return { file: dataUrlToFile(dataUrl, fileName), error: "" };
  } catch {
    return { file: null, error: "Unable to reach RAW conversion service." };
  }
};

const setFilmstripSize = (height) => {
  const clampedHeight = clamp(height, 92, 320);
  state.filmstripHeight = clampedHeight;
  const thumbSize = clamp(Math.round(clampedHeight - 48), 62, 220);
  document.documentElement.style.setProperty("--filmstrip-height", `${clampedHeight}px`);
  document.documentElement.style.setProperty("--thumb-size", `${thumbSize}px`);
};

const setControlsEnabled = (enabled) => {
  selectionPanels.forEach((panel) => {
    panel.classList.toggle("disabled", !enabled);
  });
};

const getSelectedPhoto = () => state.photos[state.selectedIndex] || null;
const getPhotoById = (id) => state.photos.find((photo) => photo.id === id) || null;
const getLayerKey = (kind, id) => `${kind}:${id}`;
const parseLayerKey = (key) => {
  if (typeof key !== "string") return null;
  if (key.startsWith(LAYER_TEXT_PREFIX)) {
    return { kind: "text", id: Number(key.slice(LAYER_TEXT_PREFIX.length)) };
  }
  if (key.startsWith(LAYER_SHAPE_PREFIX)) {
    return { kind: "shape", id: Number(key.slice(LAYER_SHAPE_PREFIX.length)) };
  }
  return null;
};
const getOverlayByLayerKey = (photo, key) => {
  if (!photo) return null;
  const parsed = parseLayerKey(key);
  if (!parsed || !Number.isFinite(parsed.id)) return null;
  if (parsed.kind === "text") return photo.textOverlays.find((overlay) => overlay.id === parsed.id) || null;
  return photo.shapeOverlays.find((overlay) => overlay.id === parsed.id) || null;
};
const ensureLayerOrder = (photo) => {
  if (!photo) return [];
  if (!Array.isArray(photo.layerOrder)) photo.layerOrder = [];

  const validKeys = new Set([
    ...photo.textOverlays.map((overlay) => getLayerKey("text", overlay.id)),
    ...photo.shapeOverlays.map((overlay) => getLayerKey("shape", overlay.id)),
  ]);

  const nextOrder = photo.layerOrder.filter((key) => validKeys.has(key));
  validKeys.forEach((key) => {
    if (!nextOrder.includes(key)) nextOrder.push(key);
  });
  photo.layerOrder = nextOrder;
  return nextOrder;
};
const applyLayerZIndices = (photo) => {
  if (!photo) return;
  const order = ensureLayerOrder(photo);
  order.forEach((key, index) => {
    const overlay = getOverlayByLayerKey(photo, key);
    if (overlay) overlay.layerIndex = index + 1;
  });
};
const removeLayerKeys = (photo, keys) => {
  if (!photo || !Array.isArray(photo.layerOrder)) return;
  const keySet = new Set(keys);
  photo.layerOrder = photo.layerOrder.filter((key) => !keySet.has(key));
};
const getPrimarySelectedLayerKey = () => {
  if (state.selectedTextIds.length > 0) return getLayerKey("text", state.selectedTextIds[0]);
  if (state.selectedShapeIds.length > 0) return getLayerKey("shape", state.selectedShapeIds[0]);
  return null;
};
const moveLayer = (key, direction) => {
  const photo = getSelectedPhoto();
  if (!photo) return;
  capturePhotoHistory(photo);
  const order = ensureLayerOrder(photo);
  const index = order.indexOf(key);
  if (index < 0) return;
  const delta = direction === "up" ? 1 : -1;
  const nextIndex = index + delta;
  if (nextIndex < 0 || nextIndex >= order.length) return;
  [order[index], order[nextIndex]] = [order[nextIndex], order[index]];
  applyLayerZIndices(photo);
  renderTextOverlays();
};
const reorderLayer = (sourceKey, targetKey) => {
  const photo = getSelectedPhoto();
  if (!photo || !sourceKey || !targetKey || sourceKey === targetKey) return;

  const order = ensureLayerOrder(photo);
  const sourceIndex = order.indexOf(sourceKey);
  const targetIndex = order.indexOf(targetKey);
  if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) return;

  capturePhotoHistory(photo);
  const [moved] = order.splice(sourceIndex, 1);
  order.splice(targetIndex, 0, moved);
  applyLayerZIndices(photo);
  renderTextOverlays();
};

const clonePhotoSnapshot = (snapshot) => JSON.parse(JSON.stringify(snapshot));
const getPhotoSnapshot = (photo) => ({
  adjustments: cloneAdjustments(photo.adjustments),
  rotation: photo.rotation,
  filmLookId: photo.filmLookId,
  filmLookStrength: photo.filmLookStrength,
  textOverlays: clonePhotoSnapshot(photo.textOverlays || []),
  shapeOverlays: clonePhotoSnapshot(photo.shapeOverlays || []),
  layerOrder: [...(photo.layerOrder || [])],
});
const isSameSnapshot = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const getPhotoHistoryEntry = (photo) => {
  if (!state.photoHistory[photo.id]) {
    state.photoHistory[photo.id] = { undo: [], redo: [] };
  }
  return state.photoHistory[photo.id];
};
const syncHistoryControls = () => {
  saveProjectBtn.disabled = state.photos.length === 0;
  saveProjectBtn.classList.toggle("is-disabled", state.photos.length === 0);
  const photo = getSelectedPhoto();
  exportTopBtn.disabled = !photo;
  exportTopBtn.classList.toggle("is-disabled", !photo);
  if (!photo) {
    undoBtn.disabled = true;
    redoBtn.disabled = true;
    undoBtn.classList.add("is-disabled");
    redoBtn.classList.add("is-disabled");
    return;
  }
  const entry = getPhotoHistoryEntry(photo);
  const canUndo = entry.undo.length > 0;
  const canRedo = entry.redo.length > 0;
  undoBtn.disabled = !canUndo;
  redoBtn.disabled = !canRedo;
  undoBtn.classList.toggle("is-disabled", !canUndo);
  redoBtn.classList.toggle("is-disabled", !canRedo);
};

const syncWorkspacePanCursor = () => {
  previewWrap.classList.toggle("pan-ready", state.isSpacePressed && Boolean(getSelectedPhoto()));
  previewWrap.classList.toggle("is-panning", state.isPanningWorkspace);
};

const loadCredits = () => {
  try {
    const rawProfile = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    if (rawProfile) {
      const profile = JSON.parse(rawProfile);
      const profileCredits = Number(profile?.creditsBalance);
      if (Number.isFinite(profileCredits) && profileCredits >= 0) {
        state.credits = Math.floor(profileCredits);
        return;
      }
    }

    const raw = window.localStorage.getItem(CREDITS_STORAGE_KEY);
    if (raw == null || raw === "") {
      state.credits = DEFAULT_CREDITS;
      return;
    }
    const parsed = Number(raw);
    if (Number.isFinite(parsed) && parsed >= 0) {
      state.credits = Math.floor(parsed);
      return;
    }
    state.credits = DEFAULT_CREDITS;
  } catch {
    state.credits = DEFAULT_CREDITS;
  }
};

const persistCredits = () => {
  try {
    window.localStorage.setItem(CREDITS_STORAGE_KEY, String(state.credits));
  } catch {
    // Ignore storage failures in restricted environments.
  }
};

const getAuthToken = () => {
  try {
    return String(window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || "").trim();
  } catch {
    return "";
  }
};

const getRefreshToken = () => {
  try {
    return String(window.localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY) || "").trim();
  } catch {
    return "";
  }
};

const getAuthExpiresAtMs = () => {
  try {
    const raw = Number(window.localStorage.getItem(AUTH_EXPIRES_AT_STORAGE_KEY) || "0");
    return Number.isFinite(raw) ? raw : 0;
  } catch {
    return 0;
  }
};

const getAppSessionStartedAtMs = () => {
  try {
    const raw = Number(window.localStorage.getItem(APP_SESSION_STARTED_AT_STORAGE_KEY) || "0");
    return Number.isFinite(raw) ? raw : 0;
  } catch {
    return 0;
  }
};

const markAppSessionStarted = (timestampMs = Date.now()) => {
  try {
    window.localStorage.setItem(APP_SESSION_STARTED_AT_STORAGE_KEY, String(Math.max(0, Number(timestampMs) || Date.now())));
  } catch {
    // Ignore storage issues.
  }
};

const ensureAppSessionStartedAt = () => {
  const hasAuth = Boolean(getAuthToken() || getRefreshToken());
  if (!hasAuth) return;
  const startedAtMs = getAppSessionStartedAtMs();
  if (!startedAtMs) {
    markAppSessionStarted();
  }
};

const isAppSessionExpired = () => {
  const startedAtMs = getAppSessionStartedAtMs();
  if (!startedAtMs) return false;
  return Date.now() - startedAtMs >= APP_SESSION_TTL_MS;
};

let authRefreshPromise = null;
let hasHandledExpiredAuthSession = false;

const storeAuthSession = ({ accessToken = "", refreshToken = "", expiresIn = 0 } = {}) => {
  if (!accessToken) return;
  try {
    window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, accessToken);
    if (refreshToken) {
      window.localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
    }
    const expiresMs = Number(expiresIn);
    if (Number.isFinite(expiresMs) && expiresMs > 0) {
      window.localStorage.setItem(AUTH_EXPIRES_AT_STORAGE_KEY, String(Date.now() + expiresMs * 1000));
    }
    if (!getAppSessionStartedAtMs()) {
      markAppSessionStarted();
    }
  } catch {
    // Ignore storage issues.
  }
  hasHandledExpiredAuthSession = false;
};

const clearAuthSession = () => {
  try {
    window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
    window.localStorage.removeItem(AUTH_EXPIRES_AT_STORAGE_KEY);
    window.localStorage.removeItem(APP_SESSION_STARTED_AT_STORAGE_KEY);
    window.localStorage.removeItem(PROFILE_STORAGE_KEY);
  } catch {
    // Ignore storage issues.
  }
};

const refreshAuthSession = async (force = false) => {
  if (isAppSessionExpired()) return "";
  const refreshToken = getRefreshToken();
  if (!refreshToken) return "";
  if (authRefreshPromise) return authRefreshPromise;

  const token = getAuthToken();
  const expiresAtMs = getAuthExpiresAtMs();
  const shouldRefresh = force || !token || !expiresAtMs || Date.now() > expiresAtMs - 60 * 1000;
  if (!shouldRefresh) return token;

  authRefreshPromise = fetch("/api/auth/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  })
    .then(async (response) => {
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) return "";
      const nextAccessToken = String(payload?.accessToken || "").trim();
      const nextRefreshToken = String(payload?.refreshToken || "").trim();
      const expiresIn = Number(payload?.expiresIn || 0);
      if (!nextAccessToken) return "";
      storeAuthSession({ accessToken: nextAccessToken, refreshToken: nextRefreshToken, expiresIn });
      return nextAccessToken;
    })
    .catch(() => "")
    .finally(() => {
      authRefreshPromise = null;
    });

  return authRefreshPromise;
};

const getJsonRequestHeaders = () => {
  return {
    "Content-Type": "application/json",
  };
};

const createClientJsonResponse = (status, payload) =>
  new Response(JSON.stringify(payload || {}), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const persistSessionRecoverySnapshot = async () => {
  if (!Array.isArray(state.photos) || state.photos.length === 0) return;
  try {
    const session = await getSerializedProjectPayload();
    const payload = {
      savedAt: new Date().toISOString(),
      projectId: String(state.currentProjectId || ""),
      projectName: String(state.currentProjectName || ""),
      session,
    };
    window.localStorage.setItem(SESSION_RECOVERY_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore snapshot backup failures.
  }
};

const handleExpiredAuthSession = (message = "Your session expired. Please sign in again.") => {
  if (hasHandledExpiredAuthSession) return;
  hasHandledExpiredAuthSession = true;
  void (async () => {
    await persistSessionRecoverySnapshot();
    clearAuthSession();
    window.alert(message);
    window.location.href = "/signup";
  })();
};

const authFetch = async (url, options = {}) => {
  ensureAppSessionStartedAt();
  if (isAppSessionExpired()) {
    handleExpiredAuthSession(APP_SESSION_EXPIRED_MESSAGE);
    return createClientJsonResponse(401, { error: APP_SESSION_EXPIRED_MESSAGE });
  }
  let token = await refreshAuthSession(false);
  if (!token) token = getAuthToken();

  const buildOptions = (authToken) => {
    const headers = {
      ...(options.headers || {}),
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    };
    return { ...options, headers };
  };

  let response = await fetch(url, buildOptions(token));
  if (response.status !== 401) return response;

  const refreshedToken = await refreshAuthSession(true);
  if (!refreshedToken) return response;
  response = await fetch(url, buildOptions(refreshedToken));
  return response;
};

const setTrialLockVisible = (visible, message = "") => {
  state.trialLocked = Boolean(visible);
  if (!trialLockModal) return;
  trialLockModal.classList.toggle("hidden-panel", !visible);
  if (visible && trialLockMessage && message) {
    trialLockMessage.textContent = message;
  }
};

const syncCreditsFromServer = (creditsBalance) => {
  const next = Number(creditsBalance);
  if (!Number.isFinite(next) || next < 0) return;
  state.credits = Math.floor(next);
  persistCredits();

  try {
    const rawProfile = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    if (rawProfile) {
      const profile = JSON.parse(rawProfile);
      if (profile && typeof profile === "object") {
        profile.creditsBalance = state.credits;
        window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
      }
    }
  } catch {
    // Ignore profile cache sync issues.
  }

  syncCreditsUI();
};

const beginStripeCheckout = async (kind) => {
  if (!getAuthToken() && !getRefreshToken()) {
    window.location.href = "/signup";
    return;
  }
  const endpoint = kind === "subscription" ? "/api/stripe/checkout/subscription" : "/api/stripe/checkout/topup";
  const response = await authFetch(endpoint, {
    method: "POST",
    headers: getJsonRequestHeaders(),
    body: "{}",
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401) {
      handleExpiredAuthSession(payload?.error || "Invalid or expired auth session.");
      return;
    }
    if (response.status === 403) {
      window.alert(payload?.error || "Active subscription required before buying credits.");
      window.location.href = "/pricing";
      return;
    }
    throw new Error(payload?.error || "Unable to start checkout.");
  }
  const checkoutUrl = String(payload?.checkoutUrl || "");
  if (!checkoutUrl) {
    throw new Error("Missing checkout URL.");
  }
  window.location.href = checkoutUrl;
};

const beginStripeBillingPortal = async () => {
  if (!getAuthToken() && !getRefreshToken()) {
    window.location.href = "/signup";
    return;
  }
  const response = await authFetch("/api/stripe/billing-portal", {
    method: "POST",
    headers: getJsonRequestHeaders(),
    body: "{}",
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401) {
      handleExpiredAuthSession(payload?.error || "Invalid or expired auth session.");
      return;
    }
    throw new Error(payload?.error || "Unable to open billing portal.");
  }
  const portalUrl = String(payload?.portalUrl || "");
  if (!portalUrl) {
    throw new Error("Missing billing portal URL.");
  }
  window.location.href = portalUrl;
};

const fetchAccessStatus = async () => {
  if (!getAuthToken() && !getRefreshToken()) {
    state.subscriptionActive = false;
    state.trialActive = false;
    state.accessBypassed = false;
    setTrialLockVisible(true, "Please sign in to continue using DarkroomX.");
    return null;
  }

  const response = await authFetch("/api/access/status", {
    method: "GET",
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401) {
      handleExpiredAuthSession(payload?.error || "Invalid or expired auth session.");
      return null;
    }
    throw new Error(payload?.error || "Unable to verify account access.");
  }
  state.subscriptionActive = Boolean(payload?.subscriptionActive);
  state.trialActive = Boolean(payload?.trialActive);
  state.accessBypassed = Boolean(payload?.bypassed);
  return payload;
};

const applyAccessStatus = (status) => {
  if (!status || typeof status !== "object") {
    state.subscriptionActive = false;
    state.trialActive = false;
    state.accessBypassed = false;
    return;
  }
  state.subscriptionActive = Boolean(status.subscriptionActive);
  state.trialActive = Boolean(status.trialActive);
  state.accessBypassed = Boolean(status.bypassed);
  const accessAllowed = Boolean(status.accessAllowed);
  if (accessAllowed) {
    setTrialLockVisible(false);
    return;
  }
  setTrialLockVisible(true, "Your 24-hour free trial has ended. Subscribe to keep editing and generating images.");
};

const ensureRawUploadsAllowed = async () => {
  try {
    const status = await fetchAccessStatus();
    return Boolean(status?.subscriptionActive || status?.bypassed);
  } catch {
    return false;
  }
};

const startAccessStatusPolling = async () => {
  try {
    const status = await fetchAccessStatus();
    applyAccessStatus(status);
  } catch (error) {
    console.error("Access status check failed:", error?.message || error);
  }

  if (state.accessCheckTimer) {
    clearInterval(state.accessCheckTimer);
  }
  state.accessCheckTimer = window.setInterval(async () => {
    try {
      const status = await fetchAccessStatus();
      applyAccessStatus(status);
    } catch (error) {
      console.error("Access status poll failed:", error?.message || error);
    }
  }, 60 * 1000);
};

const syncCreditsUI = () => {
  const depleted = state.credits <= 0;
  creditsBtnLabel.textContent = depleted ? "Buy Credits" : `Credits: ${state.credits}`;
  creditsBtn.classList.toggle("is-depleted", depleted);
  creditsBtn.title = depleted ? "Buy Credits" : `Credits left: ${state.credits}`;
  creditsBtn.ariaLabel = depleted ? "Buy Credits" : `Credits left: ${state.credits}`;
};

const creditsService = {
  getBalance() {
    return Math.max(0, Math.floor(state.credits || 0));
  },
  canAfford(cost) {
    const amount = Math.max(0, Math.floor(cost || 0));
    return this.getBalance() >= amount;
  },
  charge(cost, _reason = "", _meta = null) {
    const amount = Math.max(0, Math.floor(cost || 0));
    if (amount === 0) return true;
    if (!this.canAfford(amount)) return false;
    state.credits = this.getBalance() - amount;
    persistCredits();
    syncCreditsUI();
    return true;
  },
  add(amount) {
    const increment = Math.max(0, Math.floor(amount || 0));
    state.credits = this.getBalance() + increment;
    persistCredits();
    syncCreditsUI();
  },
};
const capturePhotoHistory = (photo = getSelectedPhoto()) => {
  if (!photo) return;
  const entry = getPhotoHistoryEntry(photo);
  const snapshot = getPhotoSnapshot(photo);
  const last = entry.undo[entry.undo.length - 1];
  if (!last || !isSameSnapshot(last, snapshot)) {
    entry.undo.push(snapshot);
    if (entry.undo.length > 120) entry.undo.shift();
  }
  entry.redo = [];
  syncHistoryControls();
};
const applyPhotoSnapshot = (photo, snapshot) => {
  if (!photo || !snapshot) return;
  photo.adjustments = cloneAdjustments(snapshot.adjustments || defaultAdjustments);
  photo.rotation = Number(snapshot.rotation ?? 0);
  photo.filmLookId = snapshot.filmLookId || "none";
  photo.filmLookStrength = Number(snapshot.filmLookStrength ?? 100);
  photo.textOverlays = clonePhotoSnapshot(snapshot.textOverlays || []);
  photo.shapeOverlays = clonePhotoSnapshot(snapshot.shapeOverlays || []);
  photo.layerOrder = [...(snapshot.layerOrder || [])];
  applyLayerZIndices(photo);
  setSelectedTextIds(state.selectedTextIds);
  setSelectedShapeIds(state.selectedShapeIds);
  if (!state.selectedTextIds.includes(state.editingTextId)) {
    state.editingTextId = null;
  }
};
const undoPhotoChange = () => {
  const photo = getSelectedPhoto();
  if (!photo) return;
  const entry = getPhotoHistoryEntry(photo);
  const previous = entry.undo.pop();
  if (!previous) {
    syncHistoryControls();
    return;
  }
  const current = getPhotoSnapshot(photo);
  entry.redo.push(current);
  applyPhotoSnapshot(photo, previous);
  applyAdjustmentsToPreview();
  syncHistoryControls();
};
const redoPhotoChange = () => {
  const photo = getSelectedPhoto();
  if (!photo) return;
  const entry = getPhotoHistoryEntry(photo);
  const next = entry.redo.pop();
  if (!next) {
    syncHistoryControls();
    return;
  }
  const current = getPhotoSnapshot(photo);
  entry.undo.push(current);
  applyPhotoSnapshot(photo, next);
  applyAdjustmentsToPreview();
  syncHistoryControls();
};

const ensureSnapGuideNodes = () => {
  if (state.snapGuideNodes) return state.snapGuideNodes;
  const vertical = document.createElement("div");
  vertical.className = "snap-guide snap-guide-v hidden-panel";
  const horizontal = document.createElement("div");
  horizontal.className = "snap-guide snap-guide-h hidden-panel";
  overlayLayer.appendChild(vertical);
  overlayLayer.appendChild(horizontal);
  state.snapGuideNodes = { vertical, horizontal };
  return state.snapGuideNodes;
};

const hideSnapGuides = () => {
  const guides = ensureSnapGuideNodes();
  guides.vertical.classList.add("hidden-panel");
  guides.horizontal.classList.add("hidden-panel");
};

const updateSnapGuides = (verticalPx, horizontalPx) => {
  const guides = ensureSnapGuideNodes();
  if (typeof verticalPx === "number") {
    guides.vertical.style.left = `${verticalPx}px`;
    guides.vertical.classList.remove("hidden-panel");
  } else {
    guides.vertical.classList.add("hidden-panel");
  }
  if (typeof horizontalPx === "number") {
    guides.horizontal.style.top = `${horizontalPx}px`;
    guides.horizontal.classList.remove("hidden-panel");
  } else {
    guides.horizontal.classList.add("hidden-panel");
  }
};

const applySnapping = (xPct, yPct, widthPx, heightPx, layerRect) => {
  const layerW = Math.max(layerRect.width, 1);
  const layerH = Math.max(layerRect.height, 1);
  let xPx = (xPct / 100) * layerW;
  let yPx = (yPct / 100) * layerH;
  let snapGuideX;
  let snapGuideY;

  const left = xPx - widthPx / 2;
  const right = xPx + widthPx / 2;
  const top = yPx - heightPx / 2;
  const bottom = yPx + heightPx / 2;

  if (Math.abs(xPx - layerW / 2) <= SNAP_THRESHOLD_PX) {
    xPx = layerW / 2;
    snapGuideX = layerW / 2;
  } else if (Math.abs(left) <= SNAP_THRESHOLD_PX) {
    xPx = widthPx / 2;
    snapGuideX = 0;
  } else if (Math.abs(layerW - right) <= SNAP_THRESHOLD_PX) {
    xPx = layerW - widthPx / 2;
    snapGuideX = layerW;
  }

  if (Math.abs(yPx - layerH / 2) <= SNAP_THRESHOLD_PX) {
    yPx = layerH / 2;
    snapGuideY = layerH / 2;
  } else if (Math.abs(top) <= SNAP_THRESHOLD_PX) {
    yPx = heightPx / 2;
    snapGuideY = 0;
  } else if (Math.abs(layerH - bottom) <= SNAP_THRESHOLD_PX) {
    yPx = layerH - heightPx / 2;
    snapGuideY = layerH;
  }

  return {
    xPct: clamp((xPx / layerW) * 100, 0, 100),
    yPct: clamp((yPx / layerH) * 100, 0, 100),
    snapGuideX,
    snapGuideY,
  };
};
const getSelectedPhotoIds = () => {
  if (state.selectedPhotoIds.length > 0) {
    const valid = state.selectedPhotoIds.filter((id) => Boolean(getPhotoById(id)));
    if (valid.length !== state.selectedPhotoIds.length) {
      state.selectedPhotoIds = valid;
    }
    if (valid.length > 0) return valid;
  }

  const selected = getSelectedPhoto();
  return selected ? [selected.id] : [];
};
const getBatchTargetPhotos = () => {
  const selectedIds = new Set(getSelectedPhotoIds());
  if (selectedIds.size <= 1) {
    const selected = getSelectedPhoto();
    return selected ? [selected] : [];
  }
  return state.photos.filter((photo) => selectedIds.has(photo.id)).slice(0, MAX_BATCH_EDIT_COUNT);
};
const syncFilmstripActionState = () => {
  if (!filmstripSelectAllBtn || !filmstripClearSelectionBtn) return;
  const total = state.photos.length;
  const selectedCount = getSelectedPhotoIds().length;
  filmstripSelectAllBtn.disabled = total === 0 || selectedCount >= total;
  filmstripClearSelectionBtn.disabled = total === 0 || selectedCount <= 1;
};

const getCompareTargetPhoto = (photo) => {
  if (!photo?.isEdited) return null;
  const rootId = photo.rootPhotoId ?? photo.id;
  return getPhotoById(rootId);
};

const getTextById = (id) => {
  const photo = getSelectedPhoto();
  if (!photo) return null;
  return photo.textOverlays.find((overlay) => overlay.id === id) || null;
};

const getShapeById = (id) => {
  const photo = getSelectedPhoto();
  if (!photo) return null;
  return photo.shapeOverlays.find((overlay) => overlay.id === id) || null;
};

const getSelectedTextOverlays = () => state.selectedTextIds.map((id) => getTextById(id)).filter(Boolean);
const getSelectedShapeOverlays = () => state.selectedShapeIds.map((id) => getShapeById(id)).filter(Boolean);

const setSelectedTextIds = (ids) => {
  const photo = getSelectedPhoto();
  if (!photo) {
    state.selectedTextIds = [];
    state.editingTextId = null;
    return;
  }

  const validIds = new Set(photo.textOverlays.map((overlay) => overlay.id));
  const deduped = [];
  ids.forEach((id) => {
    if (validIds.has(id) && !deduped.includes(id)) {
      deduped.push(id);
    }
  });

  state.selectedTextIds = deduped;
  if (!state.selectedTextIds.includes(state.editingTextId)) {
    state.editingTextId = null;
  }
};

const setSelectedShapeIds = (ids) => {
  const photo = getSelectedPhoto();
  if (!photo) {
    state.selectedShapeIds = [];
    return;
  }

  const validIds = new Set(photo.shapeOverlays.map((overlay) => overlay.id));
  const deduped = [];
  ids.forEach((id) => {
    if (validIds.has(id) && !deduped.includes(id)) {
      deduped.push(id);
    }
  });
  state.selectedShapeIds = deduped;
};

const updateZoomLabel = () => {
  zoomLevel.textContent = `${Math.round(state.zoom * 100)}%`;
};

const applyPreviewTransform = () => {
  const photo = getSelectedPhoto();
  if (!photo) return;
  mainPreview.style.transform = `rotate(${photo.rotation}deg) scale(${state.zoom})`;
};

const getSelectedPhotoAspectRatio = () => {
  const photo = getSelectedPhoto();
  const width = Number(photo?.imgEl?.naturalWidth || photo?.width || 0);
  const height = Number(photo?.imgEl?.naturalHeight || photo?.height || 0);
  if (!width || !height) return null;
  const quarterTurns = ((Number(photo?.rotation || 0) / 90) % 4 + 4) % 4;
  const rotated = quarterTurns % 2 === 1;
  return rotated ? height / width : width / height;
};

const getCropAspectRatio = () => {
  if (state.cropAspect === "free") return null;
  if (state.cropAspect === "original") {
    return getSelectedPhotoAspectRatio();
  }
  if (state.cropAspect === "custom") {
    const width = Number(cropCustomWidth?.value || 0);
    const height = Number(cropCustomHeight?.value || 0);
    if (width > 0 && height > 0) return width / height;
    return null;
  }
  return CROP_ASPECT_MAP[state.cropAspect] || null;
};

const getImageBoundsInPreview = () => {
  if (!previewWrap || !mainPreview) return null;
  const wrapRect = previewWrap.getBoundingClientRect();
  const imageRect = mainPreview.getBoundingClientRect();
  if (!imageRect.width || !imageRect.height) return null;
  return {
    x: imageRect.left - wrapRect.left + previewWrap.scrollLeft,
    y: imageRect.top - wrapRect.top + previewWrap.scrollTop,
    width: imageRect.width,
    height: imageRect.height,
  };
};

const clampCropRectToBounds = (rect, bounds) => {
  const width = clamp(rect.width, MIN_CROP_SIZE_PX, bounds.width);
  const height = clamp(rect.height, MIN_CROP_SIZE_PX, bounds.height);
  const x = clamp(rect.x, bounds.x, bounds.x + bounds.width - width);
  const y = clamp(rect.y, bounds.y, bounds.y + bounds.height - height);
  return { x, y, width, height };
};

const fitCropRectToAspect = (rect, bounds, aspect) => {
  if (!aspect || !Number.isFinite(aspect) || aspect <= 0) {
    return clampCropRectToBounds(rect, bounds);
  }

  let width = rect.width;
  let height = rect.height;
  if (width / height > aspect) {
    width = height * aspect;
  } else {
    height = width / aspect;
  }
  width = clamp(width, MIN_CROP_SIZE_PX, bounds.width);
  height = clamp(height, MIN_CROP_SIZE_PX, bounds.height);
  if (width / height > aspect) width = height * aspect;
  else height = width / aspect;

  const centerX = rect.x + rect.width / 2;
  const centerY = rect.y + rect.height / 2;
  return clampCropRectToBounds(
    {
      x: centerX - width / 2,
      y: centerY - height / 2,
      width,
      height,
    },
    bounds,
  );
};

const renderCropOverlay = () => {
  if (!cropOverlay || !cropBox) return;
  const active = state.activeTool === "crop" && Boolean(getSelectedPhoto()) && Boolean(state.cropRect);
  cropOverlay.classList.toggle("hidden-panel", !active);
  cropOverlay.setAttribute("aria-hidden", active ? "false" : "true");
  if (cropControlsTopbar) {
    cropControlsTopbar.classList.toggle("hidden-panel", !active);
    cropControlsTopbar.setAttribute("aria-hidden", active ? "false" : "true");
  }
  if (cropCustomRatioInputs) {
    const showCustom = active && state.cropAspect === "custom";
    cropCustomRatioInputs.classList.toggle("hidden-panel", !showCustom);
    cropCustomRatioInputs.setAttribute("aria-hidden", showCustom ? "false" : "true");
  }
  if (!active) return;

  const bounds = getImageBoundsInPreview();
  if (!bounds) return;
  state.cropRect = clampCropRectToBounds(state.cropRect, bounds);

  cropBox.style.left = `${state.cropRect.x}px`;
  cropBox.style.top = `${state.cropRect.y}px`;
  cropBox.style.width = `${state.cropRect.width}px`;
  cropBox.style.height = `${state.cropRect.height}px`;
};

const initializeCropRect = () => {
  const bounds = getImageBoundsInPreview();
  if (!bounds) {
    state.cropRect = null;
    return;
  }
  const aspect = getCropAspectRatio();
  let width = bounds.width * 0.8;
  let height = bounds.height * 0.8;
  if (aspect) {
    if (width / height > aspect) width = height * aspect;
    else height = width / aspect;
  }
  state.cropRect = {
    x: bounds.x + (bounds.width - width) / 2,
    y: bounds.y + (bounds.height - height) / 2,
    width,
    height,
  };
};

const clearCropState = () => {
  state.cropDrag = null;
  state.cropRect = null;
  if (cropOverlay) {
    cropOverlay.classList.add("hidden-panel");
    cropOverlay.setAttribute("aria-hidden", "true");
  }
  if (cropControlsTopbar) {
    cropControlsTopbar.classList.add("hidden-panel");
    cropControlsTopbar.setAttribute("aria-hidden", "true");
  }
  if (cropCustomRatioInputs) {
    cropCustomRatioInputs.classList.add("hidden-panel");
    cropCustomRatioInputs.setAttribute("aria-hidden", "true");
  }
};

const updateCropRectFromPointer = (event) => {
  if (!state.cropDrag) return;
  const bounds = getImageBoundsInPreview();
  if (!bounds) return;
  const { startRect, startX, startY, mode } = state.cropDrag;
  const dx = event.clientX - startX;
  const dy = event.clientY - startY;
  const aspect = getCropAspectRatio();

  if (mode === "move") {
    state.cropRect = clampCropRectToBounds(
      {
        x: startRect.x + dx,
        y: startRect.y + dy,
        width: startRect.width,
        height: startRect.height,
      },
      bounds,
    );
    renderCropOverlay();
    return;
  }

  const handle = mode;
  if (aspect) {
    const anchorX = handle.includes("w") ? startRect.x + startRect.width : startRect.x;
    const anchorY = handle.includes("n") ? startRect.y + startRect.height : startRect.y;
    const pointX = clamp(startX + dx, bounds.x, bounds.x + bounds.width);
    const pointY = clamp(startY + dy, bounds.y, bounds.y + bounds.height);
    const rawWidth = Math.max(MIN_CROP_SIZE_PX, Math.abs(pointX - anchorX));
    const rawHeight = Math.max(MIN_CROP_SIZE_PX, Math.abs(pointY - anchorY));
    let width = rawWidth;
    let height = rawHeight;
    if (width / height > aspect) {
      height = width / aspect;
    } else {
      width = height * aspect;
    }
    width = Math.min(width, bounds.width);
    height = Math.min(height, bounds.height);

    const left = handle.includes("w") ? anchorX - width : anchorX;
    const top = handle.includes("n") ? anchorY - height : anchorY;
    state.cropRect = clampCropRectToBounds({ x: left, y: top, width, height }, bounds);
    renderCropOverlay();
    return;
  }

  let nextRect = { ...startRect };
  if (handle.includes("w")) {
    const nextLeft = clamp(startRect.x + dx, bounds.x, startRect.x + startRect.width - MIN_CROP_SIZE_PX);
    nextRect.width = startRect.x + startRect.width - nextLeft;
    nextRect.x = nextLeft;
  }
  if (handle.includes("e")) {
    const nextRight = clamp(
      startRect.x + startRect.width + dx,
      startRect.x + MIN_CROP_SIZE_PX,
      bounds.x + bounds.width,
    );
    nextRect.width = nextRight - startRect.x;
  }
  if (handle.includes("n")) {
    const nextTop = clamp(startRect.y + dy, bounds.y, startRect.y + startRect.height - MIN_CROP_SIZE_PX);
    nextRect.height = startRect.y + startRect.height - nextTop;
    nextRect.y = nextTop;
  }
  if (handle.includes("s")) {
    const nextBottom = clamp(
      startRect.y + startRect.height + dy,
      startRect.y + MIN_CROP_SIZE_PX,
      bounds.y + bounds.height,
    );
    nextRect.height = nextBottom - startRect.y;
  }

  state.cropRect = clampCropRectToBounds(nextRect, bounds);
  renderCropOverlay();
};

const applyCropToSelectedPhoto = async () => {
  const photo = getSelectedPhoto();
  if (!photo || !photo.imgEl || !state.cropRect) return;

  const bounds = getImageBoundsInPreview();
  if (!bounds || bounds.width <= 0 || bounds.height <= 0) return;
  const crop = clampCropRectToBounds(state.cropRect, bounds);

  const source = photo.imgEl;
  const radians = (photo.rotation * Math.PI) / 180;
  const quarterTurns = ((photo.rotation / 90) % 4 + 4) % 4;
  const swapDimensions = quarterTurns % 2 === 1;

  const workingCanvas = document.createElement("canvas");
  workingCanvas.width = swapDimensions ? source.naturalHeight : source.naturalWidth;
  workingCanvas.height = swapDimensions ? source.naturalWidth : source.naturalHeight;
  const workingCtx = workingCanvas.getContext("2d");
  if (!workingCtx) return;
  workingCtx.translate(workingCanvas.width / 2, workingCanvas.height / 2);
  workingCtx.rotate(radians);
  workingCtx.drawImage(source, -source.naturalWidth / 2, -source.naturalHeight / 2);

  const sx = Math.round(((crop.x - bounds.x) / bounds.width) * workingCanvas.width);
  const sy = Math.round(((crop.y - bounds.y) / bounds.height) * workingCanvas.height);
  const sw = Math.round((crop.width / bounds.width) * workingCanvas.width);
  const sh = Math.round((crop.height / bounds.height) * workingCanvas.height);
  if (sw < 2 || sh < 2) return;

  const canvas = document.createElement("canvas");
  canvas.width = sw;
  canvas.height = sh;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.drawImage(workingCanvas, sx, sy, sw, sh, 0, 0, sw, sh);

  const sourceType = String(photo.file?.type || "").toLowerCase();
  const outputType = sourceType === "image/png" ? "image/png" : "image/jpeg";
  const blob = await canvasToBlob(canvas, outputType, 0.98);
  if (!blob) return;

  const dotIndex = photo.file.name.lastIndexOf(".");
  const baseName = dotIndex > 0 ? photo.file.name.slice(0, dotIndex) : photo.file.name;
  const extension = outputType === "image/png" ? "png" : "jpg";
  const croppedFile = new File([blob], `${baseName}-crop.${extension}`, {
    type: outputType,
    lastModified: Date.now(),
  });

  const newPhoto = createPhotoRecord(croppedFile, {
    adjustments: cloneAdjustments(photo.adjustments),
    rotation: 0,
    filmLookId: photo.filmLookId,
    filmLookStrength: photo.filmLookStrength,
    isEdited: true,
    sourcePhotoId: photo.id,
    rootPhotoId: photo.rootPhotoId ?? photo.id,
    editVersion: Number(photo.editVersion ?? 0) + 1,
  });

  loadImageDimensions(newPhoto);
  const selectedIndex = state.selectedIndex >= 0 ? state.selectedIndex : state.photos.indexOf(photo);
  const insertIndex = Math.max(0, selectedIndex + 1);
  state.photos.splice(insertIndex, 0, newPhoto);
  renderFilmstrip();
  selectPhoto(insertIndex);
  setActiveTool("select");
};

const renderMetadata = (photo) => {
  if (!photo) {
    metaBlock.innerHTML = '<p class="meta-empty">Select a photo to inspect details.</p>';
    return;
  }

  const dimensions = photo.width && photo.height ? `${photo.width} x ${photo.height}` : "Loading...";
  metaBlock.innerHTML = `
    <p><span class="meta-key">Name:</span> ${photo.file.name}</p>
    <p><span class="meta-key">Type:</span> ${photo.file.type || "Unknown"}</p>
    <p><span class="meta-key">Size:</span> ${formatBytes(photo.file.size)}</p>
    <p><span class="meta-key">Dimensions:</span> ${dimensions}</p>
    <p><span class="meta-key">Rotation:</span> ${photo.rotation}deg</p>
    <p><span class="meta-key">Modified:</span> ${new Date(photo.file.lastModified).toLocaleString()}</p>
  `;
};

const getFilmLookProfile = (lookId) => FILM_LOOK_PROFILES.find((profile) => profile.id === lookId) || FILM_LOOK_PROFILES[0];
const isBwFilmLook = (profile) => profile.id.startsWith("bw-") || profile.id === "ilford-hp5";

const getFilmLookStrengthT = (value) => clamp(value, 0, 100) / 100;

const cloneAdjustments = (adjustments) => {
  const base = { ...defaultAdjustments, ...(adjustments || {}) };
  const clone = {
    ...base,
    levelsByChannel: {},
    curvesByChannel: {},
  };

  TONE_CHANNELS.forEach((channel) => {
    const rawLevels = base.levelsByChannel?.[channel] || {};
    let black = Number(rawLevels.black);
    let mid = Number(rawLevels.mid);
    let white = Number(rawLevels.white);

    if (!Number.isFinite(black)) black = Number(base.levelsBlack);
    if (!Number.isFinite(mid)) mid = Number(base.levelsMid);
    if (!Number.isFinite(white)) white = Number(base.levelsWhite);
    if (!Number.isFinite(black)) black = 0;
    if (!Number.isFinite(mid)) mid = 128;
    if (!Number.isFinite(white)) white = 255;

    black = clamp(Math.round(black), 0, 253);
    mid = clamp(Math.round(mid), black + 1, 254);
    white = clamp(Math.round(white), mid + 1, 255);
    clone.levelsByChannel[channel] = { black, mid, white };

    let points = Array.isArray(base.curvesByChannel?.[channel])
      ? base.curvesByChannel[channel].map((point) => ({
          x: clamp(Math.round(Number(point?.x)), 0, 255),
          y: clamp(Math.round(Number(point?.y)), 0, 255),
        }))
      : [];

    if (points.length < 2) {
      points = [
        { x: 0, y: Number(base.curvesShadows) || 0 },
        { x: 128, y: Number(base.curvesMidtones) || 128 },
        { x: 255, y: Number(base.curvesHighlights) || 255 },
      ];
    }

    points = points
      .filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y))
      .sort((a, b) => a.x - b.x);
    points[0] = { x: 0, y: clamp(Math.round(points[0]?.y ?? 0), 0, 255) };
    points[points.length - 1] = {
      x: 255,
      y: clamp(Math.round(points[points.length - 1]?.y ?? 255), 0, 255),
    };
    for (let i = 1; i < points.length - 1; i += 1) {
      points[i].x = clamp(points[i].x, points[i - 1].x + 1, 254);
    }

    clone.curvesByChannel[channel] = points;
  });

  clone.levelsChannel = TONE_CHANNELS.includes(base.levelsChannel) ? base.levelsChannel : "rgb";
  clone.curvesChannel = TONE_CHANNELS.includes(base.curvesChannel) ? base.curvesChannel : "rgb";

  const rgbLevels = clone.levelsByChannel.rgb;
  clone.levelsBlack = rgbLevels.black;
  clone.levelsMid = rgbLevels.mid;
  clone.levelsWhite = rgbLevels.white;

  const rgbPoints = clone.curvesByChannel.rgb;
  clone.curvesShadows = rgbPoints[0].y;
  clone.curvesMidtones = rgbPoints[Math.floor(rgbPoints.length / 2)].y;
  clone.curvesHighlights = rgbPoints[rgbPoints.length - 1].y;
  return clone;
};

const mapLevelsValue = (input, black, mid, white) => {
  const min = clamp(black, 0, 254);
  const max = clamp(white, min + 1, 255);
  const gammaMid = clamp(mid, min + 1, max - 1);
  const remapped = clamp((input - min) / (max - min), 0, 1);
  const midNorm = clamp((gammaMid - min) / (max - min), 0.01, 0.99);
  const gamma = Math.log(0.5) / Math.log(midNorm);
  return clamp(Math.pow(remapped, gamma) * 255, 0, 255);
};

const getCurveSegmentAt = (points, x) => {
  for (let i = 0; i < points.length - 1; i += 1) {
    if (x >= points[i].x && x <= points[i + 1].x) {
      return i;
    }
  }
  return points.length - 2;
};

const evaluateCurveSpline = (points, x) => {
  if (!Array.isArray(points) || points.length < 2) return clamp(x, 0, 255);
  const px = clamp(x, 0, 255);
  const segment = getCurveSegmentAt(points, px);
  const p0 = points[Math.max(0, segment - 1)];
  const p1 = points[segment];
  const p2 = points[Math.min(points.length - 1, segment + 1)];
  const p3 = points[Math.min(points.length - 1, segment + 2)];
  const span = Math.max(1, p2.x - p1.x);
  const t = clamp((px - p1.x) / span, 0, 1);
  const t2 = t * t;
  const t3 = t2 * t;
  const y =
    0.5 *
    ((2 * p1.y) +
      (-p0.y + p2.y) * t +
      (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
      (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);
  return clamp(y, 0, 255);
};

const buildToneLuts = (photo) => {
  const adjustments = cloneAdjustments(photo.adjustments);
  photo.adjustments = adjustments;
  const luts = {
    red: new Array(256),
    green: new Array(256),
    blue: new Array(256),
  };

  const appliesLevels = (channel) => adjustments.levelsChannel === "rgb" || adjustments.levelsChannel === channel;
  const appliesCurves = (channel) => adjustments.curvesChannel === "rgb" || adjustments.curvesChannel === channel;

  for (let i = 0; i < 256; i += 1) {
    let r = i;
    let g = i;
    let b = i;

    if (appliesLevels("red")) {
      const v = adjustments.levelsByChannel.red;
      r = mapLevelsValue(r, v.black, v.mid, v.white);
    }
    if (appliesLevels("green")) {
      const v = adjustments.levelsByChannel.green;
      g = mapLevelsValue(g, v.black, v.mid, v.white);
    }
    if (appliesLevels("blue")) {
      const v = adjustments.levelsByChannel.blue;
      b = mapLevelsValue(b, v.black, v.mid, v.white);
    }

    if (appliesCurves("red")) r = evaluateCurveSpline(adjustments.curvesByChannel.red, r);
    if (appliesCurves("green")) g = evaluateCurveSpline(adjustments.curvesByChannel.green, g);
    if (appliesCurves("blue")) b = evaluateCurveSpline(adjustments.curvesByChannel.blue, b);

    luts.red[i] = clamp(r, 0, 255);
    luts.green[i] = clamp(g, 0, 255);
    luts.blue[i] = clamp(b, 0, 255);
  }

  return luts;
};

const getToneLutKey = (a) =>
  JSON.stringify({
    levelsChannel: a.levelsChannel,
    levelsByChannel: a.levelsByChannel,
    curvesChannel: a.curvesChannel,
    curvesByChannel: a.curvesByChannel,
  });

const getToneLutsForPhoto = (photo) => {
  if (!photo) return null;
  const key = getToneLutKey(photo.adjustments);
  if (photo._toneLuts && photo._toneLutKey === key) {
    return photo._toneLuts;
  }
  const luts = buildToneLuts(photo);
  photo._toneLutKey = key;
  photo._toneLuts = luts;
  return luts;
};

const lutToTableValues = (lut, sampleSize = 64) => {
  const values = [];
  for (let i = 0; i < sampleSize; i += 1) {
    const idx = Math.round((i / (sampleSize - 1)) * 255);
    values.push((lut[idx] / 255).toFixed(6));
  }
  return values.join(" ");
};

const applyToneFilterLut = (photo) => {
  if (!toneCurveFuncR || !toneCurveFuncG || !toneCurveFuncB || !photo) return;
  const luts = getToneLutsForPhoto(photo);
  toneCurveFuncR.setAttribute("tableValues", lutToTableValues(luts.red));
  toneCurveFuncG.setAttribute("tableValues", lutToTableValues(luts.green));
  toneCurveFuncB.setAttribute("tableValues", lutToTableValues(luts.blue));
};

const buildBaseAdjustmentsFilter = (adjustments) => {
  const exposureBrightness = 100 + adjustments.exposure * 0.45;
  const brightness = 100 + adjustments.brightness * 0.55;
  const clarityContrast = adjustments.clarity * 0.22;
  const contrast = 100 + adjustments.contrast + clarityContrast;
  const saturation = 100 + adjustments.saturation;
  const hueRotate = adjustments.tint * 0.35;
  const sepia = Math.max(0, adjustments.temperature) * 0.35;
  const blackPointContrast = 100 + adjustments.blackPoint * 0.25;
  const blackPointBrightness = 100 - adjustments.blackPoint * 0.2;

  return `brightness(${exposureBrightness}%) brightness(${brightness}%) contrast(${contrast}%) contrast(${blackPointContrast}%) brightness(${blackPointBrightness}%) saturate(${saturation}%) hue-rotate(${hueRotate}deg) sepia(${sepia}%)`;
};

const buildFilmLookFilter = (photo) => {
  const profile = getFilmLookProfile(photo.filmLookId);
  if (profile.id === "none") return "";

  const t = getFilmLookStrengthT(photo.filmLookStrength);
  const brightness = lerp(100, profile.brightness, t);
  const contrast = lerp(100, profile.contrast, t);
  const saturation = lerp(100, profile.saturation, t);
  const sepia = lerp(0, profile.sepia, t);
  const hueRotate = lerp(0, profile.hueRotate, t);

  return `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) hue-rotate(${hueRotate}deg) sepia(${sepia}%)`;
};

const buildCompositeFilter = (photo) => {
  const tone = "url(#toneCurveFilter)";
  const base = buildBaseAdjustmentsFilter(photo.adjustments);
  const look = buildFilmLookFilter(photo);
  return look ? `${tone} ${base} ${look}` : `${tone} ${base}`;
};

const drawEmptyHistogram = () => {
  const ctx = histogramCanvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, histogramCanvas.width, histogramCanvas.height);
  ctx.fillStyle = "#0f141a";
  ctx.fillRect(0, 0, histogramCanvas.width, histogramCanvas.height);
};

const getPhotoHistogramBins = (photo, { applyAdjustments = true, channel = "luma" } = {}) => {
  if (!photo?.imgEl || !photo.imgEl.complete || photo.imgEl.naturalWidth === 0) {
    return new Array(256).fill(0);
  }
  const sampleCanvas = document.createElement("canvas");
  const sampleCtx = sampleCanvas.getContext("2d", { willReadFrequently: true });
  if (!sampleCtx) return new Array(256).fill(0);

  const maxSampleWidth = 320;
  const ratio = photo.imgEl.naturalHeight / photo.imgEl.naturalWidth;
  sampleCanvas.width = Math.min(maxSampleWidth, photo.imgEl.naturalWidth);
  sampleCanvas.height = Math.max(1, Math.round(sampleCanvas.width * ratio));
  sampleCtx.drawImage(photo.imgEl, 0, 0, sampleCanvas.width, sampleCanvas.height);

  const { data } = sampleCtx.getImageData(0, 0, sampleCanvas.width, sampleCanvas.height);
  const bins = new Array(256).fill(0);
  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];
    if (applyAdjustments) {
      [r, g, b] = applyAdjustmentMath(r, g, b, photo);
    }
    let value = 0;
    if (channel === "red") value = r;
    else if (channel === "green") value = g;
    else if (channel === "blue") value = b;
    else value = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);
    bins[Math.round(clamp(value, 0, 255))] += 1;
  }
  return bins;
};

const drawLevelsCanvas = (photo) => {
  if (!levelsCanvas) return;
  const ctx = levelsCanvas.getContext("2d");
  if (!ctx) return;
  const { width: w, height: h } = levelsCanvas;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "#2c2c2c";
  ctx.strokeRect(0.5, 0.5, w - 1, h - 1);
  if (!photo) return;

  const channel = photo.adjustments.levelsChannel || "rgb";
  const levels = photo.adjustments.levelsByChannel?.[channel] || { black: 0, mid: 128, white: 255 };
  const bins = getPhotoHistogramBins(photo, { applyAdjustments: false, channel: channel === "rgb" ? "luma" : channel });
  const peak = bins.reduce((m, v) => Math.max(m, v), 1);
  ctx.beginPath();
  ctx.moveTo(0, h);
  for (let x = 0; x < w; x += 1) {
    const idx = Math.round((x / (w - 1)) * 255);
    const y = h - (bins[idx] / peak) * (h - 18);
    ctx.lineTo(x, y);
  }
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fillStyle = "rgba(170,170,170,0.35)";
  ctx.fill();

  const blackX = (levels.black / 255) * (w - 1);
  const midX = (levels.mid / 255) * (w - 1);
  const whiteX = (levels.white / 255) * (w - 1);
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(blackX, 0);
  ctx.lineTo(blackX, h);
  ctx.moveTo(midX, 0);
  ctx.lineTo(midX, h);
  ctx.moveTo(whiteX, 0);
  ctx.lineTo(whiteX, h);
  ctx.stroke();

  ctx.strokeStyle = "#f3f3f3";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(blackX, h - 14);
  ctx.lineTo(midX, 10);
  ctx.lineTo(whiteX, h - 14);
  ctx.stroke();

  [blackX, midX, whiteX].forEach((x) => {
    ctx.beginPath();
    ctx.arc(x, h - 10, 6.5, 0, Math.PI * 2);
    ctx.fillStyle = "#f5f5f5";
    ctx.fill();
    ctx.strokeStyle = "#141414";
    ctx.lineWidth = 1;
    ctx.stroke();
  });
};

const drawCurvesCanvas = (photo) => {
  if (!curvesCanvas) return;
  const ctx = curvesCanvas.getContext("2d");
  if (!ctx) return;
  const { width: w, height: h } = curvesCanvas;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "#2c2c2c";
  ctx.strokeRect(0.5, 0.5, w - 1, h - 1);
  for (let i = 1; i < 4; i += 1) {
    const gx = (w / 4) * i;
    const gy = (h / 4) * i;
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.beginPath();
    ctx.moveTo(gx, 0);
    ctx.lineTo(gx, h);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, gy);
    ctx.lineTo(w, gy);
    ctx.stroke();
  }
  if (!photo) return;

  const channel = photo.adjustments.curvesChannel || "rgb";
  const pointsRaw = photo.adjustments.curvesByChannel?.[channel] || [{ x: 0, y: 0 }, { x: 255, y: 255 }];
  const points = pointsRaw.map((point) => ({
    x: (point.x / 255) * (w - 1),
    y: h - (point.y / 255) * h,
  }));

  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  for (let x = 0; x < w; x += 1) {
    const input = (x / (w - 1)) * 255;
    const y = h - (evaluateCurveSpline(pointsRaw, input) / 255) * h;
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  points.forEach((p, index) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, index === 0 || index === points.length - 1 ? 5.3 : 6.5, 0, Math.PI * 2);
    ctx.fillStyle = "#f5f5f5";
    ctx.fill();
    ctx.strokeStyle = "#141414";
    ctx.lineWidth = 1;
    ctx.stroke();
  });
};

const renderTonePanels = () => {
  const photo = getSelectedPhoto();
  if (photo) photo.adjustments = cloneAdjustments(photo.adjustments);
  if (levelsChannelSelect) levelsChannelSelect.value = photo?.adjustments.levelsChannel || "rgb";
  if (curvesChannelSelect) curvesChannelSelect.value = photo?.adjustments.curvesChannel || "rgb";
  if (levelsReadout) {
    const levels = photo?.adjustments?.levelsByChannel?.[photo?.adjustments?.levelsChannel || "rgb"];
    if (!levels) {
      levelsReadout.textContent = "In 0 | Gamma 1.00 | Out 255";
    } else {
      const midNorm = clamp((levels.mid - levels.black) / Math.max(1, levels.white - levels.black), 0.01, 0.99);
      const gamma = Math.log(0.5) / Math.log(midNorm);
      levelsReadout.textContent = `In ${levels.black} | Gamma ${gamma.toFixed(2)} | Out ${levels.white}`;
    }
  }
  drawLevelsCanvas(photo);
  drawCurvesCanvas(photo);
};

const applyAdjustmentMath = (r, g, b, photo) => {
  const adjustments = photo.adjustments;
  let rr = r;
  let gg = g;
  let bb = b;

  const exposureShift = adjustments.exposure * 1.2;
  rr += exposureShift;
  gg += exposureShift;
  bb += exposureShift;

  const brightnessFactor = 1 + adjustments.brightness / 200;
  rr *= brightnessFactor;
  gg *= brightnessFactor;
  bb *= brightnessFactor;

  const contrastFactor = 1 + adjustments.contrast / 100;
  rr = (rr - 128) * contrastFactor + 128;
  gg = (gg - 128) * contrastFactor + 128;
  bb = (bb - 128) * contrastFactor + 128;

  const blackPoint = clamp(adjustments.blackPoint, -100, 100) / 100;
  if (blackPoint > 0) {
    const crush = 1 + blackPoint * 0.85;
    rr = Math.pow(clamp(rr, 0, 255) / 255, crush) * 255;
    gg = Math.pow(clamp(gg, 0, 255) / 255, crush) * 255;
    bb = Math.pow(clamp(bb, 0, 255) / 255, crush) * 255;
  } else if (blackPoint < 0) {
    const lift = Math.abs(blackPoint) * 0.22 * 255;
    rr = rr + lift * (1 - rr / 255);
    gg = gg + lift * (1 - gg / 255);
    bb = bb + lift * (1 - bb / 255);
  }

  const clarity = clamp(adjustments.clarity, -100, 100) / 100;
  if (clarity !== 0) {
    const luma = 0.299 * rr + 0.587 * gg + 0.114 * bb;
    const midtoneWeight = 1 - Math.min(1, Math.abs(luma - 128) / 128);
    const clarityAmount = clarity * midtoneWeight * 0.9;
    rr = luma + (rr - luma) * (1 + clarityAmount);
    gg = luma + (gg - luma) * (1 + clarityAmount);
    bb = luma + (bb - luma) * (1 + clarityAmount);
  }

  const satFactor = 1 + adjustments.saturation / 100;
  const gray = 0.299 * rr + 0.587 * gg + 0.114 * bb;
  rr = gray + (rr - gray) * satFactor;
  gg = gray + (gg - gray) * satFactor;
  bb = gray + (bb - gray) * satFactor;

  const warm = adjustments.temperature / 100;
  rr += 30 * warm;
  bb -= 30 * warm;

  const tint = adjustments.tint / 100;
  gg -= 28 * tint;
  rr += 14 * tint;
  bb += 14 * tint;

  const look = getFilmLookProfile(photo.filmLookId);
  const t = getFilmLookStrengthT(photo.filmLookStrength);
  if (look.id !== "none" && t > 0) {
    const lookBrightness = lerp(1, look.brightness / 100, t);
    rr *= lookBrightness;
    gg *= lookBrightness;
    bb *= lookBrightness;

    const lookContrast = lerp(1, look.contrast / 100, t);
    rr = (rr - 128) * lookContrast + 128;
    gg = (gg - 128) * lookContrast + 128;
    bb = (bb - 128) * lookContrast + 128;

    const lookSaturation = lerp(1, look.saturation / 100, t);
    const lookGray = 0.299 * rr + 0.587 * gg + 0.114 * bb;
    rr = lookGray + (rr - lookGray) * lookSaturation;
    gg = lookGray + (gg - lookGray) * lookSaturation;
    bb = lookGray + (bb - lookGray) * lookSaturation;

    rr += look.warm * t - look.cool * t + look.tint * t;
    bb += look.cool * t - look.warm * t - look.tint * t * 0.2;
    gg -= look.tint * t * 0.8;
  }

  const luts = getToneLutsForPhoto(photo);
  rr = luts.red[Math.round(clamp(rr, 0, 255))];
  gg = luts.green[Math.round(clamp(gg, 0, 255))];
  bb = luts.blue[Math.round(clamp(bb, 0, 255))];

  return [clamp(rr, 0, 255), clamp(gg, 0, 255), clamp(bb, 0, 255)];
};

const renderHistogram = () => {
  const photo = getSelectedPhoto();
  const ctx = histogramCanvas.getContext("2d");
  if (!photo || !ctx) {
    drawEmptyHistogram();
    return;
  }

  if (!photo.imgEl || !photo.imgEl.complete || photo.imgEl.naturalWidth === 0) {
    drawEmptyHistogram();
    return;
  }

  const bins = getPhotoHistogramBins(photo, { applyAdjustments: true, channel: "luma" });

  const peak = bins.reduce((max, count) => Math.max(max, count), 1);
  ctx.clearRect(0, 0, histogramCanvas.width, histogramCanvas.height);
  ctx.fillStyle = "#0f141a";
  ctx.fillRect(0, 0, histogramCanvas.width, histogramCanvas.height);

  const w = histogramCanvas.width;
  const h = histogramCanvas.height;
  ctx.beginPath();
  ctx.moveTo(0, h);
  for (let i = 0; i < 256; i += 1) {
    const x = (i / 255) * w;
    const y = h - (bins[i] / peak) * (h - 4);
    ctx.lineTo(x, y);
  }
  ctx.lineTo(w, h);
  ctx.closePath();

  const gradient = ctx.createLinearGradient(0, 0, 0, h);
  gradient.addColorStop(0, "rgba(192, 192, 192, 0.7)");
  gradient.addColorStop(1, "rgba(192, 192, 192, 0.07)");
  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.strokeStyle = "rgba(210, 210, 210, 0.9)";
  ctx.lineWidth = 1;
  ctx.stroke();
};

const syncTextPropertyValues = () => {
  const selected = getSelectedTextOverlays();
  const showPanel = selected.length > 0 && state.activeTool === "select";
  textPropertiesPanel.classList.toggle("hidden-panel", !showPanel);

  if (!showPanel) return;

  const base = selected[0];
  ensureFontOptionExists(base.fontFamily);
  textFontFamily.value = base.fontFamily;
  textFontWeight.value = String(base.fontWeight);
  textFontStyle.value = base.fontStyle;
  textAlign.value = base.textAlign;
  textFontSize.value = String(base.fontSize);
  textFontSizeVal.textContent = String(base.fontSize);
  textLetterSpacing.value = String(base.letterSpacing);
  textLetterSpacingVal.textContent = String(base.letterSpacing);
  textWordSpacing.value = String(base.wordSpacing);
  textWordSpacingVal.textContent = String(base.wordSpacing);
  textLineHeight.value = String(Math.round(base.lineHeight * 100));
  textLineHeightVal.textContent = base.lineHeight.toFixed(2);
  textRotation.value = String(base.rotation);
  textRotationVal.textContent = String(base.rotation);
  textOpacity.value = String(base.opacity);
  textOpacityVal.textContent = String(base.opacity);
  textColor.value = base.color;
};

const syncShapePropertyValues = () => {
  const selected = getSelectedShapeOverlays();
  const showPanel = selected.length > 0 && state.activeTool === "select";
  shapePropertiesPanel.classList.toggle("hidden-panel", !showPanel);

  if (!showPanel) return;

  const base = selected[0];
  shapeFillColor.value = base.fill;
  shapeStrokeColor.value = base.stroke;
  shapeStrokeWidth.value = String(base.strokeWidth ?? 0);
  shapeStrokeWidthVal.textContent = String(base.strokeWidth ?? 0);
  shapeBorderRadius.value = String(base.borderRadius ?? 0);
  shapeBorderRadiusVal.textContent = String(base.borderRadius ?? 0);
  shapeOpacity.value = String(base.opacity);
  shapeOpacityVal.textContent = String(base.opacity);
  shapeRotation.value = String(base.rotation);
  shapeRotationVal.textContent = String(base.rotation);

  const isSidesShape = base.type === "star" || base.type === "polygon";
  shapeSidesRow.classList.toggle("hidden-panel", !isSidesShape);
  if (isSidesShape) {
    const sides = base.sides ?? (base.type === "star" ? 5 : 6);
    shapeSides.value = String(sides);
    shapeSidesVal.textContent = String(sides);
  }
};

const createRegularPolygonPoints = (sides, cx, cy, r, rotationDeg = -90) => {
  const points = [];
  const rotationRad = (rotationDeg * Math.PI) / 180;
  const step = (Math.PI * 2) / sides;
  for (let i = 0; i < sides; i += 1) {
    const angle = rotationRad + i * step;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return points.join(" ");
};

const createStarPoints = (spikes, cx, cy, outerR, innerR, rotationDeg = -90) => {
  const points = [];
  const rotationRad = (rotationDeg * Math.PI) / 180;
  const step = Math.PI / spikes;
  for (let i = 0; i < spikes * 2; i += 1) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = rotationRad + i * step;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return points.join(" ");
};

const ensureFontOptionExists = (value) => {
  if (!value) return;
  const hasOption = Array.from(textFontFamily.options).some((option) => option.value === value);
  if (hasOption) return;

  const option = document.createElement("option");
  option.value = value;
  option.textContent = value.replace(/^'|'$/g, "");
  textFontFamily.appendChild(option);
};

const populateFallbackFonts = () => {
  textFontFamily.innerHTML = "";
  FALLBACK_FONT_OPTIONS.forEach((font) => {
    const option = document.createElement("option");
    option.value = font.value;
    option.textContent = font.label;
    textFontFamily.appendChild(option);
  });
};

const populateSystemFonts = async () => {
  populateFallbackFonts();

  if (typeof window.queryLocalFonts !== "function") return;

  try {
    const localFonts = await window.queryLocalFonts();
    const families = Array.from(new Set(localFonts.map((item) => item.family).filter(Boolean))).sort((a, b) =>
      a.localeCompare(b),
    );
    if (families.length === 0) return;

    textFontFamily.innerHTML = "";
    families.forEach((family) => {
      const option = document.createElement("option");
      option.value = toCssFamilyValue(family);
      option.textContent = family;
      textFontFamily.appendChild(option);
    });

    const helvetica = families.find((name) => name.toLowerCase() === "helvetica");
    const preferred = helvetica ? toCssFamilyValue(helvetica) : textFontFamily.options[0]?.value;
    if (preferred) textFontFamily.value = preferred;
  } catch (_error) {
    // Permission denied / unavailable in this browser; fallback options remain.
  }
};

const getShapeSvgMarkup = (overlay) => {
  const fill = overlay.type === "line" ? "none" : overlay.fill;
  const strokeWidth = overlay.strokeWidth ?? 0;
  const stroke = strokeWidth > 0 ? overlay.stroke : "none";
  const borderRadius = overlay.borderRadius ?? 0;

  if (overlay.type === "circle") {
    return `<svg viewBox="0 0 100 100" preserveAspectRatio="none"><ellipse cx="50" cy="50" rx="46" ry="46" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/></svg>`;
  }
  if (overlay.type === "triangle") {
    return `<svg viewBox="0 0 100 100" preserveAspectRatio="none"><polygon points="50,6 94,94 6,94" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/></svg>`;
  }
  if (overlay.type === "line") {
    return `<svg viewBox="0 0 100 100" preserveAspectRatio="none"><line x1="10" y1="90" x2="90" y2="10" stroke="${stroke}" stroke-width="${Math.max(1, strokeWidth)}" stroke-linecap="round"/></svg>`;
  }
  if (overlay.type === "star") {
    const spikes = clamp(overlay.sides ?? 5, 3, 12);
    const points = createStarPoints(spikes, 50, 50, 45, 20);
    return `<svg viewBox="0 0 100 100" preserveAspectRatio="none"><polygon points="${points}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" /></svg>`;
  }
  if (overlay.type === "polygon") {
    const sides = clamp(overlay.sides ?? 6, 3, 12);
    const points = createRegularPolygonPoints(sides, 50, 50, 45);
    return `<svg viewBox="0 0 100 100" preserveAspectRatio="none"><polygon points="${points}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" /></svg>`;
  }
  return `<svg viewBox="0 0 100 100" preserveAspectRatio="none"><rect x="6" y="6" width="88" height="88" rx="${borderRadius}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/></svg>`;
};

const populateFilmLookOptions = () => {
  filmLookSelect.innerHTML = "";

  const colorGroup = document.createElement("optgroup");
  colorGroup.label = "Color";
  const bwGroup = document.createElement("optgroup");
  bwGroup.label = "B&W";

  FILM_LOOK_PROFILES.forEach((profile) => {
    const option = document.createElement("option");
    option.value = profile.id;
    option.textContent = profile.name;
    if (isBwFilmLook(profile)) {
      bwGroup.appendChild(option);
    } else {
      colorGroup.appendChild(option);
    }
  });

  filmLookSelect.appendChild(colorGroup);
  filmLookSelect.appendChild(bwGroup);
};

const syncFilmLookControls = () => {
  const photo = getSelectedPhoto();
  if (!photo) {
    filmLookSelect.value = "none";
    filmLookStrength.value = "100";
    filmLookStrengthVal.textContent = "100";
    return;
  }

  filmLookSelect.value = photo.filmLookId;
  filmLookStrength.value = String(photo.filmLookStrength);
  filmLookStrengthVal.textContent = String(photo.filmLookStrength);
};

const applyOverlayStyles = (node, overlay) => {
  node.style.left = `${overlay.x}%`;
  node.style.top = `${overlay.y}%`;
  node.style.width = overlay.width ? `${overlay.width}px` : "auto";
  node.style.fontFamily = overlay.fontFamily;
  node.style.fontWeight = String(overlay.fontWeight);
  node.style.fontStyle = overlay.fontStyle;
  node.style.textAlign = overlay.textAlign;
  node.style.fontSize = `${overlay.fontSize}px`;
  node.style.letterSpacing = `${overlay.letterSpacing}px`;
  node.style.wordSpacing = `${overlay.wordSpacing}px`;
  node.style.lineHeight = String(overlay.lineHeight);
  node.style.opacity = String(overlay.opacity / 100);
  node.style.color = overlay.color;
  node.style.zIndex = String(overlay.layerIndex || 1);
  node.style.transform = `translate(-50%, -50%) rotate(${overlay.rotation}deg)`;
};

const applyShapeStyles = (node, overlay) => {
  node.style.left = `${overlay.x}%`;
  node.style.top = `${overlay.y}%`;
  node.style.width = `${overlay.width}px`;
  node.style.height = `${overlay.height}px`;
  node.style.opacity = String(overlay.opacity / 100);
  node.style.zIndex = String(overlay.layerIndex || 1);
  node.style.transform = `translate(-50%, -50%) rotate(${overlay.rotation}deg)`;
};

const deleteSelectedTextOverlays = () => {
  const photo = getSelectedPhoto();
  if (!photo || state.selectedTextIds.length === 0) return;
  capturePhotoHistory(photo);

  const toDelete = new Set(state.selectedTextIds);
  const layerKeysToDelete = [...toDelete].map((id) => getLayerKey("text", id));
  photo.textOverlays = photo.textOverlays.filter((overlay) => !toDelete.has(overlay.id));
  removeLayerKeys(photo, layerKeysToDelete);
  applyLayerZIndices(photo);
  setSelectedTextIds([]);
  renderTextOverlays();
};

const deleteSelectedShapeOverlays = () => {
  const photo = getSelectedPhoto();
  if (!photo || state.selectedShapeIds.length === 0) return;
  capturePhotoHistory(photo);

  const toDelete = new Set(state.selectedShapeIds);
  const layerKeysToDelete = [...toDelete].map((id) => getLayerKey("shape", id));
  photo.shapeOverlays = photo.shapeOverlays.filter((overlay) => !toDelete.has(overlay.id));
  removeLayerKeys(photo, layerKeysToDelete);
  applyLayerZIndices(photo);
  setSelectedShapeIds([]);
  renderTextOverlays();
};

const updateToolAvailability = () => {
  const hasPhoto = Boolean(getSelectedPhoto());
  toolTextBtn.classList.toggle("is-disabled", !hasPhoto);
  toolTextBtn.disabled = !hasPhoto;
  toolShapesBtn.classList.toggle("is-disabled", !hasPhoto);
  toolShapesBtn.disabled = !hasPhoto;
  toolEditBtn.classList.toggle("is-disabled", !hasPhoto);
  toolEditBtn.disabled = !hasPhoto;
  toolCropBtn.classList.toggle("is-disabled", !hasPhoto);
  toolCropBtn.disabled = !hasPhoto;
  if (!hasPhoto) {
    shapeFlyout.classList.add("hidden-panel");
    toolShapesBtn.classList.remove("is-active");
  }
  if (!hasPhoto && (state.activeTool === "text" || state.activeTool === "crop")) {
    setActiveTool("select");
  }
};

const syncCompareControls = () => {
  const selected = getSelectedPhoto();
  const canCompare = state.activeTool !== "crop" && Boolean(selected?.isEdited && getCompareTargetPhoto(selected));
  compareBtn.disabled = !canCompare;
  compareBtn.classList.toggle("is-disabled", !canCompare);
  compareBtnLabel.textContent = state.compareMode ? "Original" : "Compare";
};

const renderLayersPanel = () => {
  if (!layersPanelList) return;
  const photo = getSelectedPhoto();
  layersPanelList.innerHTML = "";

  if (!photo) {
    const empty = document.createElement("div");
    empty.className = "layers-empty";
    empty.textContent = "No layers";
    layersPanelList.appendChild(empty);
    return;
  }

  const order = ensureLayerOrder(photo);
  applyLayerZIndices(photo);

  if (order.length === 0) {
    const empty = document.createElement("div");
    empty.className = "layers-empty";
    empty.textContent = "No layers";
    layersPanelList.appendChild(empty);
    return;
  }

  const primaryLayerKey = getPrimarySelectedLayerKey();
  const viewOrder = [...order].reverse();
  viewOrder.forEach((key) => {
    const overlay = getOverlayByLayerKey(photo, key);
    const parsed = parseLayerKey(key);
    if (!overlay || !parsed) return;

    const row = document.createElement("div");
    row.className = `layer-row${primaryLayerKey === key ? " is-selected" : ""}`;
    row.draggable = true;
    row.dataset.layerKey = key;

    row.addEventListener("dragstart", (event) => {
      state.draggingLayerKey = key;
      row.classList.add("is-dragging");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", key);
    });
    row.addEventListener("dragend", () => {
      state.draggingLayerKey = null;
      row.classList.remove("is-dragging");
      layersPanelList.querySelectorAll(".layer-row.is-drag-over").forEach((node) => node.classList.remove("is-drag-over"));
    });
    row.addEventListener("dragover", (event) => {
      event.preventDefault();
      row.classList.add("is-drag-over");
      event.dataTransfer.dropEffect = "move";
    });
    row.addEventListener("dragleave", () => {
      row.classList.remove("is-drag-over");
    });
    row.addEventListener("drop", (event) => {
      event.preventDefault();
      row.classList.remove("is-drag-over");
      const sourceKey = event.dataTransfer.getData("text/plain") || state.draggingLayerKey;
      reorderLayer(sourceKey, key);
    });

    const dragHandle = document.createElement("span");
    dragHandle.className = "layer-drag-handle";
    dragHandle.title = "Drag to Reorder";
    dragHandle.innerHTML = '<i data-lucide="grip-vertical"></i>';

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.className = "layer-name";
    nameInput.value = overlay.name || (parsed.kind === "text" ? "Text Layer" : "Shape Layer");
    nameInput.setAttribute("aria-label", "Layer Name");
    nameInput.addEventListener("pointerdown", (event) => event.stopPropagation());
    nameInput.addEventListener("click", (event) => event.stopPropagation());
    nameInput.addEventListener("focus", () => {
      capturePhotoHistory(photo);
    });
    nameInput.addEventListener("input", () => {
      overlay.name = nameInput.value;
    });
    nameInput.addEventListener("blur", () => {
      if (!nameInput.value.trim()) {
        nameInput.value = parsed.kind === "text" ? "Text Layer" : "Shape Layer";
        overlay.name = nameInput.value;
      }
    });

    const actions = document.createElement("div");
    actions.className = "layer-actions";

    const upBtn = document.createElement("button");
    upBtn.type = "button";
    upBtn.className = "layer-btn";
    upBtn.title = "Move Up";
    upBtn.ariaLabel = "Move Layer Up";
    upBtn.innerHTML = '<i data-lucide="chevron-up"></i>';

    const downBtn = document.createElement("button");
    downBtn.type = "button";
    downBtn.className = "layer-btn";
    downBtn.title = "Move Down";
    downBtn.ariaLabel = "Move Layer Down";
    downBtn.innerHTML = '<i data-lucide="chevron-down"></i>';

    const layerIndex = order.indexOf(key);
    upBtn.disabled = layerIndex === order.length - 1;
    downBtn.disabled = layerIndex === 0;

    upBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      moveLayer(key, "up");
    });
    downBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      moveLayer(key, "down");
    });

    row.addEventListener("click", () => {
      if (parsed.kind === "text") {
        setSelectedShapeIds([]);
        setSelectedTextIds([parsed.id]);
      } else {
        setSelectedTextIds([]);
        setSelectedShapeIds([parsed.id]);
      }
      renderTextOverlays();
    });

    actions.appendChild(upBtn);
    actions.appendChild(downBtn);
    row.appendChild(dragHandle);
    row.appendChild(nameInput);
    row.appendChild(actions);
    layersPanelList.appendChild(row);
  });

  hydrateIcons();
};

const setEditModalStatus = (message) => {
  editModalStatus.textContent = message || "";
};

const setGenerateModalStatus = (message) => {
  generateModalStatus.textContent = message || "";
};
const setPrintModalStatus = (message) => {
  printModalStatus.textContent = message || "";
};

const setRawProcessingState = (busy, message = "Generating Preview...") => {
  if (!rawProcessingOverlay) return;
  rawProcessingOverlay.classList.toggle("hidden-panel", !busy);
  if (rawProcessingStatus) {
    rawProcessingStatus.textContent = message;
  }
};

const setEditSubmitState = (busy) => {
  state.isSubmittingEdit = busy;
  appShell.classList.toggle("interaction-locked", busy);
  editProcessingOverlay.classList.toggle("hidden-panel", !busy);
  editSubmitBtn.disabled = busy;
  editCancelBtn.disabled = busy;
  editModalCloseBtn.disabled = busy;
  editPromptInput.disabled = busy;
  editSubmitBtn.classList.toggle("is-busy", busy);
  editSubmitBtn.title = busy ? "Applying Edit..." : "Apply Edit";
  editSubmitBtn.ariaLabel = busy ? "Applying Edit" : "Apply Edit";
  if (!busy) {
    editProcessingStatus.textContent = "Applying AI edit...";
  }
};

const setGenerateSubmitState = (busy) => {
  state.isSubmittingGenerate = busy;
  appShell.classList.toggle("interaction-locked", busy);
  editProcessingOverlay.classList.toggle("hidden-panel", !busy);
  generateSubmitBtn.disabled = busy;
  generateCancelBtn.disabled = busy;
  generateModalCloseBtn.disabled = busy;
  generatePromptInput.disabled = busy;
  generateSubmitBtn.classList.toggle("is-busy", busy);
  generateSubmitBtn.title = busy ? "Generating..." : "Generate Image";
  generateSubmitBtn.ariaLabel = busy ? "Generating Image" : "Generate Image";
  if (!busy) {
    editProcessingStatus.textContent = "Generating image...";
  }
};
const setPrintSubmitState = (busy) => {
  state.isSubmittingPrint = busy;
  appShell.classList.toggle("interaction-locked", busy);
  editProcessingOverlay.classList.toggle("hidden-panel", !busy);
  printSubmitBtn.disabled = busy;
  printCancelBtn.disabled = busy;
  printModalCloseBtn.disabled = busy;
  [
    printOfferingSelect,
    printQuantityInput,
    printCurrencyInput,
    printEmailInput,
    printFullNameInput,
    printAddress1Input,
    printAddress2Input,
    printCityInput,
    printStateInput,
    printPostalInput,
    printCountryInput,
  ].forEach((input) => {
    input.disabled = busy;
  });
  printSubmitBtn.classList.toggle("is-busy", busy);
  printSubmitBtn.title = busy ? "Submitting Print Order..." : "Submit Print Order";
  printSubmitBtn.ariaLabel = busy ? "Submitting Print Order" : "Submit Print Order";
  if (!busy) {
    editProcessingStatus.textContent = "Submitting print order...";
  }
};
const renderPrintOfferingOptions = () => {
  printOfferingSelect.innerHTML = "";
  if (!Array.isArray(state.printOfferings) || state.printOfferings.length === 0) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "No framed offerings configured";
    printOfferingSelect.appendChild(option);
    printOfferingSelect.disabled = true;
    printSubmitBtn.disabled = true;
    return;
  }

  state.printOfferings.forEach((offering, idx) => {
    const option = document.createElement("option");
    option.value = offering.key;
    option.textContent = offering.label || offering.key;
    option.selected = idx === 0;
    printOfferingSelect.appendChild(option);
  });
  printOfferingSelect.disabled = false;
  if (!state.isSubmittingPrint) {
    printSubmitBtn.disabled = false;
  }
};
const loadPrintOfferings = async () => {
  const response = await fetch("/api/peecho/framed-offerings");
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error || "Unable to load framed offerings.");
  }
  const offerings = Array.isArray(payload.offerings) ? payload.offerings : [];
  state.printOfferings = offerings;
  renderPrintOfferingOptions();
};

const setEditModalPreviewPhoto = (photo) => {
  if (!photo) return;
  state.editModalPreviewPhotoId = photo.id;
  editModalThumb.src = photo.url;
  editModalThumb.alt = `${photo.file.name} thumbnail`;
};

const renderEditModalStrip = (photos) => {
  if (!editModalStrip) return;
  editModalStrip.innerHTML = "";

  if (!Array.isArray(photos) || photos.length <= 1) {
    editModalStrip.classList.add("hidden-panel");
    return;
  }

  const activeId = state.editModalPreviewPhotoId ?? photos[0]?.id ?? null;
  photos.forEach((photo) => {
    const thumb = document.createElement("button");
    thumb.type = "button";
    thumb.className = `modal-strip-thumb${photo.id === activeId ? " is-active" : ""}`;
    thumb.title = photo.file.name;
    thumb.style.backgroundImage = `url('${photo.url}')`;
    thumb.addEventListener("click", () => {
      setEditModalPreviewPhoto(photo);
      renderEditModalStrip(photos);
    });
    editModalStrip.appendChild(thumb);
  });

  editModalStrip.classList.remove("hidden-panel");
};

const openEditModal = () => {
  const photo = getSelectedPhoto();
  if (!photo) return;
  const selectedCount = getSelectedPhotoIds().length;
  const batchTargets = getBatchTargetPhotos();
  setEditModalPreviewPhoto(photo);
  renderEditModalStrip(batchTargets);
  editPromptInput.value = "";
  if (selectedCount > MAX_BATCH_EDIT_COUNT) {
    setEditModalStatus(`${selectedCount} selected. Batch limit is ${MAX_BATCH_EDIT_COUNT}; only the first ${MAX_BATCH_EDIT_COUNT} will be edited.`);
  } else if (batchTargets.length > 1) {
    setEditModalStatus(`${batchTargets.length} photos selected for batch edit.`);
  } else {
    setEditModalStatus("");
  }
  editProcessingStatus.textContent = "Applying AI edit...";
  setEditSubmitState(false);
  editModal.classList.remove("hidden-panel");
  hydrateIcons();
  setTimeout(() => editPromptInput.focus(), 0);
};

const closeEditModal = () => {
  editModal.classList.add("hidden-panel");
  state.editModalPreviewPhotoId = null;
  if (editModalStrip) {
    editModalStrip.innerHTML = "";
    editModalStrip.classList.add("hidden-panel");
  }
};

const openGenerateModal = () => {
  generatePromptInput.value = "";
  generateResolutionSelect.value = "1K";
  generateAspectRatioSelect.value = "1:1";
  setGenerateModalStatus("");
  editProcessingStatus.textContent = "Generating image...";
  setGenerateSubmitState(false);
  generateModal.classList.remove("hidden-panel");
  hydrateIcons();
  setTimeout(() => generatePromptInput.focus(), 0);
};

const closeGenerateModal = () => {
  generateModal.classList.add("hidden-panel");
};
const openPrintModal = () => {
  const photo = getSelectedPhoto();
  if (!photo) return;
  printQuantityInput.value = "1";
  printCurrencyInput.value = "USD";
  printEmailInput.value = "";
  printFullNameInput.value = "";
  printAddress1Input.value = "";
  printAddress2Input.value = "";
  printCityInput.value = "";
  printStateInput.value = "";
  printPostalInput.value = "";
  printCountryInput.value = "US";
  setPrintModalStatus("Loading framed offerings...");
  editProcessingStatus.textContent = "Submitting print order...";
  setPrintSubmitState(false);
  renderPrintOfferingOptions();
  printModal.classList.remove("hidden-panel");
  hydrateIcons();
  loadPrintOfferings()
    .then(() => {
      setPrintModalStatus(`Selected: ${photo.file.name}`);
      if (state.printOfferings.length === 0) {
        setPrintModalStatus("No framed offerings configured. Add them in server config.");
      }
    })
    .catch((error) => {
      setPrintModalStatus(error.message || "Unable to load framed offerings.");
      printSubmitBtn.disabled = true;
    });
};
const closePrintModal = () => {
  printModal.classList.add("hidden-panel");
};

const openCreditsModal = ({ depleted = false, context = "status" } = {}) => {
  if (!creditsModal || !creditsModalTitle) return;
  const balance = creditsService.getBalance();
  creditsModalTitle.textContent = `Credits ${balance}`;
  creditsModalBuyBtn.style.display = "inline-flex";
  creditsModal.classList.remove("hidden-panel");
  hydrateIcons();
};

const closeCreditsModal = () => {
  if (!creditsModal) return;
  creditsModal.classList.add("hidden-panel");
};

const openSettingsModal = () => {
  if (!settingsModal) return;
  settingsModal.classList.remove("hidden-panel");
  hydrateIcons();
  window.requestAnimationFrame(() => {
    settingsLinkButtons[0]?.focus();
  });
};

const closeSettingsModal = () => {
  if (!settingsModal) return;
  settingsModal.classList.add("hidden-panel");
};

const openLibraryModal = async () => {
  if (!libraryModal) return;
  closeSettingsModal();
  libraryModal.classList.remove("hidden-panel");
  hydrateIcons();
  setSettingsProjectsStatus("Loading projects...");
  try {
    await refreshProjectsFromCloud();
    if (!settingsProjectsStatus?.textContent) {
      setSettingsProjectsStatus("");
    }
  } catch (error) {
    setSettingsProjectsStatus(error?.message || "Unable to load projects.");
  }
  window.requestAnimationFrame(() => {
    settingsProjectNameInput?.focus();
  });
};

const closeLibraryModal = () => {
  if (!libraryModal) return;
  libraryModal.classList.add("hidden-panel");
};

const submitPeechoPrintOrder = async () => {
  if (state.isSubmittingPrint) return;
  const photo = getSelectedPhoto();
  if (!photo) return;

  const offeringKey = printOfferingSelect.value.trim();
  const quantity = Math.max(1, Number(printQuantityInput.value) || 1);
  const currency = printCurrencyInput.value.trim().toUpperCase() || "USD";
  const email = printEmailInput.value.trim();
  const fullName = printFullNameInput.value.trim();
  const line1 = printAddress1Input.value.trim();
  const city = printCityInput.value.trim();
  const postalCode = printPostalInput.value.trim();
  const countryCode = printCountryInput.value.trim().toUpperCase();

  if (!offeringKey || !email || !fullName || !line1 || !city || !postalCode || !countryCode) {
    setPrintModalStatus("Fill all required print fields.");
    return;
  }

  try {
    setPrintSubmitState(true);
    closePrintModal();
    editProcessingStatus.textContent = "Submitting print order...";

    const imageDataUrl = await fileToDataUrl(photo.file);
    const response = await fetch("/api/peecho/print-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageDataUrl,
        fileName: photo.file.name,
        width: photo.width || null,
        height: photo.height || null,
        offeringKey,
        quantity,
        currency,
        email,
        address: {
          fullName,
          line1,
          line2: printAddress2Input.value.trim(),
          city,
          state: printStateInput.value.trim(),
          postalCode,
          countryCode,
        },
      }),
    });

    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.error || "Unable to submit print order.");
    }

    const checkoutUrl = payload.payment?.checkout_url || payload.payment?.payment_url || payload.order?.checkout_url;
    if (checkoutUrl) {
      window.open(checkoutUrl, "_blank", "noopener");
    }
    window.alert(`Print order submitted${payload.orderId ? ` (Order ${payload.orderId})` : ""}.`);
  } catch (error) {
    window.alert(error.message || "Unable to submit print order.");
  } finally {
    setPrintSubmitState(false);
  }
};

const buildSelectedPhotoWallartDataUrl = async () => {
  const photo = getSelectedPhoto();
  if (!photo || !photo.imgEl) {
    throw new Error("Select a photo first.");
  }

  const source = photo.imgEl;
  const radians = (photo.rotation * Math.PI) / 180;
  const quarterTurns = ((photo.rotation / 90) % 4 + 4) % 4;
  const swapDimensions = quarterTurns % 2 === 1;

  const canvas = document.createElement("canvas");
  canvas.width = swapDimensions ? source.naturalHeight : source.naturalWidth;
  canvas.height = swapDimensions ? source.naturalWidth : source.naturalHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Unable to render wallart preview.");
  }

  ctx.filter = buildCompositeFilter(photo);
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(radians);
  ctx.drawImage(source, -source.naturalWidth / 2, -source.naturalHeight / 2);

  const dataUrl = canvas.toDataURL("image/jpeg", 0.98);
  if (!String(dataUrl || "").startsWith("data:image/")) {
    throw new Error("Unable to generate wallart preview.");
  }
  return dataUrl;
};

const beginCanvasPopWallartOrder = async () => {
  if (!getAuthToken() && !getRefreshToken()) {
    window.location.href = "/signup";
    return;
  }

  const photo = getSelectedPhoto();
  if (!photo) {
    window.alert("Select a photo first.");
    return;
  }

  const imageDataUrl = await buildSelectedPhotoWallartDataUrl();
  const response = await authFetch("/api/canvaspop/pull-url", {
    method: "POST",
    headers: getJsonRequestHeaders(),
    body: JSON.stringify({
      imageDataUrl,
      fileName: buildExportFilename(photo.file?.name || "wallart").replace(/\.png$/i, ".jpg"),
      productType: String(wallartProduct?.value || "framed_print"),
    }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401) {
      handleExpiredAuthSession(payload?.error || "Invalid or expired auth session.");
      return;
    }
    throw new Error(payload?.error || "Unable to start Wallart checkout.");
  }

  const checkoutUrl = String(payload?.checkoutUrl || "").trim();
  if (!checkoutUrl) {
    throw new Error("Missing checkout URL.");
  }
  window.open(checkoutUrl, "_blank", "noopener");
};

const beginPrintSpaceWallartOrder = async () => {
  if (!getAuthToken() && !getRefreshToken()) {
    window.location.href = "/signup";
    return;
  }

  const photo = getSelectedPhoto();
  if (!photo) {
    window.alert("Select a photo first.");
    return;
  }

  const imageDataUrl = await buildSelectedPhotoWallartDataUrl();
  const response = await authFetch("/api/printspace/pull-url", {
    method: "POST",
    headers: getJsonRequestHeaders(),
    body: JSON.stringify({
      imageDataUrl,
      fileName: buildExportFilename(photo.file?.name || "wallart").replace(/\.png$/i, ".jpg"),
      productType: String(wallartProduct?.value || "framed_print"),
    }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401) {
      handleExpiredAuthSession(payload?.error || "Invalid or expired auth session.");
      return;
    }
    throw new Error(payload?.error || "Unable to start PrintSpace checkout.");
  }

  const checkoutUrl = String(payload?.checkoutUrl || "").trim();
  if (!checkoutUrl) {
    throw new Error("Missing PrintSpace checkout URL.");
  }
  window.open(checkoutUrl, "_blank", "noopener");
};

const openWallartModal = async () => {
  const photo = getSelectedPhoto();
  if (!photo) return;
  if (!wallartModal) {
    await beginCanvasPopWallartOrder();
    return;
  }
  if (wallartStatus) {
    wallartStatus.textContent = "Preparing selected image preview...";
  }
  if (wallartContinueBtn) {
    wallartContinueBtn.disabled = true;
  }
  wallartModal.classList.remove("hidden-panel");
  hydrateIcons();
  try {
    const previewDataUrl = await buildSelectedPhotoWallartDataUrl();
    if (wallartPreview) {
      wallartPreview.src = previewDataUrl;
      wallartPreview.alt = `${photo.file?.name || "Selected photo"} preview`;
    }
    const width = Number(photo.width || photo.imgEl?.naturalWidth || 0);
    const height = Number(photo.height || photo.imgEl?.naturalHeight || 0);
    if (wallartMeta) {
      const dimensions = width > 0 && height > 0 ? ` • ${width} x ${height}` : "";
      wallartMeta.textContent = `${photo.file?.name || "Selected image"}${dimensions}`;
    }
    if (wallartStatus) {
      wallartStatus.textContent = "Ready to continue.";
    }
  } catch (error) {
    if (wallartStatus) {
      wallartStatus.textContent = error?.message || "Unable to prepare preview.";
    }
  } finally {
    if (wallartContinueBtn) {
      wallartContinueBtn.disabled = false;
    }
  }
};

const closeWallartModal = () => {
  if (!wallartModal) return;
  wallartModal.classList.add("hidden-panel");
};

const createPhotoRecord = (file, overrides = {}) => {
  const id = state.nextPhotoId++;
  const safeFile = file || new File([], `photo-${id}.png`, { type: "image/png", lastModified: Date.now() });
  return {
    id,
  file: safeFile,
  url: safeFile.size > 0 ? URL.createObjectURL(safeFile) : "",
  adjustments: cloneAdjustments(defaultAdjustments),
  rotation: 0,
  width: 0,
  height: 0,
  imgEl: null,
  filmLookId: "none",
  filmLookStrength: 100,
  textOverlays: [],
  shapeOverlays: [],
  layerOrder: [],
  isEdited: false,
  isGenerated: false,
  isNewGenerated: false,
  aiJob: null,
  sourcePhotoId: null,
  rootPhotoId: id,
  editVersion: 0,
  ...overrides,
  };
};

const getProjectPhotoPayload = async (photo) => {
  const imageDataUrl = photo.file ? await buildSessionPreviewDataUrl(photo) : null;
  return {
    id: photo.id,
    fileName: photo.file?.name || `photo-${photo.id}.png`,
    mimeType: photo.file?.type || "image/png",
    imageDataUrl,
    adjustments: cloneAdjustments(photo.adjustments),
    rotation: photo.rotation,
    filmLookId: photo.filmLookId,
    filmLookStrength: photo.filmLookStrength,
    textOverlays: clonePhotoSnapshot(photo.textOverlays || []),
    shapeOverlays: clonePhotoSnapshot(photo.shapeOverlays || []),
    layerOrder: [...(photo.layerOrder || [])],
    isEdited: Boolean(photo.isEdited),
    isGenerated: Boolean(photo.isGenerated),
    sourcePhotoId: photo.sourcePhotoId ?? null,
    rootPhotoId: photo.rootPhotoId ?? photo.id,
    editVersion: Number(photo.editVersion ?? 0),
  };
};

const buildSessionPreviewDataUrl = async (photo) => {
  const source = photo?.imgEl;
  if (!source?.naturalWidth || !source?.naturalHeight) {
    return fileToDataUrl(photo.file);
  }

  const maxDimension = SESSION_SAVE_MAX_DIMENSION;
  const scale = Math.min(1, maxDimension / Math.max(source.naturalWidth, source.naturalHeight));
  const width = Math.max(1, Math.round(source.naturalWidth * scale));
  const height = Math.max(1, Math.round(source.naturalHeight * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return fileToDataUrl(photo.file);
  }
  ctx.drawImage(source, 0, 0, width, height);

  let quality = SESSION_SAVE_JPEG_QUALITY_START;
  let blob = await canvasToBlob(canvas, "image/jpeg", quality);
  if (!blob) {
    return fileToDataUrl(photo.file);
  }

  while (blob.size > SESSION_SAVE_TARGET_BYTES && quality > SESSION_SAVE_JPEG_QUALITY_MIN) {
    quality = Math.max(SESSION_SAVE_JPEG_QUALITY_MIN, quality - 0.08);
    const nextBlob = await canvasToBlob(canvas, "image/jpeg", quality);
    if (!nextBlob) break;
    blob = nextBlob;
  }

  return blobToDataUrl(blob);
};

const readErrorMessageFromResponse = async (response, fallbackMessage) => {
  const payload = await response.clone().json().catch(() => null);
  const fromPayload = String(payload?.error || "").trim();
  if (fromPayload) return fromPayload;
  const raw = await response.text().catch(() => "");
  const trimmed = String(raw || "").trim();
  if (trimmed) return `${fallbackMessage} (${response.status})`;
  return fallbackMessage;
};

const sanitizeProjectName = (name) => {
  const raw = String(name || "").trim().replace(/\s+/g, " ");
  return raw.slice(0, 120);
};

const loadStoredProjectMeta = () => {
  try {
    const raw = window.localStorage.getItem(PROJECT_META_STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    const projectId = String(parsed?.id || "").trim();
    const projectName = sanitizeProjectName(parsed?.name || "");
    if (projectId) {
      state.currentProjectId = projectId;
      state.currentProjectName = projectName;
      if (settingsProjectNameInput && projectName) {
        settingsProjectNameInput.value = projectName;
      }
    }
  } catch {
    // Ignore corrupted project meta cache.
  }
};

const persistCurrentProjectMeta = (project) => {
  const projectId = String(project?.id || "").trim();
  const projectName = sanitizeProjectName(project?.name || "");
  state.currentProjectId = projectId || null;
  state.currentProjectName = projectName;
  if (settingsProjectNameInput) {
    settingsProjectNameInput.value = projectName;
  }
  try {
    if (!projectId) {
      window.localStorage.removeItem(PROJECT_META_STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(
      PROJECT_META_STORAGE_KEY,
      JSON.stringify({
        id: projectId,
        name: projectName,
      }),
    );
  } catch {
    // Ignore storage issues.
  }
};

const getSerializedProjectPayload = async () => {
  const selectedPhoto = getSelectedPhoto();
  return {
    app: "DarkroomX",
    version: 1,
    savedAt: new Date().toISOString(),
    selectedPhotoId: selectedPhoto?.id ?? null,
    photos: await Promise.all(state.photos.filter((photo) => !photo.isPendingGenerated).map((photo) => getProjectPhotoPayload(photo))),
  };
};

const saveProjectToFile = async () => {
  if (state.photos.length === 0) {
    window.alert("No photos to save.");
    return;
  }

  const payload = await getSerializedProjectPayload();

  const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `darkroomx-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.darkroomx`;
  anchor.click();
  URL.revokeObjectURL(url);
};

const restoreProjectFromPayload = async (payload) => {
  const photos = Array.isArray(payload?.photos) ? payload.photos : [];

  disposeAllPhotos();
  state.photos = [];
  state.selectedPhotoIds = [];
  state.lastSelectedPhotoId = null;
  state.photoHistory = {};
  state.nextPhotoId = 1;
  state.nextTextId = 1;
  state.nextShapeId = 1;
  state.compareMode = false;
  setSelectedTextIds([]);
  setSelectedShapeIds([]);
  closeEditModal();
  closeGenerateModal();

  if (photos.length === 0) {
    clearSelectionUI();
    return;
  }

  for (const item of photos) {
    if (!item?.imageDataUrl) continue;
    const file = dataUrlToFile(item.imageDataUrl, item.fileName || `photo-${Date.now()}.png`);
    const record = createPhotoRecord(file, {
      id: Number(item.id) || state.nextPhotoId,
      adjustments: cloneAdjustments(item.adjustments || defaultAdjustments),
      rotation: Number(item.rotation ?? 0),
      filmLookId: item.filmLookId || "none",
      filmLookStrength: Number(item.filmLookStrength ?? 100),
      textOverlays: clonePhotoSnapshot(item.textOverlays || []),
      shapeOverlays: clonePhotoSnapshot(item.shapeOverlays || []),
      layerOrder: [...(item.layerOrder || [])],
      isEdited: Boolean(item.isEdited),
      isGenerated: Boolean(item.isGenerated),
      isNewGenerated: false,
      sourcePhotoId: item.sourcePhotoId ?? null,
      rootPhotoId: item.rootPhotoId ?? item.id ?? null,
      editVersion: Number(item.editVersion ?? 0),
      aiJob: null,
    });
    state.photos.push(record);
    loadImageDimensions(record);
  }

  if (state.photos.length === 0) {
    clearSelectionUI();
    return;
  }

  state.nextPhotoId = Math.max(...state.photos.map((photo) => photo.id), 0) + 1;
  const maxTextId = Math.max(0, ...state.photos.flatMap((photo) => photo.textOverlays.map((overlay) => Number(overlay.id) || 0)));
  const maxShapeId = Math.max(0, ...state.photos.flatMap((photo) => photo.shapeOverlays.map((overlay) => Number(overlay.id) || 0)));
  state.nextTextId = maxTextId + 1;
  state.nextShapeId = maxShapeId + 1;

  renderFilmstrip();
  const desiredId = payload?.selectedPhotoId;
  const selectedIndex = desiredId != null ? state.photos.findIndex((photo) => photo.id === desiredId) : -1;
  selectPhoto(selectedIndex >= 0 ? selectedIndex : 0);
};

const restoreRecoveredSessionIfAvailable = async () => {
  try {
    if (state.photos.length > 0) return;
    const raw = window.localStorage.getItem(SESSION_RECOVERY_STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    const session = parsed?.session;
    if (!session || typeof session !== "object") return;
    await restoreProjectFromPayload(session);
    const recoveredProjectId = String(parsed?.projectId || "").trim();
    const recoveredProjectName = sanitizeProjectName(parsed?.projectName || "");
    if (recoveredProjectId) {
      persistCurrentProjectMeta({
        id: recoveredProjectId,
        name: recoveredProjectName,
      });
    }
    state.lastAutosaveDigest = "";
    window.localStorage.removeItem(SESSION_RECOVERY_STORAGE_KEY);
    setSettingsProjectsStatus("Recovered your last unsaved session.");
  } catch {
    // Ignore corrupt recovery payloads.
  }
};

const restoreLastActiveProjectOnStartup = async () => {
  try {
    if (state.photos.length > 0) return false;
    const projectId = String(state.currentProjectId || "").trim();
    if (!projectId) return false;
    if (!getAuthToken() && !getRefreshToken()) return false;

    const response = await authFetch(`/api/projects/${encodeURIComponent(projectId)}/session`, {
      method: "GET",
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (response.status === 401) return false;
      return false;
    }

    const session = payload?.session;
    if (!session || typeof session !== "object") return false;
    await restoreProjectFromPayload(session);
    const project = payload?.project || {};
    persistCurrentProjectMeta({
      id: project.id || projectId,
      name: project.name || state.currentProjectName || "",
    });
    setSettingsProjectsStatus(`Restored ${project.name || "last session"}.`);
    return true;
  } catch {
    return false;
  }
};

const handleProjectLoad = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const raw = await file.text();
    const payload = JSON.parse(raw);
    await restoreProjectFromPayload(payload);
  } catch (error) {
    window.alert(error?.message || "Unable to load project.");
  } finally {
    projectInput.value = "";
  }
};

const setSettingsProjectsStatus = (message = "") => {
  if (!settingsProjectsStatus) return;
  settingsProjectsStatus.textContent = String(message || "");
};

const formatProjectDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "";
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
};

const renderSettingsProjects = (projects = []) => {
  if (!settingsProjectsList) return;
  settingsProjectsList.innerHTML = "";

  if (!Array.isArray(projects) || projects.length === 0) {
    const empty = document.createElement("div");
    empty.className = "settings-projects-meta";
    empty.textContent = "No projects yet.";
    settingsProjectsList.appendChild(empty);
    return;
  }

  projects.forEach((project) => {
    const item = document.createElement("article");
    item.className = "settings-projects-item";
    if (state.currentProjectId === project.id) {
      item.classList.add("is-current");
    }

    const thumb = document.createElement("div");
    thumb.className = "settings-projects-thumb";
    if (project?.coverImageUrl) {
      thumb.style.backgroundImage = `url('${project.coverImageUrl}')`;
    }

    const head = document.createElement("div");
    head.className = "settings-projects-item-head";

    const name = document.createElement("div");
    name.className = "settings-projects-name";
    name.textContent = project.name || "Untitled Session";

    const currentBadge = document.createElement("span");
    currentBadge.className = "settings-projects-current";
    currentBadge.textContent = "Current";
    currentBadge.hidden = state.currentProjectId !== project.id;

    const meta = document.createElement("div");
    meta.className = "settings-projects-meta";
    const stamp = formatProjectDate(project.lastOpenedAt || project.updatedAt || project.createdAt);
    meta.textContent = stamp ? `Last opened ${stamp}` : "No save timestamp";

    const openBtn = document.createElement("button");
    openBtn.type = "button";
    openBtn.className = "settings-projects-open";
    openBtn.textContent = state.currentProjectId === project.id ? "Open (Current)" : "Open";
    const openProject = async () => {
      openBtn.disabled = true;
      try {
        const token = getAuthToken();
        if (!token && !getRefreshToken()) {
          window.location.href = "/signup";
          return;
        }
        setSettingsProjectsStatus(`Opening ${project.name || "project"}...`);
        const response = await authFetch(`/api/projects/${encodeURIComponent(project.id)}/session`, {
          method: "GET",
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          if (response.status === 401) {
            handleExpiredAuthSession(payload?.error || "Invalid or expired auth session.");
            return;
          }
          throw new Error(payload?.error || "Unable to open project.");
        }

        const session = payload?.session;
        if (session && typeof session === "object") {
          await restoreProjectFromPayload(session);
          const nextCoverImageUrl = getProjectCoverFromSession(session);
          persistCurrentProjectMeta({ id: project.id, name: project.name || "" });
          if (nextCoverImageUrl) {
            project.coverImageUrl = nextCoverImageUrl;
            thumb.style.backgroundImage = `url('${nextCoverImageUrl}')`;
          }
          setSettingsProjectsStatus(`Opened ${project.name || "project"}.`);
          await refreshProjectsFromCloud();
          return;
        }

        persistCurrentProjectMeta({ id: project.id, name: project.name || "" });
        if (settingsProjectNameInput) {
          settingsProjectNameInput.value = project.name || settingsProjectNameInput.value || "";
        } else {
          // no-op: keep current session visible when selected project has no saved snapshot
        }
        setSettingsProjectsStatus(
          `Selected ${project.name || "project"}. No saved snapshot found yet, click Save to store current studio state.`,
        );
        await refreshProjectsFromCloud();
      } catch (error) {
        setSettingsProjectsStatus(error?.message || "Unable to open project.");
      } finally {
        openBtn.disabled = false;
      }
    };

    openBtn.addEventListener("click", openProject);
    item.addEventListener("click", (event) => {
      if (event.target instanceof Element && event.target.closest("button")) return;
      void openProject();
    });

    item.appendChild(thumb);
    head.appendChild(name);
    head.appendChild(currentBadge);
    head.appendChild(openBtn);
    item.appendChild(head);
    item.appendChild(meta);
    settingsProjectsList.appendChild(item);
  });
};

const refreshProjectsFromCloud = async () => {
  if (!getAuthToken() && !getRefreshToken()) {
    renderSettingsProjects([]);
    setSettingsProjectsStatus("Sign in to manage projects.");
    return;
  }
  const response = await authFetch("/api/projects", { method: "GET" });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401) {
      handleExpiredAuthSession(payload?.error || "Invalid or expired auth session.");
      return;
    }
    throw new Error(payload?.error || "Unable to load projects.");
  }
  const projects = Array.isArray(payload?.projects) ? payload.projects : [];
  renderSettingsProjects(projects);
  state.projectsLoaded = true;
  if (!state.currentProjectId && projects[0]) {
    persistCurrentProjectMeta({ id: projects[0].id, name: projects[0].name || "" });
  }
};

const getProjectCoverFromSession = (session) => {
  if (!session || typeof session !== "object") return "";
  const photos = Array.isArray(session.photos) ? session.photos : [];
  const firstWithImage = photos.find((photo) => typeof photo?.imageDataUrl === "string" && photo.imageDataUrl.startsWith("data:image/"));
  return firstWithImage?.imageDataUrl || "";
};

const ensureProjectForSave = async ({ silent = false } = {}) => {
  if (state.currentProjectId) {
    return { id: state.currentProjectId, name: state.currentProjectName || sanitizeProjectName(settingsProjectNameInput?.value || "") };
  }
  if (!getAuthToken() && !getRefreshToken()) {
    if (!silent) {
      window.location.href = "/signup";
    }
    return null;
  }
  const fallbackName = `Session ${new Date().toISOString().slice(0, 10)}`;
  const name = sanitizeProjectName(settingsProjectNameInput?.value || fallbackName) || fallbackName;
  const response = await authFetch("/api/projects", {
    method: "POST",
    headers: getJsonRequestHeaders(),
    body: JSON.stringify({ name }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401) {
      if (!silent) {
        handleExpiredAuthSession(payload?.error || "Invalid or expired auth session.");
      }
      return null;
    }
    throw new Error(payload?.error || "Unable to create project.");
  }
  const project = payload?.project || {};
  persistCurrentProjectMeta({ id: project.id || "", name: project.name || name });
  return { id: String(project.id || ""), name: String(project.name || name) };
};

const saveCurrentSessionToCloudProject = async () => {
  const ensured = await ensureProjectForSave();
  if (!ensured?.id) return;
  const payload = await getSerializedProjectPayload();
  const coverImageUrl = getProjectCoverFromSession(payload);
  const requestBody = JSON.stringify({
    name: sanitizeProjectName(settingsProjectNameInput?.value || ensured.name || "") || ensured.name,
    coverImageUrl,
    session: payload,
  });
  if (new Blob([requestBody]).size > CLOUD_SESSION_REQUEST_SOFT_LIMIT_BYTES) {
    throw new Error("Project is too large to save right now. Reduce loaded images or split into a new project.");
  }
  const payloadDigest = getSessionPayloadDigest(payload);
  const response = await authFetch(`/api/projects/${encodeURIComponent(ensured.id)}/session`, {
    method: "PUT",
    headers: getJsonRequestHeaders(),
    body: requestBody,
  });
  if (!response.ok) {
    if (response.status === 401) {
      handleExpiredAuthSession("Invalid or expired auth session.");
      return;
    }
    throw new Error(await readErrorMessageFromResponse(response, "Unable to save project."));
  }
  const result = await response.json().catch(() => ({}));
  const projectName = sanitizeProjectName(settingsProjectNameInput?.value || ensured.name || "");
  persistCurrentProjectMeta({ id: ensured.id, name: projectName || ensured.name });
  state.lastAutosaveDigest = payloadDigest;
  setSettingsProjectsStatus(`Saved ${projectName || ensured.name || "project"}.`);
  await refreshProjectsFromCloud();
};

const getSessionPayloadDigest = (payload) => {
  if (!payload || typeof payload !== "object") return "";
  try {
    const normalized = {
      ...payload,
      savedAt: null,
    };
    return JSON.stringify(normalized);
  } catch {
    return "";
  }
};

const runCloudAutosave = async () => {
  if (state.autosaveInFlight) return;
  if (!Array.isArray(state.photos) || state.photos.length === 0) return;
  if (isAppSessionExpired()) return;
  if (!getAuthToken() && !getRefreshToken()) return;

  state.autosaveInFlight = true;
  try {
    const payload = await getSerializedProjectPayload();
    const digest = getSessionPayloadDigest(payload);
    if (digest && digest === state.lastAutosaveDigest) return;

    const ensured = await ensureProjectForSave({ silent: true });
    if (!ensured?.id) return;
    const coverImageUrl = getProjectCoverFromSession(payload);
    const requestBody = JSON.stringify({
      name: sanitizeProjectName(settingsProjectNameInput?.value || ensured.name || "") || ensured.name,
      coverImageUrl,
      session: payload,
    });
    if (new Blob([requestBody]).size > CLOUD_SESSION_REQUEST_SOFT_LIMIT_BYTES) return;
    const response = await authFetch(`/api/projects/${encodeURIComponent(ensured.id)}/session`, {
      method: "PUT",
      headers: getJsonRequestHeaders(),
      body: requestBody,
    });
    if (!response.ok) return;
    state.lastAutosaveDigest = digest;
    if (window.localStorage.getItem(SESSION_RECOVERY_STORAGE_KEY)) {
      window.localStorage.removeItem(SESSION_RECOVERY_STORAGE_KEY);
    }
  } catch {
    // Keep autosave silent in background.
  } finally {
    state.autosaveInFlight = false;
  }
};

const startCloudAutosave = () => {
  if (state.projectAutosaveTimer) {
    window.clearInterval(state.projectAutosaveTimer);
  }
  state.projectAutosaveTimer = window.setInterval(() => {
    void runCloudAutosave();
  }, CLOUD_AUTOSAVE_INTERVAL_MS);
};

const createFreshCloudProject = async () => {
  const fallbackName = `Session ${new Date().toISOString().slice(0, 10)}`;
  const name = sanitizeProjectName(settingsProjectNameInput?.value || fallbackName) || fallbackName;
  const response = await authFetch("/api/projects", {
    method: "POST",
    headers: getJsonRequestHeaders(),
    body: JSON.stringify({ name }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401) {
      handleExpiredAuthSession(payload?.error || "Invalid or expired auth session.");
      return;
    }
    throw new Error(payload?.error || "Unable to create project.");
  }

  disposeAllPhotos();
  state.photos = [];
  state.photoHistory = {};
  state.nextPhotoId = 1;
  state.nextTextId = 1;
  state.nextShapeId = 1;
  clearSelectionUI();
  const project = payload?.project || {};
  persistCurrentProjectMeta({ id: project.id || "", name: project.name || name });
  state.lastAutosaveDigest = "";
  setSettingsProjectsStatus(`Created ${project.name || name}.`);
  await refreshProjectsFromCloud();
};

const appendEditedPhotoFromDataUrl = async (editedImageDataUrl, sourcePhoto, options = {}) => {
  if (!sourcePhoto) return;
  const { selectInserted = true } = options;

  const editedBlob = dataUrlToBlob(editedImageDataUrl);
  const ext = editedBlob.type.includes("jpeg") ? "jpg" : editedBlob.type.includes("webp") ? "webp" : "png";
  const baseName = sourcePhoto.file.name.includes(".")
    ? sourcePhoto.file.name.slice(0, sourcePhoto.file.name.lastIndexOf("."))
    : sourcePhoto.file.name;
  const editedFile = new File([editedBlob], `${baseName}-edited.${ext}`, {
    type: editedBlob.type,
    lastModified: Date.now(),
  });

  const editedPhoto = createPhotoRecord(editedFile, {
    isEdited: true,
    sourcePhotoId: sourcePhoto.id ?? null,
    rootPhotoId: sourcePhoto.rootPhotoId ?? sourcePhoto.id ?? null,
    editVersion: (sourcePhoto.editVersion ?? 0) + 1,
  });
  loadImageDimensions(editedPhoto);

  const sourceIndex = state.photos.findIndex((item) => item.id === sourcePhoto.id);
  const insertIndex = sourceIndex >= 0 ? sourceIndex + 1 : state.photos.length;
  state.photos.splice(insertIndex, 0, editedPhoto);
  if (selectInserted) {
    selectPhoto(insertIndex);
  } else {
    renderFilmstrip();
  }
  return editedPhoto;
};

const appendGeneratedPhotoFromDataUrl = async (imageDataUrl, pendingPhotoId = null) => {
  const generatedBlob = dataUrlToBlob(imageDataUrl);
  const ext = generatedBlob.type.includes("jpeg") ? "jpg" : generatedBlob.type.includes("webp") ? "webp" : "png";
  const generatedFile = new File([generatedBlob], `generated-${Date.now()}.${ext}`, {
    type: generatedBlob.type,
    lastModified: Date.now(),
  });

  const pendingIndex = pendingPhotoId != null ? state.photos.findIndex((photo) => photo.id === pendingPhotoId) : -1;
  const hadPhotos = state.photos.length > 0 && pendingIndex < 0;
  const generatedPhoto = createPhotoRecord(generatedFile, {
    isGenerated: true,
    isNewGenerated: hadPhotos,
    aiJob: null,
  });
  loadImageDimensions(generatedPhoto);
  if (pendingIndex >= 0) {
    const pending = state.photos[pendingIndex];
    disposePhotoResources(pending);
    state.photos[pendingIndex] = generatedPhoto;
  } else {
    state.photos.push(generatedPhoto);
  }

  const generatedIndex = pendingIndex >= 0 ? pendingIndex : state.photos.length - 1;
  if (!hadPhotos) {
    const firstIndex = pendingIndex >= 0 ? pendingIndex : 0;
    state.selectedIndex = firstIndex;
    state.zoom = 1;
    updateZoomLabel();
    renderFilmstrip();
    selectPhoto(firstIndex);
  } else {
    renderFilmstrip();
  }

  return { photo: generatedPhoto, index: generatedIndex };
};

const submitGenerateRequest = async () => {
  if (state.isSubmittingGenerate) return;

  const prompt = generatePromptInput.value.trim();
  if (!prompt) {
    setGenerateModalStatus("Enter a prompt to generate an image.");
    return;
  }
  const resolution = generateResolutionSelect.value;
  const aspectRatio = generateAspectRatioSelect.value;

  try {
    const placeholder = createPhotoRecord(null, {
      isGenerated: true,
      isPendingGenerated: true,
      isNewGenerated: false,
      aiJob: { status: "processing", label: "Generating" },
    });
    state.photos.push(placeholder);
    renderFilmstrip();

    setGenerateSubmitState(true);
    closeGenerateModal();
    editProcessingStatus.textContent = "Generating image...";

    const response = await authFetch("/api/image-generate", {
      method: "POST",
      headers: getJsonRequestHeaders(),
      body: JSON.stringify({ prompt, resolution, aspectRatio }),
    });

    const payload = await response.json();
    if (!response.ok) {
      if (response.status === 401) {
        handleExpiredAuthSession(payload?.error || "Invalid or expired auth session.");
        return;
      }
      if (payload && Number.isFinite(Number(payload.creditsBalance))) {
        syncCreditsFromServer(payload.creditsBalance);
      }
      if (response.status === 402) {
        openCreditsModal({ depleted: true, context: "action" });
      }
      throw new Error(payload.error || "Image generation failed.");
    }
    if (!payload.imageDataUrl) {
      throw new Error("No generated image returned.");
    }

    await appendGeneratedPhotoFromDataUrl(payload.imageDataUrl, placeholder.id);
    syncCreditsFromServer(payload.creditsBalance);
  } catch (error) {
    const message = error.message || "Unable to generate image.";
    editProcessingStatus.textContent = "Unable to generate image.";
    const pendingIndex = state.photos.findIndex((photo) => photo.isPendingGenerated);
    if (pendingIndex >= 0) {
      const pending = state.photos[pendingIndex];
      disposePhotoResources(pending);
      state.photos.splice(pendingIndex, 1);
      renderFilmstrip();
    }
    window.alert(message);
  } finally {
    setGenerateSubmitState(false);
  }
};

const submitEditRequest = async () => {
  if (state.isSubmittingEdit) return;

  const prompt = editPromptInput.value.trim();
  if (!prompt) {
    setEditModalStatus("Enter a prompt to apply edits.");
    return;
  }

  const targets = getBatchTargetPhotos();
  if (targets.length === 0) return;
  const selectedCount = getSelectedPhotoIds().length;
  if (selectedCount > MAX_BATCH_EDIT_COUNT) {
    window.alert(`Batch limit is ${MAX_BATCH_EDIT_COUNT} images per run. Deselect extras and try again.`);
    return;
  }

  try {
    setEditSubmitState(true);
    closeEditModal();
    const failures = [];
    const failedTargets = [];
    let lastInsertedId = null;

    for (let i = 0; i < targets.length; i += 1) {
      const photo = getPhotoById(targets[i].id);
      if (!photo) continue;
      photo.aiJob = { status: "processing", label: `${i + 1}/${targets.length}` };
      renderFilmstrip();
      editProcessingStatus.textContent =
        targets.length > 1 ? `Applying AI edit ${i + 1} of ${targets.length}...` : "Applying AI edit...";

      try {
        const imageDataUrl = await fileToDataUrl(photo.file);
        const response = await authFetch("/api/image-edit", {
          method: "POST",
          headers: getJsonRequestHeaders(),
          body: JSON.stringify({ prompt, imageDataUrl }),
        });

        const payload = await response.json();
        if (!response.ok) {
          if (response.status === 401) {
            handleExpiredAuthSession(payload?.error || "Invalid or expired auth session.");
            return;
          }
          if (payload && Number.isFinite(Number(payload.creditsBalance))) {
            syncCreditsFromServer(payload.creditsBalance);
          }
          if (response.status === 402) {
            openCreditsModal({ depleted: true, context: "action" });
          }
          throw new Error(payload.error || "Image edit failed.");
        }
        if (!payload.imageDataUrl) {
          throw new Error("No edited image returned.");
        }

        const inserted = await appendEditedPhotoFromDataUrl(payload.imageDataUrl, photo, { selectInserted: false });
        if (inserted?.id) {
          lastInsertedId = inserted.id;
        }
        syncCreditsFromServer(payload.creditsBalance);
        photo.aiJob = { status: "done", label: `${i + 1}/${targets.length}` };
      } catch (error) {
        const message = error.message || "Unable to apply image edit.";
        failures.push(`${photo.file.name}: ${message}`);
        failedTargets.push({ id: photo.id, fileName: photo.file.name });
        photo.aiJob = { status: "failed", label: `${i + 1}/${targets.length}` };
      }
      renderFilmstrip();

      if (i < targets.length - 1) {
        await sleep(250);
      }
    }

    if (failedTargets.length > 0) {
      await sleep(900);
      const retryFailures = [];

      for (let i = 0; i < failedTargets.length; i += 1) {
        const target = failedTargets[i];
        const photo = getPhotoById(target.id);
        if (!photo) continue;
        editProcessingStatus.textContent = `Retrying failed edits ${i + 1} of ${failedTargets.length}...`;

        try {
          const imageDataUrl = await fileToDataUrl(photo.file);
          photo.aiJob = { status: "processing", label: `Retry ${i + 1}/${failedTargets.length}` };
          renderFilmstrip();
          const response = await authFetch("/api/image-edit", {
            method: "POST",
            headers: getJsonRequestHeaders(),
            body: JSON.stringify({ prompt, imageDataUrl }),
          });

          const payload = await response.json();
          if (!response.ok) {
            if (response.status === 401) {
              handleExpiredAuthSession(payload?.error || "Invalid or expired auth session.");
              return;
            }
            if (payload && Number.isFinite(Number(payload.creditsBalance))) {
              syncCreditsFromServer(payload.creditsBalance);
            }
            if (response.status === 402) {
              openCreditsModal({ depleted: true, context: "action" });
            }
            throw new Error(payload.error || "Image edit failed.");
          }
          if (!payload.imageDataUrl) {
            throw new Error("No edited image returned.");
          }

          const inserted = await appendEditedPhotoFromDataUrl(payload.imageDataUrl, photo, { selectInserted: false });
          if (inserted?.id) {
            lastInsertedId = inserted.id;
          }
          syncCreditsFromServer(payload.creditsBalance);
          photo.aiJob = { status: "done", label: "Done" };
        } catch (error) {
          retryFailures.push(`${target.fileName}: ${error.message || "Unable to apply image edit."}`);
          photo.aiJob = { status: "failed", label: "Failed" };
        }
        renderFilmstrip();

        if (i < failedTargets.length - 1) {
          await sleep(450);
        }
      }

      failures.length = 0;
      failures.push(...retryFailures);
    }

    if (lastInsertedId != null) {
      const nextIndex = state.photos.findIndex((item) => item.id === lastInsertedId);
      if (nextIndex >= 0) {
        selectPhoto(nextIndex);
      }
    }

    targets.forEach((target) => {
      const photo = getPhotoById(target.id);
      if (photo && photo.aiJob?.status === "done") {
        photo.aiJob = null;
      }
    });
    renderFilmstrip();

    if (failures.length > 0) {
      const summary = failures.length === targets.length
        ? "Unable to apply AI edit."
        : `Applied with ${failures.length} failure${failures.length === 1 ? "" : "s"}.`;
      editProcessingStatus.textContent = summary;
      window.alert([summary, "Provider returned temporary internal errors for some images.", "", ...failures].join("\n"));
    }
  } catch (error) {
    const message = error.message || "Unable to apply image edit.";
    editProcessingStatus.textContent = "Unable to apply AI edit.";
    window.alert(message);
  } finally {
    setEditSubmitState(false);
  }
};

const renderTextOverlays = () => {
  const photo = getSelectedPhoto();
  overlayLayer.innerHTML = "";
  state.snapGuideNodes = null;

  if (!photo) {
    syncTextPropertyValues();
    syncShapePropertyValues();
    renderLayersPanel();
    return;
  }

  applyLayerZIndices(photo);

  photo.shapeOverlays.forEach((overlay) => {
    const node = document.createElement("div");
    const selectedIndex = state.selectedShapeIds.indexOf(overlay.id);
    node.className = "shape-overlay";
    if (selectedIndex === 0) node.classList.add("is-selected");
    if (selectedIndex > 0) node.classList.add("is-secondary-selected");

    node.dataset.shapeId = String(overlay.id);
    node.innerHTML = getShapeSvgMarkup(overlay);
    applyShapeStyles(node, overlay);

    node.addEventListener("pointerdown", (event) => {
      if (state.activeTool !== "select") return;
      event.stopPropagation();
      setSelectedTextIds([]);

      if (event.shiftKey) {
        const next = state.selectedShapeIds.includes(overlay.id)
          ? state.selectedShapeIds.filter((id) => id !== overlay.id)
          : [...state.selectedShapeIds, overlay.id];
        setSelectedShapeIds(next);
        renderTextOverlays();
        return;
      }

      if (!state.selectedShapeIds.includes(overlay.id)) {
        setSelectedShapeIds([overlay.id]);
        renderTextOverlays();
      }

      capturePhotoHistory(photo);
      const selectedForDrag = [...state.selectedShapeIds];
      const layerRect = overlayLayer.getBoundingClientRect();
      const startX = event.clientX;
      const startY = event.clientY;
      const initialPos = new Map();

      selectedForDrag.forEach((id) => {
        const item = getShapeById(id);
        if (item) initialPos.set(id, { x: item.x, y: item.y });
      });

      const onMove = (moveEvent) => {
        const dxPct = ((moveEvent.clientX - startX) / Math.max(layerRect.width, 1)) * 100;
        const dyPct = ((moveEvent.clientY - startY) / Math.max(layerRect.height, 1)) * 100;
        let snapGuideX;
        let snapGuideY;

        selectedForDrag.forEach((id) => {
          const shapeItem = getShapeById(id);
          const base = initialPos.get(id);
          if (!shapeItem || !base) return;
          let nextX = clamp(base.x + dxPct, 0, 100);
          let nextY = clamp(base.y + dyPct, 0, 100);
          if (selectedForDrag.length === 1 && id === overlay.id) {
            const snapped = applySnapping(nextX, nextY, shapeItem.width, shapeItem.height, layerRect);
            nextX = snapped.xPct;
            nextY = snapped.yPct;
            snapGuideX = snapped.snapGuideX;
            snapGuideY = snapped.snapGuideY;
          }
          shapeItem.x = nextX;
          shapeItem.y = nextY;

          const domNode = overlayLayer.querySelector(`[data-shape-id="${id}"]`);
          if (domNode) applyShapeStyles(domNode, shapeItem);
        });
        updateSnapGuides(snapGuideX, snapGuideY);
      };

      const onUp = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        hideSnapGuides();
        syncShapePropertyValues();
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    });

    if (selectedIndex === 0 && state.activeTool === "select") {
      ["nw", "ne", "sw", "se"].forEach((corner) => {
        const handle = document.createElement("span");
        handle.className = "shape-resize-handle";
        handle.dataset.corner = corner;

        handle.addEventListener("pointerdown", (event) => {
          event.preventDefault();
          event.stopPropagation();
          capturePhotoHistory(photo);

          const xSign = corner.includes("w") ? -1 : 1;
          const ySign = corner.includes("n") ? -1 : 1;
          const startX = event.clientX;
          const startY = event.clientY;
          const startW = overlay.width;
          const startH = overlay.height;
          const startXPct = overlay.x;
          const startYPct = overlay.y;
          const layerRect = overlayLayer.getBoundingClientRect();
          const minW = overlay.type === "line" ? 40 : 30;
          const minH = overlay.type === "line" ? 6 : 30;

          const onMove = (moveEvent) => {
            const rawDx = moveEvent.clientX - startX;
            const rawDy = moveEvent.clientY - startY;

            const progress = (rawDx * xSign + rawDy * ySign) / 2;
            const baseSize = Math.max(1, (startW + startH) / 2);
            const scale = Math.max(0.08, 1 + progress / baseSize);

            const scaledW = startW * scale;
            const scaledH = startH * scale;
            const nextW = clamp(scaledW, minW, Math.max(minW, layerRect.width * 0.95));
            const nextH = clamp(scaledH, minH, Math.max(minH, layerRect.height * 0.95));

            const appliedDx = (nextW - startW) / xSign;
            const appliedDy = (nextH - startH) / ySign;
            const shiftXPct = (appliedDx / 2 / Math.max(layerRect.width, 1)) * 100;
            const shiftYPct = (appliedDy / 2 / Math.max(layerRect.height, 1)) * 100;

            overlay.width = nextW;
            overlay.height = nextH;
            overlay.x = clamp(startXPct + shiftXPct, 0, 100);
            overlay.y = clamp(startYPct + shiftYPct, 0, 100);
            applyShapeStyles(node, overlay);
          };

          const onUp = () => {
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerup", onUp);
            renderTextOverlays();
          };

          window.addEventListener("pointermove", onMove);
          window.addEventListener("pointerup", onUp);
        });

        node.appendChild(handle);
      });
    }

    overlayLayer.appendChild(node);
  });

  photo.textOverlays.forEach((overlay) => {
    const node = document.createElement("div");
    const selectedIndex = state.selectedTextIds.indexOf(overlay.id);
    const isPrimarySelected = selectedIndex === 0;

    node.className = "text-overlay";
    if (isPrimarySelected) node.classList.add("is-selected");
    if (selectedIndex > 0) node.classList.add("is-secondary-selected");
    if (state.editingTextId === overlay.id) node.classList.add("is-editing");

    node.dataset.id = String(overlay.id);
    node.contentEditable = state.editingTextId === overlay.id ? "true" : "false";
    node.textContent = overlay.text;
    applyOverlayStyles(node, overlay);

    node.addEventListener("pointerdown", (event) => {
      if (state.activeTool !== "select" || state.editingTextId === overlay.id) return;
      event.stopPropagation();
      setSelectedShapeIds([]);

      if (event.shiftKey) {
        const next = state.selectedTextIds.includes(overlay.id)
          ? state.selectedTextIds.filter((id) => id !== overlay.id)
          : [...state.selectedTextIds, overlay.id];
        setSelectedTextIds(next);
        renderTextOverlays();
        return;
      }

      if (!state.selectedTextIds.includes(overlay.id)) {
        setSelectedTextIds([overlay.id]);
        renderTextOverlays();
      }

      capturePhotoHistory(photo);
      const selectedForDrag = [...state.selectedTextIds];
      const layerRect = overlayLayer.getBoundingClientRect();
      const startX = event.clientX;
      const startY = event.clientY;
      const initialPos = new Map();
      selectedForDrag.forEach((id) => {
        const item = getTextById(id);
        if (item) initialPos.set(id, { x: item.x, y: item.y });
      });

      const onMove = (moveEvent) => {
        const dxPct = ((moveEvent.clientX - startX) / Math.max(layerRect.width, 1)) * 100;
        const dyPct = ((moveEvent.clientY - startY) / Math.max(layerRect.height, 1)) * 100;
        let snapGuideX;
        let snapGuideY;

        selectedForDrag.forEach((id) => {
          const overlayItem = getTextById(id);
          const base = initialPos.get(id);
          if (!overlayItem || !base) return;
          let nextX = clamp(base.x + dxPct, 0, 100);
          let nextY = clamp(base.y + dyPct, 0, 100);

          const domNode = overlayLayer.querySelector(`[data-id="${id}"]`);
          if (selectedForDrag.length === 1 && id === overlay.id) {
            const domRect = domNode?.getBoundingClientRect();
            const widthPx = overlayItem.width || domRect?.width || 120;
            const heightPx = domRect?.height || Math.max(24, overlayItem.fontSize * overlayItem.lineHeight);
            const snapped = applySnapping(nextX, nextY, widthPx, heightPx, layerRect);
            nextX = snapped.xPct;
            nextY = snapped.yPct;
            snapGuideX = snapped.snapGuideX;
            snapGuideY = snapped.snapGuideY;
          }
          overlayItem.x = nextX;
          overlayItem.y = nextY;
          if (domNode) applyOverlayStyles(domNode, overlayItem);
        });
        updateSnapGuides(snapGuideX, snapGuideY);
      };

      const onUp = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        hideSnapGuides();
        syncTextPropertyValues();
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    });

    node.addEventListener("dblclick", (event) => {
      if (state.activeTool !== "select") return;
      event.stopPropagation();
      setSelectedTextIds([overlay.id]);
      state.editingTextId = overlay.id;
      capturePhotoHistory(photo);
      renderTextOverlays();
      const editable = overlayLayer.querySelector(`[data-id="${overlay.id}"]`);
      if (editable) {
        editable.focus();
        const range = document.createRange();
        range.selectNodeContents(editable);
        range.collapse(false);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      }
    });

    node.addEventListener("input", () => {
      overlay.text = node.textContent || "";
    });

    node.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        node.blur();
      }
    });

    node.addEventListener("blur", () => {
      if (state.editingTextId === overlay.id) {
        overlay.text = node.textContent || "";
        state.editingTextId = null;
        renderTextOverlays();
      }
    });

    if (isPrimarySelected && state.activeTool === "select" && state.editingTextId !== overlay.id) {
      ["nw", "ne", "sw", "se"].forEach((corner) => {
        const handle = document.createElement("span");
        handle.className = "text-resize-handle";
        handle.dataset.corner = corner;

        handle.addEventListener("pointerdown", (event) => {
          event.preventDefault();
          event.stopPropagation();
          capturePhotoHistory(photo);

          const xSign = corner.includes("w") ? -1 : 1;
          const ySign = corner.includes("n") ? -1 : 1;
          const startX = event.clientX;
          const startY = event.clientY;
          const startSize = overlay.fontSize;
          const nodeRect = node.getBoundingClientRect();
          const layerRect = overlayLayer.getBoundingClientRect();
          const startWidth = overlay.width || nodeRect.width;

          const onMove = (moveEvent) => {
            const dx = (moveEvent.clientX - startX) * xSign;
            const dy = (moveEvent.clientY - startY) * ySign;
            const delta = (dx + dy) / 2;

            overlay.fontSize = clamp(Math.round(startSize + delta * 0.25), 8, 300);
            overlay.width = clamp(startWidth + delta * 1.2, 40, Math.max(120, layerRect.width * 0.95));
            applyOverlayStyles(node, overlay);
          };

          const onUp = () => {
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerup", onUp);
            renderTextOverlays();
          };

          window.addEventListener("pointermove", onMove);
          window.addEventListener("pointerup", onUp);
        });

        node.appendChild(handle);
      });
    }

    overlayLayer.appendChild(node);
  });

  syncTextPropertyValues();
  syncShapePropertyValues();
  renderLayersPanel();
  hideSnapGuides();
};

const setActiveTool = (tool) => {
  if (tool === "text" && !getSelectedPhoto()) return;
  if (tool === "crop" && !getSelectedPhoto()) return;
  state.activeTool = tool;
  Object.entries(toolButtons).forEach(([key, btn]) => {
    if (!btn) return;
    btn.classList.toggle("is-active", key === tool);
  });
  if (tool !== "shape") {
    shapeFlyout.classList.add("hidden-panel");
    toolShapesBtn.classList.remove("is-active");
  }
  if (tool === "crop") {
    state.compareMode = false;
    if (cropAspectSelect) cropAspectSelect.value = state.cropAspect || "original";
    if (cropCustomWidth && !cropCustomWidth.value) cropCustomWidth.value = "8";
    if (cropCustomHeight && !cropCustomHeight.value) cropCustomHeight.value = "10";
    initializeCropRect();
  } else {
    clearCropState();
  }
  renderTextOverlays();
  renderCropOverlay();
};

const addTextOverlay = () => {
  const photo = getSelectedPhoto();
  if (!photo) return;
  capturePhotoHistory(photo);

  const overlayId = state.nextTextId;
  const overlay = {
    id: overlayId,
    name: `Text ${overlayId}`,
    text: "Double-click to edit",
    x: 50,
    y: 50,
    fontFamily: "Helvetica, Arial, sans-serif",
    fontWeight: 400,
    fontStyle: "normal",
    textAlign: "left",
    fontSize: 36,
    letterSpacing: 0,
    wordSpacing: 0,
    lineHeight: 1.2,
    rotation: 0,
    opacity: 100,
    color: "#ffffff",
    width: 260,
  };
  state.nextTextId += 1;
  photo.textOverlays.push(overlay);
  ensureLayerOrder(photo);
  applyLayerZIndices(photo);

  setActiveTool("select");
  setSelectedTextIds([overlay.id]);
  state.editingTextId = overlay.id;
  renderTextOverlays();
};

const addShapeOverlay = (shapeType) => {
  const photo = getSelectedPhoto();
  if (!photo) return;
  capturePhotoHistory(photo);

  const overlayId = state.nextShapeId;
  const baseSize = shapeType === "line" ? { width: 220, height: 90 } : { width: 180, height: 140 };
  const defaultStrokeWidth = shapeType === "line" ? 3 : 0;
  const shapeNameMap = {
    rect: "Rectangle",
    circle: "Circle",
    triangle: "Triangle",
    line: "Line",
    star: "Star",
    polygon: "Polygon",
  };
  const overlay = {
    id: overlayId,
    name: `${shapeNameMap[shapeType] || "Shape"} ${overlayId}`,
    type: shapeType,
    x: 50,
    y: 50,
    width: baseSize.width,
    height: baseSize.height,
    rotation: 0,
    fill: "#ffffff",
    stroke: "#222222",
    strokeWidth: defaultStrokeWidth,
    borderRadius: 0,
    sides: shapeType === "star" ? 5 : shapeType === "polygon" ? 6 : 0,
    opacity: 100,
  };
  state.nextShapeId += 1;
  photo.shapeOverlays.push(overlay);
  ensureLayerOrder(photo);
  applyLayerZIndices(photo);

  setActiveTool("select");
  setSelectedTextIds([]);
  setSelectedShapeIds([overlay.id]);
  renderTextOverlays();
};

const applyToSelectedText = (updater) => {
  const selected = getSelectedTextOverlays();
  if (selected.length === 0) return;
  capturePhotoHistory();
  selected.forEach((overlay) => updater(overlay));
  renderTextOverlays();
};

const applyToSelectedShapes = (updater) => {
  const selected = getSelectedShapeOverlays();
  if (selected.length === 0) return;
  capturePhotoHistory();
  selected.forEach((overlay) => updater(overlay));
  renderTextOverlays();
};

const applyAdjustmentsToPreview = () => {
  const photo = getSelectedPhoto();
  if (!photo) return;

  const compareTarget = state.compareMode ? getCompareTargetPhoto(photo) : null;
  const previewSource = compareTarget || photo;

  mainPreview.src = previewSource.url;
  if (!compareTarget) {
    applyToneFilterLut(photo);
  }
  mainPreview.style.filter = compareTarget ? "none" : buildCompositeFilter(photo);
  mainPreview.style.transform = `rotate(${previewSource.rotation}deg) scale(${state.zoom})`;
  overlayLayer.style.visibility = compareTarget || state.activeTool === "crop" ? "hidden" : "visible";

  sliderIds.forEach((id) => {
    const slider = document.getElementById(id);
    const valueEl = document.getElementById(`${id}Val`);
    slider.value = String(photo.adjustments[id]);
    valueEl.textContent = String(photo.adjustments[id]);
  });

  renderMetadata(photo);
  renderHistogram();
  renderTonePanels();
  syncFilmLookControls();
  syncCompareControls();
  renderTextOverlays();
  renderCropOverlay();
};

const renderFilmstrip = () => {
  filmstrip.innerHTML = "";
  const selectedIds = new Set(getSelectedPhotoIds());
  const selectedPhoto = getSelectedPhoto();

  state.photos.forEach((photo, index) => {
    const thumbItem = document.createElement("div");
    thumbItem.className = "thumb-item";

    const thumb = document.createElement("button");
    thumb.type = "button";
    const isSelected = selectedIds.has(photo.id);
    const isPrimary = selectedPhoto?.id === photo.id;
    thumb.className = `thumb${photo.isPendingGenerated ? " is-pending" : ""}${isSelected ? " selected" : ""}${isPrimary ? " primary" : ""}`;
    if (photo.url) {
      thumb.style.backgroundImage = `url('${photo.url}')`;
    } else {
      thumb.style.backgroundImage = "";
    }
    thumb.title = photo.isPendingGenerated ? "Generating image..." : photo.file.name;
    if (!photo.isPendingGenerated) {
      thumb.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        const additive = event.metaKey
          || event.ctrlKey
          || event.getModifierState?.("Meta")
          || event.getModifierState?.("Control");
        const range = event.shiftKey || event.getModifierState?.("Shift");
        selectPhoto(index, { additive, range });
      });
    } else {
      thumb.disabled = true;
    }

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "thumb-delete";
    deleteBtn.title = `Delete ${photo.file.name}`;
    deleteBtn.ariaLabel = `Delete ${photo.file.name}`;
    deleteBtn.innerHTML = '<i data-lucide="x" aria-hidden="true"></i>';
    deleteBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      removePhoto(index);
    });

    if (photo.isEdited) {
      const editedBadge = document.createElement("span");
      editedBadge.className = "thumb-edited-badge";
      editedBadge.title = "Edited";
      editedBadge.innerHTML = '<i data-lucide="sparkles" aria-hidden="true"></i>';
      thumbItem.appendChild(editedBadge);
    }
    if (photo.isGenerated && photo.isNewGenerated) {
      const generatedBadge = document.createElement("span");
      generatedBadge.className = "thumb-generated-badge";
      generatedBadge.title = "New Generated Image";
      thumbItem.appendChild(generatedBadge);
    }
    if (photo.aiJob?.status) {
      const aiBadge = document.createElement("span");
      aiBadge.className = `thumb-ai-badge${photo.aiJob.status === "processing" ? " is-processing" : ""}${photo.aiJob.status === "failed" ? " is-failed" : ""}`;
      aiBadge.title =
        photo.aiJob.status === "processing"
          ? `Processing ${photo.aiJob.label ? `(${photo.aiJob.label})` : ""}`.trim()
          : photo.aiJob.status === "failed"
            ? "Processing failed"
            : "Processed";
      aiBadge.innerHTML = photo.aiJob.status === "failed"
        ? '<i data-lucide="triangle-alert" aria-hidden="true"></i>'
        : photo.aiJob.status === "done"
          ? '<i data-lucide="check" aria-hidden="true"></i>'
          : '<i data-lucide="loader-circle" aria-hidden="true"></i>';
      thumbItem.appendChild(aiBadge);
    }

    thumbItem.appendChild(thumb);
    thumbItem.appendChild(deleteBtn);
    filmstrip.appendChild(thumbItem);
  });

  hydrateIcons();
  syncFilmstripActionState();
};

const selectPhoto = (index, options = {}) => {
  if (index < 0 || index >= state.photos.length) return;
  const { additive = false, range = false } = options;
  const clicked = state.photos[index];
  let selectedIds = [];
  let primaryId = clicked.id;

  if (range) {
    const anchorIndex = state.photos.findIndex((photo) => photo.id === state.lastSelectedPhotoId);
    const start = Math.min(anchorIndex >= 0 ? anchorIndex : index, index);
    const end = Math.max(anchorIndex >= 0 ? anchorIndex : index, index);
    selectedIds = state.photos.slice(start, end + 1).map((photo) => photo.id);
  } else if (additive) {
    const current = new Set(getSelectedPhotoIds());
    if (current.has(clicked.id)) {
      current.delete(clicked.id);
    } else {
      current.add(clicked.id);
    }
    selectedIds = Array.from(current);
    if (selectedIds.length === 0) {
      selectedIds = [clicked.id];
    }
    primaryId = selectedIds.includes(clicked.id) ? clicked.id : selectedIds[0];
  } else {
    selectedIds = [clicked.id];
  }

  selectedIds = [primaryId, ...selectedIds.filter((id) => id !== primaryId)];
  state.selectedIndex = state.photos.findIndex((photo) => photo.id === primaryId);
  state.selectedPhotoIds = selectedIds.filter((id) => Boolean(getPhotoById(id)));
  state.lastSelectedPhotoId = clicked.id;
  state.compareMode = false;
  setSelectedTextIds([]);
  setSelectedShapeIds([]);
  const photo = getSelectedPhoto();

  if (!photo) return;
  photo.isNewGenerated = false;

  emptyState.classList.add("hidden");
  previewWrap.classList.remove("hidden");

  updateToolAvailability();
  renderMetadata(photo);
  setControlsEnabled(true);
  applyAdjustmentsToPreview();
  renderFilmstrip();
  syncHistoryControls();
};

const loadImageDimensions = (photo) => {
  const img = new Image();
  img.onload = () => {
    photo.width = img.naturalWidth;
    photo.height = img.naturalHeight;
    photo.imgEl = img;

    if (getSelectedPhoto() === photo) {
      renderMetadata(photo);
      renderHistogram();
    }
  };
  img.src = photo.url;
};

const handleFolderUpload = async (event) => {
  const sourceInput = event.target;
  const incomingFiles = Array.from(event.target.files || []).filter((file) => isAllowedUploadFile(file));
  let files = [...incomingFiles];
  const rawSelectionCount = files.filter((file) => isRawUploadFile(file)).length;
  if (rawSelectionCount > 0) {
    const rawAllowed = await ensureRawUploadsAllowed();
    if (!rawAllowed) {
      files = files.filter((file) => !isRawUploadFile(file));
      window.alert("RAW uploads require an active subscription.");
    }
  }
  if (files.length === 0) {
    if (sourceInput) sourceInput.value = "";
    return;
  }

  const decodeChecks = await Promise.all(
    files.map(async (file) => ({
      file,
      decodable: await probeDecodableImageFile(file),
    })),
  );
  const decodableFiles = decodeChecks.filter((item) => item.decodable).map((item) => item.file);
  const rejectedFiles = decodeChecks.filter((item) => !item.decodable).map((item) => item.file);
  const convertedRawFiles = [];
  const unresolvedRejectedFiles = [];
  const rawConversionErrors = [];
  const rawFilesPending = files.filter((file) => isRawUploadFile(file)).length;

  if (rawFilesPending > 0) {
    setRawProcessingState(true, rawFilesPending === 1 ? "Generating Preview..." : "Generating Previews...");
  }

  try {
    for (const rejected of rejectedFiles) {
      if (isRawUploadFile(rejected)) {
        const convertedResult = await convertRawToPreviewFile(rejected);
        if (convertedResult.file) {
          convertedRawFiles.push(convertedResult.file);
          continue;
        }
        rawConversionErrors.push(`${rejected.name}: ${convertedResult.error || "Conversion failed."}`);
      }
      unresolvedRejectedFiles.push(rejected);
    }
  } finally {
    if (rawFilesPending > 0) {
      setRawProcessingState(false);
    }
  }

  const importFiles = [...decodableFiles, ...convertedRawFiles];

  if (importFiles.length === 0) {
    const messageParts = [];
    if (rawConversionErrors.length > 0) {
      messageParts.push(
        "RAW conversion failed:\n" +
          rawConversionErrors
            .slice(0, 5)
            .map((msg) => `- ${msg}`)
            .join("\n"),
      );
    }
    if (unresolvedRejectedFiles.length > 0) {
      messageParts.push(
        "These files could not be opened:\n" +
          unresolvedRejectedFiles
            .slice(0, 5)
            .map((file) => `- ${file.name}`)
            .join("\n"),
      );
    }
    if (messageParts.length > 0) {
      window.alert(messageParts.join("\n\n"));
    }
    if (sourceInput) sourceInput.value = "";
    return;
  }

  const hadPhotos = state.photos.length > 0;
  const newPhotos = importFiles.map((file) => {
    const photo = createPhotoRecord(file);
    loadImageDimensions(photo);
    return photo;
  });

  state.photos.push(...newPhotos);

  if (!hadPhotos) {
    state.selectedIndex = 0;
    state.zoom = 1;
    updateZoomLabel();
    renderFilmstrip();
    selectPhoto(0);
  } else {
    renderFilmstrip();
  }

  if (unresolvedRejectedFiles.length > 0) {
    window.alert(
      `${unresolvedRejectedFiles.length} file(s) were skipped because they could not be decoded.\n\n` +
        unresolvedRejectedFiles
          .slice(0, 5)
          .map((file) => `- ${file.name}`)
          .join("\n"),
    );
  }

  if (rawConversionErrors.length > 0) {
    window.alert(
      "RAW conversion failed for:\n\n" +
        rawConversionErrors
          .slice(0, 5)
          .map((line) => `- ${line}`)
          .join("\n"),
    );
  }

  if (sourceInput) sourceInput.value = "";
};

const clearSelectionUI = () => {
  state.selectedIndex = -1;
  state.selectedPhotoIds = [];
  state.lastSelectedPhotoId = null;
  state.compareMode = false;
  setSelectedTextIds([]);
  setSelectedShapeIds([]);
  closeEditModal();
  closeGenerateModal();
  closePrintModal();
  filmstrip.innerHTML = "";
  previewWrap.classList.add("hidden");
  emptyState.classList.remove("hidden");
  renderMetadata(null);
  setControlsEnabled(false);
  drawEmptyHistogram();
  syncFilmLookControls();
  updateToolAvailability();
  syncCompareControls();
  renderTextOverlays();
  syncFilmstripActionState();
  syncHistoryControls();
};

const removePhoto = (index) => {
  if (index < 0 || index >= state.photos.length) return;

  const removed = state.photos[index];
  const removedId = removed.id;
  disposePhotoResources(removed);
  state.photos.splice(index, 1);
  delete state.photoHistory[removedId];
  state.selectedPhotoIds = state.selectedPhotoIds.filter((id) => id !== removedId);
  if (state.lastSelectedPhotoId === removedId) {
    state.lastSelectedPhotoId = state.selectedPhotoIds[0] ?? null;
  }

  if (state.photos.length === 0) {
    clearSelectionUI();
    return;
  }

  if (index === state.selectedIndex) {
    const prioritizedId = state.selectedPhotoIds[0];
    const prioritizedIndex = prioritizedId != null ? state.photos.findIndex((photo) => photo.id === prioritizedId) : -1;
    const nextIndex = prioritizedIndex >= 0 ? prioritizedIndex : Math.min(index, state.photos.length - 1);
    selectPhoto(nextIndex);
    return;
  }

  if (index < state.selectedIndex) {
    state.selectedIndex -= 1;
  }

  renderFilmstrip();
  syncHistoryControls();
};

const rotateSelected = (delta) => {
  const photo = getSelectedPhoto();
  if (!photo) return;
  capturePhotoHistory(photo);
  photo.rotation = (((photo.rotation + delta) % 360) + 360) % 360;
  applyAdjustmentsToPreview();
};

const resetSelectedRotation = () => {
  const photo = getSelectedPhoto();
  if (!photo) return;
  capturePhotoHistory(photo);
  photo.rotation = 0;
  applyAdjustmentsToPreview();
};

const buildExportFilename = (name) => {
  const dotIndex = name.lastIndexOf(".");
  const base = dotIndex > 0 ? name.slice(0, dotIndex) : name;
  return `${base}-edited.png`;
};

const canvasToBlob = (canvas, type = "image/png", quality) =>
  new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });

const exportSelectedPhoto = async () => {
  const photo = getSelectedPhoto();
  if (!photo || !photo.imgEl) return;

  const source = photo.imgEl;
  const radians = (photo.rotation * Math.PI) / 180;
  const quarterTurns = ((photo.rotation / 90) % 4 + 4) % 4;

  const swapDimensions = quarterTurns % 2 === 1;
  const canvas = document.createElement("canvas");
  canvas.width = swapDimensions ? source.naturalHeight : source.naturalWidth;
  canvas.height = swapDimensions ? source.naturalWidth : source.naturalHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.filter = buildCompositeFilter(photo);
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(radians);
  ctx.drawImage(source, -source.naturalWidth / 2, -source.naturalHeight / 2);

  const blob = await canvasToBlob(canvas, "image/png");
  if (!blob) return;

  const exportName = buildExportFilename(photo.file.name);
  if (typeof window.showSaveFilePicker === "function") {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: exportName,
        types: [
          {
            description: "PNG Image",
            accept: { "image/png": [".png"] },
          },
        ],
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return;
    } catch (error) {
      if (error?.name === "AbortError") return;
    }
  }

  const downloadUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = downloadUrl;
  anchor.download = exportName;
  anchor.click();
  URL.revokeObjectURL(downloadUrl);
  if (!state.hasShownExportFallbackHint) {
    state.hasShownExportFallbackHint = true;
    window.alert("Save dialog is not available in this browser/runtime, so the file was downloaded to your default Downloads location.");
  }
};

const setZoom = (nextZoom) => {
  state.zoom = clamp(nextZoom, 0.2, 4);
  updateZoomLabel();
  applyPreviewTransform();
  if (state.activeTool === "crop") {
    renderCropOverlay();
  }
};

const attachFilmstripResize = () => {
  let startY = 0;
  let startHeight = 0;
  let activePointerId = null;

  const onPointerMove = (event) => {
    if (event.pointerId !== activePointerId) return;
    const delta = startY - event.clientY;
    setFilmstripSize(startHeight + delta);
  };

  const onPointerUp = (event) => {
    if (event.pointerId !== activePointerId) return;
    if (filmstripHandle.hasPointerCapture(activePointerId)) {
      filmstripHandle.releasePointerCapture(activePointerId);
    }
    activePointerId = null;
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
    window.removeEventListener("pointercancel", onPointerUp);
  };

  filmstripHandle.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    activePointerId = event.pointerId;
    startY = event.clientY;
    startHeight = state.filmstripHeight;
    filmstripHandle.setPointerCapture(activePointerId);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
  });
};

const attachWorkspacePanning = () => {
  let startX = 0;
  let startY = 0;
  let startScrollLeft = 0;
  let startScrollTop = 0;
  let pointerId = null;

  const endPan = () => {
    pointerId = null;
    state.isPanningWorkspace = false;
    syncWorkspacePanCursor();
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
    window.removeEventListener("pointercancel", onUp);
  };

  const onMove = (event) => {
    if (event.pointerId !== pointerId) return;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    previewWrap.scrollLeft = startScrollLeft - dx;
    previewWrap.scrollTop = startScrollTop - dy;
  };

  const onUp = (event) => {
    if (event.pointerId !== pointerId) return;
    endPan();
  };

  previewWrap.addEventListener("pointerdown", (event) => {
    if (!getSelectedPhoto()) return;
    const shouldPan = state.isSpacePressed || event.button === 1;
    if (!shouldPan) return;
    event.preventDefault();
    pointerId = event.pointerId;
    startX = event.clientX;
    startY = event.clientY;
    startScrollLeft = previewWrap.scrollLeft;
    startScrollTop = previewWrap.scrollTop;
    state.isPanningWorkspace = true;
    syncWorkspacePanCursor();
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  });
};

const bindTonePanelEvents = () => {
  const snapToneValue = (value) => {
    const points = [0, 32, 64, 96, 128, 160, 192, 224, 255];
    const snapped = points.find((point) => Math.abs(point - value) <= 3);
    return snapped ?? value;
  };

  const getLevelsHandleAtX = (levels, xPx, width) => {
    const targets = [
      { key: "black", value: levels.black },
      { key: "mid", value: levels.mid },
      { key: "white", value: levels.white },
    ];
    let best = null;
    targets.forEach((item) => {
      const px = (item.value / 255) * (width - 1);
      const dist = Math.abs(px - xPx);
      if (!best || dist < best.dist) best = { ...item, dist };
    });
    return best && best.dist <= 18 ? best.key : null;
  };

  const clampLevels = (levels) => {
    levels.black = clamp(Math.round(levels.black), 0, 253);
    levels.mid = clamp(Math.round(levels.mid), levels.black + 1, 254);
    levels.white = clamp(Math.round(levels.white), levels.mid + 1, 255);
  };

  const normalizeCurvePoints = (points) => {
    if (!Array.isArray(points) || points.length < 2) return [{ x: 0, y: 0 }, { x: 255, y: 255 }];
    const sorted = points
      .map((point) => ({
        x: clamp(Math.round(Number(point?.x)), 0, 255),
        y: clamp(Math.round(Number(point?.y)), 0, 255),
      }))
      .filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y))
      .sort((a, b) => a.x - b.x);

    sorted[0] = { x: 0, y: sorted[0].y };
    sorted[sorted.length - 1] = { x: 255, y: sorted[sorted.length - 1].y };
    for (let i = 1; i < sorted.length - 1; i += 1) {
      sorted[i].x = clamp(sorted[i].x, sorted[i - 1].x + 1, 254);
    }
    return sorted.slice(0, 12);
  };

  const getCurrentCurvePoints = (photo) => {
    const channel = photo.adjustments.curvesChannel || "rgb";
    return {
      channel,
      points: photo.adjustments.curvesByChannel[channel],
    };
  };

  levelsChannelSelect?.addEventListener("change", (event) => {
    const photo = getSelectedPhoto();
    if (!photo) return;
    photo.adjustments = cloneAdjustments(photo.adjustments);
    capturePhotoHistory(photo);
    photo.adjustments.levelsChannel = String(event.target.value || "rgb");
    applyAdjustmentsToPreview();
  });

  curvesChannelSelect?.addEventListener("change", (event) => {
    const photo = getSelectedPhoto();
    if (!photo) return;
    photo.adjustments = cloneAdjustments(photo.adjustments);
    capturePhotoHistory(photo);
    photo.adjustments.curvesChannel = String(event.target.value || "rgb");
    applyAdjustmentsToPreview();
  });

  levelsResetBtn?.addEventListener("click", () => {
    const photo = getSelectedPhoto();
    if (!photo) return;
    photo.adjustments = cloneAdjustments(photo.adjustments);
    const channel = photo.adjustments.levelsChannel || "rgb";
    capturePhotoHistory(photo);
    photo.adjustments.levelsByChannel[channel] = { black: 0, mid: 128, white: 255 };
    applyAdjustmentsToPreview();
  });

  curvesResetBtn?.addEventListener("click", () => {
    const photo = getSelectedPhoto();
    if (!photo) return;
    photo.adjustments = cloneAdjustments(photo.adjustments);
    const channel = photo.adjustments.curvesChannel || "rgb";
    capturePhotoHistory(photo);
    photo.adjustments.curvesByChannel[channel] = [{ x: 0, y: 0 }, { x: 128, y: 128 }, { x: 255, y: 255 }];
    applyAdjustmentsToPreview();
  });

  levelsCanvas?.addEventListener("pointerdown", (event) => {
    const photo = getSelectedPhoto();
    if (!photo) return;
    photo.adjustments = cloneAdjustments(photo.adjustments);
    const channel = photo.adjustments.levelsChannel || "rgb";
    const levels = photo.adjustments.levelsByChannel[channel];
    const rect = levelsCanvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * levelsCanvas.width;
    const handle = getLevelsHandleAtX(levels, x, levelsCanvas.width);
    if (!handle) return;
    capturePhotoHistory(photo);
    toneDragState.levelsHandle = handle;
    levelsCanvas.setPointerCapture(event.pointerId);
    event.preventDefault();
  });

  levelsCanvas?.addEventListener("pointermove", (event) => {
    const photo = getSelectedPhoto();
    if (!photo || !toneDragState.levelsHandle) return;
    photo.adjustments = cloneAdjustments(photo.adjustments);
    const channel = photo.adjustments.levelsChannel || "rgb";
    const levels = photo.adjustments.levelsByChannel[channel];
    const rect = levelsCanvas.getBoundingClientRect();
    const x = clamp((event.clientX - rect.left) / rect.width, 0, 1);
    const value = snapToneValue(Math.round(x * 255));
    if (toneDragState.levelsHandle === "black") levels.black = value;
    if (toneDragState.levelsHandle === "mid") levels.mid = value;
    if (toneDragState.levelsHandle === "white") levels.white = value;
    clampLevels(levels);
    applyAdjustmentsToPreview();
  });

  levelsCanvas?.addEventListener("pointerup", () => {
    toneDragState.levelsHandle = null;
  });
  levelsCanvas?.addEventListener("pointercancel", () => {
    toneDragState.levelsHandle = null;
  });

  curvesCanvas?.addEventListener("pointerdown", (event) => {
    const photo = getSelectedPhoto();
    if (!photo) return;
    photo.adjustments = cloneAdjustments(photo.adjustments);
    const { channel, points } = getCurrentCurvePoints(photo);
    const rect = curvesCanvas.getBoundingClientRect();
    const x = clamp(((event.clientX - rect.left) / rect.width) * 255, 0, 255);
    const y = clamp((1 - (event.clientY - rect.top) / rect.height) * 255, 0, 255);
    let best = null;
    points.forEach((point, index) => {
      const px = (point.x / 255) * curvesCanvas.width;
      const py = curvesCanvas.height - (point.y / 255) * curvesCanvas.height;
      const clickX = (x / 255) * curvesCanvas.width;
      const clickY = curvesCanvas.height - (y / 255) * curvesCanvas.height;
      const d = Math.hypot(px - clickX, py - clickY);
      if (!best || d < best.d) best = { index, d };
    });

    if (best && best.d <= 16) {
      capturePhotoHistory(photo);
      toneDragState.curvesHandleIndex = best.index;
      curvesCanvas.setPointerCapture(event.pointerId);
      event.preventDefault();
      return;
    }

    capturePhotoHistory(photo);
    points.push({ x, y });
    photo.adjustments.curvesByChannel[channel] = normalizeCurvePoints(points);
    toneDragState.curvesHandleIndex = photo.adjustments.curvesByChannel[channel].findIndex(
      (point) => Math.abs(point.x - x) <= 1 && Math.abs(point.y - y) <= 1,
    );
    if (toneDragState.curvesHandleIndex < 0) {
      toneDragState.curvesHandleIndex = getCurveSegmentAt(photo.adjustments.curvesByChannel[channel], x);
    }
    curvesCanvas.setPointerCapture(event.pointerId);
    applyAdjustmentsToPreview();
    event.preventDefault();
  });

  curvesCanvas?.addEventListener("pointermove", (event) => {
    const photo = getSelectedPhoto();
    if (!photo || toneDragState.curvesHandleIndex == null) return;
    photo.adjustments = cloneAdjustments(photo.adjustments);
    const { channel, points } = getCurrentCurvePoints(photo);
    const rect = curvesCanvas.getBoundingClientRect();
    const point = points[toneDragState.curvesHandleIndex];
    if (!point) return;

    let nextX = clamp(Math.round(((event.clientX - rect.left) / rect.width) * 255), 0, 255);
    let nextY = clamp(Math.round((1 - (event.clientY - rect.top) / rect.height) * 255), 0, 255);
    nextX = snapToneValue(nextX);
    nextY = snapToneValue(nextY);

    if (toneDragState.curvesHandleIndex === 0) {
      nextX = 0;
    } else if (toneDragState.curvesHandleIndex === points.length - 1) {
      nextX = 255;
    } else {
      const prev = points[toneDragState.curvesHandleIndex - 1];
      const next = points[toneDragState.curvesHandleIndex + 1];
      nextX = clamp(nextX, prev.x + 1, next.x - 1);
    }

    point.x = nextX;
    point.y = nextY;
    photo.adjustments.curvesByChannel[channel] = normalizeCurvePoints(points);
    applyAdjustmentsToPreview();
  });

  curvesCanvas?.addEventListener("dblclick", (event) => {
    const photo = getSelectedPhoto();
    if (!photo) return;
    photo.adjustments = cloneAdjustments(photo.adjustments);
    const { channel, points } = getCurrentCurvePoints(photo);
    const rect = curvesCanvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * curvesCanvas.width;
    const y = ((event.clientY - rect.top) / rect.height) * curvesCanvas.height;
    let best = null;
    points.forEach((point, index) => {
      if (index === 0 || index === points.length - 1) return;
      const px = (point.x / 255) * curvesCanvas.width;
      const py = curvesCanvas.height - (point.y / 255) * curvesCanvas.height;
      const d = Math.hypot(px - x, py - y);
      if (!best || d < best.d) best = { index, d };
    });
    if (!best || best.d > 16) return;
    capturePhotoHistory(photo);
    points.splice(best.index, 1);
    photo.adjustments.curvesByChannel[channel] = normalizeCurvePoints(points);
    applyAdjustmentsToPreview();
  });

  curvesCanvas?.addEventListener("pointerup", () => {
    toneDragState.curvesHandleIndex = null;
  });
  curvesCanvas?.addEventListener("pointercancel", () => {
    toneDragState.curvesHandleIndex = null;
  });
};

photosInput.addEventListener("change", handleFolderUpload);
folderInput.addEventListener("change", handleFolderUpload);
projectInput.addEventListener("change", handleProjectLoad);
saveProjectBtn.addEventListener("click", () => {
  saveProjectToFile().catch((error) => {
    window.alert(error?.message || "Unable to save project.");
  });
});
loadProjectBtn.addEventListener("click", () => projectInput.click());

toolSelectBtn.addEventListener("click", () => setActiveTool("select"));
toolCropBtn.addEventListener("click", () => {
  const photo = getSelectedPhoto();
  if (!photo) return;
  setActiveTool("crop");
});
toolTextBtn.addEventListener("click", () => {
  if (!getSelectedPhoto()) return;
  setActiveTool("text");
  addTextOverlay();
});
toolUploadBtn.addEventListener("click", () => photosInput.click());
toolGenerateBtn.addEventListener("click", () => {
  openGenerateModal();
});
emptyUploadPhotosBtn.addEventListener("click", () => photosInput.click());
emptyUploadFolderBtn.addEventListener("click", () => folderInput.click());
emptyGenerateBtn.addEventListener("click", () => openGenerateModal());

toolShapesBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  if (!getSelectedPhoto()) return;
  const willOpen = shapeFlyout.classList.contains("hidden-panel");
  shapeFlyout.classList.toggle("hidden-panel", !willOpen);
  toolShapesBtn.classList.toggle("is-active", willOpen);
});

toolEditBtn.addEventListener("click", () => {
  if (!getSelectedPhoto()) return;
  openEditModal();
});

filmstripSelectAllBtn.addEventListener("click", () => {
  if (state.photos.length === 0) return;
  const primaryId = getSelectedPhoto()?.id ?? state.photos[0].id;
  const allIds = state.photos.map((photo) => photo.id);
  state.selectedPhotoIds = [primaryId, ...allIds.filter((id) => id !== primaryId)];
  state.selectedIndex = state.photos.findIndex((photo) => photo.id === primaryId);
  state.lastSelectedPhotoId = primaryId;
  renderFilmstrip();
});

filmstripClearSelectionBtn.addEventListener("click", () => {
  if (state.photos.length === 0) return;
  const primaryId = getSelectedPhoto()?.id ?? state.photos[0].id;
  state.selectedPhotoIds = [primaryId];
  state.selectedIndex = state.photos.findIndex((photo) => photo.id === primaryId);
  state.lastSelectedPhotoId = primaryId;
  renderFilmstrip();
});

shapeOptionButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    addShapeOverlay(button.dataset.shapeType);
    shapeFlyout.classList.add("hidden-panel");
    toolShapesBtn.classList.remove("is-active");
  });
});

document.addEventListener("pointerdown", (event) => {
  if (!shapeFlyout.contains(event.target) && event.target !== toolShapesBtn && !toolShapesBtn.contains(event.target)) {
    shapeFlyout.classList.add("hidden-panel");
    toolShapesBtn.classList.remove("is-active");
  }
});

toolPrintBtn.addEventListener("click", () => {
  window.print();
});
toolLibraryBtn?.addEventListener("click", () => {
  void openLibraryModal();
});
toolSettingsBtn?.addEventListener("click", () => {
  closeLibraryModal();
  openSettingsModal();
});

cropAspectSelect?.addEventListener("change", (event) => {
  state.cropAspect = String(event.target.value || "original");
  const bounds = getImageBoundsInPreview();
  if (!bounds || !state.cropRect) return;
  const aspect = getCropAspectRatio();
  state.cropRect = fitCropRectToAspect(state.cropRect, bounds, aspect);
  renderCropOverlay();
});

const handleCropCustomRatioInput = () => {
  if (state.activeTool !== "crop") return;
  const bounds = getImageBoundsInPreview();
  if (!bounds || !state.cropRect) return;
  const aspect = getCropAspectRatio();
  state.cropRect = fitCropRectToAspect(state.cropRect, bounds, aspect);
  renderCropOverlay();
};

cropCustomWidth?.addEventListener("input", handleCropCustomRatioInput);
cropCustomHeight?.addEventListener("input", handleCropCustomRatioInput);

cropRotateLeftBtn?.addEventListener("click", () => {
  rotateSelected(-90);
  if (state.activeTool === "crop") initializeCropRect();
});

cropRotateRightBtn?.addEventListener("click", () => {
  rotateSelected(90);
  if (state.activeTool === "crop") initializeCropRect();
});

cropResetRotationBtn?.addEventListener("click", () => {
  resetSelectedRotation();
  if (state.activeTool === "crop") initializeCropRect();
});

cropCancelBtn?.addEventListener("click", () => {
  setActiveTool("select");
});

cropApplyBtn?.addEventListener("click", async () => {
  cropApplyBtn.disabled = true;
  try {
    await applyCropToSelectedPhoto();
  } catch (error) {
    window.alert(error?.message || "Unable to crop photo.");
  } finally {
    cropApplyBtn.disabled = false;
  }
});

cropBox?.addEventListener("pointerdown", (event) => {
  if (state.activeTool !== "crop" || !state.cropRect) return;
  event.preventDefault();
  event.stopPropagation();
  const target = event.target;
  const handle = target?.dataset?.cropHandle || "move";
  state.cropDrag = {
    mode: handle,
    startX: event.clientX,
    startY: event.clientY,
    startRect: { ...state.cropRect },
  };
  cropBox.setPointerCapture(event.pointerId);
});

cropBox?.addEventListener("pointermove", (event) => {
  if (!state.cropDrag) return;
  updateCropRectFromPointer(event);
});

const endCropDrag = (event) => {
  if (!state.cropDrag || !cropBox) return;
  if (cropBox.hasPointerCapture(event.pointerId)) {
    cropBox.releasePointerCapture(event.pointerId);
  }
  state.cropDrag = null;
};

cropBox?.addEventListener("pointerup", endCropDrag);
cropBox?.addEventListener("pointercancel", endCropDrag);
previewWrap?.addEventListener("scroll", () => {
  if (state.activeTool === "crop") renderCropOverlay();
});
window.addEventListener("resize", () => {
  if (state.activeTool === "crop") renderCropOverlay();
});
orderPrintBtn.addEventListener("click", () => {
  if (!getSelectedPhoto()) return;
  openWallartModal().catch((error) => {
    window.alert(error?.message || "Unable to open Wallart checkout.");
  });
});
creditsBtn.addEventListener("click", () => {
  if (state.credits <= 0) {
    openCreditsModal({ depleted: true, context: "status" });
    return;
  }
  openCreditsModal({ depleted: false, context: "status" });
});

compareBtn.addEventListener("click", () => {
  const photo = getSelectedPhoto();
  if (!photo?.isEdited) return;
  state.compareMode = !state.compareMode;
  applyAdjustmentsToPreview();
});

editModalCloseBtn.addEventListener("click", closeEditModal);
editCancelBtn.addEventListener("click", closeEditModal);
editSubmitBtn.addEventListener("click", submitEditRequest);
editModal.addEventListener("pointerdown", (event) => {
  if (event.target === editModal) {
    closeEditModal();
  }
});
editPromptInput.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
    event.preventDefault();
    submitEditRequest();
  }
});

generateModalCloseBtn.addEventListener("click", closeGenerateModal);
generateCancelBtn.addEventListener("click", closeGenerateModal);
generateSubmitBtn.addEventListener("click", submitGenerateRequest);
generateModal.addEventListener("pointerdown", (event) => {
  if (event.target === generateModal) {
    closeGenerateModal();
  }
});
generatePromptInput.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
    event.preventDefault();
    submitGenerateRequest();
  }
});
printModalCloseBtn.addEventListener("click", closePrintModal);
printCancelBtn.addEventListener("click", closePrintModal);
printSubmitBtn.addEventListener("click", submitPeechoPrintOrder);
printModal.addEventListener("pointerdown", (event) => {
  if (event.target === printModal) {
    closePrintModal();
  }
});
wallartModalCloseBtn?.addEventListener("click", closeWallartModal);
wallartCancelBtn?.addEventListener("click", closeWallartModal);
wallartContinueBtn?.addEventListener("click", async () => {
  wallartContinueBtn.disabled = true;
  if (wallartPrintspaceBtn) {
    wallartPrintspaceBtn.disabled = true;
  }
  if (wallartStatus) {
    wallartStatus.textContent = "Opening checkout...";
  }
  try {
    await beginCanvasPopWallartOrder();
  } catch (error) {
    window.alert(error?.message || "Unable to start Wallart checkout.");
    if (wallartStatus) {
      wallartStatus.textContent = "Unable to open checkout. Please try again.";
    }
  } finally {
    wallartContinueBtn.disabled = false;
    if (wallartPrintspaceBtn) {
      wallartPrintspaceBtn.disabled = false;
    }
  }
});
wallartPrintspaceBtn?.addEventListener("click", async () => {
  wallartPrintspaceBtn.disabled = true;
  if (wallartContinueBtn) {
    wallartContinueBtn.disabled = true;
  }
  if (wallartStatus) {
    wallartStatus.textContent = "Opening PrintSpace checkout...";
  }
  try {
    await beginPrintSpaceWallartOrder();
  } catch (error) {
    window.alert(error?.message || "Unable to start PrintSpace checkout.");
    if (wallartStatus) {
      wallartStatus.textContent = "Unable to open PrintSpace checkout. Please try again.";
    }
  } finally {
    wallartPrintspaceBtn.disabled = false;
    if (wallartContinueBtn) {
      wallartContinueBtn.disabled = false;
    }
  }
});
wallartModal?.addEventListener("pointerdown", (event) => {
  if (event.target === wallartModal) {
    closeWallartModal();
  }
});

creditsModalCloseBtn?.addEventListener("click", closeCreditsModal);
creditsModalBuyBtn?.addEventListener("click", async () => {
  creditsModalBuyBtn.disabled = true;
  try {
    await beginStripeCheckout("topup");
  } catch (error) {
    window.alert(error?.message || "Unable to open checkout.");
  } finally {
    creditsModalBuyBtn.disabled = false;
  }
});
creditsModal?.addEventListener("pointerdown", (event) => {
  if (event.target === creditsModal) {
    closeCreditsModal();
  }
});

settingsModalCloseBtn?.addEventListener("click", closeSettingsModal);
settingsManageSubscriptionBtn?.addEventListener("click", async () => {
  settingsManageSubscriptionBtn.disabled = true;
  try {
    await beginStripeBillingPortal();
  } catch (error) {
    window.alert(error?.message || "Unable to open billing portal.");
  } finally {
    settingsManageSubscriptionBtn.disabled = false;
  }
});
settingsBuyCreditsBtn?.addEventListener("click", async () => {
  settingsBuyCreditsBtn.disabled = true;
  try {
    await beginStripeCheckout("topup");
  } catch (error) {
    window.alert(error?.message || "Unable to open checkout.");
  } finally {
    settingsBuyCreditsBtn.disabled = false;
  }
});
settingsHelpBtn?.addEventListener("click", () => {
  window.open("/help", "_blank", "noopener,noreferrer");
});
settingsShareBtn?.addEventListener("click", () => {
  const subject = encodeURIComponent("Check out DarkroomX");
  const body = encodeURIComponent("Check out DarkroomX: https://www.darkroomx.com");
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
});
settingsProjectRefreshBtn?.addEventListener("click", async () => {
  settingsProjectRefreshBtn.disabled = true;
  setSettingsProjectsStatus("Refreshing...");
  try {
    await refreshProjectsFromCloud();
    setSettingsProjectsStatus("Projects refreshed.");
  } catch (error) {
    setSettingsProjectsStatus(error?.message || "Unable to refresh projects.");
  } finally {
    settingsProjectRefreshBtn.disabled = false;
  }
});
settingsProjectSaveBtn?.addEventListener("click", async () => {
  settingsProjectSaveBtn.disabled = true;
  setSettingsProjectsStatus("Saving project...");
  try {
    await saveCurrentSessionToCloudProject();
  } catch (error) {
    setSettingsProjectsStatus(error?.message || "Unable to save project.");
  } finally {
    settingsProjectSaveBtn.disabled = false;
  }
});
settingsProjectNewBtn?.addEventListener("click", async () => {
  settingsProjectNewBtn.disabled = true;
  setSettingsProjectsStatus("Creating new project...");
  try {
    await createFreshCloudProject();
  } catch (error) {
    setSettingsProjectsStatus(error?.message || "Unable to create project.");
  } finally {
    settingsProjectNewBtn.disabled = false;
  }
});
settingsModal?.addEventListener("pointerdown", (event) => {
  if (event.target === settingsModal) {
    closeSettingsModal();
  }
});
settingsModal?.addEventListener("keydown", (event) => {
  if (settingsModal.classList.contains("hidden-panel")) return;
  if (event.key === "Escape") {
    event.preventDefault();
    closeSettingsModal();
    return;
  }
  if ((event.key === "ArrowDown" || event.key === "ArrowUp") && settingsLinkButtons.length > 0) {
    const currentIndex = settingsLinkButtons.indexOf(document.activeElement);
    if (currentIndex < 0) return;
    event.preventDefault();
    const nextIndex =
      event.key === "ArrowDown"
        ? (currentIndex + 1) % settingsLinkButtons.length
        : (currentIndex - 1 + settingsLinkButtons.length) % settingsLinkButtons.length;
    settingsLinkButtons[nextIndex]?.focus();
  }
});
libraryModalCloseBtn?.addEventListener("click", closeLibraryModal);
libraryModal?.addEventListener("pointerdown", (event) => {
  if (event.target === libraryModal) {
    closeLibraryModal();
  }
});
libraryModal?.addEventListener("keydown", (event) => {
  if (libraryModal.classList.contains("hidden-panel")) return;
  if (event.key === "Escape") {
    event.preventDefault();
    closeLibraryModal();
  }
});

trialLockSubscribeBtn?.addEventListener("click", async () => {
  trialLockSubscribeBtn.disabled = true;
  try {
    await beginStripeCheckout("subscription");
  } catch (error) {
    window.alert(error?.message || "Unable to open checkout.");
  } finally {
    trialLockSubscribeBtn.disabled = false;
  }
});

trialLockRefreshBtn?.addEventListener("click", async () => {
  trialLockRefreshBtn.disabled = true;
  try {
    const status = await fetchAccessStatus();
    applyAccessStatus(status);
    if (!state.trialLocked) {
      window.alert("Subscription active. Welcome back.");
    }
  } catch (error) {
    window.alert(error?.message || "Unable to refresh subscription status.");
  } finally {
    trialLockRefreshBtn.disabled = false;
  }
});

overlayLayer.addEventListener("pointerdown", (event) => {
  if (state.isSpacePressed) return;
  if (state.activeTool !== "select") return;
  if (event.target !== overlayLayer) return;
  setSelectedTextIds([]);
  setSelectedShapeIds([]);
  renderTextOverlays();
});

textFontFamily.addEventListener("change", (event) => {
  applyToSelectedText((overlay) => {
    overlay.fontFamily = event.target.value;
  });
});

textFontWeight.addEventListener("change", (event) => {
  applyToSelectedText((overlay) => {
    overlay.fontWeight = Number(event.target.value);
  });
});

textFontStyle.addEventListener("change", (event) => {
  applyToSelectedText((overlay) => {
    overlay.fontStyle = event.target.value;
  });
});

textAlign.addEventListener("change", (event) => {
  applyToSelectedText((overlay) => {
    overlay.textAlign = event.target.value;
  });
});

textFontSize.addEventListener("input", (event) => {
  const value = Number(event.target.value);
  textFontSizeVal.textContent = String(value);
  applyToSelectedText((overlay) => {
    overlay.fontSize = value;
  });
});

textLetterSpacing.addEventListener("input", (event) => {
  const value = Number(event.target.value);
  textLetterSpacingVal.textContent = String(value);
  applyToSelectedText((overlay) => {
    overlay.letterSpacing = value;
  });
});

textWordSpacing.addEventListener("input", (event) => {
  const value = Number(event.target.value);
  textWordSpacingVal.textContent = String(value);
  applyToSelectedText((overlay) => {
    overlay.wordSpacing = value;
  });
});

textLineHeight.addEventListener("input", (event) => {
  const value = Number(event.target.value) / 100;
  textLineHeightVal.textContent = value.toFixed(2);
  applyToSelectedText((overlay) => {
    overlay.lineHeight = value;
  });
});

textRotation.addEventListener("input", (event) => {
  const value = Number(event.target.value);
  textRotationVal.textContent = String(value);
  applyToSelectedText((overlay) => {
    overlay.rotation = value;
  });
});

textOpacity.addEventListener("input", (event) => {
  const value = Number(event.target.value);
  textOpacityVal.textContent = String(value);
  applyToSelectedText((overlay) => {
    overlay.opacity = value;
  });
});

textColor.addEventListener("input", (event) => {
  applyToSelectedText((overlay) => {
    overlay.color = event.target.value;
  });
});

shapeFillColor.addEventListener("input", (event) => {
  applyToSelectedShapes((overlay) => {
    overlay.fill = event.target.value;
  });
});

shapeStrokeColor.addEventListener("input", (event) => {
  applyToSelectedShapes((overlay) => {
    overlay.stroke = event.target.value;
  });
});

shapeStrokeWidth.addEventListener("input", (event) => {
  const value = Number(event.target.value);
  shapeStrokeWidthVal.textContent = String(value);
  applyToSelectedShapes((overlay) => {
    overlay.strokeWidth = value;
  });
});

shapeBorderRadius.addEventListener("input", (event) => {
  const value = Number(event.target.value);
  shapeBorderRadiusVal.textContent = String(value);
  applyToSelectedShapes((overlay) => {
    overlay.borderRadius = value;
  });
});

shapeOpacity.addEventListener("input", (event) => {
  const value = Number(event.target.value);
  shapeOpacityVal.textContent = String(value);
  applyToSelectedShapes((overlay) => {
    overlay.opacity = value;
  });
});

shapeRotation.addEventListener("input", (event) => {
  const value = Number(event.target.value);
  shapeRotationVal.textContent = String(value);
  applyToSelectedShapes((overlay) => {
    overlay.rotation = value;
  });
});

shapeSides.addEventListener("input", (event) => {
  const value = Number(event.target.value);
  shapeSidesVal.textContent = String(value);
  applyToSelectedShapes((overlay) => {
    if (overlay.type === "star" || overlay.type === "polygon") {
      overlay.sides = value;
    }
  });
});

filmLookSelect.addEventListener("change", (event) => {
  const photo = getSelectedPhoto();
  if (!photo) return;
  capturePhotoHistory(photo);
  photo.filmLookId = event.target.value;
  applyAdjustmentsToPreview();
});

filmLookStrength.addEventListener("input", (event) => {
  const photo = getSelectedPhoto();
  if (!photo) return;
  capturePhotoHistory(photo);
  photo.filmLookStrength = Number(event.target.value);
  filmLookStrengthVal.textContent = String(photo.filmLookStrength);
  applyAdjustmentsToPreview();
});

filmLookResetBtn.addEventListener("click", () => {
  const photo = getSelectedPhoto();
  if (!photo) return;
  capturePhotoHistory(photo);
  photo.filmLookId = "none";
  photo.filmLookStrength = 100;
  applyAdjustmentsToPreview();
});

const attachKeyboardNudging = () => {
  window.addEventListener("keydown", (event) => {
    const active = document.activeElement;
    const inTextField =
      active &&
      (active.tagName === "INPUT" ||
        active.tagName === "TEXTAREA" ||
        active.tagName === "SELECT" ||
        active.isContentEditable);

    const isUndo = (event.metaKey || event.ctrlKey) && !event.shiftKey && event.key.toLowerCase() === "z";
    const isRedo =
      (event.metaKey || event.ctrlKey) &&
      (event.key.toLowerCase() === "y" || (event.shiftKey && event.key.toLowerCase() === "z"));
    if (!inTextField && isUndo) {
      event.preventDefault();
      undoPhotoChange();
      return;
    }
    if (!inTextField && isRedo) {
      event.preventDefault();
      redoPhotoChange();
      return;
    }

    if (inTextField) return;

    if (event.code === "Space") {
      state.isSpacePressed = true;
      syncWorkspacePanCursor();
      event.preventDefault();
    }
    if (state.activeTool === "crop") {
      if (event.key === "Escape") {
        event.preventDefault();
        setActiveTool("select");
      } else if (event.key === "Enter") {
        event.preventDefault();
        void applyCropToSelectedPhoto();
      }
      return;
    }
    if (state.activeTool !== "select") return;

    const selectedText = getSelectedTextOverlays();
    const selectedShapes = getSelectedShapeOverlays();
    if (selectedText.length === 0 && selectedShapes.length === 0) return;

    let dx = 0;
    let dy = 0;
    const step = event.shiftKey ? 2 : 0.5;

    if (event.key === "ArrowLeft") dx = -step;
    if (event.key === "ArrowRight") dx = step;
    if (event.key === "ArrowUp") dy = -step;
    if (event.key === "ArrowDown") dy = step;

    if (dx !== 0 || dy !== 0) {
      event.preventDefault();
      capturePhotoHistory();
      selectedText.forEach((overlay) => {
        overlay.x = clamp(overlay.x + dx, 0, 100);
        overlay.y = clamp(overlay.y + dy, 0, 100);
      });
      selectedShapes.forEach((overlay) => {
        overlay.x = clamp(overlay.x + dx, 0, 100);
        overlay.y = clamp(overlay.y + dy, 0, 100);
      });
      renderTextOverlays();
      return;
    }

    if (event.key === "Backspace" || event.key === "Delete") {
      event.preventDefault();
      deleteSelectedTextOverlays();
      deleteSelectedShapeOverlays();
    }
  });
  window.addEventListener("keyup", (event) => {
    if (event.code === "Space") {
      state.isSpacePressed = false;
      syncWorkspacePanCursor();
    }
  });
};

sliderIds.forEach((id) => {
  const slider = document.getElementById(id);
  const valueEl = document.getElementById(`${id}Val`);

  slider.addEventListener("input", (event) => {
    const photo = getSelectedPhoto();
    if (!photo) return;

    capturePhotoHistory(photo);
    const value = Number(event.target.value);
    photo.adjustments[id] = value;
    valueEl.textContent = String(value);
    applyAdjustmentsToPreview();
  });

  slider.addEventListener("dblclick", () => {
    const photo = getSelectedPhoto();
    if (!photo) return;

    capturePhotoHistory(photo);
    const defaultValue = defaultAdjustments[id];
    photo.adjustments[id] = defaultValue;
    slider.value = String(defaultValue);
    valueEl.textContent = String(defaultValue);
    applyAdjustmentsToPreview();
  });
});

rotateLeftBtn.addEventListener("click", () => rotateSelected(-90));
rotateRightBtn.addEventListener("click", () => rotateSelected(90));
resetRotationBtn.addEventListener("click", resetSelectedRotation);
exportTopBtn.addEventListener("click", exportSelectedPhoto);
zoomInBtn.addEventListener("click", () => setZoom(state.zoom + 0.1));
zoomOutBtn.addEventListener("click", () => setZoom(state.zoom - 0.1));
zoomResetBtn.addEventListener("click", () => setZoom(1));
undoBtn.addEventListener("click", undoPhotoChange);
redoBtn.addEventListener("click", redoPhotoChange);

resetBtn.addEventListener("click", () => {
  const photo = getSelectedPhoto();
  if (!photo) return;
  capturePhotoHistory(photo);
  photo.adjustments = cloneAdjustments(defaultAdjustments);
  applyAdjustmentsToPreview();
});

setControlsEnabled(false);
drawEmptyHistogram();
renderTonePanels();
loadCredits();
updateZoomLabel();
setFilmstripSize(state.filmstripHeight);
attachFilmstripResize();
attachWorkspacePanning();
attachKeyboardNudging();
bindTonePanelEvents();
populateFilmLookOptions();
syncFilmLookControls();
populateSystemFonts();
setActiveTool("select");
updateToolAvailability();
syncCompareControls();
renderTextOverlays();
setEditSubmitState(false);
setGenerateSubmitState(false);
setPrintSubmitState(false);
syncFilmstripActionState();
syncHistoryControls();
syncWorkspacePanCursor();
syncCreditsUI();
loadStoredProjectMeta();
ensureAppSessionStartedAt();
hydrateIcons();
startAccessStatusPolling();
startCloudAutosave();
void (async () => {
  const restoredFromCloud = await restoreLastActiveProjectOnStartup();
  if (!restoredFromCloud) {
    await restoreRecoveredSessionIfAvailable();
  }
})();

window.addEventListener("beforeunload", () => {
  void runCloudAutosave();
  void persistSessionRecoverySnapshot();
});
