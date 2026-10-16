// backend/services/languageRegistry.js
import { buildJavaScriptDriver } from './drivers/javascriptDriver.js';
import { buildPythonDriver } from './drivers/pythonDriver.js';

// ─────────────────────────────────────────────
// LANGUAGE DEFINITIONS
// ─────────────────────────────────────────────
export const LANGUAGE_REGISTRY = {
  javascript: {
    judge0Id: 63,
    label: 'JavaScript (Node.js)',
    buildDriver: buildJavaScriptDriver,
    supported: true
  },
  python: {
    judge0Id: 71,
    label: 'Python 3',
    buildDriver: buildPythonDriver,
    supported: true
  },
  java: {
    judge0Id: 62,
    label: 'Java (OpenJDK 13)',
    buildDriver: null,
    supported: false
  },
  cpp: {
    judge0Id: 54,
    label: 'C++ (GCC 9.2.0)',
    buildDriver: null,
    supported: false
  }
};

// ─────────────────────────────────────────────
// NORMALIZE
// ─────────────────────────────────────────────
export function normalizeLanguage(language) {
  if (!language || typeof language !== 'string') return 'javascript';

  const key = language.toLowerCase().trim();

  if (key === 'javascript' || key === 'javascript (node.js)' || key === 'js' || key === 'node') {
    return 'javascript';
  }
  if (key === 'python' || key === 'python 3' || key === 'python3') {
    return 'python';
  }
  if (key === 'java') {
    return 'java';
  }
  if (key === 'cpp' || key === 'c++' || key === 'cplusplus') {
    return 'cpp';
  }

  // Unknown → default to javascript (safe fallback)
  return 'javascript';
}

// ─────────────────────────────────────────────
// GET DRIVER
// ─────────────────────────────────────────────
export function getDriverForLanguage(language) {
  // Normalize first
  const normalized = normalizeLanguage(language);

  // Lookup
  const entry = LANGUAGE_REGISTRY[normalized];

  if (!entry) {
    const err = new Error(`Language "${language}" is not registered.`);
    err.code = 'UNSUPPORTED_LANGUAGE';
    throw err;
  }

  if (!entry.supported || typeof entry.buildDriver !== 'function') {
    const err = new Error(
      `Language "${language}" is not yet enabled for code execution. Please try JavaScript for now.`
    );
    err.code = 'LANGUAGE_NOT_ENABLED';
    throw err;
  }

  return {
    judge0Id: entry.judge0Id,
    label: entry.label,
    buildDriver: entry.buildDriver
  };
}

export function listSupportedLanguages() {
  return Object.entries(LANGUAGE_REGISTRY)
    .filter(([, entry]) => entry.supported)
    .map(([key]) => key);
}