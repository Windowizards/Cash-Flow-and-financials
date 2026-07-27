'use client';

import { useState, useEffect } from 'react';
import './dashboard.css';

const SEED = {
  accounts: [
    { id: 1, name: 'Citi checking', balance: 29000, notes: '' },
    { id: 2, name: 'Venmo / other', balance: 57800, notes: '' },
  ],
  cards: [
    { id: 1, name: 'Amex blue', amount: 5000, close: 'Aug 3', due: '9/3', notes: '' },
    { id: 2, name: 'Plat personal', amount: 2000, close: 'Aug 26', due: '8/25', notes: '' },
    { id: 3, name: 'Plat business', amount: 764, close: 'Aug 8', due: '11/2', notes: '' },
    { id: 4, name: 'Gold amex', amount: 0, close: '', due: '10/1', notes: '' },
    { id: 5, name: 'Chase', amount: 1000, close: '', due: '10/28', notes: '' },
    { id: 6, name: 'Noelle amex', amount: 0, close: '', due: '11/28', notes: '' },
    { id: 7, name: 'Tundras', amount: 0, close: '', due: '10/20', notes: '' },
    { id: 8, name: 'Kemper', amount: 0, close: '', due: '8/15', notes: '' },
    { id: 9, name: 'Squeegee crew', amount: 0, close: '', due: '', notes: '' },
    { id: 10, name: 'Geico', amount: 0, close: '', due: '', notes: '' },
    { id: 11, name: 'Bee merry stuff', amount: 500, close: '', due: '', notes: '' },
    { id: 12, name: 'Luke', amount: 1000, close: '', due: '', notes: 'crew' },
    { id: 13, name: 'Jerry', amount: 500, close: '', due: '', notes: 'crew' },
    { id: 14, name: 'Marcus', amount: 500, close: '', due: '', notes: 'crew' },
    { id: 15, name: 'Kai', amount: 0, close: '', due: '', notes: 'crew' },
  ],
  incoming: [
    { id: 1, name: 'Kelly shaver', amount: 200, notes: '' },
    { id: 2, name: 'Prime pizza', amount: 2100, notes: '' },
    { id: 3, name: 'Vicki', amount: 700, notes: '' },
    { id: 4, name: 'CC', amount: 1400, notes: '' },
    { id: 5, name: 'Gary kuft', amount: 700, notes: '' },
    { id: 6, name: 'Koko', amount: 2300, notes: 'week 2 monday' },
    { id: 7, name: 'Mahduri', amount: 1700, notes: '' },
    { id: 8, name: 'Strongtie', amount: 2200, notes: '' },
    { id: 9, name: 'Granada gutters', amount: 1000, notes: '' },
    { id: 10, name: 'Masterline', amount: 1300, notes: 'net 30 7/15' },
    { id: 11, name: 'Aoun', amount: 1000, notes: '' },
    { id: 12, name: 'Royal oaks', amount: 23000, notes: '' },
    { id: 13, name: 'Fresno', amount: 8000, notes: '' },
    { id: 14, name: 'Tim allen windows', amount: 1600, notes: '' },
    { id: 15, name: 'Tim allen lights', amount: 5000, notes: '' },
    { id: 16, name: 'James Carlson', amount: 600, notes: '' },
    { id: 17, name: 'Canterbury', amount: 0, notes: '' },
    { id: 18, name: 'JJATC', amount: 3000, notes: '' },
    { id: 19, name: 'Sternshien', amount: 2000, notes: '' },
    { id: 20, name: 'Perm garret job', amount: 0, notes: '' },
  ],
  monthly: [
    { id: 1, name: 'SD rent', amount: 720, dueDay: 4, type: 'business' },
    { id: 2, name: 'Tundra 1', amount: 960, dueDay: 2, type: 'business' },
    { id: 3, name: 'Tundra 2', amount: 680, dueDay: 28, type: 'business' },
    { id: 4, name: 'Kemper', amount: 1150, dueDay: 15, type: 'business' },
    { id: 5, name: 'Tesla', amount: 900, dueDay: 27, type: 'personal' },
    { id: 6, name: 'Corvette', amount: 1057, dueDay: 9, type: 'personal' },
  ],
  jobs: [
    {
      id: 1,
      name: 'Royal Oaks',
      workers: [
        { id: 1, name: 'Stu', rate: 300, hours: [0, 1, 0, 0, 0, 0, 0, 0, 0] },
        { id: 2, name: 'Luke', rate: 30, hours: [8, 8, 8, 0, 0, 0, 0, 0, 0] },
        { id: 3, name: 'Julio', rate: 25, hours: [0, 8, 8, 0, 0, 0, 0, 0, 0] },
        { id: 4, name: 'Perez', rate: 25, hours: [0, 8, 8, 0, 0, 0, 0, 0, 0] },
        { id: 5, name: 'Jer', rate: 30, hours: [8, 8, 8, 0, 0, 0, 0, 0, 0] },
        { id: 6, name: 'Kai', rate: 20, hours: [8, 8, 8, 0, 0, 0, 0, 0, 0] },
        { id: 7, name: 'Marcus', rate: 20, hours: [0, 8, 8, 0, 0, 0, 0, 0, 0] },
        { id: 8, name: 'Noah', rate: 17.5, hours: [8, 8, 8, 0, 0, 0, 0, 0, 0] },
      ],
      extras: [
        { id: 1, name: 'Food day 1', amount: 110 },
        { id: 2, name: 'Food day 2', amount: 60 },
      ],
    },
  ],
  debts: [
    { id: 1, name: 'Mom', amount: 40000, limit: 0, notes: '' },
    { id: 2, name: 'Chase CC', amount: 30000, limit: 29000, notes: '0% card' },
    { id: 3, name: 'Wells Fargo 0%', amount: 0, limit: 8000, notes: '0% card' },
    { id: 4, name: 'Travel', amount: 20000, limit: 0, notes: '' },
    { id: 5, name: 'Mortgage', amount: 162000, limit: 0, notes: '' },
  ],
};

