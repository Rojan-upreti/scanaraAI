import { getFirestoreInstance } from '../config/firebase.js';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

// Helper to get Firestore instance
const getDb = () => {
  try {
    const db = getFirestoreInstance();
    if (!db) {
      throw new Error('Firestore not initialized. Please configure Firebase Admin SDK with FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL, and FIREBASE_PROJECT_ID in your .env file. See .env.example for reference.');
    }
    return db;
  } catch (error: any) {
    if (error.message.includes('Firebase Admin not initialized')) {
      throw new Error('Firestore not initialized. Please configure Firebase Admin SDK with FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL, and FIREBASE_PROJECT_ID in your .env file. See .env.example for reference.');
    }
    throw error;
  }
};

// Helper to convert Firestore timestamp to ISO string
const timestampToISO = (timestamp: any): string => {
  if (!timestamp) return new Date().toISOString();
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate().toISOString();
  }
  if (timestamp?.toDate && typeof timestamp.toDate === 'function') {
    return timestamp.toDate().toISOString();
  }
  if (timestamp instanceof Date) {
    return timestamp.toISOString();
  }
  if (typeof timestamp === 'string') {
    return timestamp;
  }
  return new Date().toISOString();
};

// Collections
const USERS_COLLECTION = 'users';
const APPS_COLLECTION = 'apps';
const AUDITS_COLLECTION = 'audits';
const CONNECTION_CLI_COLLECTION = 'connection_cli';
const CONNECTION_EXTENSION_COLLECTION = 'connection_extension';

