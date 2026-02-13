const imageInput = document.getElementById('image-input');
const cropButton = document.getElementById('crop-btn');
const resetButton = document.getElementById('reset-btn');
const downloadButton = document.getElementById('download-btn');
const statusText = document.getElementById('status-text');
const canvas = document.getElementById('crop-canvas');
const ctx = canvas.getContext('2d');

const HUB_SETTINGS_KEY = 'hub_settings_data';

let currentLanguage = 'en';
const image = new Image();
let imageLoaded = false;
let isDragging = false;
let startX = 0;
let startY = 0;
let currentRect = null;
let baseImageData = null;

const TRANSLATIONS = {
  en: {
    title: 'Crop Image',
    crop: 'Crop',
    reset: 'Reset',
    download: 'Download',
    initialStatus: 'Load an image and drag on canvas to select crop area.',
    selectAreaStatus: 'Drag on image to select crop area.',
    tooSmall: 'Selection is too small. Try again.',
    pressCrop: 'Press Crop to cut the selected area.',
    selectFirst: 'Select an area on the image first.',
    cropDone: 'Crop completed. You can now download the image.',
    resetDone: 'Image reset to original.',
  },
  el: {
    title: 'Περικοπή Εικόνας',
    crop: 'Περικοπή',
    reset: 'Επαναφορά',
    download: 'Λήψη',
    initialStatus: 'Φόρτωσε εικόνα και σύρε στο canvas για να ορίσεις περιοχή περικοπής.',
    selectAreaStatus: 'Σύρε πάνω στην εικόνα για να επιλέξεις περιοχή περικοπής.',
    tooSmall: 'Η επιλογή είναι πολύ μικρή. Δοκίμασε ξανά.',
    pressCrop: 'Πάτησε Περικοπή για να κόψεις την επιλεγμένη περιοχή.',
    selectFirst: 'Επέλεξε πρώτα περιοχή πάνω στην εικόνα.',
    cropDone: 'Η περικοπή ολοκληρώθηκε. Μπορείς τώρα να κατεβάσεις την εικόνα.',
    resetDone: 'Η εικόνα επανήλθε στην αρχική κατάσταση.',
  },
};

function getLanguageFromSettings() {
  const rawSettings = localStorage.getItem(HUB_SETTINGS_KEY);
  if (!rawSettings) {
    return 'en';
  }

  try {
    const settings = JSON.parse(rawSettings);
    return settings.language === 'el' ? 'el' : 'en';
  } catch {
    return 'en';
  }
}

function t() {
  return TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
}

function applyLanguage() {
  const translation = t();
  document.documentElement.lang = currentLanguage;

  const title = document.getElementById('crop-title');
  if (title) {
    title.textContent = translation.title;
  }

  cropButton.textContent = translation.crop;
  resetButton.textContent = translation.reset;
  downloadButton.textContent = translation.download;
}

function setStatus(text) {
  statusText.textContent = text;
}

function drawImageAndStore() {
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0);
  baseImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function redrawBase() {
  if (!baseImageData) {
    return;
  }
  ctx.putImageData(baseImageData, 0, 0);
}

function drawSelection(rect) {
  redrawBase();
  ctx.strokeStyle = '#0d6efd';
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 4]);
  ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
  ctx.setLineDash([]);
}

function getCanvasPoint(event) {
  const bounds = canvas.getBoundingClientRect();
  const scaleX = canvas.width / bounds.width;
  const scaleY = canvas.height / bounds.height;
  return {
    x: (event.clientX - bounds.left) * scaleX,
    y: (event.clientY - bounds.top) * scaleY,
  };
}

function normalizeRect(x1, y1, x2, y2) {
  const x = Math.min(x1, x2);
  const y = Math.min(y1, y2);
  const w = Math.abs(x2 - x1);
  const h = Math.abs(y2 - y1);
  return { x, y, w, h };
}

imageInput.addEventListener('change', (event) => {
  const file = event.target.files && event.target.files[0];
  if (!file) {
    return;
  }

  const objectUrl = URL.createObjectURL(file);
  image.onload = () => {
    imageLoaded = true;
    currentRect = null;
    drawImageAndStore();
    cropButton.disabled = false;
    resetButton.disabled = false;
    downloadButton.disabled = true;
    setStatus(t().selectAreaStatus);
    URL.revokeObjectURL(objectUrl);
  };
  image.src = objectUrl;
});

canvas.addEventListener('mousedown', (event) => {
  if (!imageLoaded) {
    return;
  }
  isDragging = true;
  const point = getCanvasPoint(event);
  startX = point.x;
  startY = point.y;
  currentRect = null;
});

canvas.addEventListener('mousemove', (event) => {
  if (!isDragging || !imageLoaded) {
    return;
  }
  const point = getCanvasPoint(event);
  const rect = normalizeRect(startX, startY, point.x, point.y);
  currentRect = rect;
  drawSelection(rect);
});

window.addEventListener('mouseup', () => {
  if (!isDragging) {
    return;
  }
  isDragging = false;
  if (!currentRect || currentRect.w < 2 || currentRect.h < 2) {
    currentRect = null;
    redrawBase();
    setStatus(t().tooSmall);
    return;
  }
  setStatus(t().pressCrop);
});

cropButton.addEventListener('click', () => {
  if (!currentRect || !imageLoaded) {
    setStatus(t().selectFirst);
    return;
  }

  const rect = {
    x: Math.round(currentRect.x),
    y: Math.round(currentRect.y),
    w: Math.round(currentRect.w),
    h: Math.round(currentRect.h),
  };

  const cropped = document.createElement('canvas');
  cropped.width = rect.w;
  cropped.height = rect.h;
  const croppedCtx = cropped.getContext('2d');
  croppedCtx.drawImage(canvas, rect.x, rect.y, rect.w, rect.h, 0, 0, rect.w, rect.h);

  canvas.width = rect.w;
  canvas.height = rect.h;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(cropped, 0, 0);

  baseImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  currentRect = null;
  downloadButton.disabled = false;
  setStatus(t().cropDone);
});

resetButton.addEventListener('click', () => {
  if (!imageLoaded) {
    return;
  }
  currentRect = null;
  drawImageAndStore();
  downloadButton.disabled = true;
  setStatus(t().resetDone);
});

downloadButton.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'cropped-image.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});

currentLanguage = getLanguageFromSettings();
applyLanguage();
setStatus(t().initialStatus);
