# IHEC Connect v3 — Nouvelles fonctionnalités

## 🆕 Fonctionnalités ajoutées dans v3

### 1.  Google reCAPTCHA v2 — Widget officiel
Intégration du **vrai widget Google reCAPTCHA v2** ("Je ne suis pas un robot") :
- **Frontend** : widget officiel chargé depuis `https://www.google.com/recaptcha/api.js`
- **Backend** : vérification du token via `https://www.google.com/recaptcha/api/siteverify`
- Présent sur la **page de connexion** ET la **page d'inscription**
- Le bouton de connexion est désactivé tant que le CAPTCHA n'est pas validé

**Configuration** :
1. Aller sur https://www.google.com/recaptcha/admin/create
2. Type : **reCAPTCHA v2** → "Je ne suis pas un robot"
3. Ajouter `localhost` (dev) et votre domaine (prod)
4. Copier `VITE_RECAPTCHA_SITE_KEY` dans `frontend/.env`
5. Copier `RECAPTCHA_SECRET_KEY` dans `backend/.env`

### 2. 🔐 Mot de passe oublié (PHPMailer équivalent Python)
Flow complet de réinitialisation de mot de passe :

| Étape | URL | Description |
|-------|-----|-------------|
| 1 | `/forgot-password` | Saisie de l'email IHEC |
| 2 | Email reçu | Lien sécurisé avec token (expire 30 min) |
| 3 | `/reset-password?token=...` | Nouveau mot de passe + confirmation |
| 4 | `/login?reset=1` | Confirmation de succès |

**Service email (Python = PHPMailer)** :
```
backend/app/services/email_service.py
```
Équivalences PHPMailer → Python :
| PHPMailer | Python (aiosmtplib) |
|-----------|---------------------|
| `$mail->Host` | `SMTP_HOST` |
| `$mail->Port = 587` | `SMTP_PORT = 587` |
| `$mail->SMTPSecure = 'tls'` | `start_tls=True` |
| `$mail->Username` | `SMTP_USER` |
| `$mail->Password` | `SMTP_PASSWORD` |
| `$mail->send()` | `await aiosmtplib.send(...)` |

### 3. 🔑 Confirmation de mot de passe
- Champ **"Confirmer le mot de passe"** ajouté à l'inscription
- Indicateur  en temps réel
- Jauge de **force du mot de passe** (5 niveaux)
- Règles : 8 car. minimum, 1 majuscule, 1 chiffre
- Validation backend + frontend

---

## 🚀 Démarrage rapide

```bash
# 1. Cloner et configurer
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# → Remplir les clés reCAPTCHA et SMTP dans les .env

# 2. Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

# 3. Frontend
npm install
npm run dev
```

## 📁 Fichiers nouveaux / modifiés dans v3

```
src/pages/
├── RegisterPage.tsx        ← reCAPTCHA officiel + confirm mot de passe + jauge force
├── LoginPage.tsx           ← reCAPTCHA officiel + lien "mot de passe oublié"
├── ForgotPasswordPage.tsx  ← NOUVEAU : demande de réinitialisation
└── ResetPasswordPage.tsx   ← NOUVEAU : définir nouveau mot de passe

src/hooks/
└── useAuth.tsx             ← login/register acceptent recaptchaToken

backend/app/
├── modules/auth/
│   ├── schema.py           ← confirm_password + recaptcha_token + validation renforcée
│   ├── service.py          ← create_reset_token, reset_password_with_token
│   └── router.py           ← /forgot-password, /reset-password, /verify-email
├── modules/users/
│   └── model.py            ← reset_token, reset_token_exp, verify_code, verify_code_exp
├── services/
│   ├── email_service.py    ← NOUVEAU : équivalent PHPMailer (SMTP async)
│   └── recaptcha_service.py← NOUVEAU : vérification token reCAPTCHA côté serveur
└── core/
    └── config.py           ← SMTP_*, RECAPTCHA_*, RESET_TOKEN_EXPIRE_MINUTES

backend/.env.example        ← Documentation complète des variables
frontend/.env.example       ← VITE_RECAPTCHA_SITE_KEY
```

## 🔑 Clés de test (développement)

Pour tester sans créer de compte Google reCAPTCHA :

```
# frontend/.env
VITE_RECAPTCHA_SITE_KEY=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI

# backend/.env
RECAPTCHA_SECRET_KEY=6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe
```

Ces clés Google officielles acceptent toujours la vérification en local.

## 📧 Format email IHEC accepté

```
Regex : /^[a-zA-ZÀ-ÿ]+\.[a-zA-ZÀ-ÿ]+\.\d{4}@ihec\.ucar\.tn$/i
Exemple : ahmed.benali.2024@ihec.ucar.tn
```
