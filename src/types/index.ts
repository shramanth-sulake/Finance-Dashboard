export type Role = 'VIEWER' | 'ANALYST' | 'ADMIN';
export type Status = 'ACTIVE' | 'INACTIVE';
export type RecordType = 'INCOME' | 'EXPENSE';

export interface User {
    id: string;
    username: string;
    password_hash: string;
    role: Role;
    status: Status;
    created_at: string;
}

export interface FinancialRecord {
    id: string;
    amount: number;
    type: RecordType;
    category: string;
    date: string;
    notes: string | null;
    created_by: string;
    created_at: string;
}

export interface AuthPayload {
    id: string;
    role: Role;
    status: Status;
}
