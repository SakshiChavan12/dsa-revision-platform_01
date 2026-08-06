// src/data/questions.js
export const QUESTIONS = [
  {
    id: 101,
    title: "Two Sum",
    difficulty: "Easy",
    topics: ["Array", "Hash Map"],
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]", explanation: "" },
      { input: "nums = [3,3], target = 6", output: "[0,1]", explanation: "" }
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    starterCode: `function twoSum(nums, target) {
    // Write your solution here
    
}`,
    solutionCode: `function twoSum(nums, target) {
    const map = new Map();

    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}`,
    hints: [
      "Try using a hash map to store numbers and their indices as you iterate through the array.",
      "Think about the complement: If we are at nums[i], what value are we looking for in the map?",
      "Hash map lookups are O(1) on average. Can you solve this in a single pass?",
      "Make sure to store the number as the key and the index as the value before checking for the complement."
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)"
  },
  {
    id: 102,
    title: "Add Two Numbers",
    difficulty: "Medium",
    topics: ["Linked List", "Math"],
    description: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.",
    examples: [
      { input: "l1 = [2,4,3], l2 = [5,6,4]", output: "[7,0,8]", explanation: "342 + 465 = 807." }
    ],
    constraints: ["The number of nodes in each linked list is in the range [1, 100].", "0 <= Node.val <= 9", "The number does not contain any leading zero."],
    starterCode: `function addTwoNumbers(l1, l2) {
    // Write your solution here
    
}`,
    solutionCode: `function addTwoNumbers(l1, l2) {
    let dummy = new ListNode(0);
    let current = dummy;
    let carry = 0;
    
    while (l1 !== null || l2 !== null) {
        let x = (l1 !== null) ? l1.val : 0;
        let y = (l2 !== null) ? l2.val : 0;
        let sum = x + y + carry;
        carry = Math.floor(sum / 10);
        current.next = new ListNode(sum % 10);
        current = current.next;
        if (l1 !== null) l1 = l1.next;
        if (l2 !== null) l2 = l2.next;
    }
    if (carry > 0) {
        current.next = new ListNode(carry);
    }
    return dummy.next;
}`,
    hints: ["Carry the 1 when the sum of two digits exceeds 9.", "Use a dummy head to simplify handling the result list."],
    timeComplexity: "O(max(m, n))",
    spaceComplexity: "O(max(m, n))"
  },
  // ... Add questions 103, 104, 105, 106 here following the same structure
];

export const getQuestionById = (id) => {
  return QUESTIONS.find(q => q.id === parseInt(id));
};