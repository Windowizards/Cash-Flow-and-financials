'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatCurrency, formatDate } from '../../lib/financeUtils';
import '../page.css';

const statuses = ['outstanding', 'paid', 'cancelled'];
const defaultInvoices = [
  { id: 1, invoice_number: 'INV-001', client_name: 'Acme Corp', amount: 5000, status: 'outstanding', issued_date: '2026-07-15', due_date: '2026-08-15' },
  { id: 2, invoice_number: 'INV-002', client_name: 'Tech Inc', amount: 3500, status: 'outstanding', issued_date: '2026-07-20', due_date: '2026-08-20' },
  { id: 3, invoice_number: 'INV-003', client_name: 'Design Co', amount: 2000, status: 'paid', issued_date: '2026-06-01', due_date: '2026-07-01', paid_date: '2026-07-05' },
];

export default function InvoicesPage() {
  const [showForm, setShowForm] = useState(false);
  const [invoices, setInvoices] = useState(defaultInvoices);
  const [formData, setFormData] = useState({
    invoice_number: '',
    client_name: '',
    amount: '',
    status: 'outstanding',
    issued_date: new Date().toISOString().split('T')[0],
    due_date: '',
    description: '',
  });

  function handleSubmit(e) {
    e.preventDefault();
    setInvoices([...invoices, {
      id: Date.now(),
      ...formData,
      amount: parseFloat(formData.amount),
    }]);
    setFormData({
      invoice_number: '',
      client_name: '',
      amount: '',
      status: 'outstanding',
      issued_date: new Date().toISOString().split('T')[0],
      due_date: '',
      description: '',
    });
    setShowForm(false);
  }

  function updateStatus(id, newStatus) {
    setInvoices(invoices.map(inv =>
      inv.id === id ? { ...inv, status: newStatus, paid_date: newStatus === 'paid' ? new Date().toISOString().split('T')[0] : null } : inv
    ));
  }

  function deleteInvoice(id) {
    setInvoices(invoices.filter(i => i.id !== id));
  }

  const outstanding = invoices.filter(i => i.status === 'outstanding').reduce((sum, i) => sum + i.amount, 0);
  const paid = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h1>💰 Finance</h1>
        <nav>
          <Link href="/">Dashboard</Link>
          <Link href="/accounts">Accounts</Link>
          <Link href="/invoices" className="active">Invoices</Link>
          <Link href="/jobs">Jobs</Link>
          <Link href="/expenses">Expenses</Link>
          <Link href="/taxes">Taxes</Link>
        </nav>
      </aside>

      <main className="main-content">
        <div className="header">
          <h1>Invoices</h1>
          <button className="primary" onClick={() => setShowForm(true)}>+ New Invoice</button>
        </div>

        <div className="dashboard-grid">
          <div className="stat-card warning">
            <h3>Outstanding</h3>
            <div className="amount">{formatCurrency(outstanding)}</div>
            <p>{invoices.filter(i => i.status === 'outstanding').length} invoices</p>
          </div>

          <div className="stat-card positive">
            <h3>Paid</h3>
            <div className="amount">{formatCurrency(paid)}</div>
            <p>{invoices.filter(i => i.status === 'paid').length} invoices</p>
          </div>

          <div className="stat-card">
            <h3>Total Value</h3>
            <div className="amount">{formatCurrency(outstanding + paid)}</div>
            <p>{invoices.length} invoices</p>
          </div>
        </div>

        <div className="section">
          <h2>All Invoices</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Client</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(invoice => (
                <tr key={invoice.id}>
                  <td>{invoice.invoice_number}</td>
                  <td>{invoice.client_name}</td>
                  <td className="amount">{formatCurrency(invoice.amount)}</td>
                  <td>{formatDate(invoice.due_date)}</td>
                  <td>
                    <select
                      value={invoice.status}
                      onChange={e => updateStatus(invoice.id, e.target.value)}
                      className="status-select"
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button className="secondary small" onClick={() => deleteInvoice(invoice.id)}>Delete</button>
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
                <h2>New Invoice</h2>
                <button className="close-btn" onClick={() => setShowForm(false)}>×</button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Invoice Number</label>
                    <input
                      type="text"
                      value={formData.invoice_number}
                      onChange={e => setFormData({ ...formData, invoice_number: e.target.value })}
                      placeholder="INV-001"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Client Name</label>
                    <input
                      type="text"
                      value={formData.client_name}
                      onChange={e => setFormData({ ...formData, client_name: e.target.value })}
                      required
                    />
                  </div>
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

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                  />
                </div>

                <div className="form-actions">
                  <button type="button" className="secondary" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="primary">Create Invoice</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
