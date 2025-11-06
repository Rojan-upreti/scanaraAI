# Firebase Authentication Setup

## Environment Variables

Create a `.env` file in the `client` directory with the following variables:

```env
VITE_FIREBASE_API_KEY=AIzaSyB4z0HPzkI5YPsCVjWIQNyFbXsRc2MBkF0
VITE_FIREBASE_AUTH_DOMAIN=scanaraai.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=scanaraai
VITE_FIREBASE_STORAGE_BUCKET=scanaraai.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=840074904641
VITE_FIREBASE_APP_ID=1:840074904641:web:d68ae915bf77f8afe972c0
VITE_FIREBASE_MEASUREMENT_ID=G-HH7LQ9CK08
```

## Important Notes

1. **Never commit `.env` file to git** - It's already in `.gitignore`
2. The Firebase config is loaded from environment variables, not hardcoded
3. All Firebase credentials are stored in environment variables

## Firebase Console Setup

1. Enable Google Authentication in Firebase Console:
   - Go to Firebase Console → Authentication → Sign-in method
   - Enable "Google" provider
   - Add authorized domains if needed

2. Configure OAuth consent screen:
   - Set up OAuth consent screen in Google Cloud Console
   - Add required scopes (profile, email)

## Testing

1. Start the development server: `npm run dev`
2. Click "Get Started Free" or "Sign In"
3. You'll be redirected to Google Sign-In
4. After successful authentication, you'll be redirected to the dashboard

