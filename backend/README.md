# Scanara AI Backend

Backend API server for Scanara AI.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Configure Firebase Admin SDK (optional for development):
   - Go to Firebase Console → Project Settings → Service Accounts
   - Generate a new private key
   - Add the values to `.env`:
     - `FIREBASE_PRIVATE_KEY` (the private key from the JSON)
     - `FIREBASE_CLIENT_EMAIL` (the client_email from the JSON)

## Running

### Development
```bash
npm run dev
```

Server will start on `http://localhost:3000`

### Production
```bash
npm run build
npm start
```

## API Endpoints

### Health Check
- `GET /health` - Health check endpoint

### Users
- `GET /api/users/profile` - Get user profile
- `POST /api/users/profile` - Create user profile
- `PUT /api/users/profile` - Update user profile

### Apps
- `GET /api/apps` - Get all apps for authenticated user
- `GET /api/apps/:id` - Get app by ID
- `POST /api/apps` - Create new app
- `PUT /api/apps/:id` - Update app
- `DELETE /api/apps/:id` - Delete app

### Audits
- `GET /api/audits` - Get all audits (optionally filtered by `?appId=...`)
- `GET /api/audits/:id` - Get audit by ID
- `POST /api/audits` - Create new audit
- `PUT /api/audits/:id` - Update audit

## Authentication

All API endpoints (except `/health` and `/api/users`) require authentication via Firebase ID token:

```
Authorization: Bearer <firebase-id-token>
```

The token should be sent in the `Authorization` header.

## Data Storage

Currently using JSON file storage in `backend/data/`:
- `apps.json` - User apps
- `audits.json` - Audit records
- `users.json` - User profiles

This can be easily replaced with a database (PostgreSQL, MongoDB, etc.) in the future.

## Development Mode

In development mode, if Firebase Admin SDK is not configured, the server will:
- Allow requests without strict token verification
- Extract user ID from token payload if available
- Use a default dev user ID if token can't be parsed

This allows development without setting up Firebase Admin SDK immediately.
