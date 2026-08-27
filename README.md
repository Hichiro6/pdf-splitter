# PDF Splitter

> Split PDF files by page ranges — 100% client-side, privacy-first

<div align="center">

![License](https://img.shields.io/badge/License-CC%20BY--NC--ND%204.0-red)
![Platform](https://img.shields.io/badge/Platform-Web-green)
![Tests](https://img.shields.io/badge/Tests-Playwright%20%7C%20Vitest-blue)

**Your files never leave your browser — no uploads, no servers, no tracking**

</div>

---

## 🔒 Privacy-First Design

Need to extract specific pages from a PDF? Split a 50-page report into sections? Create multiple PDFs from one document?

PDF Splitter does it **locally in your browser** using [pdf-lib](https://pdf-lib.js.org/) and [PDF.js](https://mozilla.github.io/pdf.js/). Your files stay on your device — nothing is uploaded to any server.

---

## ⚡ Key Features

- **🔒 100% Local Processing** — All operations happen in your browser using WebAssembly
- **📄 Flexible Page Ranges** — Specify custom ranges like `1-5, 8-12, 20, 25-30`
- **📦 ZIP Download** — Get all split files as a single compressed archive
- **👁️ Live Preview** — See page thumbnails before splitting
- **🌐 Multi-Language** — Supports EN, FR, DE, ES, PT, NL, IT
- **♿ Accessible** — Full keyboard navigation and screen reader support (ARIA-compliant)
- **📱 PWA Ready** — Install as a Progressive Web App on mobile devices
- **🎯 Smart Validation** — Prevents invalid page ranges with real-time feedback

---

## 🚀 Quick Start

### Online Demo
Visit the live demo (if hosted): `https://[your-domain]/pdf-splitter`

### Local Development
```bash
# Clone the repository
git clone https://github.com/Hichiro6/pdf-splitter.git
cd pdf-splitter

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📖 Usage Guide

### Step 1: Upload Your PDF
- Drag and drop a PDF file onto the dropzone, or
- Click to browse and select a file

### Step 2: Define Page Ranges
In the page range input, specify which pages to extract:
- **Single pages**: `1, 5, 10`
- **Page ranges**: `1-5, 10-15`
- **Mixed**: `1-3, 7, 12-15, 20`

### Step 3: Split and Download
Click "Split PDF" to process. Each range creates a separate PDF file.
Download all files as a ZIP archive or individual PDFs.

---

## 🛠️ Technical Stack

| Technology | Purpose |
|------------|---------|
| **[Vite](https://vitejs.dev/)** | Build tool & dev server |
| **[pdf-lib](https://pdf-lib.js.org/)** | PDF manipulation (splitting) |
| **[PDF.js](https://mozilla.github.io/pdf.js/)** | PDF rendering & preview |
| **[Biome](https://biomejs.dev/)** | Linting & formatting |
| **[Vitest](https://vitest.dev/)** | Unit testing |
| **[Playwright](https://playwright.dev/)** | E2E testing |

---

## 🧪 Testing

```bash
# Run unit tests
npm run test:unit

# Run E2E tests
npm run test:e2e

# Run tests with UI
npm run test:ui

# View test report
npm run test:report
```

Test coverage includes:
- Page range validation
- PDF splitting accuracy
- ZIP archive generation
- UI interactions & accessibility
- Edge cases (password-protected PDFs, large files)

---

## 📂 Project Structure

```
pdf-splitter/
├── src/
│   ├── main.js           # Application logic
│   └── i18n.js           # Internationalization
├── styles/
│   └── main.css          # Global styles
├── public/
│   ├── manifest.json     # PWA manifest
│   ├── sw.js             # Service worker
│   └── icons/            # PWA icons
├── tests/
│   ├── unit/             # Unit tests
│   └── e2e/              # Playwright E2E tests
├── vite.config.js        # Vite configuration
├── playwright.config.js  # Playwright configuration
├── biome.json            # Biome linting rules
└── Dockerfile            # Container deployment
```

---

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (HMR enabled) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Check code with Biome |
| `npm run format` | Format code with Biome |
| `npm test` | Run all tests |
| `docker compose up` | Run in Docker container |

---

## 🌍 Internationalization

Supported languages:
- **English** (default)
- **Français** (FR)
- **Deutsch** (DE)
- **Español** (ES)
- **Português** (PT)
- **Nederlands** (NL)
- **Italiano** (IT)

Add your language by editing `src/i18n.js`.

---

## 📝 Use Cases

- **Legal documents**: Extract specific clauses from contracts
- **Academic papers**: Split thesis chapters for submission
- **Business reports**: Separate quarterly results from annual reports
- **Personal archives**: Organize scanned documents into categories
- **Email attachments**: Break large PDFs into smaller chunks

---

## 🔐 Security & Privacy

- ✅ **No network calls** — All processing is local
- ✅ **No analytics** — No tracking or telemetry
- ✅ **No cookies** — Nothing stored externally
- ✅ **Open source** — Code is auditable
- ✅ **Client-side only** — No backend requirements

---

## 📄 License

Copyright © 2026 Hichiro6

Licensed under **CC BY-NC-ND 4.0** — You are free to share and adapt this work for non-commercial purposes, provided you give attribution and do not create derivative works.

See [LICENSE](LICENSE) for details.

---

## 🤝 Contributing

This project is released under a restrictive license to protect privacy-focused usage. For commercial licensing or contributions, please open an issue.

---

## 🙏 Acknowledgments

- [pdf-lib](https://pdf-lib.js.org/) — PDF manipulation library
- [PDF.js](https://mozilla.github.io/pdf.js/) — Mozilla's PDF toolkit
- [Vite](https://vitejs.dev/) — Next-generation frontend tooling

---

<div align="center">

**Made with ❤️ for privacy-conscious users**

[Report Bug](https://github.com/Hichiro6/pdf-splitter/issues) · [Request Feature](https://github.com/Hichiro6/pdf-splitter/issues)

</div>
