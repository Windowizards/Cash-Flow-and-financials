'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatCurrency, formatDate } from '../../lib/financeUtils';
import '../page.css';
import './data-entry.css';

const defaultData = {
  invoices: [
    { id: 1, invoice_number: 'INV-001', client_name: 'Acme Corp', amount: 5000, status: 'outstanding', issued_date: '2026-07-15', due_date: '2026-08-15' },
  ],
  expenses: [
    { id: 1, description: 'Software License', category: 'software', amount: 299, status: 'pending', due_date: '2026-08-10' },
  ],
  invoiceCosts: [
    { id: 1, invoice_id: 1, description: 'Materials', amount: 500, status: 'pending' },
  ],
  payroll: [
    { id: 1, employee_name: 'John Doe', amount: 3000, due_date: '2026-08-31', status: 'pending' },
  ],
};

export default function DataEntryPage() {
  const [tab, setTab] = useState('invoices');
  const [invoices, setInvoices] = useState(defaultData.invoices);
  const [expenses, setExpenses] = useState(defaultData.expenses);
  const [accounts, setAccounts] = useState([
    { id: 1, name: 'Checking', type: 'business', balance: 15000 },
  ]);
  const [invoiceCosts, setInvoiceCosts] = useState(defaultData.invoiceCosts);
  const [payroll, setPayroll] = useState(defaultData.payroll);

  const addRow = () => {
    if (tab === 'invoices') {
      setInvoices([...invoices, { id: Date.now(), invoice_number: '', client_name: '', amount: 0, status: 'outstanding', issued_date: new Date().toISOString().split('T')[0], due_date: '' }]);
    } else if (tab === 'expenses') {
      setExpenses([...expenses, { id: Date.now(), description: '', category: 'other', amount: 0, status: 'pending', due_date: new Date().toISOString().split('T')[0] }]);
    } else if (tab === 'accounts') {
      setAccounts([...accounts, { id: Date.now(), name: '', type: 'business', balance: 0 }]);
    } else if (tab === 'costs') {
      setInvoiceCosts([...invoiceCosts, { id: Date.now(), invoice_id: '', description: '', amount: 0, status: 'pending' }]);
    } else if (tab === 'payroll') {
      setPayroll([...payroll, { id: Date.now(), employee_name: '', amount: 0, due_date: new Date().toISOString().split('T')[0], status: 'pending' }]);
    }
  };

  const updateField = (type, id, field, value) => {
    if (type === 'invoices') {
      setInvoices(invoices.map(inv => inv.id === id ? { ...inv, [field]: field === 'amount' ? parseFloat(value) : value } : inv));
    } else if (type === 'expenses') {
      setExpenses(expenses.map(exp => exp.id === id ? { ...exp, [field]: field === 'amount' ? parseFloat(value) : value } : exp));
    } else if (type === 'accounts') {
      setAccounts(accounts.map(acc => acc.id === id ? { ...acc, [field]: field === 'balance' ? parseFloat(value) : value } : acc));
    } else if (type === 'costs') {
      setInvoiceCosts(invoiceCosts.map(cost => cost.id === id ? { ...cost, [field]: field === 'amount' ? parseFloat(value) : value } : cost));
    } else if (type === 'payroll') {
      setPayroll(payroll.map(pay => pay.id === id ? { ...pay, [field]: field === 'amount' ? parseFloat(value) : value } : pay));
    }
  };

  const deleteRow = (type, id) => {
    if (type === 'invoices') setInvoices(invoices.filter(inv => inv.id !== id));
    else if (type === 'expenses') setExpenses(expenses.filter(exp => exp.id !== id));
    else if (type === 'accounts') setAccounts(accounts.filter(acc => acc.id !== id));
    else if (type === 'costs') setInvoiceCosts(invoiceCosts.filter(cost => cost.id !== id));
    else if (type === 'payroll') setPayroll(payroll.filter(pay => pay.id !== id));
  };

  const totalInvoices = invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);

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
          <Link href="/taxes">Taxes</Link>
          <Link href="/data-entry" className="active">Quick Entry</Link>
        </nav>
      </aside>

      <main className="main-content">
        <div className="header">
          <h1>Quick Data Entry</h1>
          <button className="primary" onClick={addRow}>+ Add Row</button>
        </div>

        <div className="tabs">
          <button
            className={`tab ${tab === 'invoices' ? 'active' : ''}`}
            onClick={() => setTab('invoices')}
          >
            Invoices ({invoices.length})
          </button>
          <button
            className={`tab ${tab === 'expenses' ? 'active' : ''}`}
            onClick={() => setTab('expenses')}
          >
            Expenses ({expenses.length})
          </button>
          <button
            className={`tab ${tab === 'accounts' ? 'active' : ''}`}
            onClick={() => setTab('accounts')}
          >
            Accounts ({accounts.length})
          </button>
          <button
            className={`tab ${tab === 'costs' ? 'active' : ''}`}
            onClick={() => setTab('costs')}
          >
            Invoice Costs ({invoiceCosts.length})
          </button>
          <button
            className={`tab ${tab === 'payroll' ? 'active' : ''}`}
            onClick={() => setTab('payroll')}
          >
            Payroll ({payroll.length})
          </button>
        </div>

        {/* INVOICES TABLE */}
        {tab === 'invoices' && (
          <div className="section">
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Client Name</th>
                    <th>Amount</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map(inv => (
                    <tr key={inv.id}>
                      <td>
                        <input
                          type="text"
                          value={inv.invoice_number}
                          onChange={(e) => updateField('invoices', inv.id, 'invoice_number', e.target.value)}
                          placeholder="INV-001"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={inv.client_name}
                          onChange={(e) => updateField('invoices', inv.id, 'client_name', e.target.value)}
                          placeholder="Client name"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          step="0.01"
                          value={inv.amount}
                          onChange={(e) => updateField('invoices', inv.id, 'amount', e.target.value)}
                          placeholder="0.00"
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          value={inv.due_date}
                          onChange={(e) => updateField('invoices', inv.id, 'due_date', e.target.value)}
                        />
                      </td>
                      <td>
                        <select
                          value={inv.status}
                          onChange={(e) => updateField('invoices', inv.id, 'status', e.target.value)}
                        >
                          <option value="outstanding">Outstanding</option>
                          <option value="paid">Paid</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td>
                        <button className="delete-btn" onClick={() => deleteRow('invoices', inv.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="total-row">
              <strong>Total: {formatCurrency(totalInvoices)}</strong>
            </div>
          </div>
        )}

        {/* EXPENSES TABLE */}
        {tab === 'expenses' && (
          <div className="section">
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map(exp => (
                    <tr key={exp.id}>
                      <td>
                        <input
                          type="text"
                          value={exp.description}
                          onChange={(e) => updateField('expenses', exp.id, 'description', e.target.value)}
                          placeholder="Description"
                        />
                      </td>
                      <td>
                        <select
                          value={exp.category}
                          onChange={(e) => updateField('expenses', exp.id, 'category', e.target.value)}
                        >
                          <option value="software">Software</option>
                          <option value="equipment">Equipment</option>
                          <option value="supplies">Supplies</option>
                          <option value="travel">Travel</option>
                          <option value="other">Other</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="number"
                          step="0.01"
                          value={exp.amount}
                          onChange={(e) => updateField('expenses', exp.id, 'amount', e.target.value)}
                          placeholder="0.00"
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          value={exp.due_date}
                          onChange={(e) => updateField('expenses', exp.id, 'due_date', e.target.value)}
                        />
                      </td>
                      <td>
                        <select
                          value={exp.status}
                          onChange={(e) => updateField('expenses', exp.id, 'status', e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td>
                        <button className="delete-btn" onClick={() => deleteRow('expenses', exp.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="total-row">
              <strong>Total: {formatCurrency(totalExpenses)}</strong>
            </div>
          </div>
        )}

        {/* ACCOUNTS TABLE */}
        {tab === 'accounts' && (
          <div className="section">
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Account Name</th>
                    <th>Type</th>
                    <th>Balance</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map(acc => (
                    <tr key={acc.id}>
                      <td>
                        <input
                          type="text"
                          value={acc.name}
                          onChange={(e) => updateField('accounts', acc.id, 'name', e.target.value)}
                          placeholder="Account name"
                        />
                      </td>
                      <td>
                        <select
                          value={acc.type}
                          onChange={(e) => updateField('accounts', acc.id, 'type', e.target.value)}
                        >
                          <option value="personal">Personal</option>
                          <option value="business">Business</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="number"
                          step="0.01"
                          value={acc.balance}
                          onChange={(e) => updateField('accounts', acc.id, 'balance', e.target.value)}
                          placeholder="0.00"
                        />
                      </td>
                      <td>
                        <button className="delete-btn" onClick={() => deleteRow('accounts', acc.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* INVOICE COSTS TABLE */}
        {tab === 'costs' && (
          <div className="section">
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Cost Description</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceCosts.map(cost => (
                    <tr key={cost.id}>
                      <td>
                        <select
                          value={cost.invoice_id}
                          onChange={(e) => updateField('costs', cost.id, 'invoice_id', e.target.value)}
                        >
                          <option value="">Select Invoice</option>
                          {invoices.map(inv => (
                            <option key={inv.id} value={inv.id}>{inv.invoice_number} - {inv.client_name}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="text"
                          value={cost.description}
                          onChange={(e) => updateField('costs', cost.id, 'description', e.target.value)}
                          placeholder="Materials, Labor, etc"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          step="0.01"
                          value={cost.amount}
                          onChange={(e) => updateField('costs', cost.id, 'amount', e.target.value)}
                          placeholder="0.00"
                        />
                      </td>
                      <td>
                        <select
                          value={cost.status}
                          onChange={(e) => updateField('costs', cost.id, 'status', e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td>
                        <button className="delete-btn" onClick={() => deleteRow('costs', cost.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="total-row">
              <strong>Total Costs: {formatCurrency(invoiceCosts.reduce((sum, cost) => sum + (cost.amount || 0), 0))}</strong>
            </div>
          </div>
        )}

        {/* PAYROLL TABLE */}
        {tab === 'payroll' && (
          <div className="section">
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Employee Name</th>
                    <th>Amount Owed</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {payroll.map(pay => (
                    <tr key={pay.id}>
                      <td>
                        <input
                          type="text"
                          value={pay.employee_name}
                          onChange={(e) => updateField('payroll', pay.id, 'employee_name', e.target.value)}
                          placeholder="Employee name"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          step="0.01"
                          value={pay.amount}
                          onChange={(e) => updateField('payroll', pay.id, 'amount', e.target.value)}
                          placeholder="0.00"
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          value={pay.due_date}
                          onChange={(e) => updateField('payroll', pay.id, 'due_date', e.target.value)}
                        />
                      </td>
                      <td>
                        <select
                          value={pay.status}
                          onChange={(e) => updateField('payroll', pay.id, 'status', e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td>
                        <button className="delete-btn" onClick={() => deleteRow('payroll', pay.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="total-row">
              <strong>Total Payroll Owed: {formatCurrency(payroll.reduce((sum, pay) => sum + (pay.amount || 0), 0))}</strong>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
