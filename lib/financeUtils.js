export function calculateCashFlow(accounts, invoices, jobs, expenses, taxItems) {
  const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
  const outstandingInvoices = invoices
    .filter(inv => inv.status === 'outstanding')
    .reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const upcomingJobs = jobs
    .filter(j => j.status === 'upcoming')
    .reduce((sum, job) => sum + (job.estimated_revenue || 0), 0);
  const taxOwed = taxItems
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + (t.amount || 0), 0);
  const upcomingExpenses = expenses
    .filter(e => e.status === 'pending')
    .reduce((sum, exp) => sum + (exp.amount || 0), 0);

  const projectedIncome = outstandingInvoices + upcomingJobs;
  const projectedOutflow = taxOwed + upcomingExpenses;
  const projectedBalance = totalBalance + projectedIncome - projectedOutflow;

  return {
    totalBalance,
    outstandingInvoices,
    upcomingJobs,
    projectedIncome,
    taxOwed,
    upcomingExpenses,
    projectedOutflow,
    projectedBalance,
  };
}

export function getCashFlowTimeline(invoices, jobs, expenses, taxItems) {
  const events = [];

  invoices
    .filter(inv => inv.status === 'outstanding')
    .forEach(inv => {
      events.push({
        date: new Date(inv.due_date),
        type: 'invoice',
        amount: inv.amount,
        name: `Invoice: ${inv.client_name}`,
        category: 'income',
      });
    });

  jobs
    .filter(j => j.status === 'upcoming')
    .forEach(job => {
      events.push({
        date: new Date(job.end_date || job.start_date),
        type: 'job',
        amount: job.estimated_revenue,
        name: `Job: ${job.title}`,
        category: 'income',
      });
    });

  expenses
    .filter(e => e.status === 'pending')
    .forEach(exp => {
      events.push({
        date: new Date(exp.due_date),
        type: 'expense',
        amount: -exp.amount,
        name: `${exp.category}: ${exp.description}`,
        category: 'expense',
      });
    });

  taxItems
    .filter(t => t.status === 'pending')
    .forEach(tax => {
      events.push({
        date: new Date(tax.due_date),
        type: 'tax',
        amount: -tax.amount,
        name: `Tax: ${tax.quarter ? `Q${tax.quarter}` : tax.description}`,
        category: 'tax',
      });
    });

  return events.sort((a, b) => a.date - b.date);
}

export function groupEventsByMonth(events) {
  const grouped = {};
  events.forEach(event => {
    const key = event.date.toISOString().slice(0, 7);
    if (!grouped[key]) {
      grouped[key] = { income: 0, expense: 0, tax: 0, events: [] };
    }
    grouped[key].events.push(event);
    if (event.category === 'income') grouped[key].income += event.amount;
    if (event.category === 'expense') grouped[key].expense += Math.abs(event.amount);
    if (event.category === 'tax') grouped[key].tax += Math.abs(event.amount);
  });
  return grouped;
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function getStatusColor(status) {
  const colors = {
    outstanding: '#f59e0b',
    paid: '#10b981',
    pending: '#f59e0b',
    cancelled: '#6b7280',
    completed: '#10b981',
    upcoming: '#3b82f6',
    in_progress: '#8b5cf6',
  };
  return colors[status] || '#6b7280';
}

export function getStatusLabel(status) {
  return status.replace(/_/g, ' ').charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
