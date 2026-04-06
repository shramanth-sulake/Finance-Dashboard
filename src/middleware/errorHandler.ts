import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Error Status:', err.status || 500, 'Message:', err.message);

    if (err instanceof ZodError) {
        return res.status(400).json({
            error: 'Validation Error',
            details: err.issues.map((e: any) => ({ path: e.path.join('.'), message: e.message }))
        });
    }

    if (err.message === 'Username already exists') {
        return res.status(409).json({ error: err.message });
    }
    
    if (err.message === 'Amount must be strictly positive') {
         return res.status(400).json({ error: err.message });
    }

    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
    });
};
