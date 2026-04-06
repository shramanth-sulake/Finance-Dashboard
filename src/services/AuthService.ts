import { UserRepository } from '../repositories/UserRepository';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { AuthPayload } from '../types';

export const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_local_dev';

export class AuthService {
    private repo: UserRepository;

    constructor() {
        this.repo = new UserRepository();
    }

    login(username: string, passwordPlain: string): { token: string; payload: AuthPayload } | null {
        const user = this.repo.findByUsername(username);
        if (!user) return null;

        const hash = crypto.createHash('sha256').update(passwordPlain).digest('hex');
        if (hash !== user.password_hash) {
            return null;
        }

        if (user.status !== 'ACTIVE') {
            throw new Error('Account is inactive');
        }

        const payload: AuthPayload = {
            id: user.id,
            role: user.role,
            status: user.status
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });

        return { token, payload };
    }
}
