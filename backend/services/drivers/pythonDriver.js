// backend/services/drivers/pythonDriver.js

// ─── VALID OUTPUT FORMATTERS ───
const PY_FORMATTERS = {
  array: `print(json.dumps(__result))`,
  number: `print(__result)`,
  boolean: `print("true" if __result else "false")`,
  string: `print(__result)`
};

// ─── INPUT PARSERS ───
const PY_PARSERS = {
  array: {
    code: `nums = list(map(int, lines[0].split()))`,
    args: 'nums'
  },
  arrayTarget: {
    code: `nums = list(map(int, lines[0].split()))\ntarget = int(lines[1])`,
    args: 'nums, target'
  },
  arrayK: {
    code: `nums = list(map(int, lines[0].split()))\nk = int(lines[1])`,
    args: 'nums, k'
  },
  string: {
    code: `s = lines[0]`,
    args: 's'
  },
  twoStrings: {
    code: `s = lines[0]\nt = lines[1]`,
    args: 's, t'
  },
  stringArray: {
    code: `strs = raw_input.split(' ')`,
    args: 'strs'
  },
  number: {
    code: `n = int(raw_input)`,
    args: 'n'
  },
  twoArrays: {
    code: `nums1 = list(map(int, lines[0].split()))\nnums2 = list(map(int, lines[1].split()))`,
    args: 'nums1, nums2'
  },
  matrixTarget: {
    code: `target = int(lines[-1])\nmatrix = [list(map(int, row.split())) for row in lines[:-1]]`,
    args: 'matrix, target'
  },
  linkedList: {
    code: `
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def build_linked_list(vals):
    dummy = ListNode()
    curr = dummy
    for v in vals:
        curr.next = ListNode(v)
        curr = curr.next
    return dummy.next

__vals = json.loads(lines[0])
head = build_linked_list(__vals)
`,
    args: 'head'
  },
  linkedListN: {
    code: `
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def build_linked_list(vals):
    dummy = ListNode()
    curr = dummy
    for v in vals:
        curr.next = ListNode(v)
        curr = curr.next
    return dummy.next

__vals = json.loads(lines[0])
head = build_linked_list(__vals)
n = int(lines[1])
`,
    args: 'head, n'
  },
  twoLinkedLists: {
    code: `
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def build_linked_list(vals):
    dummy = ListNode()
    curr = dummy
    for v in vals:
        curr.next = ListNode(v)
        curr = curr.next
    return dummy.next

__vals1 = json.loads(lines[0])
__vals2 = json.loads(lines[1])
head1 = build_linked_list(__vals1)
head2 = build_linked_list(__vals2)
`,
    args: 'head1, head2'
  },
  tree: {
    code: `
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def build_tree(arr):
    if not arr or arr[0] is None:
        return None
    root = TreeNode(arr[0])
    queue = [root]
    i = 1
    while i < len(arr) and queue:
        node = queue.pop(0)
        if i < len(arr) and arr[i] is not None:
            node.left = TreeNode(arr[i])
            queue.append(node.left)
        i += 1
        if i < len(arr) and arr[i] is not None:
            node.right = TreeNode(arr[i])
            queue.append(node.right)
        i += 1
    return root

__tree_arr = json.loads(lines[0])
root = build_tree(__tree_arr)
`,
    args: 'root'
  },
  treeTwoNodes: {
    code: `
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def build_tree(arr):
    if not arr or arr[0] is None:
        return None
    root = TreeNode(arr[0])
    queue = [root]
    i = 1
    while i < len(arr) and queue:
        node = queue.pop(0)
        if i < len(arr) and arr[i] is not None:
            node.left = TreeNode(arr[i])
            queue.append(node.left)
        i += 1
        if i < len(arr) and arr[i] is not None:
            node.right = TreeNode(arr[i])
            queue.append(node.right)
        i += 1
    return root

def find_node(root, val):
    if not root: return None
    if root.val == val: return root
    left = find_node(root.left, val)
    if left: return left
    return find_node(root.right, val)

__tree_arr = json.loads(lines[0])
root = build_tree(__tree_arr)
p = find_node(root, int(lines[1]))
q = find_node(root, int(lines[2]))
`,
    args: 'root, p, q'
  },
  intervalArray: {
    code: `intervals = json.loads(lines[0])`,
    args: 'intervals'
  },
  intervalArrayPlus: {
    code: `intervals = json.loads(lines[0])\nnewInterval = json.loads(lines[1])`,
    args: 'intervals, newInterval'
  }
};

export function buildPythonDriver({ userCode, functionName, inputParser, outputFormatter }) {
  const parser = PY_PARSERS[inputParser];
  if (!parser) {
    const err = new Error(`Unsupported inputParser: "${inputParser}"`);
    err.code = 'UNSUPPORTED_PARSER';
    throw err;
  }

  const formatter = PY_FORMATTERS[outputFormatter];
  if (!formatter) {
    const err = new Error(`Unsupported outputFormatter: "${outputFormatter}"`);
    err.code = 'UNSUPPORTED_FORMATTER';
    throw err;
  }

  // Python function names must be snake_case, we do a naive conversion if needed
  // but we'll assume the user wrote the correct function name.
  
  return `import sys
import json

${userCode}

# ═══════════════════════════════════════════
# AUTO-GENERATED DRIVER
# ═══════════════════════════════════════════
raw_input = sys.stdin.read().strip()
lines = raw_input.split('\\n') if raw_input else []

${parser.code}

__result = ${functionName}(${parser.args})
${formatter}
`;
}