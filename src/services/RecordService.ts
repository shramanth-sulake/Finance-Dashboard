import { RecordRepository, RecordFilters } from '../repositories/RecordRepository';
import { FinancialRecord, RecordType } from '../types';
import crypto from 'crypto';

/**
 * Service encapsulating the business logic for Financial Records.
 */
export class RecordService {
    private repo: RecordRepository;

    constructor() {
        this.repo = new RecordRepository();
    }

    /**
     * Retrieves all records based on the given filters (with pagination).
     */
    getAll(filters: RecordFilters): FinancialRecord[] {
        return this.repo.findAll(filters);
    }

    /**
     * Retrieves a single record by its ID.
     */
    getById(id: string): FinancialRecord | undefined {
        return this.repo.findById(id);
    }

    /**
     * Creates a new financial record securely.
     */
    create(data: { amount: number; type: RecordType; category: string; date: string; notes?: string; user_id: string }): FinancialRecord {
        if (data.amount <= 0) {
            throw new Error('Amount must be strictly positive');
        }

        return this.repo.create({
            id: crypto.randomUUID(),
            amount: data.amount,
            type: data.type,
            category: data.category,
            date: data.date,
            notes: data.notes || null,
            created_by: data.user_id
        });
    }

    /**
     * Partially updates an existing record.
     */
    update(id: string, updates: Partial<Pick<FinancialRecord, 'amount' | 'type' | 'category' | 'date' | 'notes'>>): FinancialRecord | undefined {
        if (updates.amount !== undefined && updates.amount <= 0) {
            throw new Error('Amount must be strictly positive');
        }
        return this.repo.update(id, updates);
    }

    /**
     * Deletes a record from the database.
     */
    delete(id: string): boolean {
        return this.repo.delete(id);
    }
}
