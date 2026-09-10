// backend/services/drivers/javascriptDriver.js

/**
 * JavaScript Driver
 * 
 * Given a user's function and question execution spec,
 * generates a complete executable JavaScript program.
 * 
 * Supports: array, arrayTarget, arrayK, string, twoStrings,
 *           stringArray, number, twoArrays, matrixTarget
 */

// ─── VALID OUTPUT FORMATTERS ───
const JS_FORMATTERS = {
  array: `console.log(JSON.stringify(__result));`,
  number: `console.log(__result);`,
  boolean: `console.log(__result ? "true" : "false");`,
  string: `console.log(__result);`
};

// ─── VALID INPUT PARSERS ───
// Each parser declares:
//   code: JS code that reads from `lines` (an array of strings)
//   args: the exact argument list to pass to the user's function
const JS_PARSERS = {
  array: {
    code: `const nums = lines[0].split(' ').map(Number);`,
    args: 'nums'
  },
  arrayTarget: {
    code: `const nums = lines[0].split(' ').map(Number);\nconst target = parseInt(lines[1]);`,
    args: 'nums, target'
  },
  arrayK: {
    code: `const nums = lines[0].split(' ').map(Number);\nconst k = parseInt(lines[1]);`,
    args: 'nums, k'
  },
  string: {
    code: `const s = lines[0];`,
    args: 's'
  },
  twoStrings: {
    code: `const s = lines[0];\nconst t = lines[1];`,
    args: 's, t'
  },
  stringArray: {
    code: `const strs = rawInput.split(' ');`,
    args: 'strs'
  },
  number: {
    code: `const n = parseInt(rawInput);`,
    args: 'n'
  },
  twoArrays: {
    code: `const nums1 = lines[0].split(' ').map(Number);\nconst nums2 = lines[1].split(' ').map(Number);`,
    args: 'nums1, nums2'
  },
  matrixTarget: {
    code: `const target = parseInt(lines[lines.length - 1]);\nconst matrix = lines.slice(0, -1).map(row => row.split(' ').map(Number));`,
    args: 'matrix, target'
  }
};

/**
 * Build the complete executable source for Judge0.
 * @param {Object} params
 * @param {string} params.userCode       - The user's submitted function
 * @param {string} params.functionName   - The function to call (e.g. "twoSum")
 * @param {string} params.inputParser    - Which parser to use
 * @param {string} params.outputFormatter - How to format the result
 * @returns {string} The complete JavaScript source code
 */
export function buildJavaScriptDriver({ userCode, functionName, inputParser, outputFormatter }) {
  const parser = JS_PARSERS[inputParser];
  if (!parser) {
    const err = new Error(`Unsupported inputParser: "${inputParser}"`);
    err.code = 'UNSUPPORTED_PARSER';
    throw err;
  }

  const formatter = JS_FORMATTERS[outputFormatter];
  if (!formatter) {
    const err = new Error(`Unsupported outputFormatter: "${outputFormatter}"`);
    err.code = 'UNSUPPORTED_FORMATTER';
    throw err;
  }

  return `${userCode}

// ═══════════════════════════════════════════
// AUTO-GENERATED DRIVER (do not edit)
// ═══════════════════════════════════════════
const fs = require('fs');
const rawInput = fs.readFileSync(0, 'utf-8').trim();
const lines = rawInput.split('\\n');

${parser.code}

const __result = ${functionName}(${parser.args});
${formatter}
`;
}

/**
 * Expose the valid parser keys (for validation)
 */
export const SUPPORTED_JS_PARSERS = Object.keys(JS_PARSERS);
export const SUPPORTED_JS_FORMATTERS = Object.keys(JS_FORMATTERS);