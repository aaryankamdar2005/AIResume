# AI-Powered Resume Builder

A production-ready AI-powered Resume Builder Web Application that allows users to create, edit, and manage professional resumes using both manual editing and AI-powered natural language modifications.

## 🌟 Core Features

- **Multi-Modal Resume Creation**: Build resumes manually using structured forms or directly edit content in a LaTeX-style editor.
- **AI Resume Editing Chatbot**: Give instructions like "Improve the wording of my internship description" and watch the AI update your resume instantly.
- **Voice Assistant Editing**: Utilize browser speech recognition to command updates (e.g., "Add a new skill section").
- **Real-Time Live Preview**: See your changes render instantly alongside the editor.
- **Resume Version Management**: Complete history tracking. Every modification creates a restorable version point.
- **Cloud Storage & Export**: Securely store multiple resumes and seamlessly export them to high-resolution PDF or DOC formats.
- **Intelligent Optimization**: Receive ATS scoring estimates and suggestions for missing skills or weak bullet points.
- **Robust Authentication**: Email/Password login coupled with OAuth (Google, GitHub) using secure JWT sessions.

## 💻 Tech Stack

- **Frontend**: ReactJS, TailwindCSS, Zustand (State Management), Vite
- **Backend**: Node.js, Express.js, Puppeteer (PDF Export)
- **Database**: MongoDB (Mongoose)
- **AI Integration**: OpenAI API (for Chatbot and Optimization)
- **Authentication**: JWT, Passport.js (OAuth)
- **Storage**: AWS S3 (Cloud file storage)

## 📂 Project Structure

```text
ResumeBuilderNew/
├── backend/          # Node.js Express API server
│   ├── src/          # Controllers, Models, Routes, Services
│   └── package.json  
└── frontend/         # React.js Vite Application
    ├── src/          # Components, Pages, Hooks, Services
    └── package.json  
```

## 🚀 System Architecture

The application is structured around a decoupled frontend and backend. The React client handles the complex UI state, live preview orchestration, and captures voice input via the Web Speech API. Modifying commands are sent to the robust Node.js backend which coordinates with the database to track version history and integrates with LLMs (e.g., OpenAI) to securely apply AI edits ensuring strict data structures. 

*For an in-depth look at Database Schemas, API Endpoints, and detailed workflows, please see the System Architecture documentation accompanying this repository.*

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or MongoDB Atlas)
- Developer accounts for Google & GitHub (for OAuth setup)
- OpenAI API Key

### Backend Setup
1. `cd backend`
2. `npm install`
3. Create a `.env` file referencing `.env.example` to supply variables (MongoDB URI, JWT Secret, OAuth Keys, OpenAI Key).
4. Run `npm run dev` to start the API.

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. Create a `.env` file referencing `.env.example` (VITE_API_BASE_URL).
4. Run `npm run dev` to start the development server.

## 🛡️ Security & Performance

- **Environment Variables**: Strict separation of secrets (API keys, DB URIs) from source code.
- **Error Handling**: Standardized API error responses and frontend graceful degradation.
- **JWT Protection**: Secured endpoints validated against stateless HTTP-only cookies and tokens.
- **Rate Limiting**: Protect AI and Authentication endpoints against abuse.

---

*Designed and Architected by Antigravity*
