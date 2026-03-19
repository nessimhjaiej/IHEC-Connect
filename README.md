# IHEC Connect

Production-ready fullstack scaffold for an MVP academic group-session platform using Supabase Auth.

## Stack

- Backend: FastAPI, SQLAlchemy 2.0 async, PostgreSQL, Pydantic, Supabase JWT validation
- Frontend: React, Vite, TypeScript, Tailwind CSS, React Query, Axios, Supabase JS

## Software Architecture

This project follows a modular monolith architecture. The backend is deployed as one application but organized into clear feature modules such as `auth`, `users`, `sessions`, `participants`, and `reviews`. Each module follows a router -> service -> repository flow so HTTP handling, business logic, and data access stay separated.

## Features

- Supabase authentication for students and tutors
- Profile management through the `public.users` table
- Browse academic group sessions
- View session details
- Join open sessions as a participant
- Create sessions as a tutor
- Dashboard and profile pages
- Subject and review support in the backend scaffold

## Structure

```text
project-root/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── modules/
│   │   ├── repositories/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│   ├── .env.example
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.ts
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
├── .gitignore
└── README.md
```

## Backend Notes

- Modular monolith with feature modules under `app/modules`
- Async SQLAlchemy session dependency
- Supabase bearer token validation on protected routes
- Domain models included: `User`, `Subject`, `Session`, `SessionParticipant`, `Review`

## Frontend Notes

- Supabase Auth on the frontend
- FastAPI used for profile and business APIs
- Axios client with bearer token interceptor
- React Query hooks for auth, sessions, subjects, and profile updates

## Environment Setup

Create real `.env` files from the provided templates before starting the app.

### Backend

1. Copy `backend/.env.example` to `backend/.env`
2. Fill in your real Supabase database and auth values

Required keys:

```env
APP_NAME=IHEC Connect API
API_PREFIX=/api/v1
ENVIRONMENT=development
DATABASE_URL=postgresql+asyncpg://postgres:YOUR_DATABASE_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
SUPABASE_JWT_AUDIENCE=authenticated
CORS_ORIGINS=["http://localhost:5173"]
```

Notes:
- `DATABASE_URL` must use the async SQLAlchemy driver format: `postgresql+asyncpg://...`
- If your database password contains special characters, URL-encode them

### Frontend

1. Copy `frontend/.env.example` to `frontend/.env`
2. Fill in your frontend runtime values

Required keys:

```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

## Local Development

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
python -m pip install --upgrade pip
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Supabase Notes

- `public.users.id` should reference `auth.users.id`
- Signup should create a matching profile row in `public.users`
- FastAPI expects a valid Supabase access token on protected routes

## Recommended Next Steps

1. Add Alembic migrations for the current schema.
2. Add Supabase RLS policies for `users`, `sessions`, `session_participants`, and `reviews`.
3. Add frontend form validation and error states.
4. Add backend and frontend tests.
