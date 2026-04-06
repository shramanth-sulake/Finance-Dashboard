import { RecordRepository } from '../repositories/RecordRepository';

export class DashboardService {
    private recordRepo: RecordRepository;

    constructor() {
        this.recordRepo = new RecordRepository();
    }

    getSummary() {
        const aggregates = this.recordRepo.getAggregates();
        
        const netBalance = aggregates.totalIncome - aggregates.totalExpense;
        
        const recentActivity = this.recordRepo.findAll({}).slice(0, 5);

        return {
            totalIncome: aggregates.totalIncome,
            totalExpense: aggregates.totalExpense,
            netBalance,
            categoryTotals: aggregates.categoryTotals,
            recentActivity
        };
    }
}
