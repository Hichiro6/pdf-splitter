# PDF Splitter

> Split PDF files by page ranges — 100% client-side, no uploads, no servers.

<div align="center">

![License](https://img.shields.io/badge/License-CC%20BY--NC--ND%204.0-red)
![Platform](https://img.shields.io/badge/Platform-Web-green)

**Privacy-first PDF splitting — your files never leave your browser**

</div>

---

## 🔒 Why PDF Splitter?

Need to extract specific pages from a PDF? Split a 50-page report into sections?  
PDF Splitter does it **locally in your browser** — no upload, no server, no tracking.

---

## ⚡ Key Features

- **🔒 100% local**: Your PDFs stay on your device, no uploads
- **📄 Drag & drop**: Upload any PDF file
- **🔢 Page range splitting**: Define custom ranges (e.g., 1-5, 8-12, 20)
- **📦 ZIP download**: Get all split files as a single archive
- **👁️ Page count detection**: Automatic page detection via PDF.js
- **🌍 7 languages**: EN, FR, DE, ES, PT, NL, IT
- **♿ Accessible**: ARIA-compliant, keyboard navigation, screen reader support
- **💾 PWA installable**: Add to home screen or install as an app

---

## 🚀 Usage

### Online

Access the app from any modern browser:
- Desktop: Chrome, Firefox, Safari, Edge
- Mobile: Safari (iOS), Chrome (Android)

### Local Installation

```bash
git clone https://github.com/Hichiro6/pdf-splitter.git
cd pdf-splitter
npm install
npm run dev
```

The app opens at `http://localhost:5173`

### Production Build

```bash
npm run build
# The dist folder contains everything needed for deployment
```

Deploy on GitHub Pages, Netlify, Vercel, or any static host.

---

## 💡 How It Works

1. **Drag & drop** a PDF file (or click to select)
2. **Define split ranges** (e.g., 1-3, 5-8, 10-end)
3. Click **Split PDF**
4. **Download** the resulting files (individual or ZIP)

> ⚠️ **Important**: No files are sent to a server. Everything is processed locally in your browser via JavaScript.

---

## 🛠️ Tech Stack

| Role | Technology |
|------|------------|
| Framework | Vite (vanilla JS) |
| PDF Manipulation | pdf-lib |
| PDF Rendering | pdfjs-dist (page parsing) |
| ZIP Compression | fflate |
| i18n | Custom lightweight system |
| Styling | Modern CSS3 (CSS Variables) |
| Build | Vite |

---

## 📁 Project Structure

```
pdf-splitter/
├── index.html              # Main page
├── src/
│   ├── main.js             # Main application logic
│   └── i18n.js             # Internationalization (7 languages)
├── styles/
│   └── main.css            # Global styles
├── tests/
│   ├── unit/               # Vitest unit tests
│   └── e2e/                # Playwright E2E tests
├── LICENSE                 # CC BY-NC-ND 4.0
├── README.md
└── package.json
```

---

## 🧪 Testing

```bash
npm run test:run        # unit tests (Vitest)
npm run test:e2e        # E2E tests (Playwright)
```

---

## 📝 License

**CC BY-NC-ND 4.0** — Attribution - NonCommercial - NoDerivatives

See [LICENSE](LICENSE) for the full text.

---

## 📧 Contact

Developed by **Hichiro** (GitHub: [@Hichiro6](https://github.com/Hichiro6))

Issues and PRs on GitHub: https://github.com/Hichiro6/pdf-splitter

---

<div align="center">

**Split your PDFs — simply, locally, securely.**

Made with ❤️ in Belgium

</div>
