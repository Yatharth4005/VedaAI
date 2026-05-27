# VedaAI — AI Assessment Creator

> A premium, AI-powered exam and question paper generator designed for school teachers. Built with a robust monorepo architecture using Next.js 14, Express, BullMQ, Redis, Socket.io, and the Google Gemini API.

---

## Architecture Overview

VedaAI is engineered to handle complex LLM generation flows asynchronously, ensuring that teachers never experience a frozen UI while waiting for questions to be structured, formatted, and validated.

```
┌───────────────────────────────────────┐
│          Next.js 14 Frontend          │ (Deployed on Vercel)
│     (Zustand, Tailwind, Socket.io)     │
└──────────────────┬────────────────────┘
                   │ REST APIs &
                   │ Realtime WebSockets
                   ▼
┌───────────────────────────────────────┐
│          Express API Server           │ (Deployed on Railway)
│      (CORS, Socket.io, Mongoose)      │
└──────────────────┬────────────────────┘
                   │
         ┌─────────┴─────────┐
         ▼                   ▼
┌─────────────────┐ ┌─────────────────┐
│  MongoDB Atlas  │ │  Upstash Redis  │
│  (Data Store)   │ │  (BullMQ Queue) │
└─────────────────┘ └────────┬────────┘
                             │
                             ▼
┌───────────────────────────────────────┐
│             BullMQ Worker             │ (Deployed on Railway)
│     (Gemini 2.5 Flash, Validation)    │
└───────────────────────────────────────┘
```

---

## Tech Stack & Key Features

*   **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui components, Zustand (State Management), React Hook Form + Zod (Validation), `Socket.io-client` for real-time progress updates, and `@react-pdf/renderer` for pixel-perfect PDF exports.
*   **Backend:** Express, Mongoose (MongoDB), BullMQ (Job Queue), `Socket.io` (Realtime events).
*   **AI Engine:** Google Gemini SDK (`@google/generative-ai`) leveraging Zod-parsed structured JSON outputs via `gemini-2.5-flash`.
*   **Database & Cache:** MongoDB Atlas for persistence and Upstash Redis for message queuing and job handling.

---

## Local Setup & Installation

### Prerequisites
- **Node.js** v20+
- **Docker Desktop** (for running local MongoDB & Redis)
- A **Google AI Studio** API key ([Get one here](https://aistudio.google.com/))

### 1. Launch Infrastructure
Run the local MongoDB and Redis instances via Docker Compose:
```bash
docker compose up -d
```

### 2. Configure & Start Backend
1. Navigate into the backend directory and set up environment variables:
   ```bash
   cd backend
   cp .env.example .env
   ```
2. Edit `backend/.env` and supply your Gemini API key:
   ```env
   PORT=4000
   MONGODB_URI=mongodb://localhost:27017/vedaai
   REDIS_URL=redis://localhost:6379
   GEMINI_API_KEY=AIzaSy...
   GEMINI_MODEL=gemini-2.5-flash
   FRONTEND_URL=http://localhost:3000
   NODE_ENV=development
   ```
3. Install dependencies and start the API server:
   ```bash
   npm install
   npm run dev          # Starts Express + WebSockets on port 4000
   ```
4. Start the BullMQ Worker in a separate terminal:
   ```bash
   cd backend
   npm run worker       # Processes Gemini generation jobs
   ```

### 3. Configure & Start Frontend
1. Navigate to the frontend directory and configure environment variables:
   ```bash
   cd ../frontend
   cp .env.local.example .env.local
   ```
2. Edit `frontend/.env.local` to point to the backend server:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4000
   NEXT_PUBLIC_WS_URL=http://localhost:4000
   ```
3. Install dependencies and run the Next.js development server:
   ```bash
   npm install
   npm run dev          # Launches frontend on http://localhost:3000
   ```

---

## E2E Verification & Smoke Test

To verify the backend queue, workers, and Gemini integration without running the frontend UI, execute this `curl` command:

```bash
curl -X POST http://localhost:4000/api/assignments \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Mathematics",
    "class": "Class 9",
    "dueDate": "28-05-2026",
    "questionTypes": [
      {
        "type": "Numerical Problems",
        "count": 2,
        "marksPerQuestion": 5
      }
    ],
    "totalQuestions": 2,
    "totalMarks": 10,
    "additionalInstructions": "Algebra equations"
  }'
```

This will queue a job. Check your worker console to see Gemini generating the assessment and saving it successfully to the database.

---

## Deployment Reference

| Service | Platform | Configuration Details |
| :--- | :--- | :--- |
| **Frontend** | Vercel | Root directory: `frontend/`. Set `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_WS_URL`. |
| **Express API** | Railway | Deploy using `backend/Dockerfile`. Expose port `4000`. |
| **BullMQ Worker** | Railway | Deploy as a separate worker service running `node dist/queues/worker.js`. |
| **Database** | MongoDB Atlas | Free M0 cluster. Provide the connection string as `MONGODB_URI`. |
| **Job Queue** | Upstash Redis | Secure `rediss://` cluster. Use `maxRetriesPerRequest: null` configuration. |

---

## Repository Structure

```
VedaAI/
├── docker-compose.yml       # Local MongoDB + Redis containers
├── .gitignore               # Unified monorepo gitignore
├── README.md                # This documentation
├── backend/
│   ├── src/
│   │   ├── index.ts         # Main server (REST + Socket.io)
│   │   ├── lib/             # MongoDB, Redis, and Socket.io clients
│   │   ├── models/          # Mongoose models (Assignment, QuestionPaper)
│   │   ├── routes/          # REST endpoints
│   │   ├── queues/          # BullMQ queue & worker processors
│   │   └── services/        # Gemini API service & validation
│   └── package.json
└── frontend/
    ├── app/                 # Next.js App Router (Assignments, New, Output)
    ├── components/          # Figma-matched layout & QuestionPaper components
    ├── hooks/               # WebSockets (useSocket) & CRUD hooks
    ├── store/               # Zustand assignments & loading store
    └── package.json
```

---

## License

Private repository for hiring assignment submission. All rights reserved.
