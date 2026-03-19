# IHEC Connect

Production-ready fullstack scaffold for an MVP academic group-session platform.

## Stack

- Backend: FastAPI, SQLAlchemy 2.0 async, PostgreSQL, Pydantic, JWT authentication
- Frontend: React, Vite, TypeScript, Tailwind CSS, React Query, Axios

## Software Architecture

This project follows a modular monolithic architecture, where the backend is deployed as a single application but internally structured into well-defined modules (auth, users, sessions, participants, etc.). Each module respects a clear separation of concerns using a layered approach: routers handle HTTP requests, services encapsulate business logic, and repositories manage data access. This design ensures the codebase remains extensible, maintainable, and easy to understand, while avoiding the operational complexity of microservices. It also provides a solid foundation for future scalability and feature expansion.

## Features

* User authentication (register and login)
* Profile management (basic academic information)
* Browse available academic sessions
* View detailed session information (topic, tutor, schedule)
* Join group sessions as a participant
* Create and manage sessions as a tutor
* Dashboard to track joined and created sessions
* Basic rating/feedback system for sessions


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
