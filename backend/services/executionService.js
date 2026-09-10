// backend/services/executionService.js
import axios from 'axios';

const JUDGE0_URL = process.env.JUDGE0_URL || 'https://ce.judge0.com';

export const LANGUAGE_IDS = {
  javascript: 63,
  python: 71,
  java: 62,
  cpp: 54
};

/**
 * Execute code on Judge0 and return a normalized result.
 * @param {Object} params
 * @param {string} params.sourceCode
 * @param {string} params.language  - 'javascript' | 'python' | 'java' | 'cpp'
 * @param {string} params.stdin
 * @returns {Promise<{
 *   statusId: number,
 *   status: string,
 *   stdout: string,
 *   stderr: string,
 *   compileOutput: string,
 *   executionTime: number,
 *   memory: number
 * }>}
 */
export async function executeCode({ sourceCode, language, stdin = '' }) {
  const languageId = LANGUAGE_IDS[language];
  if (!languageId) {
    const err = new Error(`Unsupported language: ${language}`);
    err.code = 'UNSUPPORTED_LANGUAGE';
    throw err;
  }

  // 1. Create the submission
  let token;
  try {
    const submitRes = await axios.post(
      `${JUDGE0_URL}/submissions`,
      {
        source_code: sourceCode,
        language_id: languageId,
        stdin
      },
      { headers: { 'Content-Type': 'application/json' } }
    );
    token = submitRes.data.token;
  } catch (err) {
    console.error('Judge0 submit error:', err.message);
    const error = new Error('Judge0 is currently unreachable.');
    error.code = 'JUDGE0_UNAVAILABLE';
    throw error;
  }

  // 2. Poll for the result
  for (let i = 0; i < 15; i++) {
    await new Promise(r => setTimeout(r, 1500));

    let result;
    try {
      const resultRes = await axios.get(`${JUDGE0_URL}/submissions/${token}`);
      result = resultRes.data;
    } catch (err) {
      console.error('Judge0 poll error:', err.message);
      continue;
    }

    // Status >= 3 means finished
    if (result.status && result.status.id >= 3) {
      return {
        statusId: result.status.id,
        status: result.status.description,
        stdout: result.stdout || '',
        stderr: result.stderr || '',
        compileOutput: result.compile_output || '',
        executionTime: result.time ? parseFloat(result.time) * 1000 : 0,
        memory: result.memory || 0
      };
    }
  }

  const err = new Error('Judge0 execution timed out.');
  err.code = 'JUDGE0_TIMEOUT';
  throw err;
}

/**
 * Map Judge0 status ID to our application status.
 */
export function mapJudge0StatusToAppStatus(statusId) {
  const map = {
    3: 'Accepted',
    4: 'Wrong Answer',
    5: 'Time Limit Exceeded',
    6: 'Compilation Error',
    7: 'Runtime Error',
    8: 'Runtime Error',
    9: 'Runtime Error',
    10: 'Runtime Error',
    11: 'Runtime Error',
    12: 'Runtime Error',
    13: 'Internal Error',
    14: 'Exec Format Error'
  };
  return map[statusId] || 'Runtime Error';
}