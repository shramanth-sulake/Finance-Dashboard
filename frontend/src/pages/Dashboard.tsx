import { useEffect, useState } from 'react';
import { apiFetch } from '../services/api';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import './Dashboard.css';

interface SummaryData {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  categoryTotals: { category: string; type: string; total: number }[];
  recentActivity: any[];
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

export default function Dashboard() {
  const [data, setData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const summary = await apiFetch('/dashboard/summary');
      setData(summary);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (!data) return <div className="error">Failed to load data</div>;

  const chartData = data.categoryTotals.map(c => ({
    name: c.category,
    value: c.total,
    type: c.type
  }));

  return (
    <div className="dashboard animate-slide-up">
      <header className="page-header">
        <h1>Overview</h1>
        <p className="text-secondary">Your financial snapshot</p>
      </header>

      <div className="metrics-grid">
        <div className="glass-card metric-card">
          <div className="metric-icon bg-income"><TrendingUp size={24} /></div>
          <div>
            <p className="metric-label">Total Income</p>
            <h2 className="metric-value text-income">${data.totalIncome.toFixed(2)}</h2>
          </div>
        </div>
        
        <div className="glass-card metric-card">
          <div className="metric-icon bg-expense"><TrendingDown size={24} /></div>
          <div>
            <p className="metric-label">Total Expense</p>
            <h2 className="metric-value text-expense">${data.totalExpense.toFixed(2)}</h2>
          </div>
        </div>
        
        <div className="glass-card metric-card">
          <div className="metric-icon bg-primary"><DollarSign size={24} /></div>
          <div>
            <p className="metric-label">Net Balance</p>
            <h2 className={`metric-value ${data.netBalance >= 0 ? 'text-income' : 'text-expense'}`}>
              ${data.netBalance.toFixed(2)}
            </h2>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="glass-card chart-container">
          <h3>Category Breakdown</h3>
          <div className="chart-wrapper">
             {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.type === 'EXPENSE' ? '#ef4444' : COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--border-light)', borderRadius: '8px' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
             ) : (
               <div className="empty-state">No category data available</div>
             )}
          </div>
        </div>

        <div className="glass-card recent-activity">
          <div className="flex justify-between items-center" style={{marginBottom: '1.5rem'}}>
            <h3>Recent Activity</h3>
          </div>
          <div className="activity-list">
            {data.recentActivity.length === 0 ? (
               <div className="empty-state">No recent records</div>
            ) : (
               data.recentActivity.map(record => (
                <div key={record.id} className="activity-item">
                  <div className="activity-info">
                    <span className="activity-icon">
                       {record.type === 'INCOME' ? <TrendingUp size={16} className="text-income" /> : <TrendingDown size={16} className="text-expense" />}
                    </span>
                    <div>
                      <p className="activity-category">{record.category}</p>
                      <p className="activity-date">{new Date(record.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`activity-amount ${record.type === 'INCOME' ? 'text-income' : 'text-expense'}`}>
                    {record.type === 'INCOME' ? '+' : '-'}${record.amount.toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
