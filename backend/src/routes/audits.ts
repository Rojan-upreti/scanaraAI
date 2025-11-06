import express from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import {
  getAudits,
  getAuditById,
  createAudit,
  updateAudit,
} from '../data/database.js';
import { processAudit } from '../services/auditService.js';

const router = express.Router();

// Get all audits for user (optionally filtered by appId)
router.get('/', async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.uid;
    const appId = req.query.appId as string | undefined;
    const audits = await getAudits(userId, appId);
    res.json(audits);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get audit by ID
router.get('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.uid;
    const audit = await getAuditById(req.params.id, userId);
    
    if (!audit) {
      return res.status(404).json({ error: 'Audit not found' });
    }
    
    res.json(audit);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create audit
router.post('/', async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.uid;
    const { appId } = req.body;
    
    if (!appId) {
      return res.status(400).json({ error: 'appId is required' });
    }
    
    const audit = await createAudit({
      userId,
      appId,
      status: 'running',
    });
    
    // Start processing audit in background (don't wait for it)
    processAudit(audit.id, userId, appId).catch(error => {
      console.error('Background audit processing failed:', error);
    });
    
    res.status(201).json(audit);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update audit
router.put('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.uid;
    const audit = await updateAudit(req.params.id, userId, req.body);
    res.json(audit);
  } catch (error: any) {
    if (error.message === 'Audit not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

export default router;

