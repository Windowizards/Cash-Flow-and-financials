'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import './dashboard.css';

export default function DashboardPage() {
  const [tab, setTab] = useState('overview');

  // Financial data
  const [bankAccounts, setBankAccounts] = useState([
    { id: 1, name: 'Checking', balance: 15000, type: 'bank' },
    { id: 2, name: 'Savings', balance: 25000, type: 'bank' },
  ]);

  const [creditCards, setCreditCards] = useState([
    { id: 1, name: 'Chase Sapphire', balance: 3500, limit: 10000 },
    { id: 2, name: 'Amex Business', balance: 2100, limit: 50000 },
  ]);

  const [monthlyExpenses, setMonthlyExpenses] = useState([
    { id: 1, name: 'Rent', amount: 3000, category: 'housing' },
    { id: 2, name: 'Utilities', amount: 300, category: 'utilities' },
    { id: 3, name: 'Internet', amount: 100, category: 'utilities' },
    { id: 4, name: 'Insurance', amount: 500, category: 'insurance' },
    { id: 5, name: 'Groceries', amount: 800, category: 'food' },
  ]);

  // Calculations
  const totalBankBalance = bankAccounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalCreditDebt = creditCards.reduce((sum, card) => sum + card.balance, 0);
  const totalMonthlyExpenses = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const dailyBurnRate = (totalMonthlyExpenses / 30).toFixed(2);
  const netPosition = (totalBankBalance - totalCreditDebt).toFixed(2);
  const daysUntilBroke = (netPosition / dailyBurnRate).toFixed(0);

  // Add new rows
  const addBankAccount = () => {
    setBankAccounts([...bankAccounts, { id: Date.now(), name: '', balance: 0, type: 'bank' }]);
  };

  const addCreditCard = () => {
    setCreditCards([...creditCards, { id: Date.now(), name: '', balance: 0, limit: 0 }]);
  };

  const addExpense = () => {
    setMonthlyExpenses([...monthlyExpenses, { id: Date.now(), name: '', amount: 0, category: 'other' }]);
  };

  // Update functions
  const updateBankAccount = (id, field, value) => {
    setBankAccounts(bankAccounts.map(acc =>
      acc.id === id ? { ...acc, [field]: field === 'balance' ? parseFloat(value) || 0 : value } : acc
    ));
  };

  const updateCreditCard = (id, field, value) => {
    setCreditCards(creditCards.map(card =>
      card.id === id ? { ...card, [field]: field === 'balance' || field === 'limit' ? parseFloat(value) || 0 : value } : card
    ));
  };

  const updateExpense = (id, field, value) => {
    setMonthlyExpenses(monthlyExpenses.map(exp =>
      exp.id === id ? { ...exp, [field]: field === 'amount' ? parseFloat(value) || 0 : value } : exp
    ));
  };

  // Delete functions
  const deleteBankAccount = (id) => setBankAccounts(bankAccounts.filter(acc => acc.id !== id));
  const deleteCreditCard = (id) => setCreditCards(creditCards.filter(card => card.id !== id));
  const deleteExpense = (id) => setMonthlyExpenses(monthlyExpenses.filter(exp => exp.id !== id));

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo-section">
          <div className="logo">💾</div>
          <h1>CyberDollar</h1>
        </div>
        <nav className="nav-tabs">
          <button className={`nav-btn ${tab === 'overview' ? 'active' : ''}`} onClick={() => setTab('overview')}>
            Overview
          </button>
          <button className={`nav-btn ${tab === 'accounts' ? 'active' : ''}`} onClick={() => setTab('accounts')}>
            Bank Accounts
          </button>
          <button className={`nav-btn ${tab === 'debt' ? 'active' : ''}`} onClick={() => setTab('debt')}>
            Credit Cards
          </button>
          <button className={`nav-btn ${tab === 'expenses' ? 'active' : ''}`} onClick={() => setTab('expenses')}>
            Monthly Expenses
          </button>
          <button className={`nav-btn ${tab === 'projection' ? 'active' : ''}`} onClick={() => setTab('projection')}>
            Cash Burn
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* OVERVIEW TAB */}
        {tab === 'overview' && (
          <div className="tab-content">
            <h2>Financial Overview</h2>

            <div className="metrics-grid">
              <div className="metric-card primary">
                <div className="metric-label">Total Bank Balance</div>
                <div className="metric-value">${totalBankBalance.toLocaleString()}</div>
                <div className="metric-subtext">{bankAccounts.length} accounts</div>
              </div>

              <div className="metric-card warning">
                <div className="metric-label">Total Credit Debt</div>
                <div className="metric-value">${totalCreditDebt.toLocaleString()}</div>
                <div className="metric-subtext">{creditCards.length} cards</div>
              </div>

              <div className={`metric-card ${netPosition >= 0 ? 'success' : 'danger'}`}>
                <div className="metric-label">Net Position</div>
                <div className="metric-value">${netPosition.toLocaleString()}</div>
                <div className="metric-subtext">Assets - Debt</div>
              </div>

              <div className="metric-card info">
                <div className="metric-label">Daily Burn Rate</div>
                <div className="metric-value">${dailyBurnRate}</div>
                <div className="metric-subtext">/ day average</div>
              </div>

              <div className={`metric-card ${daysUntilBroke > 90 ? 'success' : daysUntilBroke > 30 ? 'warning' : 'danger'}`}>
                <div className="metric-label">Days Until Broke</div>
                <div className="metric-value">{daysUntilBroke}</div>
                <div className="metric-subtext">at current burn rate</div>
              </div>

              <div className="metric-card">
                <div className="metric-label">Monthly Expenses</div>
                <div className="metric-value">${totalMonthlyExpenses.toLocaleString()}</div>
                <div className="metric-subtext">{monthlyExpenses.length} items</div>
              </div>
            </div>

            <div className="quick-summary">
              <h3>Quick Status</h3>
              <p>You have <strong>${totalBankBalance.toLocaleString()}</strong> in banks and owe <strong>${totalCreditDebt.toLocaleString()}</strong> on credit cards.</p>
              <p>Your net position is <strong>${netPosition.toLocaleString()}</strong>. At your current burn rate of <strong>${dailyBurnRate}/day</strong>, you have approximately <strong>{daysUntilBroke} days</strong> of runway.</p>
            </div>
          </div>
        )}

        {/* BANK ACCOUNTS TAB */}
        {tab === 'accounts' && (
          <div className="tab-content">
            <div className="tab-header">
              <h2>Bank Accounts</h2>
              <button className="btn-add" onClick={addBankAccount}>+ Add Account</button>
            </div>

            <div className="spreadsheet">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Account Name</th>
                    <th>Balance</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {bankAccounts.map(acc => (
                    <tr key={acc.id}>
                      <td>
                        <input
                          type="text"
                          value={acc.name}
                          onChange={(e) => updateBankAccount(acc.id, 'name', e.target.value)}
                          placeholder="Account name"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={acc.balance}
                          onChange={(e) => updateBankAccount(acc.id, 'balance', e.target.value)}
                          placeholder="0.00"
                        />
                      </td>
                      <td>
                        <button className="btn-delete" onClick={() => deleteBankAccount(acc.id)}>✕</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="table-footer">
                <strong>Total: ${totalBankBalance.toLocaleString()}</strong>
              </div>
            </div>
          </div>
        )}

        {/* CREDIT CARDS TAB */}
        {tab === 'debt' && (
          <div className="tab-content">
            <div className="tab-header">
              <h2>Credit Cards & Debt</h2>
              <button className="btn-add" onClick={addCreditCard}>+ Add Card</button>
            </div>

            <div className="spreadsheet">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Card Name</th>
                    <th>Balance</th>
                    <th>Limit</th>
                    <th>Used %</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {creditCards.map(card => {
                    const utilization = card.limit > 0 ? ((card.balance / card.limit) * 100).toFixed(0) : 0;
                    return (
                      <tr key={card.id}>
                        <td>
                          <input
                            type="text"
                            value={card.name}
                            onChange={(e) => updateCreditCard(card.id, 'name', e.target.value)}
                            placeholder="Card name"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={card.balance}
                            onChange={(e) => updateCreditCard(card.id, 'balance', e.target.value)}
                            placeholder="0.00"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={card.limit}
                            onChange={(e) => updateCreditCard(card.id, 'limit', e.target.value)}
                            placeholder="0.00"
                          />
                        </td>
                        <td className="utilization">{utilization}%</td>
                        <td>
                          <button className="btn-delete" onClick={() => deleteCreditCard(card.id)}>✕</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="table-footer">
                <strong>Total Owed: ${totalCreditDebt.toLocaleString()}</strong>
              </div>
            </div>
          </div>
        )}

        {/* MONTHLY EXPENSES TAB */}
        {tab === 'expenses' && (
          <div className="tab-content">
            <div className="tab-header">
              <h2>Fixed Monthly Expenses</h2>
              <button className="btn-add" onClick={addExpense}>+ Add Expense</button>
            </div>

            <div className="spreadsheet">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Expense Name</th>
                    <th>Monthly Amount</th>
                    <th>Daily Amount</th>
                    <th>Category</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyExpenses.map(exp => {
                    const dailyAmount = (exp.amount / 30).toFixed(2);
                    return (
                      <tr key={exp.id}>
                        <td>
                          <input
                            type="text"
                            value={exp.name}
                            onChange={(e) => updateExpense(exp.id, 'name', e.target.value)}
                            placeholder="Expense name"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={exp.amount}
                            onChange={(e) => updateExpense(exp.id, 'amount', e.target.value)}
                            placeholder="0.00"
                          />
                        </td>
                        <td className="daily">${dailyAmount}</td>
                        <td>
                          <select value={exp.category} onChange={(e) => updateExpense(exp.id, 'category', e.target.value)}>
                            <option value="housing">Housing</option>
                            <option value="utilities">Utilities</option>
                            <option value="food">Food</option>
                            <option value="insurance">Insurance</option>
                            <option value="transport">Transport</option>
                            <option value="other">Other</option>
                          </select>
                        </td>
                        <td>
                          <button className="btn-delete" onClick={() => deleteExpense(exp.id)}>✕</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="table-footer">
                <strong>Total Monthly: ${totalMonthlyExpenses.toLocaleString()}</strong>
                <strong>Daily Burn: ${dailyBurnRate}</strong>
              </div>
            </div>
          </div>
        )}

        {/* CASH BURN TAB */}
        {tab === 'projection' && (
          <div className="tab-content">
            <h2>Cash Degradation Timeline</h2>
            <p className="subtitle">How your balance decreases day by day at current burn rate</p>

            <div className="projection-info">
              <div className="info-box">
                <div className="info-label">Starting Balance</div>
                <div className="info-value">${totalBankBalance.toLocaleString()}</div>
              </div>
              <div className="info-box">
                <div className="info-label">Daily Burn</div>
                <div className="info-value">${dailyBurnRate}</div>
              </div>
              <div className="info-box">
                <div className="info-label">Days Until $0</div>
                <div className="info-value">{daysUntilBroke}</div>
              </div>
            </div>

            <div className="timeline-container">
              <h3>Balance Over Time</h3>
              <table className="timeline-table">
                <thead>
                  <tr>
                    <th>Days From Now</th>
                    <th>Remaining Balance</th>
                    <th>Spent</th>
                  </tr>
                </thead>
                <tbody>
                  {[0, 7, 14, 30, 60, 90].map(days => {
                    const remaining = Math.max(0, totalBankBalance - (days * dailyBurnRate));
                    const spent = totalBankBalance - remaining;
                    if (days > daysUntilBroke && days !== 0 && days !== 7 && days !== 14) return null;
                    return (
                      <tr key={days}>
                        <td>{days === 0 ? 'Today' : `+${days} days`}</td>
                        <td className="balance">${remaining.toLocaleString()}</td>
                        <td className="spent">${spent.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
