// backend/services/languageRegistry.js

export function normalizeLanguage(lang) {
  if (!lang) return "";
  const l = lang.toString().trim().toLowerCase();
  if (l === "c++" || l === "cpp" || l === "cplusplus") return "cpp";
  if (l === "javascript" || l === "js" || l === "javascript (node.js)") return "javascript";
  if (l === "python" || l === "python3" || l === "py") return "python";
  if (l === "java") return "java";
  return l;
}

export function getLanguageById(lang) {
  // Using standard Judge0 IDs. If you use RapidAPI, verify these match your subscription.
  const language = {
    "c++": 54,
    "cpp": 54,
    "java": 62,        // OpenJDK 13
    "javascript": 63,  // Node.js 12
    "python": 71,      // Python 3.8
    "typescript": 74,
  };
  const normalized = normalizeLanguage(lang);
  return language[normalized] || language[lang?.toString().toLowerCase()];
}