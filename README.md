<div align="center">

🚀 DSA Revision Platform
Stop wondering what to solve next.
Build your own DSA revision lists, practice random questions from them, and turn every attempt into measurable progress.

Live Demo: DSA Revision Platform

<img width="1886" height="716" alt="image" src="https://github.com/user-attachments/assets/8b91a565-3674-42aa-bba3-366cdc215276" />
<img width="1886" height="913" alt="image" src="https://github.com/user-attachments/assets/e41ea754-48bf-44a4-8587-3e7feb801d7b" />
<img width="1907" height="920" alt="image" src="https://github.com/user-attachments/assets/5e6ee72a-e835-4714-aefd-a8ebf3803365" />


Features • How It Works • Tech Stack • Getting Started • API • Roadmap
</div>

📖 About the Project
When preparing for DSA, most students solve hundreds of problems — and then forget which ones they solved, which ones they struggled with, and which topics are weak.

DSA Revision Platform is not another LeetCode clone. It focuses on one thing: personalized revision.
A personalized DSA revision platform where users create custom question lists and practice them through randomized, performance-aware revision sessions.

Instead of spending time deciding what to study, you:
1. Pick questions from a central catalogue
2. Save them as your own revision list
3. Hit Start Practice — the platform picks a random question from your list
4. Write code, run it, submit it, and track how you're doing
✨ Features
Core (MVP)
Feature	Description
🔐 Authentication	Register / login with JWT; every user has their own lists, submissions, and progress
📚 Question Catalogue	Browse and search questions; filter by topic, difficulty, and platform
✅ Multi-select	Select many questions at once and add them to a list
📝 My Lists	Create and manage personal revision lists (e.g. Array Revision, Placement Questions, Weak Questions)
🎲 Random Practice	A random question is picked only from your chosen list, with no repetition within a session
💻 Code Editor	Write solutions in Java, C++, Python, or JavaScript
▶️ Run Code	Execute your code against visible test cases
🏆 Submit	Execute against all test cases (visible + hidden) to determine correctness
📊 Progress Tracking	Attempts, solved count, accuracy, and recent activity


Planned
- 💡 Progressive hints (Hint 1 → Hint 2 → Hint 3, never the full solution immediately)
- 🤖 AI-generated hints (Gemini)
- 📈 Weak-topic detection and targeted revision lists
- 🔖 Bookmarks and 📝 personal notes
- 🌗 Light / dark theme and user settings
🔄 How It Works
Register / Login
      ↓
Browse Question Catalogue
      ↓
Select Multiple Questions
      ↓
Create Revision List
      ↓
Start Practice  →  Random question from your list
      ↓
Write Code  →  Run Code (visible tests)  →  Submit (all tests)
      ↓
Accepted ✅ / Wrong Answer ❌ / Error ⚠️
      ↓
Submission saved  →  Progress updated  →  Next question
Code Execution Architecture
User code is never run on the application server and never sent to Judge0 directly from the browser. Credentials stay on the backend.
React Code Editor
       │  POST /api/code/run
       ▼
Express Backend  (codeController.js)
       │
       ▼
judge0Service.js  ──►  Judge0  (executes code in a sandbox)
       │
       ▼
Normalized result  ──►  React  (test-case results UI)
Why this design?
- 🔒 Judge0 API keys are never exposed in the browser
- 🧱 The backend enforces allowed languages, size limits, and execution limits
- 🧩 Raw Judge0 responses are converted into clean application statuses
🛠️ Tech Stack
Layer	Technology
Frontend	React, Vite, React Router, Tailwind CSS, Axios, code editor component
Backend	Node.js, Express.js, REST API
Auth	JWT, bcryptjs
Database	MongoDB, Mongoose (MongoDB Atlas)
Code Execution	Judge0
AI Hints (planned)	Google Gemini API
Tools	Git, GitHub, Postman / Thunder Client


📁 Project Structure
dsa-revision-platform/
│
├── backend/
│   ├── config/            # Database connection (db.js)
│   ├── controllers/       # Request handlers (auth, questions, lists, practice, code)
│   ├── middleware/        # JWT auth middleware
│   ├── models/            # Mongoose models (User, Question, RevisionList, Submission, Progress)
│   ├── routes/            # Express routes
│   ├── services/          # judge0Service.js — all communication with Judge0
│   ├── .env.example
│   ├── index.js
│   └── package.json
│
└── frontend/
    └── src/
        ├── components/
        │   ├── common/        # Button, Input, Card, Badge
        │   ├── layout/        # Navbar, Sidebar, DashboardLayout
        │   ├── questions/     # QuestionCard, QuestionFilters, QuestionList
        │   ├── lists/         # ListCard, CreateListModal
        │   ├── practice/      # PracticeCard, ResultModal
        │   └── dashboard/     # StatCard, TodaysPractice, RecentActivity, ...
        ├── pages/             # Dashboard, Questions, MyLists, CreateList,
        │                      # Practice, Progress, Login, Register
        ├── data/
        ├── hooks/
        ├── utils/
        ├── App.jsx
        └── main.jsx
