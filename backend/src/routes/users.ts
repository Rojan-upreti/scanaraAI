import express from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import {
  getUserProfile,
  createOrUpdateUserProfile,
} from '../data/database.js';

const router = express.Router();

// Get user profile
router.get('/profile', async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.uid;
    const profile = await getUserProfile(userId);
    
    if (!profile) {
      // Return 404 for non-existent profiles (expected for new users)
      return res.status(404).json({ error: 'Profile not found', code: 'PROFILE_NOT_FOUND' });
    }
    
    res.json(profile);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create or update user profile
router.post('/profile', async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.uid;
    const { firstName, lastName, companyName, phoneNumber, email } = req.body;
    
    if (!firstName || !lastName || !phoneNumber || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const profile = await createOrUpdateUserProfile({
      uid: userId,
      firstName,
      lastName,
      companyName,
      phoneNumber,
      email,
      updatedAt: new Date().toISOString(),
    });
    
    res.status(201).json(profile);
  } catch (error: any) {
    console.error('Error creating/updating profile:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put('/profile', async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.uid;
    const existingProfile = await getUserProfile(userId);
    
    if (!existingProfile) {
      return res.status(404).json({ error: 'Profile not found', code: 'PROFILE_NOT_FOUND' });
    }
    
    const { firstName, lastName, companyName, phoneNumber } = req.body;
    
    const profile = await createOrUpdateUserProfile({
      ...existingProfile,
      firstName: firstName || existingProfile.firstName,
      lastName: lastName || existingProfile.lastName,
      companyName: companyName !== undefined ? companyName : existingProfile.companyName,
      phoneNumber: phoneNumber || existingProfile.phoneNumber,
      updatedAt: new Date().toISOString(),
    });
    
    res.json(profile);
  } catch (error: any) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

