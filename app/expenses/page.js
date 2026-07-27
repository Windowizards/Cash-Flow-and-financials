'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatCurrency, formatDate } from '../../lib/financeUtils';
import '../page.css';

const categories = ['software', 'equipment', 'supplies', 'travel', 'marketing', 'utilities', 'other'];
const statuses = ['pending', 'paid', 'cancelled'];

export default function ExpensesPage() {
  const [showForm, setShowForm] = useState(false);
  const [expenses, setExpenses] = useState([
    { id: 1, description: 'Software License', category: 'software', amount: 299, status: 'pending', due_date: '2026-08-10', is_recurring: true, recurring_frequency: 'monthly' },
    { id: 2, description: 'Equipment', category: 'equipment', amount: 1500, status: 'pending', due_date: '2026-08-25', is_recurring: false },
  ]);
  const [formData, setFormData] = useState({
    description: '',
    category: 'other',
    amount: '',
    due_date: new Date().toISOString().split('T')[0],
    is_recurring: false,
    recurring_frequency: 'monthly',
  });

  function handleSubmit(e) {
    e.preventDefault();
    setExpenses([...expenses, {
      id: Date.now(),
      ...formData,
      amount: parseFloat(formData.amount),
      is_recurring: formData.is_recurring === 'on' || formData.is_recurring === true,
      status: 'pending',
    }]);
    setFormData({
      description: '',
      category: 'other',
      amount: '',
      due_date: new Date().toISOString().split('T')[0],
      is_recurring: false,
      recurring_frequency: 'monthly',
    });
    setShowForm(false);
  }

  function updateStatus(id, newStatus) {
    setExpenses(expenses.map(exp => exp.id === id ? { ...exp, status: newStatus } : exp));
  }

  function deleteExpense(id) {
    setExpenses(expenses.filter(e => e.id !== id));
  }

  const pending = expenses.filter(e => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0);
  const paid = expenses.filter(e => e.status === 'paid').reduce((sum, e) => sum + e.amount, 0);
  const recurring = expenses.filter(e => e.is_recurring).length;

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h1>💰 Finance</h1>
        <nav>
          <Link href="/">Dashboard</Link>
          <Link href="/accounts">Accounts</Link>
          <Link href="/invoices">Invoices</Link>
          <Link href="/jobs">Jobs</Link>
          <Link href="/expenses" className="active">Expenses</Link>
          <Link href="/taxes">Taxes</Link>
        </nav>
      </aside>

      <main className="main-content">
        <div className="header">
          <h1>Expenses & Purchases</h1>
          <button className="primary" onClick={() => setShowForm(true)}>+ New Expense</button>
        </div>

        <div className="dashboard-grid">
          <div className="stat-card warning">
            <h3>Pending</h3>
            <div className="amount">{formatCurrency(pending)}</div>
            <p>{expenses.filter(e => e.status === 'pending').length} expenses</p>
          </div>

          <div className="stat-card positive">
            <h3>Paid</h3>
            <div className="amount">{formatCurrency(paid)}</div>
            <p>{expenses.filter(e => e.status === 'paid').length} expenses</p>
          </div>

          <div className="stat-card">
            <h3>Recurring</h3>
            <div className="amount">{recurring}</div>
            <p>recurring expenses</p>
          </div>
        </div>

        <div className="section">
          <h2>All Expenses</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Recurring</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(expense => (
                <tr key={expense.id}>
                  <td>{expense.description}</td>
                  <td>{expense.category}</td>
                  <td className="amount">{formatCurrency(expense.amount)}</td>
                  <td>{formatDate(expense.due_date)}</td>
                  <td>
                    <select
                      value={expense.status}
                      onChange={e => updateStatus(expense.id, e.target.value)}
                      className="status-select"
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                  <td>{expense.is_recurring ? expense.recurring_frequency : '-'}</td>
                  <td>
                    <button className="secondary small" onClick={() => deleteExpense(expense.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showForm && (
          <div className="modal" onClick={() => setShowForm(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>New Expense</h2>
                <button className="close-btn" onClick={() => setShowForm(false)}>×</button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Description</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={e => setFormData({ ...formData, amount: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Due Date</label>
                  <input
                    type="date"
                    value={formData.due_date}
                    onChange={e => setFormData({ ...formData, due_date: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group checkbox">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.is_recurring}
                      onChange={e => setFormData({ ...formData, is_recurring: e.target.checked })}
                    />
                    Recurring Expense
                  </label>
                </div>

                {formData.is_recurring && (
                  <div className="form-group">
                    <label>Frequency</label>
                    <select
                      value={formData.recurring_frequency}
                      onChange={e => setFormData({ ...formData, recurring_frequency: e.target.value })}
                    >
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Bi-weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="annually">Annually</option>
                    </select>
                  </div>
                )}

                <div className="form-actions">
                  <button type="button" className="secondary" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="primary">Create Expense</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
