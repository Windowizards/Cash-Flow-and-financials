'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { calculateCashFlow, formatCurrency, getCashFlowTimeline, groupEventsByMonth } from '../lib/financeUtils';
import Timeline from '../components/Timeline';
import './page.css';

export default function Dashboard() {
  const [data, setData] = useState({
    accounts: [],
    invoices: [],
    jobs: [],
    expenses: [],
    taxItems: [],
  });
  const [loading, setLoading] = useState(true);
  const [cashFlow, setCashFlow] = useState(null);
  const [upcomingMonth, setUpcomingMonth] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (data.accounts.length > 0) {
      const cf = calculateCashFlow(
        data.accounts,
        data.invoices,
        data.jobs,
        data.expenses,
        data.taxItems
      );
      setCashFlow(cf);

      const timeline = getCashFlowTimeline(
        data.invoices,
        data.jobs,
        data.expenses,
        data.taxItems
      );
      const grouped = groupEventsByMonth(timeline);
      if (Object.keys(grouped).length > 0) {
        const firstMonth = Object.keys(grouped).sort()[0];
        setUpcomingMonth({ month: firstMonth, ...grouped[firstMonth] });
      }
    }
  }, [data]);

  async function loadData() {
    try {
      setLoading(true);
      // For now, simulate data. In production, fetch from API
      setData({
        accounts: [
          { id: 1, name: 'Checking', type: 'business', balance: 15000 },
          { id: 2, name: 'Savings', type: 'business', balance: 25000 },
          { id: 3, name: 'Personal', type: 'personal', balance: 8500 },
        ],
        invoices: [
          { id: 1, client_name: 'Acme Corp', amount: 5000, status: 'outstanding', due_date: '2026-08-15' },
          { id: 2, client_name: 'Tech Inc', amount: 3500, status: 'outstanding', due_date: '2026-08-20' },
        ],
        jobs: [
          { id: 1, title: 'Website Redesign', estimated_revenue: 8000, status: 'upcoming', start_date: '2026-08-01', end_date: '2026-08-31' },
        ],
        expenses: [
          { id: 1, description: 'Software License', category: 'software', amount: 299, status: 'pending', due_date: '2026-08-10' },
          { id: 2, description: 'Equipment', category: 'equipment', amount: 1500, status: 'pending', due_date: '2026-08-25' },
        ],
        taxItems: [
          { id: 1, description: 'Q3 Estimated Tax', amount: 3000, status: 'pending', due_date: '2026-09-15', quarter: '3', year: 2026 },
        ],
      });
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h1>💰 Finance</h1>
        <nav>
          <Link href="/" className="active">Dashboard</Link>
          <Link href="/accounts">Accounts</Link>
          <Link href="/invoices">Invoices</Link>
          <Link href="/jobs">Jobs</Link>
          <Link href="/expenses">Expenses</Link>
          <Link href="/taxes">Taxes</Link>
        </nav>
      </aside>

      <main className="main-content">
        <div className="header">
          <h1>Cash Flow Dashboard</h1>
          <div className="header-actions">
            <button className="primary">+ Add Item</button>
          </div>
        </div>

        {cashFlow && (
          <>
            <div className="dashboard-grid">
              <div className="stat-card positive">
                <h3>Total Balance</h3>
                <div className="amount">{formatCurrency(cashFlow.totalBalance)}</div>
                <p>{data.accounts.length} accounts</p>
              </div>

              <div className="stat-card positive">
                <h3>Outstanding Income</h3>
                <div className="amount">{formatCurrency(cashFlow.projectedIncome)}</div>
                <p>{data.invoices.filter(i => i.status === 'outstanding').length} invoices + {data.jobs.filter(j => j.status === 'upcoming').length} upcoming jobs</p>
              </div>

              <div className="stat-card warning">
                <h3>Outstanding Payments</h3>
                <div className="amount">{formatCurrency(cashFlow.projectedOutflow)}</div>
                <p>{data.expenses.filter(e => e.status === 'pending').length} expenses + {data.taxItems.filter(t => t.status === 'pending').length} taxes</p>
              </div>

              <div className={`stat-card ${cashFlow.projectedBalance >= 0 ? 'positive' : 'negative'}`}>
                <h3>Projected Balance</h3>
                <div className="amount">{formatCurrency(cashFlow.projectedBalance)}</div>
                <p>After all pending items</p>
              </div>
            </div>

            <div className="section">
              <h2>Upcoming Cash Flow</h2>
              <Timeline events={getCashFlowTimeline(data.invoices, data.jobs, data.expenses, data.taxItems)} />
            </div>

            <div className="section">
              <h2>Quick Actions</h2>
              <div className="quick-actions">
                <Link href="/invoices?new=true" className="action-card">
                  <div className="icon">📄</div>
                  <div className="text">
                    <h3>New Invoice</h3>
                    <p>Record a new invoice</p>
                  </div>
                </Link>

                <Link href="/jobs?new=true" className="action-card">
                  <div className="icon">💼</div>
                  <div className="text">
                    <h3>New Job</h3>
                    <p>Add upcoming project</p>
                  </div>
                </Link>

                <Link href="/expenses?new=true" className="action-card">
                  <div className="icon">💳</div>
                  <div className="text">
                    <h3>New Expense</h3>
                    <p>Record a purchase</p>
                  </div>
                </Link>

                <Link href="/taxes?new=true" className="action-card">
                  <div className="icon">🧾</div>
                  <div className="text">
                    <h3>Add Tax Item</h3>
                    <p>Track tax obligations</p>
                  </div>
                </Link>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