// Helper to generate API key
const generateApiKey = () => {
  return `sk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
};

// User Profiles
export const getUserProfile = async (userId: string) => {
  try {
    const db = getDb();
    const userDoc = await db.collection(USERS_COLLECTION).doc(userId).get();
    
    if (!userDoc.exists) {
      return null;
    }
    
    return { uid: userId, ...userDoc.data() } as any;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

export const createOrUpdateUserProfile = async (profileData: any) => {
  try {
    const db = getDb();
    const { uid, ...profile } = profileData;
    
    // Remove undefined values - Firestore doesn't accept undefined
    const cleanProfile: any = {};
    Object.keys(profile).forEach(key => {
      if (profile[key] !== undefined) {
        cleanProfile[key] = profile[key];
      }
    });
    
    const userRef = db.collection(USERS_COLLECTION).doc(uid);
    const userDoc = await userRef.get();
    
    const updateData: any = {
      ...cleanProfile,
      updatedAt: FieldValue.serverTimestamp(),
    };
    
    if (!userDoc.exists) {
      updateData.createdAt = FieldValue.serverTimestamp();
    }
    
    await userRef.set(updateData, { merge: true });
    
    const updatedDoc = await userRef.get();
    const data = updatedDoc.data();
    return { 
      uid, 
      ...data,
      createdAt: timestampToISO(data?.createdAt),
      updatedAt: timestampToISO(data?.updatedAt),
    } as any;
  } catch (error) {
    console.error('Error creating/updating user profile:', error);
    throw error;
  }
};

// Apps
export const getApps = async (userId: string) => {
  try {
    const db = getDb();
    // Fetch without orderBy first to avoid index requirement
    const snapshot = await db.collection(APPS_COLLECTION)
      .where('userId', '==', userId)
      .get();
    
    // Sort in memory by createdAt descending
    const apps = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: timestampToISO(data?.createdAt),
        lastAuditAt: data?.lastAuditAt ? timestampToISO(data.lastAuditAt) : undefined,
      };
    }) as any[];
    
    // Sort by createdAt descending (newest first)
    apps.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA; // Descending order
    });
    
    return apps;
  } catch (error) {
    console.error('Error getting apps:', error);
    throw error;
  }
};

export const getAppById = async (appId: string, userId: string) => {
  try {
    const db = getDb();
    const appDoc = await db.collection(APPS_COLLECTION).doc(appId).get();
    
    if (!appDoc.exists) {
      return null;
    }
    
    const data = appDoc.data();
    const appData = { 
      id: appDoc.id, 
      ...data,
      createdAt: timestampToISO(data?.createdAt),
      lastAuditAt: data?.lastAuditAt ? (data.lastAuditAt.toDate?.()?.toISOString() || undefined) : undefined,
    } as any;
    
    // Verify ownership
    if (appData.userId !== userId) {
      return null;
    }
    
    return appData;
  } catch (error) {
    console.error('Error getting app by ID:', error);
    throw error;
  }
};

export const createApp = async (appData: any) => {
  try {
    const db = getDb();
    
    // Remove undefined values - Firestore doesn't accept undefined
    const cleanData: any = {};
    Object.keys(appData).forEach(key => {
      if (appData[key] !== undefined) {
        cleanData[key] = appData[key];
      }
    });
    
    const newApp = {
      ...cleanData,
      apiKey: generateApiKey(),
      createdAt: FieldValue.serverTimestamp(),
      connectionType: null,
      isConnected: false,
    };
    
    const docRef = await db.collection(APPS_COLLECTION).add(newApp);
    const doc = await docRef.get();
    
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: timestampToISO(data?.createdAt),
    } as any;
  } catch (error) {
    console.error('Error creating app:', error);
    throw error;
  }
};

export const updateApp = async (appId: string, userId: string, updates: any) => {
  try {
    const db = getDb();
    const appRef = db.collection(APPS_COLLECTION).doc(appId);
    const appDoc = await appRef.get();
    
    if (!appDoc.exists) {
      throw new Error('App not found');
    }
    
    const appData = appDoc.data();
    if (appData?.userId !== userId) {
      throw new Error('Unauthorized');
    }
    
    // Remove undefined values - Firestore doesn't accept undefined
    const cleanUpdates: any = {};
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        cleanUpdates[key] = updates[key];
      }
    });
    
    const updateData: any = { ...cleanUpdates };
    // Convert lastAuditAt to Firestore timestamp if it's a string
    if (updateData.lastAuditAt && typeof updateData.lastAuditAt === 'string') {
      updateData.lastAuditAt = new Date(updateData.lastAuditAt);
    }
    updateData.updatedAt = FieldValue.serverTimestamp();
    
    await appRef.update(updateData);
    
    const updatedDoc = await appRef.get();
    const data = updatedDoc.data();
    return {
      id: updatedDoc.id,
      ...data,
      createdAt: timestampToISO(data?.createdAt),
      lastAuditAt: data?.lastAuditAt ? (data.lastAuditAt.toDate?.()?.toISOString() || undefined) : undefined,
    } as any;
  } catch (error) {
    console.error('Error updating app:', error);
    throw error;
  }
};

export const deleteApp = async (appId: string, userId: string) => {
  try {
    const db = getDb();
    const appRef = db.collection(APPS_COLLECTION).doc(appId);
    const appDoc = await appRef.get();
    
    if (!appDoc.exists) {
      throw new Error('App not found');
    }
    
    const appData = appDoc.data();
    if (appData?.userId !== userId) {
      throw new Error('Unauthorized');
    }
    
    // Delete the app
    await appRef.delete();
    
    // Delete related audits
    const auditsSnapshot = await db.collection(AUDITS_COLLECTION)
      .where('appId', '==', appId)
      .get();
    
    const batch = db.batch();
    auditsSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  } catch (error) {
    console.error('Error deleting app:', error);
    throw error;
  }
};

// Audits
export const getAudits = async (userId: string, appId?: string) => {
  try {
    const db = getDb();
    let query = db.collection(AUDITS_COLLECTION)
      .where('userId', '==', userId);
    
    if (appId) {
      query = query.where('appId', '==', appId);
    }
    
    // Fetch without orderBy to avoid index requirement
    const snapshot = await query.get();
    
    // Sort in memory by createdAt descending
    const audits = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: timestampToISO(data?.createdAt),
        completedAt: data?.completedAt ? timestampToISO(data.completedAt) : undefined,
      };
    }) as any[];
    
    // Sort by createdAt descending (newest first)
    audits.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA; // Descending order
    });
    
    return audits;
  } catch (error) {
    console.error('Error getting audits:', error);
    throw error;
  }
};

export const getAuditById = async (auditId: string, userId: string) => {
  try {
    const db = getDb();
    const auditDoc = await db.collection(AUDITS_COLLECTION).doc(auditId).get();
    
    if (!auditDoc.exists) {
      return null;
    }
    
    const data = auditDoc.data();
    const auditData = { 
      id: auditDoc.id, 
      ...data,
      createdAt: timestampToISO(data?.createdAt),
      completedAt: data?.completedAt ? (data.completedAt.toDate?.()?.toISOString() || undefined) : undefined,
    } as any;
    
    // Verify ownership
    if (auditData.userId !== userId) {
      return null;
    }
    
    return auditData;
  } catch (error) {
    console.error('Error getting audit by ID:', error);
    throw error;
  }
};

export const createAudit = async (auditData: any) => {
  try {
    const db = getDb();
    
    // Remove undefined values - Firestore doesn't accept undefined
    const cleanData: any = {};
    Object.keys(auditData).forEach(key => {
      if (auditData[key] !== undefined) {
        cleanData[key] = auditData[key];
      }
    });
    
    const newAudit = {
      ...cleanData,
      status: 'running',
      createdAt: FieldValue.serverTimestamp(),
    };
    
    const docRef = await db.collection(AUDITS_COLLECTION).add(newAudit);
    const doc = await docRef.get();
    
    const data = doc.data();
    // Convert Firestore timestamps to ISO strings for client
    const audit = {
      id: doc.id,
      ...data,
      createdAt: timestampToISO(data?.createdAt),
    };
    
    return audit as any;
  } catch (error) {
    console.error('Error creating audit:', error);
    throw error;
  }
};

export const updateAudit = async (auditId: string, userId: string, updates: any) => {
  try {
    const db = getDb();
    const auditRef = db.collection(AUDITS_COLLECTION).doc(auditId);
    const auditDoc = await auditRef.get();
    
    if (!auditDoc.exists) {
      throw new Error('Audit not found');
    }
    
    const auditData = auditDoc.data();
    if (auditData?.userId !== userId) {
      throw new Error('Unauthorized');
    }
    
    // Remove undefined values - Firestore doesn't accept undefined
    const cleanUpdates: any = {};
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        cleanUpdates[key] = updates[key];
      }
    });
    
    const updateData: any = { ...cleanUpdates };
    
    // Convert completedAt to Firestore timestamp if it's a string
    if (updateData.completedAt && typeof updateData.completedAt === 'string') {
      updateData.completedAt = new Date(updateData.completedAt);
    } else if (updateData.status === 'completed' && !updateData.completedAt) {
      updateData.completedAt = FieldValue.serverTimestamp();
    }
    
    updateData.updatedAt = FieldValue.serverTimestamp();
    
    await auditRef.update(updateData);
    
    const updatedDoc = await auditRef.get();
    const data = updatedDoc.data();
    return {
      id: updatedDoc.id,
      ...data,
      createdAt: timestampToISO(data?.createdAt),
      completedAt: data?.completedAt ? (data.completedAt.toDate?.()?.toISOString() || undefined) : undefined,
    } as any;
  } catch (error) {
    console.error('Error updating audit:', error);
    throw error;
  }
};

// Connection Status Checks
export const checkCliConnection = async (userId: string, apiKey: string) => {
  try {
    const db = getDb();
    const connectionDoc = await db.collection(CONNECTION_CLI_COLLECTION).doc(userId).get();
    
    if (!connectionDoc.exists) {
      return { connected: false, message: 'CLI not connected' };
    }
    
    const data = connectionDoc.data();
    if (data?.apiKey === apiKey) {
      return { connected: true, message: 'CLI connected successfully' };
    }
    
    return { connected: false, message: 'API key mismatch' };
  } catch (error) {
    console.error('Error checking CLI connection:', error);
    throw error;
  }
};

export const checkExtensionConnection = async (userId: string) => {
  try {
    const db = getDb();
    const connectionDoc = await db.collection(CONNECTION_EXTENSION_COLLECTION).doc(userId).get();
    
    if (!connectionDoc.exists) {
      return { connected: false, message: 'Extension not connected' };
    }
    
    return { connected: true, message: 'Extension connected successfully' };
  } catch (error) {
    console.error('Error checking extension connection:', error);
    throw error;
  }
};
