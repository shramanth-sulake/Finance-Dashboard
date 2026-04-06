import { useEffect, useState } from 'react';
import { apiFetch } from '../services/api';
import { Plus, Trash2 } from 'lucide-react';
import './Records.css';

interface RecordItem {
  id: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  date: string;
  notes?: string;
}

export default function Records() {
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState({ 
    amount: '', 
    type: 'EXPENSE', 
    category: '', 
    date: new Date().toISOString().split('T')[0], 
    notes: '' 
  });

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const data = await apiFetch('/records');
      setRecords(data);
    } catch (err) {
      console.error('Failed to fetch records:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    
    try {
      await apiFetch(`/records/${id}`, { method: 'DELETE' });
      fetchRecords();
    } catch (err) {
      alert('Failed to delete the record.');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch('/records', {
        method: 'POST',
        data: {
          ...formData,
          amount: parseFloat(formData.amount)
        }
      });
      
      setShowModal(false);
      fetchRecords();
    } catch (err: any) {
      alert(err.message || 'Failed to create record.');
    }
  };

  return (
    <div className="records-page animate-slide-up">
      <header className="page-header flex justify-between items-center">
        <div>
          <h1>Financial Records</h1>
          <p className="text-secondary">Manage and view all transactions</p>
        </div>
        <button className="btn-primary" style={{ width: 'auto' }} onClick={() => setShowModal(true)}>
          <Plus size={18} /> Add Record
        </button>
      </header>

      <div className="glass-card table-container">
        {loading ? <div className="empty-state">Loading...</div> : (
          <table className="records-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 && (
                <tr><td colSpan={6} className="empty-state">No records found</td></tr>
              )}
              {records.map(record => (
                <tr key={record.id}>
                  <td>{new Date(record.date).toLocaleDateString()}</td>
                  <td><span className="pill">{record.category}</span></td>
                  <td>
                    <span className={`badge ${record.type === 'INCOME' ? 'badge-income' : 'badge-expense'}`}>
                      {record.type}
                    </span>
                  </td>
                  <td className={`font-outfit ${record.type === 'INCOME' ? 'text-income' : 'text-expense'}`}>
                    ${record.amount.toFixed(2)}
                  </td>
                  <td className="text-secondary">{record.notes || '-'}</td>
                  <td>
                    <button className="btn-icon" onClick={() => handleDelete(record.id)}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="glass-card modal-content animate-slide-up">
            <h3>Add New Record</h3>
            <form onSubmit={handleCreate} className="modal-form">
               <div className="flex gap-4">
                  <div className="form-group flex-1">
                    <label>Amount ($)</label>
                    <input type="number" step="0.01" required className="input-base" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                  </div>
                  <div className="form-group flex-1">
                    <label>Type</label>
                    <select className="input-base" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                      <option value="EXPENSE">Expense</option>
                      <option value="INCOME">Income</option>
                    </select>
                  </div>
               </div>
               
               <div className="form-group">
                 <label>Category</label>
                 <input type="text" required className="input-base" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="e.g. Salary, Groceries" />
               </div>

               <div className="form-group">
                 <label>Date</label>
                 <input type="date" required className="input-base" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
               </div>

               <div className="form-group">
                 <label>Notes (Optional)</label>
                 <input type="text" className="input-base" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
               </div>
               
               <div className="flex gap-4" style={{marginTop: '1rem'}}>
                  <button type="button" className="btn-icon flex-1" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn-primary flex-1">Save Record</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
