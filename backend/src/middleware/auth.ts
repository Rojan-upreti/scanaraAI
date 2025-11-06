import { Request, Response, NextFunction } from 'express';
import { verifyIdToken } from '../config/firebase.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
  };
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    const token = authHeader.substring(7);
    
    // In development, if Firebase Admin is not configured, allow requests
    if (process.env.NODE_ENV === 'development' && !process.env.FIREBASE_PRIVATE_KEY) {
      // Try to get user ID from token if available, otherwise use dev user
      try {
        // Extract user ID from token payload if possible (basic check)
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
          req.user = {
            uid: payload.user_id || payload.sub || 'dev-user-id',
            email: payload.email || 'dev@example.com',
          };
        } else {
          req.user = {
            uid: 'dev-user-id',
            email: 'dev@example.com',
          };
        }
      } catch {
        req.user = {
          uid: 'dev-user-id',
          email: 'dev@example.com',
        };
      }
      return next();
    }

    try {
      const decodedToken = await verifyIdToken(token);
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
      };
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ error: 'Authentication error' });
  }
};

