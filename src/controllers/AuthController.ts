import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

const authService = new AuthService();

/**
 * Controller handling user authentication.
 */
export class AuthController {
    /**
     * Authenticates a user and returns a JWT token.
     */
    static login(req: Request, res: Response) {
        const { username, password } = req.body;

        const result = authService.login(username, password);

        if (!result) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        res.json(result);
    }
}
