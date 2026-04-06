import db from '../db/connection';
import { FinancialRecord, RecordType } from '../types';

export interface RecordFilters {
    startDate?: string;
    endDate?: string;
    type?: RecordType;
    category?: string;
    limit?: number;
    offset?: number;
}

export class RecordRepository {
    findById(id: string): FinancialRecord | undefined {
        return db.prepare('SELECT * FROM records WHERE id = ?').get(id) as FinancialRecord | undefined;
    }

    findAll(filters: RecordFilters = {}): FinancialRecord[] {
        let query = 'SELECT * FROM records WHERE 1=1';
        const params: any[] = [];

        if (filters.startDate) {
            query += ' AND date >= ?';
            params.push(filters.startDate);
        }
        if (filters.endDate) {
            query += ' AND date <= ?';
            params.push(filters.endDate);
        }
        if (filters.type) {
            query += ' AND type = ?';
            params.push(filters.type);
        }
        if (filters.category) {
            query += ' AND category = ?';
            params.push(filters.category);
        }

        query += ' ORDER BY date DESC, created_at DESC';

        // Apply pagination
        const limit = filters.limit ?? 50;
        const offset = filters.offset ?? 0;
        query += ' LIMIT ? OFFSET ?';
        params.push(limit, offset);

        return db.prepare(query).all(...params) as FinancialRecord[];
    }

    create(record: Omit<FinancialRecord, 'created_at'>): FinancialRecord {
        db.prepare(`
            INSERT INTO records (id, amount, type, category, date, notes, created_by)
            VALUES (@id, @amount, @type, @category, @date, @notes, @created_by)
        `).run(record);

        return this.findById(record.id)!;
    }

    update(id: string, updates: Partial<Pick<FinancialRecord, 'amount' | 'type' | 'category' | 'date' | 'notes'>>): FinancialRecord | undefined {
        const existing = this.findById(id);
        if (!existing) return undefined;

        const updated = { ...existing, ...updates };

        db.prepare(`
            UPDATE records 
            SET amount = @amount, type = @type, category = @category, date = @date, notes = @notes
            WHERE id = @id
        `).run(updated);

        return this.findById(id);
    }

    delete(id: string): boolean {
        const info = db.prepare('DELETE FROM records WHERE id = ?').run(id);
        return info.changes > 0;
    }

    getAggregates() {
        const totalIncome = db.prepare(`SELECT SUM(amount) as sum FROM records WHERE type = 'INCOME'`).get() as { sum: number | null };
        const totalExpense = db.prepare(`SELECT SUM(amount) as sum FROM records WHERE type = 'EXPENSE'`).get() as { sum: number | null };
        
        const categoryTotalsQuery = db.prepare(`
            SELECT category, type, SUM(amount) as total 
            FROM records 
            GROUP BY category, type
        `).all() as { category: string; type: string; total: number }[];

        return {
            totalIncome: totalIncome.sum || 0,
            totalExpense: totalExpense.sum || 0,
            categoryTotals: categoryTotalsQuery
        };
    }
}
