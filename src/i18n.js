/**
 * PDF Splitter - i18n System
 * Languages: EN (default), FR, DE, ES, PT, NL, IT
 *
 * API:
 *   initI18n()              - Initialize language on startup
 *   setLanguage(lang, cb)   - Change language
 *   getCurrentLanguage()    - Get current language code
 *   t(key, params)          - Get translated string with param substitution
 */

export const LANGUAGES = {
  en: { name: 'English', flag: '🇬🇧' },
  fr: { name: 'Français', flag: '🇫🇷' },
  de: { name: 'Deutsch', flag: '🇩🇪' },
  es: { name: 'Español', flag: '🇪🇸' },
  pt: { name: 'Português', flag: '🇵🇹' },
  nl: { name: 'Nederlands', flag: '🇳🇱' },
  it: { name: 'Italiano', flag: '🇮🇹' },
};

const STORAGE_KEY = 'pdfsplitter_lang';
let currentLang = 'en';

export const TRANSLATIONS = {
  en: {
    'app.title': 'PDF Splitter — Split your PDF files',
    'header.tagline': 'Split PDF files in your browser',
    'header.badge': '🔒 100% local — your files never leave your browser',
    'privacy.link': 'View on GitHub',
    'footer.bmc': 'Buy me a coffee',
    'dropzone.title': 'Drop your PDF here',
    'dropzone.subtitle': 'or click to select a file',
    'controls.split': 'Split',
    'controls.ranges': 'Split ranges',
    'controls.pages': 'Pages',
    'btn.split': 'Split PDF',
    'btn.download': 'Download',
    'btn.reset': 'Reset',
    'alerts.noFiles': 'Please add at least one PDF file.',
    'alerts.splitError': 'Split error: {msg}',
    'alerts.success': 'PDF split successfully!',
    'progress.splitting': 'Splitting PDF...',
    'lang.label': 'Language',
  },

  fr: {
    'app.title': 'PDF Splitter — Divisez vos fichiers PDF',
    'header.tagline': 'Divisez vos fichiers PDF dans votre navigateur',
    'header.badge': '🔒 100% local — vos fichiers ne quittent jamais votre navigateur',
    'privacy.link': 'Voir sur GitHub',
    'footer.bmc': 'Offrir un café',
    'dropzone.title': 'Déposez votre PDF ici',
    'dropzone.subtitle': 'ou cliquez pour sélectionner un fichier',
    'controls.split': 'Diviser',
    'controls.ranges': 'Plages de division',
    'controls.pages': 'Pages',
    'btn.split': 'Diviser le PDF',
    'btn.download': 'Télécharger',
    'btn.reset': 'Réinitialiser',
    'alerts.noFiles': 'Veuillez ajouter au moins un fichier PDF.',
    'alerts.splitError': 'Erreur de division : {msg}',
    'alerts.success': 'PDF divisé avec succès !',
    'progress.splitting': 'Division du PDF...',
    'lang.label': 'Langue',
  },

  de: {
    'app.title': 'PDF Splitter — PDF-Dateien aufteilen',
    'header.tagline': 'Teilen Sie PDF-Dateien im Browser',
    'header.badge': '🔒 100% lokal — Ihre Dateien verlassen nie den Browser',
    'privacy.link': 'Auf GitHub ansehen',
    'footer.bmc': 'Kaffee ausgeben',
    'dropzone.title': 'PDF hier ablegen',
    'dropzone.subtitle': 'oder klicken, um eine Datei auszuwählen',
    'controls.split': 'Aufteilen',
    'controls.ranges': 'Aufteilungsbereiche',
    'controls.pages': 'Seiten',
    'btn.split': 'PDF aufteilen',
    'btn.download': 'Herunterladen',
    'btn.reset': 'Zurücksetzen',
    'alerts.noFiles': 'Bitte fügen Sie mindestens eine PDF-Datei hinzu.',
    'alerts.splitError': 'Aufteilungsfehler: {msg}',
    'alerts.success': 'PDF erfolgreich aufgeteilt!',
    'progress.splitting': 'PDF wird aufgeteilt...',
    'lang.label': 'Sprache',
  },

  es: {
    'app.title': 'PDF Splitter — Divide tus archivos PDF',
    'header.tagline': 'Divide archivos PDF en el navegador',
    'header.badge': '🔒 100% local — tus archivos nunca salen del navegador',
    'privacy.link': 'Ver en GitHub',
    'footer.bmc': 'Invítame un café',
    'dropzone.title': 'Deja tu PDF aquí',
    'dropzone.subtitle': 'o haz clic para seleccionar un archivo',
    'controls.split': 'Dividir',
    'controls.ranges': 'Rangos de división',
    'controls.pages': 'Páginas',
    'btn.split': 'Dividir PDF',
    'btn.download': 'Descargar',
    'btn.reset': 'Reiniciar',
    'alerts.noFiles': 'Por favor, añade al menos un archivo PDF.',
    'alerts.splitError': 'Error de división: {msg}',
    'alerts.success': '¡PDF dividido con éxito!',
    'progress.splitting': 'Dividiendo PDF...',
    'lang.label': 'Idioma',
  },

  pt: {
    'app.title': 'PDF Splitter — Divida seus arquivos PDF',
    'header.tagline': 'Divida arquivos PDF no navegador',
    'header.badge': '🔒 100% local — seus arquivos nunca saem do navegador',
    'privacy.link': 'Ver no GitHub',
    'footer.bmc': 'Pague um café',
    'dropzone.title': 'Solte seu PDF aqui',
    'dropzone.subtitle': 'ou clique para selecionar um arquivo',
    'controls.split': 'Dividir',
    'controls.ranges': 'Faixas de divisão',
    'controls.pages': 'Páginas',
    'btn.split': 'Dividir PDF',
    'btn.download': 'Baixar',
    'btn.reset': 'Redefinir',
    'alerts.noFiles': 'Por favor, adicione pelo menos um arquivo PDF.',
    'alerts.splitError': 'Erro de divisão: {msg}',
    'alerts.success': 'PDF dividido com sucesso!',
    'progress.splitting': 'Dividindo PDF...',
    'lang.label': 'Idioma',
  },

  nl: {
    'app.title': 'PDF Splitter — Splits uw PDF-bestanden',
    'header.tagline': 'Splits PDF-bestanden in uw browser',
    'header.badge': '🔒 100% lokaal — uw bestanden verlaten nooit uw browser',
    'privacy.link': 'Bekijk op GitHub',
    'footer.bmc': 'Koffie aanbieden',
    'dropzone.title': 'Sleep uw PDF hierheen',
    'dropzone.subtitle': 'of klik om een bestand te selecteren',
    'controls.split': 'Splitsen',
    'controls.ranges': 'Splitsingsbereiken',
    'controls.pages': "Pagina's",
    'btn.split': 'PDF splitsen',
    'btn.download': 'Downloaden',
    'btn.reset': 'Opnieuw',
    'alerts.noFiles': 'Voeg ten minste één PDF-bestand toe.',
    'alerts.splitError': 'Splitsingsfout: {msg}',
    'alerts.success': 'PDF succesvol gesplitst!',
    'progress.splitting': 'PDF wordt gesplitst...',
    'lang.label': 'Taal',
  },

  it: {
    'app.title': 'PDF Splitter — Dividi i tuoi file PDF',
    'header.tagline': 'Dividi file PDF nel browser',
    'header.badge': '🔒 100% locale — i tuoi file non lasciano mai il browser',
    'privacy.link': 'Vedi su GitHub',
    'footer.bmc': 'Offri un caffè',
    'dropzone.title': 'Trascina qui il tuo PDF',
    'dropzone.subtitle': 'o clicca per selezionare un file',
    'controls.split': 'Dividi',
    'controls.ranges': 'Intervallo di divisione',
    'controls.pages': 'Pagine',
    'btn.split': 'Dividi PDF',
    'btn.download': 'Scarica',
    'btn.reset': 'Ripristina',
    'alerts.noFiles': 'Aggiungi almeno un file PDF.',
    'alerts.splitError': 'Errore di divisione: {msg}',
    'alerts.success': 'PDF diviso con successo!',
    'progress.splitting': 'Divisione del PDF...',
    'lang.label': 'Lingua',
  },
};

