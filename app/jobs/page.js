'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatCurrency, formatDate } from '../../lib/financeUtils';
import '../page.css';

const statuses = ['upcoming', 'in_progress', 'completed', 'cancelled'];

export default function JobsPage() {
  const [showForm, setShowForm] = useState(false);
  const [jobs, setJobs] = useState([
    { id: 1, title: 'Website Redesign', estimated_revenue: 8000, actual_revenue: null, status: 'upcoming', start_date: '2026-08-01', end_date: '2026-08-31', client_name: 'Acme Corp' },
  ]);
  const [formData, setFormData] = useState({
    title: '',
    estimated_revenue: '',
    status: 'upcoming',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    client_name: '',
  });

  function handleSubmit(e) {
    e.preventDefault();
    setJobs([...jobs, {
      id: Date.now(),
      ...formData,
      estimated_revenue: parseFloat(formData.estimated_revenue),
      actual_revenue: null,
    }]);
    setFormData({
      title: '',
      estimated_revenue: '',
      status: 'upcoming',
      start_date: new Date().toISOString().split('T')[0],
      end_date: '',
      client_name: '',
    });
    setShowForm(false);
  }

  function updateStatus(id, newStatus) {
    setJobs(jobs.map(job => job.id === id ? { ...job, status: newStatus } : job));
  }

  function deleteJob(id) {
    setJobs(jobs.filter(j => j.id !== id));
  }

  const upcomingRevenue = jobs.filter(j => j.status === 'upcoming').reduce((sum, j) => sum + (j.estimated_revenue || 0), 0);
  const completedRevenue = jobs.filter(j => j.status === 'completed').reduce((sum, j) => sum + (j.actual_revenue || j.estimated_revenue || 0), 0);

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h1>💰 Finance</h1>
        <nav>
          <Link href="/">Dashboard</Link>
          <Link href="/accounts">Accounts</Link>
          <Link href="/invoices">Invoices</Link>
          <Link href="/jobs" className="active">Jobs</Link>
          <Link href="/expenses">Expenses</Link>
          <Link href="/taxes">Taxes</Link>
        </nav>
      </aside>

      <main className="main-content">
        <div className="header">
          <h1>Jobs & Projects</h1>
          <button className="primary" onClick={() => setShowForm(true)}>+ New Job</button>
        </div>

        <div className="dashboard-grid">
          <div className="stat-card">
            <h3>Upcoming Revenue</h3>
            <div className="amount">{formatCurrency(upcomingRevenue)}</div>
            <p>{jobs.filter(j => j.status === 'upcoming').length} jobs</p>
          </div>

          <div className="stat-card positive">
            <h3>Completed Revenue</h3>
            <div className="amount">{formatCurrency(completedRevenue)}</div>
            <p>{jobs.filter(j => j.status === 'completed').length} completed</p>
          </div>

          <div className="stat-card">
            <h3>Total Projected</h3>
            <div className="amount">{formatCurrency(upcomingRevenue + completedRevenue)}</div>
            <p>{jobs.length} projects</p>
          </div>
        </div>

        <div className="section">
          <h2>All Jobs</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Client</th>
                <th>Revenue</th>
                <th>Dates</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job.id}>
                  <td>{job.title}</td>
                  <td>{job.client_name}</td>
                  <td className="amount">{formatCurrency(job.estimated_revenue || 0)}</td>
                  <td>{formatDate(job.start_date)} - {job.end_date ? formatDate(job.end_date) : 'TBD'}</td>
                  <td>
                    <select
                      value={job.status}
                      onChange={e => updateStatus(job.id, e.target.value)}
                      className="status-select"
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button className="secondary small" onClick={() => deleteJob(job.id)}>Delete</button>
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
                <h2>New Job</h2>
                <button className="close-btn" onClick={() => setShowForm(false)}>×</button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Project Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Client Name</label>
                  <input
                    type="text"
                    value={formData.client_name}
                    onChange={e => setFormData({ ...formData, client_name: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Estimated Revenue</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.estimated_revenue}
                      onChange={e => setFormData({ ...formData, estimated_revenue: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value })}
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Start Date</label>
                    <input
                      type="date"
                      value={formData.start_date}
                      onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>End Date</label>
                    <input
                      type="date"
                      value={formData.end_date}
                      onChange={e => setFormData({ ...formData, end_date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="secondary" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="primary">Create Job</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
