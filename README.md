# InterviewMate AI — AI-Powered Campus Placement & Interview Preparation Platform

![InterviewMate AI Banner](https://img.shields.io/badge/InterviewMate-AI%20Platform-indigo?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20MongoDB%20%7C%20TailwindCSS-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)

**InterviewMate AI** is a modern, production-ready, full-stack web application designed specifically for college students and fresh engineering graduates preparing for campus placements, technical hiring rounds, aptitude diagnostics, and HR interviews.

Built to serve as a flagship resume/portfolio project, it integrates conversational AI interviewers, voice speech-to-text, timed aptitude quizzes with step-by-step mathematical explanations, core engineering coding evaluation, ATS resume scanning, and multi-metric candidate performance analytics.

---

## 🌟 Key Features

### 1. 🚀 Modern Portfolio Landing Page
- High-conversion hero section with dynamic badge and live interview console preview.
- Placement metrics counter (**94.2% placement rate, 50,000+ questions evaluated, 120+ college drives supported**).
- Interactive feature matrix for Quantitative Aptitude, Logical Reasoning, Technical Prep, AI Mock Interviews, HR Behavioral rounds, and Resume ATS Scanner.
- 4-step placement roadmap and clean footer.

### 2. 🔐 JWT Authentication & Student Profiles
- Registration with campus-specific fields: **Full Name, College / University, Degree, Graduation Year, Target Job Role, and Skills**.
- Secure password hashing with `bcryptjs` and stateless session management with `jsonwebtoken`.
- **1-Click Demo Accounts**: Instant access as **Demo Student** (`demo.student@interviewmate.ai`) or **Demo Admin** (`admin@interviewmate.ai`) for frictionless showcase and portfolio testing.

### 3. 📊 Candidate Dashboard & Readiness Index
- Personalized welcome banner tailored to the student's target role and graduation batch.
- **Placement Readiness Index Gauge**: Real-time calculated placement readiness score (0-100%).
- KPI scorecards: Questions solved, Mock interviews completed, Average score, Quizzes taken.
- Interactive Recharts area chart illustrating 7-day performance trajectory.
- Category proficiency bars and recent activity feed.

### 4. 🧮 Quantitative Aptitude Practice
- **9 Core Placement Categories**:
  - Quantitative Aptitude
  - Number System
  - Percentages
  - Profit and Loss
  - Time and Work
  - Time, Speed and Distance
  - Probability
  - Ratios
  - Averages
- Timed quiz runner with countdown clock (1 minute per question).
- Interactive Question Navigator palette (answered vs. unvisited indicators).
- Automatic score computation, celebratory confetti on high scores, and **step-by-step mathematical logic breakdowns** for every single question.

### 5. 🧠 Logical Reasoning Diagnostic Tests
- **8 Reasoning Modules**: Number Series, Coding-Decoding, Blood Relations, Direction Sense, Syllogisms, Analogies, Seating Arrangement, and Pattern Problems.
- Difficulty filtering: **Easy, Medium, Hard**.
- Step-by-step deduction explanations for each logic problem.

### 6. 💻 Technical Interview Preparation (Code & Concepts)
- Covers **9 Core Engineering Disciplines**:
  - Java (JVM, Collections, Multithreading)
  - Python (GIL, Generators, OOP, Memory)
  - C / C++ (Pointers, Dynamic Memory, Valgrind)
  - SQL (Joins, Aggregations, Indexing, Transactions)
  - OOP (Encapsulation, Polymorphism, Abstraction, Inheritance)
  - Data Structures & Algorithms (Hash Maps, Trees, Graphs, Complexity)
  - DBMS (ACID, Isolation Levels, Normalization)
  - Operating Systems (Deadlocks, Coffman Conditions, Scheduling)
  - Computer Networks (TCP 3-Way Handshake, OSI, UDP)
- Code and explanation console with word count.
- **AI-Powered Evaluation**:
  - Score (0 to 100).
  - Constructive, coaching critique.
  - What you did well (Strengths).
  - Missing points and edge cases.
  - Exemplary model answer for placement rounds.

### 7. 🤖 Interactive AI Mock Interview Studio (Flagship)
- Pre-interview setup: Target Role, Experience Level (Fresher, 1-2 Yrs, Intern), Interview Type (Technical, HR, Mixed), and Question Count.
- **Multi-Turn Dynamic Conversation**:
  - AI asks one realistic question at a time.
  - Speech-to-Text Voice Input using the Web Speech API (candidates can speak directly into their microphone!).
  - Contextual AI evaluation of candidate answers.
  - Generates intelligent follow-up questions adapted to what the student said.
- **Official Performance Scorecard**:
  - Overall Score & Readiness Badge.
  - **4-Dimensional Radar & Bar Chart**: Technical Knowledge, Communication, Problem Solving, Confidence & Clarity.
  - Bulleted Observed Strengths and Actionable Areas to Improve.
  - Recommended Study Topics.
  - Past interview dialogue history viewer.

### 8. 👥 HR Behavioral Interview Coach (STAR Method)
- Classic behavioral questions: "Tell me about yourself", "Why should we hire you?", "Strengths and Weaknesses", "Handling Team Conflict", "5-Year Career Vision".
- Built-in **STAR Methodology Guide** (Situation, Task, Action, Result).
- Automated AI feedback evaluating each component of the candidate's story.

### 9. 📄 Resume ATS Analyzer
- Drag-and-drop PDF resume upload (using `multer` and `pdf-parse`).
- Keyword density extraction across Technical Languages, Soft Skills, and Developer Tools.
- Section completeness audit (Education, Projects, Experience, Certifications, Portfolio Links).
- **ATS Score (0 to 100)** with missing section warnings.
- Personalized project recommendations and **interview questions generated directly from the uploaded resume**!

### 10. 📈 Analytics & Progress Tracking
- Dimension radar visualization.
- Weekly test frequency bar chart.
- Complete historical quiz attempt log with filterable performance and time records.

### 11. 🔍 Searchable Question Bank & Bookmarks
- Fast full-text keyword search across questions, topics, and categories.
- Filters by Category, Topic, and Difficulty.
- Bookmarking engine with dedicated "My Bookmarks" tab.

### 12. 🛡️ Admin Management Dashboard
- Platform-wide statistics (registered students, total questions, quizzes taken, mock interviews completed).
- Registered students directory with college and degree information.
- Question Bank CRUD manager: Create, edit, and delete questions with full validation.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js 18 (Vite)
- **Styling**: Tailwind CSS 3.4 (with custom Dark & Light mode theme system)
- **Icons**: Lucide React
- **Charts**: Recharts (Area, Bar, and Radar charts)
- **Effects**: Canvas Confetti
- **Audio / Voice**: Web Speech API (`webkitSpeechRecognition`)

### Backend
- **Runtime**: Node.js (v20+ LTS)
- **Server Framework**: Express.js
- **Authentication**: JWT (`jsonwebtoken`) + Password Hashing (`bcryptjs`)
- **PDF Processing**: `multer` + `pdf-parse`
- **Database**: MongoDB with Mongoose + Automatic Local JSON Persistence Adapter
- **AI Integration**: Google Gemini API (`gemini-1.5-flash`) + Intelligent Local Heuristic Fallback Engine

---

## 📁 Project Structure

```
interviewmate-ai/
├── client/                               # Frontend React Application
│   ├── public/
│   ├── src/
│   │   ├── components/                   # Reusable UI components
│   │   │   ├── Navbar.jsx                # Header with theme toggle & user badge
│   │   │   ├── Sidebar.jsx               # Dashboard sidebar navigation
│   │   │   ├── Footer.jsx                # Placement impact footer
│   │   │   ├── ProtectedRoute.jsx        # JWT & Admin route authorization
│   │   │   └── Toast.jsx                 # Global notification alert system
│   │   ├── context/
│   │   │   ├── AuthContext.jsx           # Global user authentication state
│   │   │   └── ThemeContext.jsx          # Dark / Light mode theme switcher
│   │   ├── pages/                        # Feature pages
│   │   │   ├── LandingPage.jsx           # Marketing & hero showcase
│   │   │   ├── LoginPage.jsx             # Sign-in with 1-click demo logins
│   │   │   ├── RegisterPage.jsx          # Full student onboarding
│   │   │   ├── DashboardPage.jsx         # Readiness index & score analytics
│   │   │   ├── AptitudePage.jsx          # Timed math quizzes with timer
│   │   │   ├── LogicalReasoningPage.jsx  # Analytical reasoning tests
│   │   │   ├── TechnicalPrepPage.jsx     # Coding questions & AI evaluation
│   │   │   ├── MockInterviewPage.jsx     # Voice/Text AI multi-turn interview
│   │   │   ├── HRInterviewPage.jsx       # Behavioral STAR questions
│   │   │   ├── ResumeAnalyzerPage.jsx    # PDF parsing & ATS score report
│   │   │   ├── ProgressPage.jsx          # Historical logs & streak charts
│   │   │   ├── QuestionBankPage.jsx      # Searchable questions & bookmarks
│   │   │   ├── ProfilePage.jsx           # Editable student profile
│   │   │   └── AdminDashboardPage.jsx    # Management portal for officers
│   │   ├── services/
│   │   │   └── api.js                    # Centralized API client with JWT header
│   │   ├── App.jsx                       # Main application router
│   │   ├── index.css                     # Tailwind directives & custom CSS
│   │   └── main.jsx                      # Vite React entry point
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js                    # Configured with proxy to port 5000
│
├── server/                               # Backend Node.js & Express API
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                     # Resilient Mongoose & Local DB engine
│   │   ├── controllers/
│   │   │   ├── authController.js         # Register, Login, Me, Demo logins
│   │   │   ├── quizController.js         # Aptitude, Reasoning, Scoring, Stats
│   │   │   ├── technicalController.js    # Tech questions & AI answer review
│   │   │   ├── mockInterviewController.js# Multi-turn interview & scorecard
│   │   │   ├── hrController.js           # HR behavioral & STAR evaluation
│   │   │   ├── resumeController.js       # PDF upload & ATS processing
│   │   │   ├── questionBankController.js # Search & bookmark management
│   │   │   └── adminController.js        # System statistics & question CRUD
│   │   ├── middleware/
│   │   │   └── auth.js                   # JWT verification & Admin guards
│   │   ├── models/
│   │   │   ├── User.js                   # Student profile & credentials
│   │   │   ├── Question.js               # Placement question repository
│   │   │   ├── QuizAttempt.js            # Historical quiz records & scores
│   │   │   ├── MockInterview.js          # Multi-turn transcript & scorecard
│   │   │   ├── ResumeAnalysis.js         # Extracted skills & ATS score
│   │   │   └── Bookmark.js               # Saved question relationships
│   │   ├── routes/                       # Express router endpoints
│   │   ├── seeds/
│   │   │   └── seedData.js               # 30+ placement questions & demo accounts
│   │   ├── services/
│   │   │   ├── aiService.js              # Gemini API & NLP evaluation engine
│   │   │   └── resumeService.js          # PDF text extraction & ATS scoring
│   │   └── server.js                     # Express server entry point
│   ├── data/
│   │   └── local_db.json                 # Automatic local persistence database
│   ├── package.json
│   └── .env.example
└── README.md
```

---

## ⚡ Getting Started & Installation

### Prerequisites
- **Node.js** (v18.x or v20.x LTS)
- **npm** (v9.x or higher)

### 1. Clone or Navigate to the Project
```bash
cd "C:\Users\Yogeshwaran. V\.gemini\antigravity\scratch\interviewmate-ai"
```

### 2. Backend Setup
```bash
cd server
npm install
```

Configure your environment variables in `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/interviewmate
JWT_SECRET=interviewmate_jwt_secret_key_2026_dev
GEMINI_API_KEY=
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

> **Note on Database Resilience**: If a local MongoDB daemon or Atlas instance is reachable on port 27017, Mongoose connects seamlessly. If MongoDB is offline, the backend automatically activates the built-in **JSON Persistence Adapter** (`server/data/local_db.json`), ensuring zero-friction setup on any computer!

> **Note on AI API Key**: If a `GEMINI_API_KEY` is provided, live Google Gemini 1.5 Flash models are queried. If omitted, the platform uses its **intelligent built-in NLP evaluation engine** to score answers, provide feedback, and generate follow-up questions authentically.

Seed the demo questions and accounts (runs automatically on startup or manually):
```bash
npm run seed
```

Start the backend server:
```bash
npm start
```
The backend will run on `http://localhost:5000`.

### 3. Frontend Setup
In a new terminal window:
```bash
cd client
npm install
npm run dev
```
The frontend will start on `http://localhost:5173`.

---

## 👤 Demo Accounts (Instant 1-Click Access)

On the login page (`http://localhost:5173/login`), click either 1-click button or use these credentials:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Demo Student** | `demo.student@interviewmate.ai` | `password123` | Full student preparation modules, mock interviews, tests |
| **Demo Admin** | `admin@interviewmate.ai` | `password123` | Student views + Admin Management Dashboard & Question CRUD |

---

## 🔬 User Flows & Testing

1. **Registration & Onboarding**: Register a new student account with college name, degree, graduation year (e.g. 2026), and target job role.
2. **Dashboard Overview**: Check your calculated Readiness Index, view the weekly progress area chart, and explore quick launch actions.
3. **Aptitude Quiz**: Select a category (e.g. *Percentages* or *Time & Work*), start a timed quiz, navigate questions, and view the step-by-step mathematical explanations.
4. **Logical Reasoning**: Solve questions in *Number Series* or *Blood Relations* and review the deduction logic.
5. **Technical Interview**: Pick *Java*, *Python*, or *Data Structures*, write an answer or code snippet, and receive an instant 0-100 score, feedback, and model answer.
6. **AI Mock Interview Studio**: Choose your target role and number of questions. Converse with the AI interviewer using text or **voice input**, answer follow-up questions, and view the **4-dimensional radar scorecard**.
7. **HR Behavioral Prep**: Practice answering "Why should we hire you?" and inspect the **STAR method analysis**.
8. **Resume ATS Analyzer**: Upload any PDF resume to extract skills, calculate the ATS score, and receive interview questions tailored to that resume.
9. **Question Bank**: Search for keywords like "TCP" or "deadlock", filter by difficulty, and bookmark questions.
10. **Admin Portal**: Log in as admin to view platform statistics and add custom questions.

---

## 🔮 Future Enhancements
- Video avatar integration with WebRTC for simulated face-to-face visual interviews.
- Coding playground with an interactive code execution sandbox (Judge0 API).
- Peer-to-peer mock interview matching between college batchmates.
- WhatsApp / Email weekly campus placement diagnostic test summaries.

---

## 📄 License
This project is licensed under the **MIT License**.
