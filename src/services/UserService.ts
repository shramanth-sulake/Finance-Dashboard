import { UserRepository } from '../repositories/UserRepository';
import crypto from 'crypto';
import { Role, Status, User } from '../types';

export class UserService {
    private repo: UserRepository;

    constructor() {
        this.repo = new UserRepository();
    }

    create(username: string, passwordPlain: string, role: Role): Omit<User, 'password_hash'> {
        const existing = this.repo.findByUsername(username);
        if (existing) {
            throw new Error('Username already exists');
        }

        const password_hash = crypto.createHash('sha256').update(passwordPlain).digest('hex');
        
        const user = this.repo.create({
            id: crypto.randomUUID(),
            username,
            password_hash,
            role,
            status: 'ACTIVE'
        });

        const { password_hash: _, ...safeUser } = user;
        return safeUser;
    }

    getAll(): Omit<User, 'password_hash'>[] {
        return this.repo.findAll().map(u => {
            const { password_hash, ...safeUser } = u;
            return safeUser as Omit<User, 'password_hash'>;
        });
    }

    updateRole(id: string, role: Role): Omit<User, 'password_hash'> | undefined {
        const user = this.repo.updateRole(id, role);
        if (!user) return undefined;
        const { password_hash, ...safeUser } = user;
        return safeUser;
    }

    updateStatus(id: string, status: Status): Omit<User, 'password_hash'> | undefined {
        const user = this.repo.updateStatus(id, status);
        if (!user) return undefined;
        const { password_hash, ...safeUser } = user;
        return safeUser;
    }
}
