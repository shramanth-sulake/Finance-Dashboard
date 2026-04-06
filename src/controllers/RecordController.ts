import { Request, Response } from 'express';
import { RecordService } from '../services/RecordService';
import { RecordFilters } from '../repositories/RecordRepository';

const recordService = new RecordService();

/**
 * Controller handling all financial record management operations including
 * CRUD and paginated/filtered retrievals.
 */
export class RecordController {
    
    /**
     * Retrieves all records based on optional filters and pagination.
     */
    static getAll(req: Request, res: Response) {
        const filters: RecordFilters = req.query; // Populated and validated via Zod coercion
        const records = recordService.getAll(filters);
        res.json(records);
    }

    /**
     * Retrieves a single record by its UUID.
     */
    static getById(req: Request, res: Response) {
        const id = req.params.id as string;
        const record = recordService.getById(id);
        
        if (!record) {
            return res.status(404).json({ error: 'Record not found' });
        }

        res.json(record);
    }

    /**
     * Creates a new financial record associated with the authenticated user.
     */
    static create(req: Request, res: Response) {
        const { amount, type, category, date, notes } = req.body;
        const user_id = req.user!.id; // Resolved from authenticateToken middleware

        try {
            const record = recordService.create({ amount, type, category, date, notes, user_id });
            res.status(201).json(record);
        } catch (err: any) {
             res.status(400).json({ error: err.message });
        }
    }

    /**
     * Updates an existing financial record by ID.
     */
    static update(req: Request, res: Response) {
        const id = req.params.id as string;
        const updates = req.body;

        try {
            const updated = recordService.update(id, updates);
            if (!updated) {
                return res.status(404).json({ error: 'Record not found' });
            }
            res.json(updated);
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    /**
     * Deletes a financial record by ID.
     */
    static delete(req: Request, res: Response) {
        const id = req.params.id as string;
        const success = recordService.delete(id);
        
        if (!success) {
            return res.status(404).json({ error: 'Record not found' });
        }
        res.status(204).send();
    }
}
