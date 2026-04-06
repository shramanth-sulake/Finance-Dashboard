import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../services/AuthService';
import { AuthPayload, Role } from '../types';

// Extend Express Request object to hold user details
declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload;
        }
    }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Authentication token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        const user = decoded as AuthPayload;
        
        if (user.status !== 'ACTIVE') {
            return res.status(403).json({ error: 'User account is inactive' });
        }

        req.user = user;
        next();
    });
};

export const requireRole = (roles: Role[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: `Insufficient permissions. Required role(s): ${roles.join(', ')}` });
        }

        next();
    }
};
