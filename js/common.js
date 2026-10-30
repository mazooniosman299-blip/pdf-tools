// Common utilities for PDF Tools site
// Optimized for performance and privacy (all processing client-side)

function formatFileSize(bytes) {
  if (bytes === 0) return '0 بايت';
  const k = 1024;
  const sizes = ['بايت', 'ك.ب', 'م.ب', 'ج.ب'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function showStatus(elementId, message, type = 'info') {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.className = 'status ' + type;
  el.textContent = message;
  el.style.display = 'block';
}

function hideStatus(elementId) {
  const el = document.getElementById(elementId);
  if (el) {
    el.style.display = 'none';
    el.className = 'status';
  }
}

function setProgress(percent) {
  const bar = document.getElementById('progressBar');
  const fill = document.getElementById('progressFill');
  if (bar && fill) {
    bar.classList.add('active');
    fill.style.width = percent + '%';
    if (percent >= 100) {
      setTimeout(() => {
        bar.classList.remove('active');
        fill.style.width = '0%';
      }, 800);
    }
  }
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Drag & drop setup
function setupDropZone(dropZoneId, fileInputId, onFilesSelected, multiple = true) {
  const dropZone = document.getElementById(dropZoneId);
  const fileInput = document.getElementById(fileInputId);
  if (!dropZone || !fileInput) return;

  dropZone.addEventListener('click', () => fileInput.click());

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    const files = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf') || f.type.startsWith('image/'));
    if (files.length) onFilesSelected(files);
  });

  fileInput.addEventListener('change', () => {
    const files = Array.from(fileInput.files);
    if (files.length) onFilesSelected(files);
    fileInput.value = '';
  });
}

// Mobile menu
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('active');
    });
  }

  // FAQ accordion
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      q.parentElement.classList.toggle('open');
    });
  });
});

// Lazy load pdf-lib and pdf.js when needed
let pdfLibLoaded = false;
let pdfjsLoaded = false;

async function loadPdfLib() {
  if (pdfLibLoaded) return window.PDFLib;
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js';
    script.onload = () => {
      pdfLibLoaded = true;
      resolve(window.PDFLib);
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function loadPdfJs() {
  if (pdfjsLoaded) return window.pdfjsLib;
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      pdfjsLoaded = true;
      resolve(window.pdfjsLib);
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}