🚦 Getting Started
Prerequisites
- Node.js v18 or higher
- MongoDB — a local instance or a free MongoDB Atlas cluster
- A Judge0 API endpoint (hosted API or self-hosted) — see the Judge0 docs for current setup options
- Git
1. Clone the repository
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>
2. Set up the backend
cd backend
npm install
Create your environment file:
cp .env.example .env
Open .env and fill in your values:
# Server
PORT=5000

# Database
MONGO_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_long_random_secret

# Judge0
JUDGE0_API_URL=your_judge0_api_url
JUDGE0_API_KEY=your_judge0_api_key
Variable	What it is
PORT	Port the Express server runs on
MONGO_URI	MongoDB connection string
JWT_SECRET	Secret used to sign login tokens — use a long random string
JUDGE0_API_URL	Base URL of the Judge0 instance you use
JUDGE0_API_KEY	Key for your Judge0 provider (if your chosen service requires one)


⚠️ Never commit your .env file. Make sure backend/.gitignore contains:
.env
node_modules/

Start the backend:
npm run dev
The API should now be running at http://localhost:5000.
3. Set up the frontend
Open a new terminal:
cd frontend
npm install
npm run dev
Create frontend/.env if your app needs an API base URL:
VITE_API_URL=http://localhost:5000/api
The app should now be running at http://localhost:5173.
4. Try it out
1. Open http://localhost:5173
2. Register a new account
3. Go to Questions, select a few, and create a list
4. Open My Lists → Practice
5. Write a solution and click Run Code
🔌 API Reference
Routes marked 🔒 require a JWT: Authorization: Bearer <token>.
Update this table as endpoints are added or renamed.

Auth
Method	Endpoint	Description
POST	/api/auth/register	Create a new account
POST	/api/auth/login	Log in and receive a JWT


Questions & Lists
Method	Endpoint	Description
GET	/api/questions	List / filter questions
GET	/api/lists 🔒	Get your revision lists
POST	/api/lists 🔒	Create a revision list


Code Execution
Method	Endpoint	Description
POST	/api/code/run 🔒	Run code against visible test cases
POST	/api/code/submit 🔒	Run code against all test cases (including hidden)


Example — Run Code response
{
  "success": true,
  "status": "RUN_COMPLETE",
  "testCases": [
    { "testCase": 1, "passed": true,  "actualOutput": "[0,1]", "expectedOutput": "[0,1]" },
    { "testCase": 2, "passed": false, "actualOutput": "[1,2]", "expectedOutput": "[0,1]" }
  ]
}
Example — Submit response
{
  "status": "ACCEPTED",
  "accepted": true,
  "passed": 10,
  "total": 10
}
Result Statuses
Status	Meaning
ACCEPTED	All test cases passed
WRONG_ANSWER	Code ran, but output didn't match
COMPILATION_ERROR	Code failed to compile
RUNTIME_ERROR	Code crashed while running
TIME_LIMIT_EXCEEDED	Code took too long
MEMORY_LIMIT_EXCEEDED	Code used too much memory
IN_QUEUE / PROCESSING	Execution is still in progress
SYSTEM_ERROR	Something went wrong on our side


🗄️ Data Models
User           → name, email, password (hashed), createdAt
Question       → title, description, topic[], difficulty, platform,
                 examples, starterCode, testCases[]
RevisionList   → userId, name, questions[], createdAt
Submission     → userId, questionId, language, code, status,
                 testCasesPassed, totalTestCases, runtime, memory, submittedAt
Progress       → userId, questionId, attempts, solved, lastAttempt, performance
Each test case looks like:
{ "input": "...", "expectedOutput": "...", "isHidden": false }
Hidden test cases are never sent to the frontend.
🔐 Security Notes
- Judge0 credentials live only in backend environment variables
- The backend validates the language against an allow-list — it never trusts a languageId from the client
- Users cannot change CPU, memory, or network settings for execution
- Source code size and request size are limited
- Submitted code is executed only through Judge0 — never via child_process on the app server
- Passwords are hashed with bcryptjs; protected routes require a valid JWT
- Rate limiting is planned
🗺️ Roadmap
- [x] Authentication
- [x] Question catalogue and filters
- [x] Revision lists
- [x] Random, non-repeating practice sessions
- [x] Judge0 integration — Run Code
- [x] Judge0 integration — Submit with hidden tests
- [x] Submission history
- [x] Progress and accuracy tracking
- [x] Weak-topic analysis 
- [x] Bookmarks and notes

📌 A Note on Question Content
Question statements and test cases in this project should be original or properly licensed. Please don't copy proprietary problem statements or hidden test cases from third-party platforms. Linking to the original problem on its platform is fine.
🤝 Contributing
Contributions, issues, and feature ideas are welcome!
1. Fork the repository
2. Create a branch: git checkout -b feature/your-feature
3. Commit your changes: git commit -m "Add your feature"
4. Push: git push origin feature/your-feature
5. Open a Pull Request
📄 License
Distributed under the MIT License. See LICENSE for details.
👤 Author
Sakshi Chavan
<div align="center">

⭐ If this project helps you, consider giving it a star!
</div>
