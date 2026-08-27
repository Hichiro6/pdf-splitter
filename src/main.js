/**
 * PDF Splitter — Main Application
 * Features: Upload PDF, parse page count, define ranges, split into multiple PDFs, download ZIP
 * 100% client-side using pdf-lib + pdfjs-dist
 */

import '../styles/main.css';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { PDFDocument } from 'pdf-lib';
import { t, initI18n, getCurrentLanguage } from './i18n.js';

// Application state
const state = {
  files: [], // Array of { id, file, name, pageCount, ranges: [{start, end}], previews: [] }
  nextId: 1,
  isProcessing: false,
  previewCanvases: [],
};

// DOM elements
const elements = {};

/**
 * Initialize application
 */
async function init() {
  initI18n();
  cacheElements();
  bindEvents();
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
  setupCollapseToggle();
  console.log('✅ PDF Splitter initialized');
}

/**
 * Cache DOM elements
 */
function cacheElements() {
  elements.dropzone = document.getElementById('dropzone');
  elements.fileInput = document.getElementById('file-input');
  elements.fileList = document.getElementById('file-list');
  elements.splitBtn = document.getElementById('btn-split');
  elements.resetBtn = document.getElementById('btn-reset');
  elements.srLive = document.getElementById('sr-live');
  elements.previewContainer = document.getElementById('preview-container');
  elements.previewArea = document.getElementById('preview-area');
  elements.previewFilename = document.getElementById('preview-filename');
  elements.splitControlGroup = document.getElementById('split-control-group');
}

/**
 * Setup collapse/expand functionality for control groups
 */
function setupCollapseToggle() {
  const title = elements.splitControlGroup?.querySelector('.control-group__title');
  const body = elements.splitControlGroup?.querySelector('.control-group__body');
  if (!title || !body) return;

  title.addEventListener('click', () => {
    const isExpanded = title.getAttribute('aria-expanded') === 'true';
    title.setAttribute('aria-expanded', !isExpanded);
    body.classList.toggle('collapsed', isExpanded);
  });
}

/**
 * Bind event listeners
 */
function bindEvents() {
  // Dropzone
  elements.dropzone.addEventListener('click', () => elements.fileInput.click());
  elements.dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    elements.dropzone.classList.add('--active');
  });
  elements.dropzone.addEventListener('dragleave', () => {
    elements.dropzone.classList.remove('--active');
  });
  elements.dropzone.addEventListener('drop', handleDrop);
  elements.fileInput.addEventListener('change', handleFileSelect);

  // Buttons
  elements.splitBtn.addEventListener('click', handleSplit);
  elements.resetBtn.addEventListener('click', resetAll);
}

/**
 * Handle file drop
 */
function handleDrop(e) {
  e.preventDefault();
  elements.dropzone.classList.remove('--active');
  const files = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf');
  if (files.length > 0) loadFiles(files);
}

/**
 * Handle file selection
 */
function handleFileSelect(e) {
  const files = Array.from(e.target.files).filter(f => f.type === 'application/pdf');
  if (files.length > 0) loadFiles(files);
  elements.fileInput.value = '';
}

/**
 * Load multiple PDF files
 */
async function loadFiles(newFiles) {
  for (const file of newFiles) {
    try {
      const pageCount = await getPdfPageCount(file);
      const fileId = `file-${state.nextId++}`;
      
      // Generate preview canvases for this PDF
      const previews = await generatePreviews(file, pageCount);
      
      state.files.push({
        id: fileId,
        file,
        name: file.name.replace(/\.pdf$/i, ''),
        pageCount,
        previews,
        ranges: [{ start: 1, end: pageCount }], // Default: all pages
      });
      announce(`${file.name} loaded. ${pageCount} pages.`);
    } catch (err) {
      console.error('Failed to load PDF:', file.name, err);
      announce(`Error loading ${file.name}. Invalid PDF.`);
    }
  }
  renderFileList();
}

/**
 * Get page count from PDF file
 */
