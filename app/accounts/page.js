'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatCurrency } from '../../lib/financeUtils';
import '../page.css';
import './accounts.css';

export default function AccountsPage() {
  const [showForm, setShowForm] = useState(false);
  const [accounts, setAccounts] = useState([
    { id: 1, name: 'Checking', type: 'business', balance: 15000 },
    { id: 2, name: 'Savings', type: 'business', balance: 25000 },
    { id: 3, name: 'Personal', type: 'personal', balance: 8500 },
  ]);
  const [formData, setFormData] = useState({
    name: '',
    type: 'business',
    balance: '',
  });

  function handleSubmit(e) {
    e.preventDefault();
    setAccounts([...accounts, {
      id: Date.now(),
      ...formData,
      balance: parseFloat(formData.balance),
    }]);
    setFormData({ name: '', type: 'business', balance: '' });
    setShowForm(false);
  }

  function deleteAccount(id) {
    setAccounts(accounts.filter(a => a.id !== id));
  }

  const businessTotal = accounts
    .filter(a => a.type === 'business')
    .reduce((sum, a) => sum + a.balance, 0);

  const personalTotal = accounts
    .filter(a => a.type === 'personal')
    .reduce((sum, a) => sum + a.balance, 0);

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h1>💰 Finance</h1>
        <nav>
          <Link href="/">Dashboard</Link>
          <Link href="/accounts" className="active">Accounts</Link>
          <Link href="/invoices">Invoices</Link>
          <Link href="/jobs">Jobs</Link>
          <Link href="/expenses">Expenses</Link>
          <Link href="/taxes">Taxes</Link>
        </nav>
      </aside>

      <main className="main-content">
        <div className="header">
          <h1>Bank Accounts</h1>
          <button className="primary" onClick={() => setShowForm(true)}>+ New Account</button>
        </div>

        <div className="dashboard-grid">
          <div className="stat-card">
            <h3>Business Total</h3>
            <div className="amount positive">{formatCurrency(businessTotal)}</div>
            <p>{accounts.filter(a => a.type === 'business').length} accounts</p>
          </div>

          <div className="stat-card">
            <h3>Personal Total</h3>
            <div className="amount">{formatCurrency(personalTotal)}</div>
            <p>{accounts.filter(a => a.type === 'personal').length} accounts</p>
          </div>

          <div className="stat-card positive">
            <h3>All Accounts</h3>
            <div className="amount">{formatCurrency(businessTotal + personalTotal)}</div>
            <p>{accounts.length} total</p>
          </div>
        </div>

        <div className="section">
          <h2>Business Accounts</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Balance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {accounts.filter(a => a.type === 'business').map(account => (
                <tr key={account.id}>
                  <td>{account.name}</td>
                  <td className="amount">{formatCurrency(account.balance)}</td>
                  <td>
                    <button className="secondary small" onClick={() => deleteAccount(account.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="section">
          <h2>Personal Accounts</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Balance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {accounts.filter(a => a.type === 'personal').map(account => (
                <tr key={account.id}>
                  <td>{account.name}</td>
                  <td className="amount">{formatCurrency(account.balance)}</td>
                  <td>
                    <button className="secondary small" onClick={() => deleteAccount(account.id)}>Delete</button>
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
                <h2>New Account</h2>
                <button className="close-btn" onClick={() => setShowForm(false)}>×</button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Account Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Type</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="business">Business</option>
                    <option value="personal">Personal</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Current Balance</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.balance}
                    onChange={e => setFormData({ ...formData, balance: e.target.value })}
                    required
                  />
                </div>

                <div className="form-actions">
                  <button type="button" className="secondary" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="primary">Create Account</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
