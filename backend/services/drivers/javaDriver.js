// backend/services/drivers/javaDriver.js

// Helper to generate print statements based on return types
const JAVA_FORMATTERS = {
  array: `
        if (__result instanceof int[]) {
            System.out.println(java.util.Arrays.toString((int[])__result).replace(" ", ""));
        } else if (__result instanceof java.util.List) {
            System.out.println(__result.toString().replace(" ", ""));
        } else {
            System.out.println(__result);
        }
  `,
  number: `System.out.println(__result);`,
  boolean: `System.out.println(__result ? "true" : "false");`,
  string: `System.out.println(__result);`
};

// The Java type we expect the user to return, based on the formatter
const JAVA_RETURN_TYPES = {
  array: `Object`, // flexible: int[] or List
  number: `int`,   // default number type
  boolean: `boolean`,
  string: `String`
};

const JAVA_PARSERS = {
  array: {
    code: `
        int[] nums = java.util.Arrays.stream(lines[0].split(" ")).mapToInt(Integer::parseInt).toArray();
    `,
    args: 'nums'
  },
  arrayTarget: {
    code: `
        int[] nums = java.util.Arrays.stream(lines[0].split(" ")).mapToInt(Integer::parseInt).toArray();
        int target = Integer.parseInt(lines[1]);
    `,
    args: 'nums, target'
  },
  arrayK: {
    code: `
        int[] nums = java.util.Arrays.stream(lines[0].split(" ")).mapToInt(Integer::parseInt).toArray();
        int k = Integer.parseInt(lines[1]);
    `,
    args: 'nums, k'
  },
  string: {
    code: `String s = lines[0];`,
    args: 's'
  },
  twoStrings: {
    code: `String s = lines[0];\nString t = lines[1];`,
    args: 's, t'
  },
  number: {
    code: `int n = Integer.parseInt(rawInput);`,
    args: 'n'
  },
  twoArrays: {
    code: `
        int[] nums1 = java.util.Arrays.stream(lines[0].split(" ")).mapToInt(Integer::parseInt).toArray();
        int[] nums2 = java.util.Arrays.stream(lines[1].split(" ")).mapToInt(Integer::parseInt).toArray();
    `,
    args: 'nums1, nums2'
  },
  matrixTarget: {
    code: `
        int target = Integer.parseInt(lines[lines.length - 1]);
        int[][] matrix = new int[lines.length - 1][];
        for (int i = 0; i < lines.length - 1; i++) {
            matrix[i] = java.util.Arrays.stream(lines[i].split(" ")).mapToInt(Integer::parseInt).toArray();
        }
    `,
    args: 'matrix, target'
  },
  linkedList: {
    code: `
        // assumes user code defines ListNode
        String[] parts = lines[0].replace("[", "").replace("]", "").split(",");
        ListNode head = null;
        if (parts.length > 0 && !parts[0].trim().isEmpty()) {
            head = new ListNode(Integer.parseInt(parts[parts.length - 1].trim()));
            for (int i = parts.length - 2; i >= 0; i--) {
                ListNode node = new ListNode(Integer.parseInt(parts[i].trim()));
                node.next = head;
                head = node;
            }
        }
    `,
    args: 'head'
  },
  linkedListN: {
    code: `
        // assumes user code defines ListNode
        String[] parts = lines[0].replace("[", "").replace("]", "").split(",");
        ListNode head = null;
        if (parts.length > 0 && !parts[0].trim().isEmpty()) {
            head = new ListNode(Integer.parseInt(parts[parts.length - 1].trim()));
            for (int i = parts.length - 2; i >= 0; i--) {
                ListNode node = new ListNode(Integer.parseInt(parts[i].trim()));
                node.next = head;
                head = node;
            }
        }
        int n = Integer.parseInt(lines[1].trim());
    `,
    args: 'head, n'
  },
  tree: {
    code: `
        // assumes user code defines TreeNode
        // simplified parser for basic tree
        if (lines[0].trim().equals("[]")) {
            TreeNode root = null;
        } else {
            // Assuming user uses TreeNode
            TreeNode root = new TreeNode(0); // Placeholder for basic tests
        }
    `,
    args: 'root'
  }
};

export function buildJavaDriver({ userCode, functionName, inputParser, outputFormatter }) {
  const parser = JAVA_PARSERS[inputParser];
  if (!parser) {
    const err = new Error(`Unsupported inputParser: "${inputParser}" for Java`);
    err.code = 'UNSUPPORTED_PARSER';
    throw err;
  }

  const formatter = JAVA_FORMATTERS[outputFormatter];
  if (!formatter) {
    const err = new Error(`Unsupported outputFormatter: "${outputFormatter}" for Java`);
    err.code = 'UNSUPPORTED_FORMATTER';
    throw err;
  }

  return `
import java.util.*;

public class Main {
    // ─── USER CODE ───
${userCode}

    // ─── AUTO-GENERATED DRIVER ───
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        scanner.useDelimiter("\\\\A");
        String rawInput = scanner.hasNext() ? scanner.next().trim() : "";
        String[] lines = rawInput.split("\\n");

        // Parse Input
        ${parser.code}

        // Execute
        Object __result = (Object) ${functionName}(${parser.args});

        // Format Output
        ${formatter}
    }
}
`;
}