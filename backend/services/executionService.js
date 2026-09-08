// backend/services/executionService.js
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

// =====================================================================
// 🚀 THE UNIVERSAL CODE GENERATOR (Parses inputParser & outputFormatter)
// =====================================================================
export const generateFinalCode = (userCode, language, functionName, inputParser, outputFormatter) => {
  
  // 1. Build the INPUT PARSING section based on inputParser
  let parseLine = '';
  let functionArgs = '';

  switch (inputParser) {
    case 'arrayTarget':
      parseLine = `
    const nums = input[0].split(' ').map(Number);
    const target = parseInt(input[1]);
      `;
      functionArgs = 'nums, target';
      break;
      
    case 'arrayK':
      parseLine = `
    const nums = input[0].split(' ').map(Number);
    const k = parseInt(input[1]);
      `;
      functionArgs = 'nums, k';
      break;

    case 'arrayH':
      parseLine = `
    const piles = input[0].split(' ').map(Number);
    const h = parseInt(input[1]);
      `;
      functionArgs = 'piles, h';
      break;

    case 'twoStrings':
      parseLine = `
    const s = input[0].trim();
    const t = input[1].trim();
      `;
      functionArgs = 's, t';
      break;

    case 'twoArrays':
      parseLine = `
    const nums1 = input[0].split(' ').map(Number);
    const nums2 = input[1].split(' ').map(Number);
      `;
      functionArgs = 'nums1, nums2';
      break;

    case 'stringArray':
      parseLine = `
    const strs = input[0].split(' ');
      `;
      functionArgs = 'strs';
      break;

    case 'intervalArray':
      parseLine = `
    const intervals = JSON.parse(input[0]);
      `;
      functionArgs = 'intervals';
      break;

    case 'intervalArrayPlus':
      parseLine = `
    const intervals = JSON.parse(input[0]);
    const newInterval = JSON.parse(input[1]);
      `;
      functionArgs = 'intervals, newInterval';
      break;

    case 'matrixTarget':
      parseLine = `
    const matrix = input.slice(0, -1).map(row => row.split(' ').map(Number));
    const target = parseInt(input[input.length - 1]);
      `;
      functionArgs = 'matrix, target';
      break;

    case 'linkedList':
      parseLine = `
    function ListNode(val, next) { this.val = (val===undefined ? 0 : val); this.next = (next===undefined ? null : next); }
    const vals = JSON.parse(input[0]);
    let head = null;
    for (let i = vals.length - 1; i >= 0; i--) {
      head = new ListNode(vals[i], head);
    }
      `;
      functionArgs = 'head';
      break;

    case 'twoLinkedLists':
      parseLine = `
    function ListNode(val, next) { this.val = (val===undefined ? 0 : val); this.next = (next===undefined ? null : next); }
    const vals1 = JSON.parse(input[0]);
    const vals2 = JSON.parse(input[1]);
    let head1 = null, head2 = null;
    for (let i = vals1.length - 1; i >= 0; i--) head1 = new ListNode(vals1[i], head1);
    for (let i = vals2.length - 1; i >= 0; i--) head2 = new ListNode(vals2[i], head2);
      `;
      functionArgs = 'head1, head2';
      break;

    case 'tree':
      parseLine = `
    function TreeNode(val, left, right) { this.val = (val===undefined ? 0 : val); this.left = (left===undefined ? null : left); this.right = (right===undefined ? null : right); }
    const tree = JSON.parse(input[0]);
    function buildTree(arr) {
      if (arr.length === 0) return null;
      const root = new TreeNode(arr[0]);
      const queue = [root];
      let i = 1;
      while (i < arr.length) {
        const current = queue.shift();
        if (arr[i] !== null) { current.left = new TreeNode(arr[i]); queue.push(current.left); }
        i++;
        if (i < arr.length && arr[i] !== null) { current.right = new TreeNode(arr[i]); queue.push(current.right); }
        i++;
      }
      return root;
    }
    const root = buildTree(tree);
      `;
      functionArgs = 'root';
      break;

    case 'number':
      parseLine = `
    const n = parseInt(input[0]);
      `;
      functionArgs = 'n';
      break;

    default: // array
      parseLine = `
    const nums = input[0].split(' ').map(Number);
      `;
      functionArgs = 'nums';
      break;
  }

  // 2. Build the OUTPUT FORMATTING section based on outputFormatter
  let formatOutput = '';
  switch (outputFormatter) {
    case 'array':
      formatOutput = `console.log(JSON.stringify(result));`;
      break;
    case 'boolean':
      formatOutput = `console.log(result ? "true" : "false");`;
      break;
    case 'number':
      formatOutput = `console.log(result);`;
      break;
    case 'string':
      formatOutput = `console.log(result);`;
      break;
    default:
      formatOutput = `console.log(result);`;
      break;
  }

  // 3. Generate the full JavaScript code for Judge0
  if (language === 'javascript') {
    return `
${userCode}

// DRIVER CODE
const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split('\\n');
${parseLine}
const result = ${functionName}(${functionArgs});
${formatOutput}
`;
  }
  
  // 4. Generate the full Python code for Judge0
  if (language === 'python') {
    // Convert JS syntax to Python for basic parsing
    const pyParse = parseLine
      .replace(/const /g, '')
      .replace(/let /g, '')
      .replace(/parseInt/g, 'int')
      .replace(/JSON\.parse/g, 'json.loads')
      .replace(/input\[0\]\.split\(' '\)\.map\(Number\)/g, 'list(map(int, input_data[0].split()))');
    
    return `
${userCode}

import sys, json
input_data = sys.stdin.read().strip().split('\\n')
${pyParse}
result = ${functionName}(${functionArgs})
${formatOutput.replace('console.log', 'print').replace('JSON.stringify', 'json.dumps')}
`;
  }
  
  return userCode; // Fallback for other languages
};