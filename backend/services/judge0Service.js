// backend/services/judge0Service.js
import axios from 'axios';

const JUDGE0_URL = process.env.JUDGE0_URL || 'https://judge0-ce.p.rapidapi.com';
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY;

export const LANGUAGE_IDS = {
  javascript: 63,  // JavaScript (Node.js 12.x)
  java: 62,        // Java (OpenJDK 13)
  python: 71,      // Python (3.8)
  cpp: 54          // C++ (GCC 9.2.0)
};

export const submitToJudge0 = async (sourceCode, languageId, stdin = '') => {
  const options = {
    method: 'POST',
    url: `${JUDGE0_URL}/submissions`,
    params: { base64_encoded: 'false', wait: 'false' },
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': JUDGE0_API_KEY,
      'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
    },
    data: {
      source_code: sourceCode,
      language_id: languageId,
      stdin: stdin
    }
  };

  const response = await axios.request(options);
  return response.data.token; // Returns submission token
};

export const getJudge0Result = async (token) => {
  const options = {
    method: 'GET',
    url: `${JUDGE0_URL}/submissions/${token}`,
    params: { base64_encoded: 'false', fields: '*' },
    headers: {
      'X-RapidAPI-Key': JUDGE0_API_KEY,
      'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
    }
  };

  // Poll until Judge0 finishes (max 10 attempts)
  for (let i = 0; i < 10; i++) {
    const response = await axios.request(options);
    const result = response.data;

    if (result.status && result.status.id >= 3) {
      return result; // 1 = In Queue, 2 = Processing, 3+ = Finished
    }

    // Wait 2 seconds before polling again
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  throw new Error('Judge0 execution timeout');
};