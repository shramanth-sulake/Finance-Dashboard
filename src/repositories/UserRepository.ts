import db from '../db/connection';
import { User, Role, Status } from '../types';

export class UserRepository {
    findById(id: string): User | undefined {
        return db.prepare('SELECT * FROM users WHERE id = ?').get(id) as User | undefined;
    }

    findByUsername(username: string): User | undefined {
        return db.prepare('SELECT * FROM users WHERE username = ?').get(username) as User | undefined;
    }

    findAll(): User[] {
        return db.prepare('SELECT id, username, role, status, created_at FROM users').all() as User[];
    }

    create(user: Pick<User, 'id' | 'username' | 'password_hash' | 'role' | 'status'>): User {
        db.prepare(`
            INSERT INTO users (id, username, password_hash, role, status)
            VALUES (@id, @username, @password_hash, @role, @status)
        `).run(user);
        
        return this.findById(user.id)!;
    }

    updateRole(id: string, role: Role): User | undefined {
        const info = db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, id);
        if (info.changes === 0) return undefined;
        return this.findById(id);
    }

    updateStatus(id: string, status: Status): User | undefined {
        const info = db.prepare('UPDATE users SET status = ? WHERE id = ?').run(status, id);
        if (info.changes === 0) return undefined;
        return this.findById(id);
    }
}
