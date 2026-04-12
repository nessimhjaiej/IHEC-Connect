# IHEC Connect — Plateforme Académique & Entrepreneuriale

Plateforme fullstack complète pour l'IHEC Carthage couvrant les 4 sprints du projet Agile Scrum.

## Stack Technique

| Couche | Technologie |
|--------|------------|
| **Backend** | FastAPI, SQLAlchemy 2.0 async, Pydantic v2 |
| **Base de données** | PostgreSQL (via Supabase) |
| **Authentification** | Supabase Auth + JWT RS256 |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS |
| **State Management** | TanStack React Query v5 |
| **HTTP Client** | Axios |

## Modules Développés (4 Sprints)

### Sprint 1 — Authentification & Utilisateurs
- Inscription/connexion via Supabase Auth
- Rôles : `student`, `tutor`, `admin`
- Gestion des profils (bio, avatar)
- Activation/désactivation de comptes (admin)

### Sprint 2 — Tutorat
- Création/modification de séances (tuteur)
- Recherche et réservation de séances (étudiant)
- Lien Google Meet par séance
- Capacité et comptage des participants

### Sprint 3 — Documents & Notation
- Upload/download de documents pédagogiques (PDF, Word, Image)
- Association document ↔ séance
- Système de notation 1-5 étoiles
- Avis et commentaires par séance
- Résumé de note moyenne par tuteur

### Sprint 4 — Entrepreneuriat
- Calendrier des événements (workshops, formations, conférences)
- Inscription aux événements avec vérification des places
- Catalogue d'opportunités (stages, emplois, freelance)
- Gestion admin des événements et opportunités

## Structure du Projet

```
IHEC-Connect/
├── backend/
│   ├── app/
│   │   ├── api/           # Router principal
│   │   ├── core/          # Config, DB, Security, Dependencies
│   │   ├── models/        # Import centralisé des modèles
│   │   └── modules/
│   │       ├── auth/          # Session utilisateur
│   │       ├── users/         # Profils & gestion admin
│   │       ├── subjects/      # Matières académiques
│   │       ├── sessions/      # Séances de tutorat
│   │       ├── participants/  # Inscriptions aux séances
│   │       ├── reviews/       # Notation & évaluations
│   │       ├── documents/     # Upload/Download fichiers
│   │       ├── events/        # Événements & inscriptions
│   │       └── opportunities/ # Stages & emplois
│   ├── .env.example
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── components/    # UI réutilisables + Layout
    │   ├── hooks/         # React Query hooks
    │   ├── pages/         # Pages de l'application
    │   ├── services/      # Clients API
    │   ├── types/         # Types TypeScript
    │   └── utils/         # Utilitaires
    ├── .env.example
    └── package.json
```

## Configuration

### Backend

```bash
cd backend
cp .env.example .env
# Remplir avec vos valeurs Supabase
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
cp .env.example .env
# Remplir avec vos valeurs Supabase
npm install
npm run dev
```

## Variables d'Environnement

### Backend (.env)
```env
DATABASE_URL=postgresql+asyncpg://postgres:PASSWORD@db.REF.supabase.co:5432/postgres
SUPABASE_URL=https://REF.supabase.co
SUPABASE_ANON_KEY=votre_cle_anon
UPLOAD_DIR=uploads
MAX_UPLOAD_SIZE_MB=10
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_SUPABASE_URL=https://REF.supabase.co
VITE_SUPABASE_ANON_KEY=votre_cle_anon
```

## API Endpoints

| Méthode | URL | Description |
|---------|-----|-------------|
| GET | /api/v1/sessions | Liste des séances |
| POST | /api/v1/sessions | Créer une séance (tutor) |
| POST | /api/v1/participants/session/{id}/join | Rejoindre une séance |
| POST | /api/v1/documents | Upload document |
| GET | /api/v1/documents/{id}/download | Télécharger |
| POST | /api/v1/reviews | Soumettre un avis |
| GET | /api/v1/events | Liste des événements |
| POST | /api/v1/events/{id}/register | S'inscrire à un événement |
| GET | /api/v1/opportunities | Liste des opportunités |
| PATCH | /api/v1/users/{id}/admin | Gérer un utilisateur (admin) |

Documentation interactive disponible sur : `http://localhost:8000/docs`
