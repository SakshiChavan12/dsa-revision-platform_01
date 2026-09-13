// backend/services/drivers/javascriptDriver.js

// ─── VALID OUTPUT FORMATTERS ───
const JS_FORMATTERS = {
  array: `console.log(JSON.stringify(__result));`,
  number: `console.log(__result);`,
  boolean: `console.log(__result ? "true" : "false");`,
  string: `console.log(__result);`
};

// ─── INPUT PARSERS ───
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
  },

  // ─────────── LINKED LIST ───────────
  linkedList: {
    code: `
function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}
const __vals = JSON.parse(lines[0]);
let head = null;
for (let i = __vals.length - 1; i >= 0; i--) head = new ListNode(__vals[i], head);
`,
    args: 'head'
  },
  linkedListN: {
    code: `
function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}
const __vals = JSON.parse(lines[0]);
let head = null;
for (let i = __vals.length - 1; i >= 0; i--) head = new ListNode(__vals[i], head);
const n = parseInt(lines[1]);
`,
    args: 'head, n'
  },
  twoLinkedLists: {
    code: `
function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}
const __vals1 = JSON.parse(lines[0]);
const __vals2 = JSON.parse(lines[1]);
let head1 = null, head2 = null;
for (let i = __vals1.length - 1; i >= 0; i--) head1 = new ListNode(__vals1[i], head1);
for (let i = __vals2.length - 1; i >= 0; i--) head2 = new ListNode(__vals2[i], head2);
`,
    args: 'head1, head2'
  },

  // ─────────── TREE ───────────
  tree: {
    code: `
function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}
function __buildTree(arr) {
  if (!arr || arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]);
  const queue = [root];
  let i = 1;
  while (i < arr.length && queue.length > 0) {
    const node = queue.shift();
    if (i < arr.length && arr[i] !== null) {
      node.left = new TreeNode(arr[i]);
      queue.push(node.left);
    }
    i++;
    if (i < arr.length && arr[i] !== null) {
      node.right = new TreeNode(arr[i]);
      queue.push(node.right);
    }
    i++;
  }
  return root;
}
const __treeArr = JSON.parse(lines[0]);
const root = __buildTree(__treeArr);
`,
    args: 'root'
  },
  treeTwoNodes: {
    code: `
function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}
function __buildTree(arr) {
  if (!arr || arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]);
  const queue = [root];
  let i = 1;
  while (i < arr.length && queue.length > 0) {
    const node = queue.shift();
    if (i < arr.length && arr[i] !== null) {
      node.left = new TreeNode(arr[i]);
      queue.push(node.left);
    }
    i++;
    if (i < arr.length && arr[i] !== null) {
      node.right = new TreeNode(arr[i]);
      queue.push(node.right);
    }
    i++;
  }
  return root;
}
function __findNode(root, val) {
  if (!root) return null;
  if (root.val === val) return root;
  return __findNode(root.left, val) || __findNode(root.right, val);
}
const __treeArr = JSON.parse(lines[0]);
const root = __buildTree(__treeArr);
const p = __findNode(root, parseInt(lines[1]));
const q = __findNode(root, parseInt(lines[2]));
`,
    args: 'root, p, q'
  },

  // ─────────── INTERVALS ───────────
  intervalArray: {
    code: `const intervals = JSON.parse(lines[0]);`,
    args: 'intervals'
  },
  intervalArrayPlus: {
    code: `const intervals = JSON.parse(lines[0]);\nconst newInterval = JSON.parse(lines[1]);`,
    args: 'intervals, newInterval'
  }
};

/**
 * Build the complete executable source for Judge0.
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
// AUTO-GENERATED DRIVER
// ═══════════════════════════════════════════
const fs = require('fs');
const rawInput = fs.readFileSync(0, 'utf-8').trim();
const lines = rawInput.split('\\n');

${parser.code}

const __result = ${functionName}(${parser.args});
${formatter}
`;
}

export const SUPPORTED_JS_PARSERS = Object.keys(JS_PARSERS);
export const SUPPORTED_JS_FORMATTERS = Object.keys(JS_FORMATTERS);