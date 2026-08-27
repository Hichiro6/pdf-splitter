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
  files: [], // Array of { id, file, name, pageCount, ranges: [{start, end}] }
  nextId: 1,
  isProcessing: false,
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
  elements.splitResults = document.getElementById('split-results');
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
      state.files.push({
        id: fileId,
        file,
        name: file.name.replace(/\.pdf$/i, ''),
        pageCount,
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
 * Render the file list with range inputs
 */
function renderFileList() {
  if (state.files.length === 0) {
    elements.fileList.innerHTML = '';
    elements.dropzone.hidden = false;
    elements.splitBtn.disabled = true;
    return;
  }

  elements.dropzone.hidden = true;
  elements.splitBtn.disabled = false;

  elements.fileList.innerHTML = state.files.map(file => `
    <div class="file-card" data-file-id="${file.id}">
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
      <div class="ranges-container">
        <div class="range-list" id="ranges-${file.id}"></div>
        <button class="range-row__add" onclick="window.addRange('${file.id}')" aria-label="Add page range">
          + Add range
        </button>
      </div>
    </div>
  `).join('');
}

/**
 * Add a new range input row for a file
 */
window.AddRange = function(fileId) {
  const file = state.files.find(f => f.id === fileId);
  if (!file) return;

  const rangeId = `range-${Date.now()}`;
  file.ranges.push({ start: 1, end: file.pageCount });

  const listEl = document.getElementById(`ranges-${fileId}`);
  const row = document.createElement('div');
  row.className = 'range-item';
  row.id = rangeId;
  row.innerHTML = `
    <span class="range-item__label">Pages:</span>
    <input type="number" class="range-row__input" data-field="start" value="1" min="1" max="${file.pageCount}" aria-label="Start page" onchange="window.updateRange('${fileId}', '${rangeId}')">
    <span>-</span>
    <input type="number" class="range-row__input" data-field="end" value="${file.pageCount}" min="1" max="${file.pageCount}" aria-label="End page" onchange="window.updateRange('${fileId}', '${rangeId}')">
    <button class="range-item__remove" onclick="window.removeRange('${fileId}', '${rangeId}')" aria-label="Remove range">✕</button>
  `;
  listEl.appendChild(row);
};

window.addRange = AddRange;

/**
 * Update range values when inputs change
 */
window.updateRange = function(fileId, rangeId) {
  const file = state.files.find(f => f.id === fileId);
  if (!file) return;

  const row = document.getElementById(rangeId);
  const start = parseInt(row.querySelector('[data-field="start"]').value, 10);
  const end = parseInt(row.querySelector('[data-field="end"]').value, 10);

  const rangeIndex = file.ranges.findIndex((_, idx) => {
    // Find matching range by DOM order (simplified)
    return true; // Will be recalculated
  });

  // Rebuild ranges from DOM
  file.ranges = Array.from(row.parentElement.querySelectorAll('.range-item')).map(r => ({
    start: parseInt(r.querySelector('[data-field="start"]').value, 10),
    end: parseInt(r.querySelector('[data-field="end"]').value, 10),
  }));
};

/**
 * Remove a range input row
 */
window.removeRange = function(fileId, rangeId) {
  const row = document.getElementById(rangeId);
  if (row) row.remove();

  const file = state.files.find(f => f.id === fileId);
  if (!file) return;

  const listEl = document.getElementById(`ranges-${fileId}`);
  file.ranges = Array.from(listEl.querySelectorAll('.range-item')).map(r => ({
    start: parseInt(r.querySelector('[data-field="start"]').value, 10),
    end: parseInt(r.querySelector('[data-field="end"]').value, 10),
  }));

  if (file.ranges.length === 0) {
    file.ranges.push({ start: 1, end: file.pageCount });
    AddRange(fileId);
  }
};

/**
 * Remove a file from the list
 */
window.removeFile = function(fileId) {
  state.files = state.files.filter(f => f.id !== fileId);
  renderFileList();
  if (state.files.length === 0) {
    elements.splitResults.innerHTML = '';
  }
};

/**
 * Handle split action
 */
async function handleSplit() {
  if (state.files.length === 0 || state.isProcessing) return;

  state.isProcessing = true;
  elements.splitBtn.disabled = true;
  elements.splitResults.innerHTML = '';
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

    if (start > end || start < 1 || end > file.pageCount) continue;

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
    });
  }

  return results;
}

/**
 * Render split results
 */
function renderSplitResults(results) {
  elements.splitResults.innerHTML = `
    <h3 class="split-results__title">${results.length} file(s) ready</h3>
  `;

  results.forEach((result, idx) => {
    const item = document.createElement('div');
    item.className = 'split-result';
    item.innerHTML = `
      <div class="split-result__icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM16 18H8V16H16V18ZM16 14H8V12H16V14ZM13 9V3.5L18.5 9H13Z"/>
        </svg>
      </div>
      <div class="split-result__info">
        <div class="split-result__name">${escapeHtml(result.name)}</div>
        <div class="split-result__pages">${result.pages} page(s)</div>
      </div>
      <button class="split-result__download" onclick="window.downloadFile(${idx})">
        ${t('btn.download')}
      </button>
    `;
    elements.splitResults.appendChild(item);
  });

  // Store blobs for download
  window.splitBlobs = results;
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
  elements.splitResults.innerHTML = '';
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
