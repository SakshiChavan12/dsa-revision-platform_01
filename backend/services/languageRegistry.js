// backend/services/languageRegistry.js

/**
 * Language Registry
 * 
 * Central source of truth for supported languages.
 * 
 * Each entry maps a canonical language key to:
 *   - judge0Id:   Judge0 CE language ID
 *   - buildDriver: function that returns executable source for a test case
 *   - label:      Human-readable name (for logs / UI consistency)
 * 
 * The driver functions have the signature:
 *   buildDriver({ userCode, functionName, inputParser, outputFormatter }) → string
 * 
 * They throw an Error with .code === 'UNSUPPORTED_PARSER' or 'UNSUPPORTED_FORMATTER'
 * if the question's spec cannot be handled.
 */

import { buildJavaScriptDriver } from './drivers/javascriptDriver.js';

// ─────────────────────────────────────────────
// LANGUAGE DEFINITIONS
// ─────────────────────────────────────────────
// NOTE: python / java / cpp drivers will be added in later steps.
// Until then, they are registered as "unsupported" so the controller
// can return a clean 422 instead of crashing.
// ─────────────────────────────────────────────

export const LANGUAGE_REGISTRY = {
  javascript: {
    judge0Id: 63,
    label: 'JavaScript (Node.js)',
    buildDriver: buildJavaScriptDriver,
    supported: true
  },

  // ── Filled in Step 4 ──
  python: {
    judge0Id: 71,
    label: 'Python 3',
    buildDriver: null,
    supported: false
  },

  // ── Filled in Step 5 ──
  java: {
    judge0Id: 62,
    label: 'Java (OpenJDK 13)',
    buildDriver: null,
    supported: false
  },

  // ── Filled in Step 6 ──
  cpp: {
    judge0Id: 54,
    label: 'C++ (GCC 9.2.0)',
    buildDriver: null,
    supported: false
  }
};

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

/**
 * Normalize a language key from the frontend.
 * Accepts: 'javascript', 'JavaScript (Node.js)', 'python', 'Python', 'cpp', 'C++', 'java'
 */
export function normalizeLanguage(language) {
  if (!language || typeof language !== 'string') return null;

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

  return null;
}

/**
 * Get the language entry for a given language string.
 * Returns null if the language is not registered.
 */
export function getLanguageEntry(language) {
  const normalized = normalizeLanguage(language);
  if (!normalized) return null;
  return LANGUAGE_REGISTRY[normalized] || null;
}

/**
 * Get the driver build function for a language.
 * Throws a clean error if the language is unsupported.
 */
export function getDriverForLanguage(language) {
  const entry = getLanguageEntry(language);

  if (!entry) {
    const err = new Error(`Unsupported language: "${language}"`);
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

/**
 * List all supported language keys (for /api/languages if needed later).
 */
export function listSupportedLanguages() {
  return Object.entries(LANGUAGE_REGISTRY)
    .filter(([, entry]) => entry.supported)
    .map(([key]) => key);
}