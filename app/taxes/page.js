'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatCurrency, formatDate } from '../../lib/financeUtils';
import '../page.css';

const types = ['quarterly_estimate', 'tax_payment', 'expense_deduction'];
const quarters = ['1', '2', '3', '4'];

export default function TaxesPage() {
  const [showForm, setShowForm] = useState(false);
  const [taxItems, setTaxItems] = useState([
    { id: 1, type: 'quarterly_estimate', amount: 3000, due_date: '2026-09-15', status: 'pending', quarter: '3', year: 2026 },
    { id: 2, type: 'tax_payment', amount: 5000, due_date: '2026-04-15', status: 'paid', quarter: '1', year: 2026, paid_date: '2026-04-10' },
  ]);
  const [formData, setFormData] = useState({
    type: 'quarterly_estimate',
    amount: '',
    due_date: new Date().toISOString().split('T')[0],
    quarter: '1',
    year: new Date().getFullYear(),
    description: '',
  });

  function handleSubmit(e) {
    e.preventDefault();
    setTaxItems([...taxItems, {
      id: Date.now(),
      ...formData,
      amount: parseFloat(formData.amount),
      year: parseInt(formData.year),
      status: 'pending',
    }]);
    setFormData({
      type: 'quarterly_estimate',
      amount: '',
      due_date: new Date().toISOString().split('T')[0],
      quarter: '1',
      year: new Date().getFullYear(),
      description: '',
    });
    setShowForm(false);
  }

  function updateStatus(id, newStatus) {
    setTaxItems(taxItems.map(t =>
      t.id === id ? { ...t, status: newStatus, paid_date: newStatus === 'paid' ? new Date().toISOString().split('T')[0] : null } : t
    ));
  }

  function deleteTaxItem(id) {
    setTaxItems(taxItems.filter(t => t.id !== id));
  }

  const pending = taxItems.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0);
  const paid = taxItems.filter(t => t.status === 'paid').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h1>💰 Finance</h1>
        <nav>
          <Link href="/">Dashboard</Link>
          <Link href="/accounts">Accounts</Link>
          <Link href="/invoices">Invoices</Link>
          <Link href="/jobs">Jobs</Link>
          <Link href="/expenses">Expenses</Link>
          <Link href="/taxes" className="active">Taxes</Link>
        </nav>
      </aside>

      <main className="main-content">
        <div className="header">
          <h1>Tax Tracker</h1>
          <button className="primary" onClick={() => setShowForm(true)}>+ Add Tax Item</button>
        </div>

        <div className="dashboard-grid">
          <div className="stat-card warning">
            <h3>Tax Owed</h3>
            <div className="amount">{formatCurrency(pending)}</div>
            <p>{taxItems.filter(t => t.status === 'pending').length} pending</p>
          </div>

          <div className="stat-card positive">
            <h3>Tax Paid</h3>
            <div className="amount">{formatCurrency(paid)}</div>
            <p>{taxItems.filter(t => t.status === 'paid').length} paid</p>
          </div>

          <div className="stat-card">
            <h3>Total Tracked</h3>
            <div className="amount">{formatCurrency(pending + paid)}</div>
            <p>{taxItems.length} items</p>
          </div>
        </div>

        <div className="section">
          <h2>All Tax Items</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Quarter/Year</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {taxItems.map(tax => (
                <tr key={tax.id}>
                  <td>{tax.type.replace(/_/g, ' ')}</td>
                  <td>{tax.quarter ? `Q${tax.quarter}` : ''} {tax.year}</td>
                  <td className="amount">{formatCurrency(tax.amount)}</td>
                  <td>{formatDate(tax.due_date)}</td>
                  <td>
                    <select
                      value={tax.status}
                      onChange={e => updateStatus(tax.id, e.target.value)}
                      className="status-select"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>
                    <button className="secondary small" onClick={() => deleteTaxItem(tax.id)}>Delete</button>
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
                <h2>Add Tax Item</h2>
                <button className="close-btn" onClick={() => setShowForm(false)}>×</button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Type</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                  >
                    {types.map(type => (
                      <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
                    ))}
                  </select>
                </div>

                <div className="form-row">
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

                  <div className="form-group">
                    <label>Due Date</label>
                    <input
                      type="date"
                      value={formData.due_date}
                      onChange={e => setFormData({ ...formData, due_date: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Quarter (if applicable)</label>
                    <select
                      value={formData.quarter}
                      onChange={e => setFormData({ ...formData, quarter: e.target.value })}
                    >
                      <option value="">None</option>
                      {quarters.map(q => (
                        <option key={q} value={q}>Q{q}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Year</label>
                    <input
                      type="number"
                      value={formData.year}
                      onChange={e => setFormData({ ...formData, year: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="e.g., Quarterly estimated income tax"
                  />
                </div>

                <div className="form-actions">
                  <button type="button" className="secondary" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="primary">Add Item</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
