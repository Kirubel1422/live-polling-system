# Live Polling System

An interactive, AI-powered live polling and presentation platform. Create engaging slides, quizzes, word clouds, and more, or automatically generate a full presentation deck from a simple text prompt using AI. Your participants can join your live session via a short join code and answer interactively in real time.

## 🚀 Tech Stack

### Frontend
- **React 18** (with Vite)
- **TypeScript**
- **Tailwind CSS** (v4) with **Radix UI** & **shadcn/ui** components
- **Redux Toolkit** (with RTK Query)
- **Tiptap** (Rich text editor)
- **React Router**

### Backend
- **Node.js** with **Express.js**
- **TypeScript**
- **TypeORM** (with PostgreSQL)
- **Passport.js** (JWT + Local Authentication)
- **Socket.io** (Real-time live session synchronization)
- **Zod** (Schema validation)

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- Docker (optional, for containerized deployments)

### 1. Clone the Repository
```bash
git clone https://github.com/Kirubel1422/live-polling-system.git
cd live-polling-system
```

### 2. Set up the Backend
```bash
cd live-polling-backend

# Install dependencies
npm install

# Configure environment variables
# Duplicate `.env.example` to `.env` and fill out your PostgreSQL credentials
cp .env.example .env

# Run migrations/seed   
npm run seed:templates

# Start the development server
npm run dev
```

### 3. Set up the Frontend
Open a new terminal window.
```bash
cd live-polling-frontend

# Install dependencies
npm install

# Configure environment variables
# Provide your backend API URL, default is usually http://localhost:5000/api
cp .env.example .env

# Start the frontend dev server
npm run dev
```
The frontend should now be running on `http://localhost:5173`.

---

## 🐳 Running with Docker (The Easiest Way)

This repository includes a `docker-compose.yml` file to spin up the Database, Backend, and Frontend all at once—perfect for quickly testing the app right after cloning.

### 1. Start the Entire Stack
```bash
docker-compose up --build
```
*Note: Make sure your Docker daemon is running.*

### 2. Access the App
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

*If you want to test the AI Generation features, remember to add your `AI_API_KEY` under the backend environment variables in `docker-compose.yml`.*

---
