import axios from 'axios';

// Judge0 CE Public API (No API Key Required - Free Tier)
const JUDGE0_URL = 'https://ce.judge0.com';

// Map your frontend languages to Judge0 language IDs
export const LANGUAGE_IDS = {
  javascript: 63,  // JavaScript (Node.js 12.x)
  java: 62,        // Java (OpenJDK 13)
  python: 71,      // Python (3.8)
  cpp: 54          // C++ (GCC 9.2.0)
};

// Send code to Judge0, get back a token
export const createSubmission = async (sourceCode, languageId, stdin = '') => {
  const response = await axios.post(
    `${JUDGE0_URL}/submissions`,
    {
      source_code: sourceCode,
      language_id: languageId,
      stdin: stdin
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data.token;
};

// Poll Judge0 until it finishes, get the result
export const getSubmissionResult = async (token) => {
  let result;

  // Poll every 2 seconds until Judge0 finishes (max 10 attempts)
  for (let i = 0; i < 10; i++) {
    const response = await axios.get(`${JUDGE0_URL}/submissions/${token}`);
    result = response.data;

    // Judge0 statuses: 1=In Queue, 2=Processing. Anything >= 3 means finished.
    if (result.status && result.status.id >= 3) {
      break;
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  return result;
};

// Process the Judge0 result into a clean format
export const processJudge0Result = (result) => {
  // Map Judge0 status IDs to our application statuses
  const statusMap = {
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

  const status = statusMap[result.status?.id] || 'Unknown Status';
  
  return {
    status: status,
    isCorrect: result.status?.id === 3, // ID 3 = Accepted
    stdout: result.stdout || '',
    stderr: result.stderr || '',
    compileError: result.compile_output || '',
    time: result.time || '0.00',
    memory: result.memory || 0
  };
};