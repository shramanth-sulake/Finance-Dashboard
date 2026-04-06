import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { UserController } from '../controllers/UserController';
import { RecordController } from '../controllers/RecordController';
import { DashboardController } from '../controllers/DashboardController';
import { authenticateToken, requireRole } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';
import {
    loginSchema,
    createUserSchema,
    updateRoleSchema,
    updateStatusSchema,
    createRecordSchema,
    updateRecordSchema,
    getRecordsSchema,
    deleteRecordSchema,
    getByIdSchema
} from '../middleware/schemas';

const router = Router();

// --- Public Routes ---
router.post('/auth/login', validateRequest(loginSchema), AuthController.login);

// --- Authenticated Routes ---
router.use(authenticateToken);

// Dashboard Routes
router.get(
    '/dashboard/summary', 
    requireRole(['VIEWER', 'ANALYST', 'ADMIN']), 
    DashboardController.getSummary
);

// Financial Record Routes
router.get(
    '/records', 
    requireRole(['ANALYST', 'ADMIN']), 
    validateRequest(getRecordsSchema), 
    RecordController.getAll
);

router.get(
    '/records/:id', 
    requireRole(['ANALYST', 'ADMIN']), 
    validateRequest(getByIdSchema), 
    RecordController.getById
);

router.post(
    '/records', 
    requireRole(['ADMIN']), 
    validateRequest(createRecordSchema), 
    RecordController.create
);

router.put(
    '/records/:id', 
    requireRole(['ADMIN']), 
    validateRequest(updateRecordSchema), 
    RecordController.update
);

router.delete(
    '/records/:id', 
    requireRole(['ADMIN']), 
    validateRequest(deleteRecordSchema), 
    RecordController.delete
);

// User Management Routes
router.get(
    '/users', 
    requireRole(['ADMIN']), 
    UserController.getAll
);

router.post(
    '/users', 
    requireRole(['ADMIN']), 
    validateRequest(createUserSchema), 
    UserController.create
);

router.put(
    '/users/:id/role', 
    requireRole(['ADMIN']), 
    validateRequest(updateRoleSchema), 
    UserController.updateRole
);

router.put(
    '/users/:id/status', 
    requireRole(['ADMIN']), 
    validateRequest(updateStatusSchema), 
    UserController.updateStatus
);

export default router;