/**
 * Translate a key with optional parameter substitution.
 * @param {string} key - Translation key (e.g. 'alerts.splitError')
 * @param {Object} params - Parameters to substitute (e.g. { msg: 'error' })
 * @returns {string} Translated string
 */
export function t(key, params = {}) {
  const lang = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  let str = lang[key] || TRANSLATIONS.en[key] || key;

  for (const [k, v] of Object.entries(params)) {
    str = str.replace(`{${k}}`, String(v));
  }

  return str;
}

/**
 * Get the current language code.
 * @returns {string} Current language code (e.g. 'en', 'fr')
 */
export function getCurrentLanguage() {
  return currentLang;
}

/**
 * Apply translations to all data-i18n elements in the DOM.
 */
function applyTranslations() {
  // data-i18n: textContent
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (key) {
      el.textContent = t(key);
    }
  });

  // data-i18n-title: title attribute
  document.querySelectorAll('[data-i18n-title]').forEach((el) => {
    const key = el.getAttribute('data-i18n-title');
    if (key) {
      el.setAttribute('title', t(key));
    }
  });

  // data-i18n-aria-label: aria-label attribute
  document.querySelectorAll('[data-i18n-aria-label]').forEach((el) => {
    const key = el.getAttribute('data-i18n-aria-label');
    if (key) {
      el.setAttribute('aria-label', t(key));
    }
  });

  // Update document title and lang attribute
  document.title = t('app.title');
  document.documentElement.lang = currentLang;
}

