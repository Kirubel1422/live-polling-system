# ⚡ Live Polling System

An interactive, AI-powered live polling and presentation platform designed to transform passive audiences into active participants. Whether you're hosting a lecture, a corporate meeting, or a fun quiz night, this system allows you to create engaging slides, live Q&A sessions, rating scales, and dynamic word clouds that update in real-time. 

Don't want to build a presentation from scratch? Leverage the built-in **AI Generator** to automatically craft a full, interactive presentation deck from a simple text prompt. Participants can instantly join your live session via a secure 6-character short-code on any device—no account required—and watch their answers visualize instantly on the presenter's big screen.

## ✨ Key Features
- **Real-Time Interactivity:** Powered by WebSockets to instantly sync slides, transitions, and participant responses.
- **AI Presentation Generation:** Generate complete, multi-slide interactive decks and intelligent follow-up questions using advanced LLMs.
- **Multiple Slide Types:** Support for Word Clouds, Multiple Choice, Q&A, Rating Scales, Opinion Scales, and Rich Text content.
- **Seamless Authentication:** Secure JWT-based local authentication alongside Google and GitHub OAuth integrations.
- **Media & Email Support:** Native Cloudinary integration for image uploads and Nodemailer for password recovery.
- **Responsive Presenter & Participant Views:** Distinct, beautifully designed UIs tailored for the host's desktop and the participant's mobile device.

## 🚀 Tech Stack

### 💻 Frontend
- **React 18 & Vite:** Lightning-fast frontend framework and build tool.
- **TypeScript:** For strict type safety and robust developer experience.
- **Tailwind CSS v4 & shadcn/ui:** For a highly polished, responsive, and accessible user interface.
- **Redux Toolkit & RTK Query:** For centralized state management and efficient API data fetching/caching.
- **Tiptap:** Headless rich text editor for crafting custom content slides.
- **Socket.io-client:** For real-time, low-latency communication with the live presentation server.

### ⚙️ Backend
- **Node.js & Express.js:** Scalable and lightweight backend API server.
- **TypeScript:** Ensuring type parity between the frontend models and backend entities.
- **PostgreSQL & TypeORM:** Relational database management with a powerful ORM for complex entity relationships.
- **Socket.io:** Managing real-time WebSocket rooms, event broadcasting, and live participant states.
- **Passport.js:** Handling secure JWT issuance and OAuth 2.0 (Google/GitHub) authentication flows.
- **Zod:** For rigorous runtime payload validation and type inference.
- **Nodemailer & Cloudinary:** For reliable email delivery and cloud asset management.

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
### Environment Variables

Before starting the application, ensure the following environment variables are properly configured. If you are using Docker Compose, these can be set directly in the `docker-compose.yml` file under the respective services. If running locally, create a `.env` file in the respective directories based on the provided `.env.example`.

#### Backend (`live-polling-backend`)
- **Core Settings**:
  - `APP_PORT`, `NODE_ENV`, `CLIENT_URL`: Server port, environment (dev/production), and allowed frontend origin for CORS.
- **Database**:
  - `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`: PostgreSQL connection details.
- **Security**:
  - `JWT_SECRET`, `JWT_EXPIRES_IN`: Secret and expiration for signing JSON Web Tokens.
  - `COOKIE_SECRET`, `COOKIE_DOMAIN`: Secret for signing cookies and the domain they are valid on.
- **AI Integration** *(Optional but required for AI generation)*:
  - `AI_MODEL_NAME`, `AI_API_KEY`: OpenRouter (or equivalent) model name and API key.
- **OAuth** *(Optional but required for Social Login)*:
  - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`: Credentials for Google Sign-in.
  - `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`: Credentials for GitHub Sign-in.
- **Cloudinary** *(Optional but required for image uploads)*:
  - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Credentials for storing images.
- **SMTP / Mail** *(Optional but required for email features)*:
  - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`: SMTP credentials for email verification and password resets.

#### Frontend (`live-polling-frontend`)
- `VITE_API_URL`: The full URL to the backend API (e.g., `http://localhost:5000/api`). This is also automatically parsed by the frontend to determine the websocket (`socket.io`) connection URL.

---