async function getPdfPageCount(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer, isEvalSupported: false }).promise;
  return pdf.numPages;
}

/**
 * Generate preview canvases for all pages of a PDF
 */
async function generatePreviews(file, pageCount) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer, isEvalSupported: false }).promise;
  const previews = [];
  
  // Render only first few pages to avoid performance issues
  const maxPreviewPages = Math.min(pageCount, 10);
  
  for (let pageNum = 1; pageNum <= maxPreviewPages; pageNum++) {
    try {
      const page = await pdf.getPage(pageNum);
      const scale = 0.5; // Thumbnail scale
      const viewport = page.getViewport({ scale });
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;
      
      previews.push({ pageNum, canvas });
    } catch (err) {
      console.warn(`Failed to render preview for page ${pageNum}:`, err);
    }
  }
  
  return previews;
}

/**
 * Render the file list with range inputs and preview thumbnails
 */
function renderFileList() {
  if (state.files.length === 0) {
    elements.fileList.innerHTML = '';
    elements.previewContainer.hidden = true;
    elements.dropzone.hidden = false;
    elements.splitBtn.disabled = true;
    return;
  }

  elements.dropzone.hidden = true;
  elements.splitBtn.disabled = false;

  elements.fileList.innerHTML = state.files.map(file => `
    <div class="file-card" data-file-id="${escapeHtml(file.id)}">
      <div class="file-card__header">
        <div class="file-card__thumb">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM16 18H8V16H16V18ZM16 14H8V12H16V14ZM13 9V3.5L18.5 9H13Z"/>
          </svg>
        </div>
        <div class="file-card__info">
          <div class="file-card__name">${escapeHtml(file.name)}</div>
          <div class="file-card__meta">${file.pageCount} pages</div>
        </div>
        <button class="file-card__remove" onclick="window.removeFile('${file.id}')" aria-label="Remove ${escapeHtml(file.name)}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z"/>
          </svg>
        </button>
      </div>
      
      <!-- Preview thumbnails -->
      <div class="file-preview" data-file-id="${file.id}" onclick="showPreview('${file.id}')">
        <div class="file-preview__thumbs">
          ${file.previews.slice(0, 5).map(p => `
            <div class="preview-thumb">
              <canvas width="${p.canvas.width}" height="${p.canvas.height}"></canvas>
            </div>
          `).join('')}
          ${file.pageCount > 5 ? `<div class="preview-thumb preview-thumb--more">+${file.pageCount - 5}</div>` : ''}
        </div>
        <div class="preview-thumb__label">Click to expand preview</div>
      </div>
      
      <div class="ranges-container" data-file-id="${file.id}">
        <div class="range-list" id="ranges-${file.id}"></div>
        <button class="range-row__add" type="button" onclick="window.addRange('${file.id}')" aria-label="Add page range">
          + Add range
        </button>
      </div>
    </div>
  `).join('');

  // Copy preview canvases
  state.files.forEach(file => {
    const thumbs = elements.fileList.querySelectorAll(`.file-card[data-file-id="${file.id}"] .preview-thumb canvas`);
    file.previews.slice(0, Math.min(thumbs.length, 5)).forEach((p, i) => {
      if (thumbs[i]) {
        thumbs[i].getContext('2d').drawImage(p.canvas, 0, 0);
      }
    });
  });

  // Render initial ranges for each file
  state.files.forEach(file => {
    renderRanges(file);
  });

  // Show preview by default for first file
  if (state.files.length > 0) {
    showPreview(state.files[0].id);
  }
}

/**
 * Show preview for a specific file
 */
