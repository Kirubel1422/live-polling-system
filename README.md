# Live Polling System

An open-source, production-ready platform for running interactive live presentations. Participants join instantly via a short-code on any device and respond to polls, Q&A, word clouds, ranking exercises, and more — all visualized in real-time on the presenter's screen.

---

## 📑 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Local Development](#local-development)
  - [Docker (Recommended)](#docker-recommended)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Deployment](#deployment)

---

## 📖 Overview

Live Polling System bridges the gap between presenters and audiences. It replaces passive slideshows with a guided, participatory experience — every slide can be a poll, a prediction, a ranking exercise, or a live Q&A thread.

Don't want to build a presentation from scratch? Leverage the built-in **AI Generator** to automatically craft a full, interactive presentation deck from a simple text prompt. The AI assistant conducts a short contextual interview to tailor the audience, tone, and structure before generation begins. The AI output is validated against the application schema automatically and re-submitted for correction if the structure is malformed.

The platform is built for reliability at scale: a Redis-backed Socket.IO adapter enables horizontal scaling across multiple backend instances, BullMQ handles background jobs asynchronously, Sentry captures unexpected errors, and Prometheus metrics are exposed for infrastructure monitoring.

---

## 🏗️ Architecture

```text
┌──────────────────────────────────────────────────────┐
│                     Client Browser                   │
│   React 18 + Vite │ Redux Toolkit │ Socket.IO Client │
└────────────────────────────┬─────────────────────────┘
                             │ HTTP / WebSocket
┌────────────────────────────▼─────────────────────────┐
│                   Express.js API Server              │
│  Passport.js │ Zod Validation │ Rate Limiting        │
│  Winston Logging │ Prometheus Metrics │ Sentry       │
└──────┬──────────────────────────────────┬────────────┘
       │                                  │
┌──────▼──────┐                  ┌────────▼────────────┐
│  PostgreSQL │                  │        Redis        │
│   TypeORM   │                  │  Socket.IO Adapter  │
└─────────────┘                  │  BullMQ Job Queues  │
                                 │  Response Cache     │
                                 └─────────────────────┘
```

---

## ✨ Features

**Real-time presentation engine**
- WebSocket rooms per presentation session powered by Socket.IO with a Redis adapter for multi-instance deployments.
- Slide transitions broadcast to all participants with sub-second latency.
- Participant heartbeat monitoring with configurable stale-connection detection.
- Presenter receives live participant count and per-slide response aggregations.

**AI presentation generation**
- Conversational context-building interview (up to 4 turns) before generation begins, persisted in Redux to survive re-renders.
- Full deck generated from a plain-text prompt using any OpenRouter-compatible model.
- Separate models supported for context-building (lightweight) and slide generation (full-capability).
- JSON output validated against the application schema; malformed output is automatically re-submitted to the model with a targeted correction prompt.
- Enhancement mode: submit a natural-language modification request to surgically update an existing deck.

**Slide types**
- Multiple Choice, Quiz (with correct answer tracking), Open-Ended, Q&A (with upvoting), Word Cloud, Rating, Scales (Likert), Ranking (drag-and-drop), 100 Points (budget allocation), Number (estimation), Image Choice, Pin on Image, Wheel of Names, Content (rich text).

**Authentication and authorization**
- Local email/password authentication with bcrypt hashing.
- Google OAuth 2.0 and GitHub OAuth 2.0.
- JWT issued as HttpOnly cookies; `sameSite` and `secure` flags set dynamically based on environment.
- Email verification and password reset via SMTP.

**Observability and reliability**
- Structured Winston logging: colored output to terminal, plain-text to `logs/app.log` and `logs/error.log`.
- HTTP requests logged in Nginx combined-log format, routed to `error` or `warn` level based on status code.
- Sentry error tracking initialized at startup; 5xx errors captured with request context.
- Prometheus metrics endpoint (`/api/metrics`) gated by bearer token; socket event counters and active connection gauges included.
- Background job queues (BullMQ + Redis) for email delivery and analytics processing.
- Redis-backed response cache for session and slide data.
- Express rate limiting on all API routes; per-event socket rate limiting with in-memory token buckets.

---

## 🚀 Tech Stack

### 💻 Frontend

| Technology | Purpose |
|---|---|
| React 18 + Vite | UI framework and build tooling |
| TypeScript | Static typing across all components and API contracts |
| Tailwind CSS v4 + shadcn/ui | Design system and accessible component primitives |
| Redux Toolkit | Centralized state management (presentations, auth, AI modal, interview phase) |
| RTK Query | Data fetching, caching, and cache invalidation |
| Socket.IO Client | Real-time bidirectional communication |
| Tiptap | Headless rich-text editor for content slides |
| @dnd-kit | Drag-and-drop ranking slides |
| Zod | Client-side form and response validation |
| Lottie React | Animation assets for loading states |

### ⚙️ Backend

| Technology | Purpose |
|---|---|
| Node.js + Express.js | HTTP API server |
| TypeScript | Type safety shared with frontend models |
| PostgreSQL + TypeORM | Relational persistence; entities for users, presentations, slides, sessions, responses, participants |
| Socket.IO + @socket.io/redis-adapter | WebSocket rooms with Redis-backed multi-instance support |
| Redis (ioredis) | Socket adapter, BullMQ job broker, response cache |
| BullMQ | Background job queues for email and analytics |
| Passport.js | Local, JWT, Google OAuth 2.0, GitHub OAuth 2.0 strategies |
| envalid | Typed, validated environment variable schema — hard crash on missing required variables at startup |
| Zod | Runtime validation of all HTTP request bodies and Socket.IO event payloads |
| Winston | Structured logging with separate console and file transports |
| Sentry | Error monitoring and performance tracing |
| prom-client | Prometheus metrics exposition |
| swagger-ui-express | OpenAPI documentation served at `/api/docs` |
| Cloudinary | Cloud image storage for slide media |
| Nodemailer | Transactional email (verification, password reset) |
| express-rate-limit | Distributed API rate limiting |
| Vitest | Unit and integration testing |

---

## 🛠️ Prerequisites

- Node.js v18 or higher
- PostgreSQL v13 or higher (skip if using Docker)
- Redis v7 or higher (skip if using Docker)
- Docker and Docker Compose (for containerized setup)

---

## 🚦 Getting Started

### Docker (Recommended)

The `docker-compose.yml` file at the repository root builds both services from source on GitHub and spins up PostgreSQL and Redis with health checks. No local Node.js or database installation is required.

**1. Boot the full stack**
```bash
docker-compose up --build
```
*Note: Make sure your Docker daemon is running.*

**2. Configure environment variables**
Before running, open `docker-compose.yml` and fill in the empty environment variable values under the `backend` service (AI API key, OAuth credentials, Cloudinary, SMTP). The file ships with safe placeholder values for all optional integrations.

**3. Access the services**
| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000/api |
| API Documentation | http://localhost:5000/api/docs |
| Metrics (bearer token required) | http://localhost:5000/api/metrics |

---

### Local Development

**1. Clone the repository**
```bash
git clone https://github.com/Kirubel1422/live-polling-system.git
cd live-polling-system
```

**2. Set up the Backend**
```bash
cd live-polling-backend

# Install dependencies
npm install

# Duplicate `.env.example` to `.env` and fill out your PostgreSQL credentials
cp .env.example .env

# Start the development server (automatically runs migrations and seeding)
npm run dev
```

**3. Set up the Frontend**
Open a new terminal window.
```bash
cd live-polling-frontend

# Install dependencies
npm install

# Duplicate `.env.example` to `.env`
cp .env.example .env

# Start the frontend dev server
npm run dev
```

---

## 🔑 Environment Variables

### Backend (`live-polling-backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `APP_PORT` | Yes | Port the API server listens on. Default: `5000` |
| `NODE_ENV` | Yes | Runtime environment: `dev`, `test`, or `production` |
| `CLIENT_URL` | Yes | Comma-separated list of allowed frontend origins for CORS |
| `DB_HOST` | Yes | PostgreSQL host. Use `postgres` when running in Docker |
| `DB_PORT` | Yes | PostgreSQL port. Default: `5432` |
| `DB_USERNAME` | Yes | PostgreSQL username |
| `DB_PASSWORD` | Yes | PostgreSQL password |
| `DB_NAME` | Yes | PostgreSQL database name |
| `JWT_SECRET` | Yes | Secret key for signing JWTs |
| `JWT_EXPIRES_IN` | Yes | JWT expiration duration. Default: `7d` |
| `COOKIE_SECRET` | Yes | Secret for signing session cookies |
| `COOKIE_DOMAIN` | Yes | Cookie domain. Use `localhost` for local development |
| `REDIS_URL` | Yes | Redis connection URL. Use `redis://redis:6379` in Docker |
| `AI_API_KEY` | Optional | OpenRouter API key for AI slide generation |
| `AI_MODEL_NAME` | Optional | Model identifier for slide generation (e.g. `openai/gpt-4o`) |
| `AI_CONTEXT_MODEL` | Optional | Lightweight model for context-building interviews |
| `GOOGLE_CLIENT_ID` | Optional | Google OAuth 2.0 client ID |
| `GOOGLE_CLIENT_SECRET` | Optional | Google OAuth 2.0 client secret |
| `GITHUB_CLIENT_ID` | Optional | GitHub OAuth App client ID |
| `GITHUB_CLIENT_SECRET` | Optional | GitHub OAuth App client secret |
| `CLOUDINARY_CLOUD_NAME` | Optional | Cloudinary cloud name for image uploads |
| `CLOUDINARY_API_KEY` | Optional | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Optional | Cloudinary API secret |
| `SMTP_HOST` | Optional | SMTP server hostname |
| `SMTP_PORT` | Optional | SMTP server port. Default: `2525` |
| `SMTP_USER` | Optional | SMTP authentication username |
| `SMTP_PASS` | Optional | SMTP authentication password |
| `SENTRY_DSN` | Optional | Sentry DSN for error tracking |
| `METRICS_TOKEN` | Optional | Bearer token required to access `/api/metrics` |
| `RATE_LIMIT_ENABLED` | Optional | Enable/disable Express rate limiting. Default: `true` |
| `SOCKET_REDIS_ADAPTER_ENABLED` | Optional | Enable Redis adapter for Socket.IO. Default: `false` |
| `BULLMQ_ENABLED` | Optional | Enable BullMQ background workers. Default: `false` |
| `API_DOCS_ENABLED` | Optional | Serve Swagger UI at `/api/docs`. Default: `true` |

### Frontend (`live-polling-frontend/.env`)

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | Yes | Full URL to the backend API. Example: `http://localhost:5000/api` |

---

## 📚 API Documentation

When `API_DOCS_ENABLED=true`, Swagger UI is served at `/api/docs`. The OpenAPI specification covers all authentication, presentation, slide, participant, template, user, health, and metrics endpoints.

---

## 📂 Project Structure

```text
live-polling-system/
├── docker-compose.yml
├── live-polling-backend/
│   ├── src/
│   │   ├── ai/                        # AI generator, JSON validator, system prompts
│   │   ├── configs/                   # Database, Redis, CORS, cookie, passport, security
│   │   ├── constants/                 # Validated ENV schema (envalid)
│   │   ├── docs/                      # Swagger / OpenAPI spec
│   │   ├── entities/                  # TypeORM entities
│   │   ├── interfaces/                # Internal TypeScript interfaces
│   │   ├── modules/                   # Feature modules: auth, presentations, slides, etc.
│   │   ├── observability/             # Sentry + Prometheus
│   │   ├── queues/                    # BullMQ queue definitions (email, analytics)
│   │   ├── scripts/                   # Database seeders
│   │   ├── tests/                     # Vitest integration tests
│   │   ├── utils/                     # Cache, error handlers, loggers, rate limits
│   │   ├── validators/                # Zod schemas for HTTP and socket payloads
│   │   ├── workers/                   # BullMQ workers
│   │   └── app.ts                     # Application entry point
│   ├── Dockerfile
│   └── package.json
└── live-polling-frontend/
    ├── src/
    │   ├── api/                       # RTK Query API slices
    │   ├── assets/                    # Lottie animations and static images
    │   ├── components/                # Modular React UI components
    │   ├── config/                    # Environment variables mapping
    │   ├── lib/                       # Utility functions and class name helpers
    │   ├── pages/                     # Route-level page components
    │   ├── store/                     # Redux slices: auth, presentations, AI, interview
    │   ├── styles/                    # Global Tailwind CSS and typography
    │   └── validators/                # Client-side Zod schemas
    ├── Dockerfile
    └── package.json
```

---

## 🧪 Testing

The backend includes integration tests written with Vitest and Supertest.

```bash
cd live-polling-backend

# Run all tests once
npm test

# Run in watch mode
npm run test:watch
```

---

## 🌍 Deployment

**Docker Compose (single host)**

The `docker-compose.yml` at the repository root is the canonical deployment artifact. Both services pull their build context directly from the GitHub repository, so no local source checkout is required on the target host.

```bash
# On the production host
curl -o docker-compose.yml https://raw.githubusercontent.com/Kirubel1422/live-polling-system/main/docker-compose.yml

# Edit environment variables in docker-compose.yml
# Then start the stack
docker-compose up -d
```

**Production Checklist**
- Set `NODE_ENV=production`
- Set `SOCKET_REDIS_ADAPTER_ENABLED=true` if running more than one backend instance
- Set `BULLMQ_ENABLED=true` to activate background job processing
- Set `API_DOCS_ENABLED=false` to disable public Swagger exposure
- Use strong, randomly generated values for `JWT_SECRET`, `COOKIE_SECRET`, and `METRICS_TOKEN`
- Point `CLIENT_URL` to your production frontend domain
- Configure `COOKIE_DOMAIN` to match your production domain
- Set up a Sentry project and provide `SENTRY_DSN`
- Ensure Redis persistence is configured (`appendonly yes`) for BullMQ durability

**Logs**
The backend writes two log files inside the container at `logs/app.log` (all levels) and `logs/error.log` (errors only). Mount a host volume to persist logs across container restarts:

```yaml
volumes:
  - ./logs:/app/logs
```
