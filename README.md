# CareerBuilder.ai - AI-Powered Career Architect

An intelligent platform for high-performance resume generation and career strategy. Transform raw professional data into structured, ATS-optimized narratives through natural language and spatial design.

## 🚀 Core AI Features

- **Prompt-Driven Resume Generation**: Create professional resumes instantly by providing natural language prompts. The AI engine handles formatting, structure, and content synthesis.
- **Contextual AI Bullet Optimization**: Refine existing experiences with LLM-driven verb optimization and metric-focused results. Adjust tone (e.g., "Make this more executive" or "Make this more technical") via the AI Copilot.
- **AI Mock Interview Room**: An immersive, real-time simulation suite. Generates 3 tailored technical questions based on your resume and target JD.
- **Neural Transcription & Scoring**: Integrated **Whisper-large-v3** for real-time audio transcription and **Llama-3.3-70B** for scoring and improvement feedback.
- **Plagiarism Core**: Integrated external API validation to detect generic or copied content, ensuring original professional narratives.
- **Matrix Match Analyzer**: Direct alignment of your resume against specific Job Descriptions. Identifies missing skills, structural gaps, and priority keywords required for target Applicant Tracking Systems.
- **Neural Content Refinement**: Intelligent rewriting of weak bullet points into high-impact, quantified professional achievements.
- **Blueprint Architect**: A dedicated IDE-style workspace for manual precision, ensuring total control over the resume's structural foundation.
- **LaTeX-Fidelity PDF Export**: High-resolution, multi-format export powered by Puppeteer to ensure your document renders perfectly in every digital and physical environment.



## 💻 Technical Infrastructure

### Frontend
- **Engine**: Vite + React
- **Design System**: Tailwind CSS 4.0 with customized @theme variables
- **Spatial UI**: Three.js & Framer Motion for immersive, responsive interactions
- **State Architecture**: Zustand for atomic, performant data synchronization

### Backend
- **Core API**: Node.js + Express
- **Intelligence**: Groq SDK (Llama-3 70B & Mixtral optimization)
- **Database**: MongoDB (Mongoose schemas for robust versioning)
- **Orchestration**: Puppeteer for PDF synthesis and mammoth/pdf-parse for content ingestion

## 📂 Project Structure

```text
AIResume/
├── backend/          # Node.js API server (AI Logic, Auth, PDF Synthesis)
└── frontend/         # React.js Spatial Workspace (Design Rail, Canvas, AI Inspector)
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (Running instance)
- Groq Cloud API Key

### Quick Start
1. **Backend**: `cd backend && npm install && npm run dev`
2. **Frontend**: `cd frontend && npm install && npm run dev`

---