function showPreview(fileId) {
  const file = state.files.find(f => f.id === fileId);
  if (!file) return;

  elements.previewContainer.hidden = false;
  elements.previewFilename.textContent = `${file.name} (${file.pageCount} pages)`;
  elements.previewArea.innerHTML = '';

  file.previews.forEach(preview => {
    const wrapper = document.createElement('div');
    wrapper.className = 'preview-page-wrapper';
    
    const pageInfo = document.createElement('span');
    pageInfo.className = 'preview-page-number';
    pageInfo.textContent = `Page ${preview.pageNum}`;
    
    const canvas = document.createElement('canvas');
    canvas.width = preview.canvas.width;
    canvas.height = preview.canvas.height;
    canvas.getContext('2d').drawImage(preview.canvas, 0, 0);
    
    wrapper.appendChild(pageInfo);
    wrapper.appendChild(canvas);
    elements.previewArea.appendChild(wrapper);
  });
}

/**
 * Render all ranges for a file
 */
function renderRanges(file) {
  const listEl = document.getElementById(`ranges-${file.id}`);
  if (!listEl) return;

  listEl.innerHTML = '';

  file.ranges.forEach((range, idx) => {
    const rangeId = `range-${file.id}-${idx}`;
    const row = document.createElement('div');
    row.className = 'range-item';
    row.id = rangeId;
    row.dataset.rangeId = rangeId;
    row.innerHTML = `
      <span class="range-item__label">Pages:</span>
      <input type="number" class="range-row__input" data-field="start" value="${range.start}" min="1" max="${file.pageCount}" aria-label="Start page">
      <span>-</span>
      <input type="number" class="range-row__input" data-field="end" value="${range.end}" min="1" max="${file.pageCount}" aria-label="End page">
      <span class="range-row__error" style="display: none;"></span>
      ${file.ranges.length > 1 ? `<button class="range-item__remove" type="button" onclick="window.removeRange('${file.id}', '${rangeId}')" aria-label="Remove range">✕</button>` : ''}
    `;
    listEl.appendChild(row);

    // Add validation
    const startInput = row.querySelector('[data-field="start"]');
    const endInput = row.querySelector('[data-field="end"]');
    const errorSpan = row.querySelector('.range-row__error');

    function validateRange() {
      const start = parseInt(startInput.value, 10);
      const end = parseInt(endInput.value, 10);
      let errorMessage = '';

      if (isNaN(start) || start < 1) {
        errorMessage = 'Start must be ≥ 1';
      } else if (start > file.pageCount) {
        errorMessage = `Start cannot exceed ${file.pageCount} pages`;
      } else if (isNaN(end) || end < 1) {
        errorMessage = 'End must be ≥ 1';
      } else if (end > file.pageCount) {
        errorMessage = `End cannot exceed ${file.pageCount} pages`;
      } else if (start > end) {
        errorMessage = `Start (${start}) must be ≤ End (${end})`;
      }

      if (errorMessage) {
        startInput.classList.add('range-row__input--error');
        endInput.classList.add('range-row__input--error');
        errorSpan.textContent = errorMessage;
        errorSpan.style.display = 'block';
        return false;
      } else {
        startInput.classList.remove('range-row__input--error');
        endInput.classList.remove('range-row__input--error');
        errorSpan.style.display = 'none';

        // Update state
        range.start = start;
        range.end = end;
        return true;
      }
    }

    startInput.addEventListener('input', validateRange);
    endInput.addEventListener('input', validateRange);

    // Initial validation
    validateRange();
  });
}

/**
 * Add a new range input row for a file
 */
window.addRange = function(fileId) {
  const file = state.files.find(f => f.id === fileId);
  if (!file) return;

  file.ranges.push({ start: 1, end: file.pageCount });
  renderRanges(file);
};

/**
 * Remove a range input row
 */
window.removeRange = function(fileId, rangeId) {
  const file = state.files.find(f => f.id === fileId);
  if (!file) return;

  // Parse index from rangeId format "range-{fileId}-{idx}"
  const match = rangeId.match(/range-.+-(\d+)$/);
  const idx = match ? parseInt(match[1], 10) : -1;

  if (idx >= 0 && idx < file.ranges.length) {
    file.ranges.splice(idx, 1);
  }

  // Ensure at least one range remains
  if (file.ranges.length === 0) {
    file.ranges.push({ start: 1, end: file.pageCount });
  }

  renderRanges(file);
};

