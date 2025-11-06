import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';

dotenv.config();

let firestoreInstance: any = null;
let authInstance: any = null;

export const initializeFirebaseAdmin = () => {
  if (getApps().length > 0) {
    const app = getApps()[0];
    firestoreInstance = getFirestore(app);
    authInstance = getAuth(app);
    return app;
  }

  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    
    if (!privateKey || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PROJECT_ID) {
      console.warn('⚠️  Firebase Admin not initialized. Missing credentials in .env file.');
      console.warn('   Required: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY');
      return null;
    }

    const app = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });

    firestoreInstance = getFirestore(app);
    authInstance = getAuth(app);
    
    console.log('✅ Firebase Admin initialized with Firestore');
    return app;
  } catch (error) {
    console.error('❌ Error initializing Firebase Admin:', error);
    console.warn('⚠️  Running without Firebase Admin (auth will be mocked in development).');
    return null;
  }
};

export const getFirestoreInstance = () => {
  if (!firestoreInstance) {
    const app = initializeFirebaseAdmin();
    if (!app) {
      throw new Error('Firebase Admin not initialized. Please configure Firebase Admin SDK with FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL, and FIREBASE_PROJECT_ID in your .env file.');
    }
    // firestoreInstance should be set by initializeFirebaseAdmin
    if (!firestoreInstance) {
      throw new Error('Firestore instance not available. Please check Firebase configuration.');
    }
  }
  return firestoreInstance;
};

export const verifyIdToken = async (token: string) => {
  try {
    if (!authInstance) {
      const app = initializeFirebaseAdmin();
      if (!app) {
        throw new Error('Firebase Admin not initialized');
      }
    }
    const decodedToken = await authInstance.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying token:', error);
    throw error;
  }
};

