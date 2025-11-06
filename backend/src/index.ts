import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeFirebaseAdmin } from './config/firebase.js';
import { authMiddleware } from './middleware/auth.js';
import appRoutes from './routes/apps.js';
import auditRoutes from './routes/audits.js';
import userRoutes from './routes/users.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Initialize Firebase Admin
try {
  const app = initializeFirebaseAdmin();
  if (!app) {
    console.error('❌ Firebase Admin failed to initialize.');
    console.error('\n📋 To fix this, please configure your .env file with:');
    console.error('   - FIREBASE_PROJECT_ID (your Firebase project ID)');
    console.error('   - FIREBASE_CLIENT_EMAIL (from Firebase service account JSON)');
    console.error('   - FIREBASE_PRIVATE_KEY (from Firebase service account JSON)');
    console.error('\n📖 How to get these values:');
    console.error('   1. Go to Firebase Console → Project Settings → Service Accounts');
    console.error('   2. Click "Generate new private key"');
    console.error('   3. Copy the values from the downloaded JSON file');
    console.error('\n⚠️  Server will start but Firestore operations will fail until configured.');
  } else {
    console.log('✅ Firebase Admin initialized successfully');
  }
} catch (error) {
  console.error('❌ Error initializing Firebase Admin:', error);
  console.error('⚠️  Server will start but Firestore operations will fail.');
}

// Middleware
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Scanara AI Backend API' });
});

// Routes
app.use('/api/users', authMiddleware, userRoutes); // Users route requires auth
app.use('/api/apps', authMiddleware, appRoutes);
app.use('/api/audits', authMiddleware, auditRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});