const NUM_DAYS = 9;
const MONTHS = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };

function fmt(n) {
  const v = Math.round(n || 0);
  return (v < 0 ? '-$' : '$') + Math.abs(v).toLocaleString();
}

function fmt2(n) {
  return '$' + (n || 0).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 0 });
}

function nextDue(str) {
  if (!str) return null;
  const s = String(str).trim().toLowerCase();
  let mo, da;
  let m = s.match(/(\d{1,2})\/(\d{1,2})/);
  if (m) {
    mo = +m[1] - 1;
    da = +m[2];
  } else {
    m = s.match(/([a-z]{3,9})\.?\s+(\d{1,2})/);
    if (m && MONTHS[m[1].slice(0, 3)] != null) {
      mo = MONTHS[m[1].slice(0, 3)];
      da = +m[2];
    } else return null;
  }
  if (mo == null || mo > 11 || !da || da > 31) return null;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let d = new Date(today.getFullYear(), mo, da);
  if (d < today) d.setFullYear(d.getFullYear() + 1);
  return d;
}

export default function DashboardPage() {
  const [tab, setTab] = useState('overview');
  const [data, setData] = useState(SEED);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('cyberdollar-data-v1');
      if (saved) setData({ ...SEED, ...JSON.parse(saved) });
    } catch (e) { /* corrupted save — keep seed */ }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem('cyberdollar-data-v1', JSON.stringify(data));
  }, [data, loaded]);

  // ---------- Totals ----------
  const totalCash = data.accounts.reduce((s, a) => s + (a.balance || 0), 0);
  const totalOwed = data.cards.reduce((s, c) => s + (c.amount || 0), 0);
  const totalIncoming = data.incoming.reduce((s, i) => s + (i.amount || 0), 0);
  const totalMonthly = data.monthly.reduce((s, e) => s + (e.amount || 0), 0);
  const totalDebts = data.debts.reduce((s, d) => s + (d.amount || 0), 0);
  const dailyBurn = totalMonthly / 30;
  const netNow = totalCash - totalOwed;
  const projected = netNow + totalIncoming;
  const runwayDays = dailyBurn > 0 ? Math.floor(netNow / dailyBurn) : Infinity;

  const bizMonthly = data.monthly.filter(e => e.type === 'business');
  const persMonthly = data.monthly.filter(e => e.type === 'personal');

  // ---------- Generic list helpers ----------
  const updateList = (key, id, field, value, numeric) => {
    setData(d => ({
      ...d,
      [key]: d[key].map(row => row.id === id ? { ...row, [field]: numeric ? (parseFloat(value) || 0) : value } : row),
    }));
  };
  const addToList = (key, blank) => {
    setData(d => ({ ...d, [key]: [...d[key], { ...blank, id: Date.now() }] }));
  };
  const removeFromList = (key, id) => {
    setData(d => ({ ...d, [key]: d[key].filter(row => row.id !== id) }));
  };

  // ---------- Payroll helpers ----------
  const jobLabor = (job) => job.workers.reduce((s, w) => s + (w.rate || 0) * w.hours.reduce((a, b) => a + (b || 0), 0), 0);
  const jobExtras = (job) => job.extras.reduce((s, e) => s + (e.amount || 0), 0);

  const updateWorker = (jobId, workerId, field, value) => {
    setData(d => ({
      ...d,
      jobs: d.jobs.map(j => j.id !== jobId ? j : {
        ...j,
        workers: j.workers.map(w => w.id === workerId ? { ...w, [field]: field === 'rate' ? (parseFloat(value) || 0) : value } : w),
      }),
    }));
  };
  const updateHours = (jobId, workerId, dayIdx, value) => {
    setData(d => ({
      ...d,
      jobs: d.jobs.map(j => j.id !== jobId ? j : {
        ...j,
        workers: j.workers.map(w => {
          if (w.id !== workerId) return w;
          const hours = [...w.hours];
          hours[dayIdx] = parseFloat(value) || 0;
          return { ...w, hours };
        }),
      }),
    }));
  };
  const addWorker = (jobId) => {
    setData(d => ({
      ...d,
      jobs: d.jobs.map(j => j.id !== jobId ? j : {
        ...j,
        workers: [...j.workers, { id: Date.now(), name: '', rate: 0, hours: Array(NUM_DAYS).fill(0) }],
      }),
    }));
  };
  const removeWorker = (jobId, workerId) => {
    setData(d => ({
      ...d,
      jobs: d.jobs.map(j => j.id !== jobId ? j : { ...j, workers: j.workers.filter(w => w.id !== workerId) }),
    }));
  };
  const updateExtra = (jobId, extraId, field, value) => {
    setData(d => ({
      ...d,
      jobs: d.jobs.map(j => j.id !== jobId ? j : {
        ...j,
        extras: j.extras.map(e => e.id === extraId ? { ...e, [field]: field === 'amount' ? (parseFloat(value) || 0) : value } : e),
      }),
    }));
  };
  const addExtra = (jobId) => {
    setData(d => ({
      ...d,
      jobs: d.jobs.map(j => j.id !== jobId ? j : { ...j, extras: [...j.extras, { id: Date.now(), name: '', amount: 0 }] }),
    }));
  };
  const removeExtra = (jobId, extraId) => {
    setData(d => ({
      ...d,
      jobs: d.jobs.map(j => j.id !== jobId ? j : { ...j, extras: j.extras.filter(e => e.id !== extraId) }),
    }));
  };
  const addJob = () => {
    setData(d => ({
      ...d,
      jobs: [...d.jobs, { id: Date.now(), name: 'New job', workers: [], extras: [] }],
    }));
  };
  const removeJob = (jobId) => {
    setData(d => ({ ...d, jobs: d.jobs.filter(j => j.id !== jobId) }));
  };
  const updateJobName = (jobId, name) => {
    setData(d => ({ ...d, jobs: d.jobs.map(j => j.id === jobId ? { ...j, name } : j) }));
  };

  // ---------- Projection ----------
  const buildProjection = () => {
    const HORIZON = 120;
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const events = [];
    data.cards.forEach(c => {
      if (!c.amount) return;
      const d = nextDue(c.due);
      if (!d) return;
      const dayOffset = Math.round((d - startOfToday) / 86400000);
      if (dayOffset >= 0 && dayOffset <= HORIZON) {
        events.push({ day: dayOffset, name: `${c.name} due`, amount: c.amount });
      }
    });

    const milestones = new Set([0, 7, 14, 21, 30, 45, 60, 90, 120]);
    events.forEach(e => milestones.add(e.day));
    const days = [...milestones].sort((a, b) => a - b).filter(d => d <= HORIZON);

    return days.map(day => {
      const date = new Date(startOfToday);
      date.setDate(date.getDate() + day);
      const duesSoFar = events.filter(e => e.day <= day).reduce((s, e) => s + e.amount, 0);
      const cash = totalCash - dailyBurn * day - duesSoFar;
      const todaysEvents = events.filter(e => e.day === day);
      return { day, date, cash, events: todaysEvents };
    });
  };

  if (!loaded) return <div className="dashboard-container" />;

  const projection = buildProjection();

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="logo-section">
          <div className="logo-mark">$</div>
          <h1>CyberDollar</h1>
        </div>
        <nav className="nav-tabs">
          <button className={`nav-btn ${tab === 'overview' ? 'active' : ''}`} onClick={() => setTab('overview')}>Overview</button>
          <button className={`nav-btn ${tab === 'cash' ? 'active' : ''}`} onClick={() => setTab('cash')}>Cash</button>
          <button className={`nav-btn ${tab === 'owed' ? 'active' : ''}`} onClick={() => setTab('owed')}>Owed now</button>
          <button className={`nav-btn ${tab === 'incoming' ? 'active' : ''}`} onClick={() => setTab('incoming')}>Incoming</button>
          <button className={`nav-btn ${tab === 'monthly' ? 'active' : ''}`} onClick={() => setTab('monthly')}>Monthly</button>
          <button className={`nav-btn ${tab === 'payroll' ? 'active' : ''}`} onClick={() => setTab('payroll')}>Payroll</button>
          <button className={`nav-btn ${tab === 'debts' ? 'active' : ''}`} onClick={() => setTab('debts')}>Big debts</button>
          <button className={`nav-btn ${tab === 'projection' ? 'active' : ''}`} onClick={() => setTab('projection')}>Projection</button>
        </nav>
      </aside>

      <main className="main-content">
        {/* ============ OVERVIEW ============ */}
        {tab === 'overview' && (
          <div className="tab-content">
            <h2>Overview</h2>
            <div className="metrics-grid">
              <div className="metric-card primary">
                <div className="metric-label">Total I have</div>
                <div className="metric-value">{fmt(totalCash)}</div>
                <div className="metric-subtext">{data.accounts.map(a => a.name).join(' + ')}</div>
              </div>
              <div className="metric-card warning">
                <div className="metric-label">Owed now</div>
                <div className="metric-value">{fmt(totalOwed)}</div>
                <div className="metric-subtext">cards + crew + bills</div>
              </div>
              <div className={`metric-card ${netNow >= 0 ? 'success' : 'danger'}`}>
                <div className="metric-label">Net after paying everything</div>
                <div className="metric-value">{fmt(netNow)}</div>
                <div className="metric-subtext">cash − owed</div>
              </div>
              <div className="metric-card info">
                <div className="metric-label">Total incoming</div>
                <div className="metric-value">{fmt(totalIncoming)}</div>
                <div className="metric-subtext">{data.incoming.filter(i => i.amount > 0).length} open invoices</div>
              </div>
              <div className="metric-card success">
                <div className="metric-label">Projected position</div>
                <div className="metric-value">{fmt(projected)}</div>
                <div className="metric-subtext">net + incoming collected</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Daily burn</div>
                <div className="metric-value">{fmt2(dailyBurn)}</div>
                <div className="metric-subtext">{fmt(totalMonthly)}/mo fixed · {runwayDays === Infinity ? '∞' : runwayDays} days runway</div>
              </div>
            </div>

            <div className="quick-summary">
              <h3>Where you stand</h3>
              <p>You have <strong>{fmt(totalCash)}</strong> and owe <strong>{fmt(totalOwed)}</strong> right now, leaving <strong>{fmt(netNow)}</strong> net. With <strong>{fmt(totalIncoming)}</strong> incoming, your projected position is <strong>{fmt(projected)}</strong>.</p>
              <p>Fixed expenses run <strong>{fmt(totalMonthly)}/month</strong> ({fmt2(dailyBurn)}/day). Long-term debt sits at <strong>{fmt(totalDebts)}</strong> (Mom, Chase CC, travel, mortgage).</p>
            </div>
          </div>
        )}

        {/* ============ CASH ============ */}
        {tab === 'cash' && (
          <div className="tab-content">
            <div className="tab-header">
              <h2>Cash on hand</h2>
              <button className="btn-add" onClick={() => addToList('accounts', { name: '', balance: 0, notes: '' })}>+ Add account</button>
            </div>
            <div className="spreadsheet">
              <table className="data-table">
                <thead>
                  <tr><th>Account</th><th className="col-amount">Balance</th><th>Notes</th><th className="col-x"></th></tr>
                </thead>
                <tbody>
                  {data.accounts.map(a => (
                    <tr key={a.id}>
                      <td><input type="text" value={a.name} onChange={e => updateList('accounts', a.id, 'name', e.target.value)} placeholder="Account name" /></td>
                      <td><input type="number" value={a.balance || ''} onChange={e => updateList('accounts', a.id, 'balance', e.target.value, true)} placeholder="0" /></td>
                      <td><input type="text" value={a.notes || ''} onChange={e => updateList('accounts', a.id, 'notes', e.target.value)} placeholder="" /></td>
                      <td><button className="btn-delete" onClick={() => removeFromList('accounts', a.id)}>✕</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="table-footer"><strong>Total I have: {fmt(totalCash)}</strong></div>
            </div>
          </div>
        )}

        {/* ============ OWED NOW ============ */}
        {tab === 'owed' && (
          <div className="tab-content">
            <div className="tab-header">
              <h2>Owed now</h2>
              <button className="btn-add" onClick={() => addToList('cards', { name: '', amount: 0, close: '', due: '', notes: '' })}>+ Add row</button>
            </div>
            <p className="subtitle">Credit cards, crew payments, bills — everything currently due</p>
            <div className="spreadsheet">
              <table className="data-table">
                <thead>
                  <tr><th>Name</th><th className="col-amount">Amount</th><th className="col-date">Statement close</th><th className="col-date">Due date</th><th>Notes</th><th className="col-x"></th></tr>
                </thead>
                <tbody>
                  {data.cards.map(c => (
                    <tr key={c.id}>
                      <td><input type="text" value={c.name} onChange={e => updateList('cards', c.id, 'name', e.target.value)} placeholder="Card / person" /></td>
                      <td><input type="number" value={c.amount || ''} onChange={e => updateList('cards', c.id, 'amount', e.target.value, true)} placeholder="0" /></td>
                      <td><input type="text" value={c.close || ''} onChange={e => updateList('cards', c.id, 'close', e.target.value)} placeholder="Aug 3" /></td>
                      <td><input type="text" value={c.due || ''} onChange={e => updateList('cards', c.id, 'due', e.target.value)} placeholder="9/3" /></td>
                      <td><input type="text" value={c.notes || ''} onChange={e => updateList('cards', c.id, 'notes', e.target.value)} placeholder="" /></td>
                      <td><button className="btn-delete" onClick={() => removeFromList('cards', c.id)}>✕</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="table-footer">
                <strong>Total owed: {fmt(totalOwed)}</strong>
                <strong>Cash − owed: {fmt(netNow)}</strong>
              </div>
            </div>
          </div>
        )}

        {/* ============ INCOMING ============ */}
        {tab === 'incoming' && (
          <div className="tab-content">
            <div className="tab-header">
              <h2>Incoming (AR)</h2>
              <button className="btn-add" onClick={() => addToList('incoming', { name: '', amount: 0, notes: '' })}>+ Add invoice</button>
            </div>
            <p className="subtitle">Who owes you money — jobs done or in progress</p>
            <div className="spreadsheet">
              <table className="data-table">
                <thead>
                  <tr><th>Client / job</th><th className="col-amount">Amount</th><th>Notes</th><th className="col-x"></th></tr>
                </thead>
                <tbody>
                  {data.incoming.map(i => (
                    <tr key={i.id}>
                      <td><input type="text" value={i.name} onChange={e => updateList('incoming', i.id, 'name', e.target.value)} placeholder="Client" /></td>
                      <td><input type="number" value={i.amount || ''} onChange={e => updateList('incoming', i.id, 'amount', e.target.value, true)} placeholder="0" /></td>
                      <td><input type="text" value={i.notes || ''} onChange={e => updateList('incoming', i.id, 'notes', e.target.value)} placeholder="net 30, week 2..." /></td>
                      <td><button className="btn-delete" onClick={() => removeFromList('incoming', i.id)}>✕</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="table-footer"><strong>Total incoming: {fmt(totalIncoming)}</strong></div>
            </div>
          </div>
        )}

        {/* ============ MONTHLY ============ */}
        {tab === 'monthly' && (
          <div className="tab-content">
            <div className="tab-header">
              <h2>Fixed monthly expenses</h2>
              <button className="btn-add" onClick={() => addToList('monthly', { name: '', amount: 0, dueDay: 1, type: 'business' })}>+ Add expense</button>
            </div>

            <div className="projection-info">
              <div className="info-box">
                <div className="info-label">Monthly total</div>
                <div className="info-value">{fmt(totalMonthly)}</div>
              </div>
              <div className="info-box">
                <div className="info-label">Daily burn</div>
                <div className="info-value">{fmt2(dailyBurn)}</div>
              </div>
              <div className="info-box">
                <div className="info-label">Weekly burn</div>
                <div className="info-value">{fmt2(dailyBurn * 7)}</div>
              </div>
            </div>

            {[['business', 'Business', bizMonthly], ['personal', 'Personal', persMonthly]].map(([type, label, rows]) => (
              <div key={type} className="sub-section">
                <h3 className="sub-title">{label} — {fmt(rows.reduce((s, e) => s + (e.amount || 0), 0))}/mo</h3>
                <div className="spreadsheet">
                  <table className="data-table">
                    <thead>
                      <tr><th>Expense</th><th className="col-amount">Monthly</th><th className="col-amount">Daily avg</th><th className="col-date">Due day</th><th className="col-date">Type</th><th className="col-x"></th></tr>
                    </thead>
                    <tbody>
                      {rows.map(e => (
                        <tr key={e.id}>
                          <td><input type="text" value={e.name} onChange={ev => updateList('monthly', e.id, 'name', ev.target.value)} placeholder="Expense" /></td>
                          <td><input type="number" value={e.amount || ''} onChange={ev => updateList('monthly', e.id, 'amount', ev.target.value, true)} placeholder="0" /></td>
                          <td className="daily">{fmt2((e.amount || 0) / 30)}</td>
                          <td><input type="number" min="1" max="31" value={e.dueDay || ''} onChange={ev => updateList('monthly', e.id, 'dueDay', ev.target.value, true)} placeholder="1" /></td>
                          <td>
                            <select value={e.type} onChange={ev => updateList('monthly', e.id, 'type', ev.target.value)}>
                              <option value="business">Business</option>
                              <option value="personal">Personal</option>
                            </select>
                          </td>
                          <td><button className="btn-delete" onClick={() => removeFromList('monthly', e.id)}>✕</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ============ PAYROLL ============ */}
        {tab === 'payroll' && (
          <div className="tab-content">
            <div className="tab-header">
              <h2>Payroll / job costing</h2>
              <button className="btn-add" onClick={addJob}>+ Add job</button>
            </div>
            <p className="subtitle">Rate × hours per day, per job — just like your sheet</p>

            {data.jobs.map(job => (
              <div key={job.id} className="job-block">
                <div className="job-header">
                  <input className="job-name" type="text" value={job.name} onChange={e => updateJobName(job.id, e.target.value)} placeholder="Job name" />
                  <div className="job-header-actions">
                    <button className="btn-add small" onClick={() => addWorker(job.id)}>+ Worker</button>
                    <button className="btn-add small" onClick={() => addExtra(job.id)}>+ Extra</button>
                    <button className="btn-delete" onClick={() => removeJob(job.id)}>✕ Job</button>
                  </div>
                </div>

                <div className="spreadsheet payroll-scroll">
                  <table className="data-table payroll-table">
                    <thead>
                      <tr>
                        <th>Worker</th>
                        <th className="col-rate">Rate</th>
                        {Array.from({ length: NUM_DAYS }, (_, i) => <th key={i} className="col-hr">D{i + 1}</th>)}
                        <th className="col-amount">Total</th>
                        <th className="col-x"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {job.workers.map(w => {
                        const total = (w.rate || 0) * w.hours.reduce((a, b) => a + (b || 0), 0);
                        return (
                          <tr key={w.id}>
                            <td><input type="text" value={w.name} onChange={e => updateWorker(job.id, w.id, 'name', e.target.value)} placeholder="Name" /></td>
                            <td><input type="number" value={w.rate || ''} onChange={e => updateWorker(job.id, w.id, 'rate', e.target.value)} placeholder="0" /></td>
                            {w.hours.map((h, idx) => (
                              <td key={idx}><input className="hr-input" type="number" value={h || ''} onChange={e => updateHours(job.id, w.id, idx, e.target.value)} placeholder="·" /></td>
                            ))}
                            <td className="balance">{fmt(total)}</td>
                            <td><button className="btn-delete" onClick={() => removeWorker(job.id, w.id)}>✕</button></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {job.extras.length > 0 && (
                  <div className="spreadsheet extras-table">
                    <table className="data-table">
                      <thead>
                        <tr><th>Extra</th><th className="col-amount">Amount</th><th className="col-x"></th></tr>
                      </thead>
                      <tbody>
                        {job.extras.map(ex => (
                          <tr key={ex.id}>
                            <td><input type="text" value={ex.name} onChange={e => updateExtra(job.id, ex.id, 'name', e.target.value)} placeholder="Food, materials..." /></td>
                            <td><input type="number" value={ex.amount || ''} onChange={e => updateExtra(job.id, ex.id, 'amount', e.target.value)} placeholder="0" /></td>
                            <td><button className="btn-delete" onClick={() => removeExtra(job.id, ex.id)}>✕</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="table-footer job-footer">
                  <strong>Labor: {fmt(jobLabor(job))}</strong>
                  <strong>Extras: {fmt(jobExtras(job))}</strong>
                  <strong>Job total: {fmt(jobLabor(job) + jobExtras(job))}</strong>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ============ BIG DEBTS ============ */}
        {tab === 'debts' && (
          <div className="tab-content">
            <div className="tab-header">
              <h2>Big debts</h2>
              <button className="btn-add" onClick={() => addToList('debts', { name: '', amount: 0, limit: 0, notes: '' })}>+ Add debt</button>
            </div>
            <p className="subtitle">Long-term: family, 0% cards, mortgage — not due today, but real</p>
            <div className="spreadsheet">
              <table className="data-table">
                <thead>
                  <tr><th>Debt</th><th className="col-amount">Balance</th><th className="col-amount">Limit</th><th className="col-amount">Used</th><th>Notes</th><th className="col-x"></th></tr>
                </thead>
                <tbody>
                  {data.debts.map(d => {
                    const util = d.limit > 0 ? Math.round((d.amount / d.limit) * 100) : null;
                    return (
                      <tr key={d.id}>
                        <td><input type="text" value={d.name} onChange={e => updateList('debts', d.id, 'name', e.target.value)} placeholder="Debt" /></td>
                        <td><input type="number" value={d.amount || ''} onChange={e => updateList('debts', d.id, 'amount', e.target.value, true)} placeholder="0" /></td>
                        <td><input type="number" value={d.limit || ''} onChange={e => updateList('debts', d.id, 'limit', e.target.value, true)} placeholder="—" /></td>
                        <td className={util != null && util > 90 ? 'spent' : 'utilization'}>{util != null ? util + '%' : '—'}</td>
                        <td><input type="text" value={d.notes || ''} onChange={e => updateList('debts', d.id, 'notes', e.target.value)} placeholder="" /></td>
                        <td><button className="btn-delete" onClick={() => removeFromList('debts', d.id)}>✕</button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="table-footer"><strong>Total long-term debt: {fmt(totalDebts)}</strong></div>
            </div>
          </div>
        )}

        {/* ============ PROJECTION ============ */}
        {tab === 'projection' && (
          <div className="tab-content">
            <h2>Cash projection</h2>
            <p className="subtitle">Daily burn ({fmt2(dailyBurn)}/day from fixed expenses) plus card due dates hitting on schedule</p>

            <div className="projection-info">
              <div className="info-box">
                <div className="info-label">Cash today</div>
                <div className="info-value">{fmt(totalCash)}</div>
              </div>
              <div className="info-box">
                <div className="info-label">Daily burn</div>
                <div className="info-value">{fmt2(dailyBurn)}</div>
              </div>
              <div className="info-box">
                <div className="info-label">If all AR collects</div>
                <div className="info-value">{fmt(projected)}</div>
              </div>
            </div>

            <div className="timeline-container">
              <h3>Position on future dates</h3>
              <table className="timeline-table">
                <thead>
                  <tr><th>Date</th><th>What hits</th><th>Projected cash</th></tr>
                </thead>
                <tbody>
                  {projection.map(row => (
                    <tr key={row.day} className={row.events.length ? 'has-event' : ''}>
                      <td>
                        {row.day === 0 ? 'Today' : row.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        <span className="day-offset"> {row.day === 0 ? '' : `+${row.day}d`}</span>
                      </td>
                      <td>
                        {row.events.length
                          ? row.events.map((e, i) => <span key={i} className="event-tag">{e.name} −{fmt(e.amount)}</span>)
                          : <span className="event-none">burn only</span>}
                      </td>
                      <td className={row.cash >= 0 ? 'balance' : 'spent'}>{fmt(row.cash)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="projection-note">Doesn't count incoming AR ({fmt(totalIncoming)}) — collect Royal Oaks and this whole table shifts up.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
