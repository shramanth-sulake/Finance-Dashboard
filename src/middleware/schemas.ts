import { z } from 'zod';

export const loginSchema = z.object({
    body: z.object({
        username: z.string().min(3),
        password: z.string().min(6),
    })
});

export const createUserSchema = z.object({
    body: z.object({
        username: z.string().min(3),
        password: z.string().min(6),
        role: z.enum(['VIEWER', 'ANALYST', 'ADMIN']),
    })
});

export const updateRoleSchema = z.object({
    params: z.object({ id: z.string().uuid() }),
    body: z.object({ role: z.enum(['VIEWER', 'ANALYST', 'ADMIN']) })
});

export const updateStatusSchema = z.object({
    params: z.object({ id: z.string().uuid() }),
    body: z.object({ status: z.enum(['ACTIVE', 'INACTIVE']) })
});

export const createRecordSchema = z.object({
    body: z.object({
        amount: z.number().positive(),
        type: z.enum(['INCOME', 'EXPENSE']),
        category: z.string().min(1),
        date: z.string().refine(v => !isNaN(Date.parse(v)), { message: "Invalid date format" }),
        notes: z.string().optional()
    })
});

export const updateRecordSchema = z.object({
    params: z.object({ id: z.string().uuid() }),
    body: z.object({
        amount: z.number().positive().optional(),
        type: z.enum(['INCOME', 'EXPENSE']).optional(),
        category: z.string().min(1).optional(),
        date: z.string().refine(v => !isNaN(Date.parse(v)), { message: "Invalid date format" }).optional(),
        notes: z.string().optional()
    }).refine(data => Object.keys(data).length > 0, {
        message: "At least one field to update must be provided"
    })
});

export const getRecordsSchema = z.object({
    query: z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        type: z.enum(['INCOME', 'EXPENSE']).optional(),
        category: z.string().optional(),
        limit: z.coerce.number().int().min(1).max(100).optional().default(50),
        offset: z.coerce.number().int().min(0).optional().default(0)
    })
});

export const deleteRecordSchema = z.object({
    params: z.object({ id: z.string().uuid() })
});

export const getByIdSchema = z.object({
    params: z.object({ id: z.string().uuid() })
});
