# IHEC Connect

Production-ready fullstack scaffold for an MVP academic group-session platform.

## Stack

- Backend: FastAPI, SQLAlchemy 2.0 async, PostgreSQL, Pydantic, JWT authentication
- Frontend: React, Vite, TypeScript, Tailwind CSS, React Query, Axios

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
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.ts
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
└── README.md
```

## Backend notes

- Modular monolith with feature modules under `app/modules`
- Router to service to repository flow in each module
- Async SQLAlchemy session dependency
- JWT auth with reusable security helpers
- Domain models included: `User`, `Subject`, `Session`, `SessionParticipant`, `Review`

## Frontend notes

- React Router based page structure
- Axios client with bearer token interceptor
- React Query hooks for auth, sessions, subjects, and profile updates
- Tailwind-based reusable UI primitives

## Local development

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Recommended next steps

1. Add Alembic migrations and `.env` files for environment-specific configuration.
2. Replace placeholder JWT secret values and connect `database_url` to Supabase Postgres.
3. Add form validation, toast/error handling, and richer dashboard filtering.
4. Add test suites for services, repositories, and critical frontend flows.
