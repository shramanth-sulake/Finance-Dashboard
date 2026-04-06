import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { Role } from '../types';

const userService = new UserService();

export class UserController {
    static getAll(req: Request, res: Response) {
        const users = userService.getAll();
        res.json(users);
    }

    static create(req: Request, res: Response) {
        const { username, password, role } = req.body;
        try {
            const user = userService.create(username, password, role as Role);
            res.status(201).json(user);
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    static updateRole(req: Request, res: Response) {
        const id = req.params.id as string;
        const { role } = req.body;
        const updated = userService.updateRole(id, role as Role);
        
        if (!updated) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(updated);
    }

    static updateStatus(req: Request, res: Response) {
        const id = req.params.id as string;
        const { status } = req.body;
        const updated = userService.updateStatus(id, status);
        
        if (!updated) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(updated);
    }
}
