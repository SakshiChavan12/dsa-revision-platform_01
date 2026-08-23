// backend/scripts/importQuestions.js
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const importQuestions = async () => {
  try {
    // 1. Read the JSON file
    const filePath = join(__dirname, '..', 'data', 'questions.json');
    const rawData = readFileSync(filePath, 'utf-8');
    const questions = JSON.parse(rawData);

    console.log(`Questions found: ${questions.length}`);

    let inserted = 0;
    let skipped = 0;

    // 2. Loop through each question and send it to the API
    for (const question of questions) {
      try {
        // First, check if it already exists by searching
        const existingResponse = await fetch(`http://localhost:5000/api/questions?title=${encodeURIComponent(question.title)}`);
        const existingData = await existingResponse.json();

        // Check if the title already exists in the database (This is a frontend filter, but we'll manually check)
        const allQuestions = await fetch(`http://localhost:5000/api/questions`);
        const allData = await allQuestions.json();
        const exists = allData.questions.some(q => q.title === question.title);

        if (exists) {
          console.log(`⚠️ Question already exists: ${question.title}`);
          skipped++;
        } else {
          // Send a POST request to your working API!
          const response = await fetch('http://localhost:5000/api/questions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              // You must put your actual JWT token here from your login!
              'Authorization': 'Bearer YOUR_JWT_TOKEN_HERE' 
            },
            body: JSON.stringify(question)
          });

          if (response.ok) {
            console.log(`✅ Added: ${question.title}`);
            inserted++;
          } else {
            console.log(`❌ Failed to add: ${question.title}`);
          }
        }
      } catch (innerError) {
        console.log(`❌ Error with question: ${question.title} - ${innerError.message}`);
      }
    }

    console.log(`Questions inserted: ${inserted}`);
    console.log(`Questions skipped: ${skipped}`);
    console.log('✅ Import completed successfully');
    process.exit(0);

  } catch (error) {
    console.error('❌ Failed to read file or import:', error.message);
    process.exit(1);
  }
};

importQuestions();