/**
 * Remove a file from the list
 */
window.removeFile = function(fileId) {
  state.files = state.files.filter(f => f.id !== fileId);
  renderFileList();
  if (state.files.length === 0) {
    elements.previewArea.innerHTML = '';
  }
};

/**
 * Handle split action with validation
 */
async function handleSplit() {
  if (state.files.length === 0 || state.isProcessing) return;

  // Validate all ranges first
  let hasErrors = false;
  state.files.forEach(file => {
    file.ranges.forEach((range, idx) => {
      if (range.start < 1 || range.end > file.pageCount || range.start > range.end) {
        hasErrors = true;
      }
    });
  });

  if (hasErrors) {
    announce('Please fix range errors before splitting');
    alert('Please fix the highlighted range errors before splitting.');
    return;
  }

  state.isProcessing = true;
  elements.splitBtn.disabled = true;
  announce('Starting split operation...');

  try {
    const results = [];

    for (const file of state.files) {
      const fileResults = await splitPdfFile(file);
      results.push(...fileResults);
    }

    if (results.length > 0) {
      renderSplitResults(results);
      announce(`Split complete. ${results.length} files ready for download.`);
    } else {
      announce('No files were split.');
    }
  } catch (err) {
    console.error('Split error:', err);
    announce(`Split failed: ${err.message}`);
  } finally {
    state.isProcessing = false;
    elements.splitBtn.disabled = false;
  }
}

/**
 * Split a single PDF file based on its ranges
 */
async function splitPdfFile(file) {
  const arrayBuffer = await file.file.arrayBuffer();
  const srcDoc = await PDFDocument.load(arrayBuffer);
  const results = [];

  for (let i = 0; i < file.ranges.length; i++) {
    const range = file.ranges[i];
    const { start, end } = range;

    // Skip invalid ranges
    if (start > end || start < 1 || end > file.pageCount) {
      console.warn(`Skipping invalid range: ${start}-${end} for file ${file.name}`);
      continue;
    }

    const newDoc = await PDFDocument.create();
    const pageIndexes = [];
    for (let p = start - 1; p < end; p++) {
      pageIndexes.push(p);
    }

    const copiedPages = await newDoc.copyPages(srcDoc, pageIndexes);
    copiedPages.forEach(page => newDoc.addPage(page));

    const pdfBytes = await newDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });

    results.push({
      name: `${file.name}_part${i + 1}.pdf`,
      blob,
      pages: end - start + 1,
      range: `${start}-${end}`,
    });
  }

  return results;
}

/**
 * Render split results (simplified - just download button)
 */
function renderSplitResults(results) {
  // Store blobs for download
  window.splitBlobs = results;
  
  // Show success message in preview area
  elements.previewArea.innerHTML = `
    <div class="split-success">
      <h3>✅ ${results.length} file(s) ready for download</h3>
      <p>Each range has been split into a separate PDF.</p>
    </div>
  `;
  
  results.forEach((result, idx) => {
    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'btn btn--primary';
    downloadBtn.style.marginTop = '8px';
    downloadBtn.onclick = () => downloadFile(idx);
    downloadBtn.textContent = `Download ${result.name} (${result.pages} pages)`;
    elements.previewArea.appendChild(downloadBtn);
  });
}

/**
 * Download a split file
 */
window.downloadFile = function(idx) {
  const blobs = window.splitBlobs || [];
  const blob = blobs[idx];
  if (!blob) return;

  const url = URL.createObjectURL(blob.blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = blob.name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Reset all files and results
 */
function resetAll() {
  state.files = [];
  state.isProcessing = false;
  state.previewCanvases = [];
  elements.previewArea.innerHTML = '';
  elements.previewContainer.hidden = true;
  elements.fileInput.value = '';
  renderFileList();
  announce('All files cleared.');
}

/**
 * Announce message to screen readers
 */
function announce(message) {
  if (elements.srLive) {
    elements.srLive.textContent = message;
  }
  console.log(`[Announcement] ${message}`);
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Start app
init();
