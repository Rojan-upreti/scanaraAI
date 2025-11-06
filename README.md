# Scanara AI

AI-powered HIPAA compliance scanning tool for healthcare applications.

## Project Structure

```
finalhackathonproject3303/
├── client/          # React + TypeScript frontend
├── backend/         # Express + TypeScript backend API
└── n8n/            # n8n workflow automation
```

## Quick Start

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Start backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with Firebase config:
```bash
# Copy from .env.example or create with:
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_API_BASE_URL=http://localhost:3000/api
```

4. Start development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## Features

- ✅ Firebase Authentication (Google SSO + Email/Password)
- ✅ User Profile Management
- ✅ Project/App Management
- ✅ API Key Generation
- ✅ Compliance Audit System
- ✅ Audit Reports with Findings
- ✅ RESTful Backend API
- ✅ Real-time Data Sync

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Firebase Auth
- React Router

### Backend
- Node.js
- Express
- TypeScript
- Firebase Admin SDK
- JSON File Storage (can be migrated to database)

## API Documentation

See `backend/README.md` for detailed API documentation.

## Environment Variables

### Client (`client/.env`)
- `VITE_FIREBASE_*` - Firebase configuration
- `VITE_API_BASE_URL` - Backend API URL (default: `http://localhost:3000/api`)

### Backend (`backend/.env`)
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `CLIENT_URL` - Frontend URL for CORS (default: `http://localhost:5173`)
- `FIREBASE_*` - Firebase Admin SDK credentials (optional for development)

## Development

Both servers can run simultaneously:
- Backend: `http://localhost:3000`
- Frontend: `http://localhost:5173`

The frontend will automatically connect to the backend API.

