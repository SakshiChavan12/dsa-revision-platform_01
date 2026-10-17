// backend/services/executionService.js
import axios from 'axios';

// You can change this back to 'https://ce.judge0.com' if you don't have RapidAPI
const JUDGE0_URL = process.env.JUDGE0_URL || 'https://ce.judge0.com';

// Submit all test cases at once (CodeArena style)
export const submitBatch = async (submissions) => {
  try {
    const response = await axios.request({
      method: "POST",
      url: `${JUDGE0_URL}/submissions/batch`,
      params: { base64_encoded: "false" },
      headers: { "Content-Type": "application/json" },
      data: { submissions },
    });
    return response.data;
  } catch (error) {
    console.error("Judge0 submitBatch error:", error.response?.data || error.message);
    throw new Error("Judge0 API error during batch submission.");
  }
};

// Poll for the results of the batch
export const submitToken = async (resultToken) => {
  if (!resultToken || resultToken.length === 0) return [];
  
  const waiting = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  for (let attempts = 0; attempts < 15; attempts++) {
    try {
      const response = await axios.request({
        method: "GET",
        url: `${JUDGE0_URL}/submissions/batch`,
        params: {
          tokens: resultToken.join(","),
          base64_encoded: "false",
          fields: "*",
        },
      });

      // Check if all submissions are finished (status > 2 means done)
      const done = response.data.submissions.every((r) => r.status_id > 2);
      if (done) return response.data.submissions;

      await waiting(2000); // Wait 2 seconds before checking again
    } catch (error) {
      console.error("Judge0 submitToken error:", error.response?.data || error.message);
      throw new Error("Judge0 Token error.");
    }
  }
  throw new Error("Judge0 execution timed out.");
};

// Translate Judge0 status IDs to strings for your frontend
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