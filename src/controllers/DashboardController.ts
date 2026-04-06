import { Request, Response } from 'express';
import { DashboardService } from '../services/DashboardService';

const dashboardService = new DashboardService();

export class DashboardController {
    static getSummary(req: Request, res: Response) {
        const summary = dashboardService.getSummary();
        res.json(summary);
    }
}
