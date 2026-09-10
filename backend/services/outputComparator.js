// backend/services/outputComparator.js

/**
 * Output Comparator
 * 
 * Normalizes outputs before comparing.
 * 
 * Rules:
 *  - Trim leading/trailing whitespace
 *  - Normalize line endings (\r\n → \n)
 *  - Remove trailing whitespace on each line
 *  - For JSON-like outputs: parse & re-stringify to normalize
 */

function normalizeSimple(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/\r\n/g, '\n')          // normalize line endings
    .split('\n')
    .map(line => line.trimEnd())     // trailing whitespace per line
    .join('\n')
    .trim();                         // overall trim
}

function tryNormalizeJSON(str) {
  try {
    const parsed = JSON.parse(str);
    return JSON.stringify(parsed);
  } catch {
    return null;
  }
}

/**
 * Compare actual output to expected output.
 * @param {string} actual
 * @param {string} expected
 * @returns {boolean}
 */
export function compareOutput(actual, expected) {
  if (actual === null || actual === undefined) return false;
  if (expected === null || expected === undefined) return false;

  // 1. Try strict JSON comparison
  const actualJSON = tryNormalizeJSON(actual);
  const expectedJSON = tryNormalizeJSON(expected);
  if (actualJSON !== null && expectedJSON !== null) {
    return actualJSON === expectedJSON;
  }

  // 2. Fallback to normalized string comparison
  return normalizeSimple(actual) === normalizeSimple(expected);
}