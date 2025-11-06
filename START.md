# Quick Start Guide

## Start Both Servers

### Terminal 1 - Backend
```bash
cd backend
npm install
npm run dev
```

Backend will run on: `http://localhost:3000`

### Terminal 2 - Frontend
```bash
cd client
npm install
npm run dev
```

Frontend will run on: `http://localhost:5173`

## What's Running

- ✅ Backend API: `http://localhost:3000`
- ✅ Frontend App: `http://localhost:5173`
- ✅ API Base URL: `http://localhost:3000/api`

## First Time Setup

1. **Backend Environment**: 
   - Copy `backend/.env.example` to `backend/.env`
   - Firebase Admin SDK is optional for development

2. **Frontend Environment**:
   - Already configured in `client/.env`
   - Firebase config is set up
   - API URL points to `http://localhost:3000/api`

## Testing

1. Open `http://localhost:5173` in your browser
2. Sign up with email/password or use Google Sign-In
3. Complete your profile
4. Create a project
5. Run an audit

## Troubleshooting

- **Backend not starting**: Check if port 3000 is available
- **Frontend can't connect**: Verify backend is running on port 3000
- **Auth errors**: Check Firebase config in `client/.env`
- **CORS errors**: Ensure `CLIENT_URL` in `backend/.env` matches frontend URL

