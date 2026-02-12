const imageInput = document.getElementById('image-input');
const cropButton = document.getElementById('crop-btn');
const resetButton = document.getElementById('reset-btn');
const downloadButton = document.getElementById('download-btn');
const statusText = document.getElementById('status-text');
const canvas = document.getElementById('crop-canvas');
const ctx = canvas.getContext('2d');

const image = new Image();
let imageLoaded = false;
let isDragging = false;
let startX = 0;
let startY = 0;
let currentRect = null;
let baseImageData = null;

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
    setStatus('Σύρε πάνω στην εικόνα για να επιλέξεις περιοχή crop.');
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
    setStatus('Η επιλογή είναι πολύ μικρή. Δοκίμασε ξανά.');
    return;
  }
  setStatus('Πάτησε Crop για να κόψεις την επιλεγμένη περιοχή.');
});

cropButton.addEventListener('click', () => {
  if (!currentRect || !imageLoaded) {
    setStatus('Επίλεξε πρώτα περιοχή πάνω στην εικόνα.');
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
  setStatus('Το crop ολοκληρώθηκε. Μπορείς να κατεβάσεις την εικόνα.');
});

resetButton.addEventListener('click', () => {
  if (!imageLoaded) {
    return;
  }
  currentRect = null;
  drawImageAndStore();
  downloadButton.disabled = true;
  setStatus('Έγινε reset στην αρχική εικόνα.');
});

downloadButton.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'cropped-image.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});
