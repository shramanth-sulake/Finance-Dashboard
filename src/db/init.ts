import db from './connection';
import crypto from 'crypto';

export function initializeDatabase() {
    db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT CHECK(role IN ('VIEWER', 'ANALYST', 'ADMIN')) NOT NULL,
            status TEXT CHECK(status IN ('ACTIVE', 'INACTIVE')) NOT NULL DEFAULT 'ACTIVE',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

    db.exec(`
        CREATE TABLE IF NOT EXISTS records (
            id TEXT PRIMARY KEY,
            amount DECIMAL(10, 2) NOT NULL,
            type TEXT CHECK(type IN ('INCOME', 'EXPENSE')) NOT NULL,
            category TEXT NOT NULL,
            date DATE NOT NULL,
            notes TEXT,
            created_by TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (created_by) REFERENCES users(id)
        );
        CREATE INDEX IF NOT EXISTS idx_records_date_category ON records(date, category);
        CREATE INDEX IF NOT EXISTS idx_records_user_id ON records(created_by);
    `);

    // Seed default admin user if not exists
    const adminExists = db.prepare('SELECT id FROM users WHERE username = ?').get('admin');
    
    if (!adminExists) {
        // In a real app we'd use bcrypt, but we'll use a simple mock for the assignment
        // or actually, let's just insert a plain string or a simple hash to keep it simple.
        // For security context in the assignment, let's use node crypto.
        const hash = crypto.createHash('sha256').update('admin123').digest('hex');
        
        db.prepare(`
            INSERT INTO users (id, username, password_hash, role, status)
            VALUES (?, ?, ?, ?, ?)
        `).run(crypto.randomUUID(), 'admin', hash, 'ADMIN', 'ACTIVE');
        console.log('Seeded default admin user: admin / admin123');
    }

    console.log('Database initialized successfully.');
}

// Run if called directly
if (require.main === module) {
    initializeDatabase();
}
