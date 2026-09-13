// backend/scripts/updateAllQuestions.js
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ═══ CONFIGURATION ═══
const API_URL = 'http://localhost:5000/api';
const EMAIL = 'sunny@gmail.com';        // ← CHANGE
const PASSWORD = 'Sunny123';  // ← CHANGE

async function main() {
  console.log('🚀 Update All Questions Script\n');

  // 1. Login
  console.log('📝 Logging in...');
  const loginRes = await axios.post(`${API_URL}/auth/login`, { email: EMAIL, password: PASSWORD });
  const token = loginRes.data.token;
  console.log(`✅ Logged in as ${loginRes.data.user.email}\n`);

  const authHeaders = { Authorization: `Bearer ${token}` };

  // 2. Load config
  const configPath = path.join(__dirname, '..', 'data', 'questions-execution-config.json');
  const configs = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  console.log(`📦 Loaded ${configs.length} execution configs\n`);

  // 3. Fetch existing questions
  console.log('📥 Fetching existing questions...');
  const allRes = await axios.get(`${API_URL}/questions`);
  const existing = allRes.data.questions;
  console.log(`✅ Found ${existing.length} questions in DB\n`);

  // 4. Update each
  let updated = 0, notFound = 0, failed = 0;

  for (const cfg of configs) {
    const q = existing.find(x => x.title === cfg.title);
    if (!q) {
      console.log(`❓ Not found: "${cfg.title}"`);
      notFound++;
      continue;
    }

    try {
      await axios.put(
        `${API_URL}/questions/${q._id}`,
        {
          functionName: cfg.functionName,
          inputParser: cfg.inputParser,
          outputFormatter: cfg.outputFormatter,
          testCases: cfg.testCases
        },
        { headers: authHeaders }
      );
      console.log(`✅ Updated: "${cfg.title}" (${cfg.testCases.length} tests)`);
      updated++;
    } catch (err) {
      console.log(`❌ Failed: "${cfg.title}" — ${err.response?.data?.message || err.message}`);
      failed++;
    }
  }

  console.log('\n═══════════════════════════════════════');
  console.log(`✅ Updated:   ${updated}`);
  console.log(`❌ Failed:    ${failed}`);
  console.log(`❓ Not found: ${notFound}`);
  console.log(`📦 Total:     ${configs.length}`);
  console.log('═══════════════════════════════════════\n');
}

main().catch(err => {
  console.error('❌ Fatal:', err.message);
  process.exit(1);
});