/**
 * Set the current language, persist to localStorage, and apply translations.
 * @param {string} lang - Language code (e.g. 'fr', 'de')
 * @param {Function} [callback] - Optional callback after language change
 */
export function setLanguage(lang, callback) {
  if (!LANGUAGES[lang]) {
    console.warn(`Unknown language: ${lang}, falling back to 'en'`);
    lang = 'en';
  }

  currentLang = lang;

  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch (_e) {
    // localStorage might be unavailable (private browsing)
  }

  applyTranslations();

  if (typeof callback === 'function') {
    callback(lang);
  }
}

/**
 * Create the language selector buttons and append to header.
 */
function createLanguageSelector() {
  const header = document.querySelector('.header');
  if (!header) return;

  // Remove existing selector if any
  const existing = header.querySelector('.lang-selector');
  if (existing) existing.remove();

  const selector = document.createElement('div');
  selector.className = 'lang-selector';
  selector.setAttribute('role', 'group');
  selector.setAttribute('aria-label', t('lang.label'));

  for (const [code, info] of Object.entries(LANGUAGES)) {
    const btn = document.createElement('button');
    btn.className = 'lang-btn';
    btn.textContent = info.flag;
    btn.title = info.name;
    btn.setAttribute('aria-label', info.name);
    btn.setAttribute('data-lang', code);
    if (code === currentLang) {
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
    } else {
      btn.setAttribute('aria-pressed', 'false');
    }

    btn.addEventListener('click', () => {
      // Update active states
      selector.querySelectorAll('.lang-btn').forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      setLanguage(code);
    });

    selector.appendChild(btn);
  }

  header.appendChild(selector);
}

/**
 * Initialize i18n on app startup.
 * Loads saved language from localStorage, defaults to 'en'.
 */
export function initI18n() {
  let savedLang = 'en';

  try {
    savedLang = localStorage.getItem(STORAGE_KEY) || 'en';
  } catch (_e) {
    // localStorage unavailable
  }

  if (!LANGUAGES[savedLang]) {
    savedLang = 'en';
  }

  currentLang = savedLang;
  applyTranslations();
  createLanguageSelector();
}
