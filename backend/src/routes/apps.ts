import express from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import {
  getApps,
  getAppById,
  createApp,
  updateApp,
  deleteApp,
  checkCliConnection,
  checkExtensionConnection,
} from '../data/database.js';

const router = express.Router();

// Get all apps for user
router.get('/', async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.uid;
    const apps = await getApps(userId);
    res.json(apps);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get app by ID
router.get('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.uid;
    const app = await getAppById(req.params.id, userId);
    
    if (!app) {
      return res.status(404).json({ error: 'App not found' });
    }
    
    res.json(app);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create app
router.post('/', async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.uid;
    const { name, description, repositoryUrl } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    const app = await createApp({
      userId,
      name,
      description,
      repositoryUrl,
      connectionType: null,
      isConnected: false,
    });
    
    res.status(201).json(app);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update app
router.put('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.uid;
    const app = await updateApp(req.params.id, userId, req.body);
    res.json(app);
  } catch (error: any) {
    if (error.message === 'App not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

// Delete app
router.delete('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.uid;
    await deleteApp(req.params.id, userId);
    res.json({ message: 'App deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Check connection status
router.get('/:id/connection', async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.uid;
    const appId = req.params.id;
    const { type } = req.query;
    
    const app = await getAppById(appId, userId);
    if (!app) {
      return res.status(404).json({ error: 'App not found' });
    }
    
    if (type === 'cli') {
      const result = await checkCliConnection(userId, app.apiKey);
      return res.json(result);
    } else if (type === 'extension') {
      const result = await checkExtensionConnection(userId);
      return res.json(result);
    }
    
    return res.status(400).json({ error: 'Invalid connection type' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

