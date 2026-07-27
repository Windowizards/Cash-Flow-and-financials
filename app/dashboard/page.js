'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import './dashboard.css';

const NUM_DAYS = 9;
const MONTHS = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };

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
    { id: 7, name: 'Gas bill', amount: 100, dueDay: 1, type: 'personal' },
    { id: 8, name: 'Electricity', amount: 600, dueDay: 1, type: 'personal' },
    { id: 9, name: 'Water', amount: 300, dueDay: 1, type: 'personal' },
    { id: 10, name: 'Trash', amount: 100, dueDay: 1, type: 'personal' },
    { id: 11, name: 'Pool', amount: 120, dueDay: 1, type: 'personal' },
    { id: 12, name: 'Gardener', amount: 250, dueDay: 1, type: 'personal' },
    { id: 13, name: 'Vicki', amount: 0, dueDay: 1, type: 'personal' },
    { id: 14, name: 'Groceries', amount: 750, dueDay: 1, type: 'personal' },
    { id: 15, name: 'Geico insurance', amount: 1100, dueDay: 1, type: 'personal' },
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
  standardPayroll: {
    workers: [
      { id: 1, name: 'Stu', rate: 300, hours: [0, 0, 0, 0, 0, 0, 0, 0, 0] },
      { id: 2, name: 'Luke', rate: 30, hours: [0, 0, 0, 0, 0, 0, 0, 0, 0] },
      { id: 3, name: 'Julio', rate: 25, hours: [0, 0, 0, 0, 0, 0, 0, 0, 0] },
      { id: 4, name: 'Perez', rate: 25, hours: [0, 0, 0, 0, 0, 0, 0, 0, 0] },
      { id: 5, name: 'Jer', rate: 30, hours: [0, 0, 0, 0, 0, 0, 0, 0, 0] },
      { id: 6, name: 'Kai', rate: 20, hours: [0, 0, 0, 0, 0, 0, 0, 0, 0] },
      { id: 7, name: 'Marcus', rate: 20, hours: [0, 0, 0, 0, 0, 0, 0, 0, 0] },
      { id: 8, name: 'Noah', rate: 17.5, hours: [0, 0, 0, 0, 0, 0, 0, 0, 0] },
    ],
  },
  zeroCards: [
    { id: 1, name: 'Wells Fargo 0%', balance: 0, limit: 8000, promoEnd: '', notes: '' },
    { id: 2, name: 'Chase business 0%', balance: 30000, limit: 29000, promoEnd: '', notes: '' },
  ],
  chinaOrder: [],
  chinaFunding: [],
  personalPurchases: [],
  goals: [],
  savingsBuckets: [],
  refiProceeds: 0,
  refiAllocations: [],
  customTabs: [],
  history: [],
  plaidItems: [],
  debts: [
    { id: 1, name: 'Mom', amount: 40000, limit: 0, notes: '' },
    { id: 4, name: 'Travel', amount: 20000, limit: 0, notes: '' },
    { id: 5, name: 'Mortgage', amount: 162000, limit: 0, notes: '' },
  ],
  sheetWebhook: '',
};

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

const workerTotal = (w) => (w.rate || 0) * w.hours.reduce((a, b) => a + (b || 0), 0);
const gridTotal = (workers) => workers.reduce((s, w) => s + workerTotal(w), 0);

const DEFAULT_SCHEMAS = {
  accounts: [
    { key: 'name', label: 'Account', type: 'text', core: true },
    { key: 'balance', label: 'Balance', type: 'number', core: true },
    { key: 'kind', label: 'Kind', type: 'select', options: ['bank', 'credit card'] },
    { key: 'bucket', label: 'Tag', type: 'select', options: ['business', 'personal'] },
    { key: 'notes', label: 'Notes', type: 'text' },
  ],
  cards: [
    { key: 'name', label: 'Name', type: 'text', core: true },
    { key: 'group', label: 'Group', type: 'select', options: ['credit card', 'person', 'business'], core: true },
    { key: 'amount', label: 'Amount', type: 'number', core: true },
    { key: 'close', label: 'Statement close', type: 'text' },
    { key: 'due', label: 'Due date', type: 'text', core: true },
    { key: 'bucket', label: 'Tag', type: 'select', options: ['business', 'personal'] },
    { key: 'notes', label: 'Notes', type: 'text' },
  ],
  incoming: [
    { key: 'name', label: 'Client / job', type: 'text', core: true },
    { key: 'amount', label: 'Amount', type: 'number', core: true },
    { key: 'expected', label: 'Expected', type: 'date', core: true },
    { key: 'cost', label: 'Costs', type: 'number', core: true },
    { key: 'bucket', label: 'Tag', type: 'select', options: ['business', 'personal'] },
    { key: 'notes', label: 'Notes', type: 'text' },
  ],
  monthly: [
    { key: 'name', label: 'Expense', type: 'text', core: true },
    { key: 'amount', label: 'Monthly', type: 'number', core: true },
    { key: 'dueDay', label: 'Due day', type: 'number', core: true, noSum: true },
    { key: 'type', label: 'Tag', type: 'select', options: ['business', 'personal'], core: true },
  ],
  zeroCards: [
    { key: 'name', label: 'Card', type: 'text', core: true },
    { key: 'balance', label: 'Balance', type: 'number', core: true },
    { key: 'limit', label: 'Limit', type: 'number', core: true },
    { key: 'promoEnd', label: 'Promo ends', type: 'text' },
    { key: 'bucket', label: 'Tag', type: 'select', options: ['business', 'personal'] },
    { key: 'notes', label: 'Notes', type: 'text' },
  ],
  chinaOrder: [
    { key: 'name', label: 'Item', type: 'text', core: true },
    { key: 'contact', label: 'Contact', type: 'text' },
    { key: 'amount', label: 'Total cost', type: 'number', core: true },
    { key: 'paid', label: 'Paid so far', type: 'number', core: true, pctOf: 'amount' },
    { key: 'status', label: 'Status', type: 'select', options: ['quoted', 'ordered', 'production', 'shipped', 'customs', 'received'], core: true },
    { key: 'bucket', label: 'Tag', type: 'select', options: ['business', 'personal'] },
    { key: 'notes', label: 'Notes', type: 'text' },
  ],
  chinaFunding: [
    { key: 'card', label: 'From card', type: 'link', core: true },
    { key: 'amount', label: 'Amount allocated', type: 'number', core: true },
    { key: 'date', label: 'Date charged', type: 'date' },
    { key: 'notes', label: 'Notes', type: 'text' },
  ],
  personalPurchases: [
    { key: 'name', label: 'Purchase', type: 'text', core: true },
    { key: 'amount', label: 'Amount', type: 'number', core: true },
    { key: 'date', label: 'Date', type: 'date', core: true },
    { key: 'status', label: 'Status', type: 'select', options: ['planned', 'bought', 'skipped'], core: true },
    { key: 'bucket', label: 'Tag', type: 'select', options: ['personal', 'business'] },
    { key: 'notes', label: 'Notes', type: 'text' },
  ],
  debts: [
    { key: 'name', label: 'Debt', type: 'text', core: true },
    { key: 'amount', label: 'Balance', type: 'number', core: true },
    { key: 'limit', label: 'Limit', type: 'number', core: true },
    { key: 'due', label: 'Next payment', type: 'text' },
    { key: 'bucket', label: 'Tag', type: 'select', options: ['business', 'personal'] },
    { key: 'link', label: 'Link', type: 'link' },
    { key: 'notes', label: 'Notes', type: 'text' },
  ],
  goals: [
    { key: 'name', label: 'Goal', type: 'text', core: true },
    { key: 'target', label: 'Target', type: 'number', core: true },
    { key: 'saved', label: 'Saved so far', type: 'number', core: true, pctOf: 'target' },
    { key: 'date', label: 'Target date', type: 'date' },
    { key: 'link', label: 'Link', type: 'link' },
    { key: 'notes', label: 'Notes', type: 'text' },
  ],
  savingsBuckets: [
    { key: 'name', label: 'Bucket', type: 'text', core: true },
    { key: 'amount', label: 'Set aside', type: 'number', core: true, pctOf: 'target' },
    { key: 'target', label: 'Target', type: 'number', core: true },
    { key: 'date', label: 'By when', type: 'date' },
    { key: 'link', label: 'Link', type: 'link' },
    { key: 'notes', label: 'Notes', type: 'text' },
  ],
  refiAllocations: [
    { key: 'name', label: 'Covers', type: 'text', core: true },
    { key: 'amount', label: 'Amount', type: 'number', core: true },
    { key: 'link', label: 'Link', type: 'link' },
    { key: 'notes', label: 'Notes', type: 'text' },
  ],
};

// Every list tab gets a Link column so rows can point at rows anywhere else in the app
['accounts', 'cards', 'incoming', 'monthly', 'zeroCards', 'chinaOrder', 'personalPurchases'].forEach(k => {
  const cols = DEFAULT_SCHEMAS[k];
  if (!cols.some(c => c.key === 'link')) {
    const notesIdx = cols.findIndex(c => c.key === 'notes');
    const linkCol = { key: 'link', label: 'Link', type: 'link' };
    if (notesIdx >= 0) cols.splice(notesIdx, 0, linkCol);
    else cols.push(linkCol);
  }
});

const CUSTOM_TAB_COLUMNS = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'amount', label: 'Amount', type: 'number' },
  { key: 'date', label: 'Date', type: 'text' },
  { key: 'link', label: 'Link', type: 'link' },
  { key: 'notes', label: 'Notes', type: 'text' },
];

function EditableTable({ columns, rows, computed = [], rowActions, onCell, onDelRow, onSchemaChange, footerExtras = [], linkTargets = [], onJump }) {
  const [q, setQ] = useState('');
  const addColumn = () => onSchemaChange([...columns, { key: 'c_' + Date.now(), label: 'New column', type: 'text' }]);
  const renameColumn = (key, label) => onSchemaChange(columns.map(c => c.key === key ? { ...c, label } : c));
  const retypeColumn = (key, type) => onSchemaChange(columns.map(c => c.key === key ? { ...c, type } : c));
  const removeColumn = (key) => onSchemaChange(columns.filter(c => c.key !== key));

  const needle = q.trim().toLowerCase();
  const shown = needle
    ? rows.filter(r => columns.some(c => String(r[c.key] == null ? '' : r[c.key]).toLowerCase().includes(needle)))
    : rows;

  const confirmDel = (row) => {
    const label = row.name || '';
    const hasData = label || (parseFloat(row.amount) || 0) > 0 || (parseFloat(row.balance) || 0) > 0;
    if (!hasData || window.confirm(`Delete ${label ? '"' + label + '"' : 'this row'}? This can't be undone.`)) {
      onDelRow(row.id);
    }
  };

  // Number cells: typing "30%" in a column with pctOf converts to 30% of that
  // row's base column (e.g. Paid so far = 30% of Total cost), stored as dollars.
  const numChange = (row, col, raw) => {
    if (col.pctOf && /%\s*$/.test(raw)) {
      const pct = parseFloat(raw);
      const base = parseFloat(row[col.pctOf]) || 0;
      if (!isNaN(pct)) {
        onCell(row.id, col.key, String(Math.round((pct / 100) * base * 100) / 100), true);
        return;
      }
    }
    onCell(row.id, col.key, raw.replace(/[$,]/g, ''), true);
  };

  return (
    <div className="spreadsheet">
      {rows.length > 5 && (
        <div className="table-search">
          <input type="text" value={q} onChange={e => setQ(e.target.value)} placeholder="🔎 Type to filter rows…" />
          {q && <button className="auth-skip" onClick={() => setQ('')}>clear ({shown.length}/{rows.length})</button>}
        </div>
      )}
      <div className="payroll-scroll">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.key} className={col.type === 'number' ? 'col-amount' : col.type === 'date' ? 'col-date' : undefined}>
                  <div className="th-edit">
                    <input className="th-input" value={col.label} onChange={e => renameColumn(col.key, e.target.value)} title="Click to rename column" />
                    {!col.core && (
                      <span className="th-tools">
                        <select className="th-type" value={col.type} onChange={e => retypeColumn(col.key, e.target.value)} title="Column type">
                          <option value="text">abc</option>
                          <option value="number">123</option>
                          <option value="date">📅</option>
                        </select>
                        <button className="th-del" title="Remove column" onClick={() => removeColumn(col.key)}>✕</button>
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {computed.map(c => <th key={c.label} className="col-amount">{c.label}</th>)}
              <th className="col-x2">
                <button className="th-add" title="Add a column" onClick={addColumn}>＋ col</button>
              </th>
            </tr>
          </thead>
          <tbody>
            {shown.map(row => (
              <tr key={row.id}>
                {columns.map(col => (
                  <td key={col.key}>
                    {col.type === 'link' ? (
                      <div className="link-cell">
                        <select value={row[col.key] || ''} onChange={e => onCell(row.id, col.key, e.target.value, false)}>
                          <option value="">—</option>
                          {linkTargets.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                        {row[col.key] && onJump && (
                          <button className="link-jump" title="Go to linked item" onClick={() => onJump(row[col.key])}>→</button>
                        )}
                      </div>
                    ) : col.type === 'select' ? (
                      <select value={row[col.key] || (col.options && col.options[0]) || ''} onChange={e => onCell(row.id, col.key, e.target.value, false)}>
                        {(col.options || []).map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : col.type === 'number' ? (
                      <input
                        type={col.pctOf ? 'text' : 'number'}
                        inputMode="decimal"
                        value={row[col.key] === 0 || row[col.key] == null ? '' : row[col.key]}
                        onChange={e => numChange(row, col, e.target.value)}
                        placeholder={col.pctOf ? '0 or 30%' : '0'}
                        title={col.pctOf ? 'Type a dollar amount, or a percentage like 30% to auto-calculate' : ''}
                      />
                    ) : (
                      <input
                        type={col.type === 'date' ? 'date' : 'text'}
                        value={row[col.key] == null ? '' : row[col.key]}
                        onChange={e => onCell(row.id, col.key, e.target.value, false)}
                      />
                    )}
                  </td>
                ))}
                {computed.map(c => <td key={c.label} className={c.className ? c.className(row) : 'daily'}>{c.fn(row)}</td>)}
                <td className="row-actions">
                  {rowActions && rowActions(row)}
                  <button className="btn-delete" onClick={() => confirmDel(row)}>✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="table-footer">
        {needle && <strong className="g-mid">filtered totals ↓</strong>}
        {columns.filter(c => c.type === 'number' && !c.noSum).map(c => (
          <strong key={c.key}>{c.label}: {fmt(shown.reduce((s, r) => s + (parseFloat(r[c.key]) || 0), 0))}</strong>
        ))}
        {!needle && footerExtras.map((f, i) => <strong key={i}>{f}</strong>)}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [tab, setTab] = useState('overview');
  const [payrollView, setPayrollView] = useState('overall');
  const [data, setData] = useState(SEED);
  const [loaded, setLoaded] = useState(false);
  const [session, setSession] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [localOnly, setLocalOnly] = useState(false);
  const [email, setEmail] = useState('');
  const [linkSent, setLinkSent] = useState(false);
  const [authErr, setAuthErr] = useState('');
  const [syncState, setSyncState] = useState('');
  const [password, setPassword] = useState('');
  const [showPwForm, setShowPwForm] = useState(false);
  const [newPw, setNewPw] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [affordAmt, setAffordAmt] = useState('');
  const [monthlyFilter, setMonthlyFilter] = useState('all');
  const [chinaView, setChinaView] = useState('shipments');
  const [owedFilter, setOwedFilter] = useState('all');
  const [qbBusy, setQbBusy] = useState(false);
  const [qbMsg, setQbMsg] = useState('');
  const [qbPeriod, setQbPeriod] = useState('this_month');
  const [qbReports, setQbReports] = useState(null);
  const [qbStaged, setQbStaged] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const m = window.location.hash.match(/qb=([^&]+)/);
    if (m) {
      try {
        setQbStaged(JSON.parse(atob(decodeURIComponent(m[1]))));
      } catch (e) { /* bad payload */ }
      window.history.replaceState(null, '', window.location.pathname);
    } else if (window.location.hash.includes('qberr')) {
      setQbMsg('QuickBooks connection didn’t finish — try Connect again');
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (loaded && qbStaged) {
      setData(d => ({ ...d, quickbooks: { refreshToken: qbStaged.refresh_token, realmId: qbStaged.realmId } }));
      setQbStaged(null);
      setTab('quickbooks');
      setQbMsg('QuickBooks connected ✓ — pick a period and load your reports');
    }
  }, [loaded, qbStaged]);

  // One-time: import personal monthly expenses from the screenshot, if not already present
  useEffect(() => {
    if (!loaded) return;
    setData(d => {
      if (d.personalExpensesImported) return d;
      const toAdd = [
        { name: 'Gas bill', amount: 100 },
        { name: 'Electricity', amount: 600 },
        { name: 'Water', amount: 300 },
        { name: 'Trash', amount: 100 },
        { name: 'Pool', amount: 120 },
        { name: 'Gardener', amount: 250 },
        { name: 'Vicki', amount: 0 },
        { name: 'Groceries', amount: 750 },
        { name: 'Geico insurance', amount: 1100 },
      ].filter(item => !d.monthly.some(m => (m.name || '').trim().toLowerCase() === item.name.toLowerCase()));
      if (!toAdd.length) return { ...d, personalExpensesImported: true };
      return {
        ...d,
        personalExpensesImported: true,
        monthly: [
          ...d.monthly,
          ...toAdd.map((item, i) => ({ id: Date.now() + i, name: item.name, amount: item.amount, dueDay: 1, type: 'personal' })),
        ],
      };
    });
  }, [loaded]);

  // One-time: import China Shipments Tracker.xlsx into the China order tab
  useEffect(() => {
    if (!loaded) return;
    setData(d => {
      if (d.chinaOrderImported) return d;
      const raw = [
        ['C9 spool', 'China', '', '', 11576, 0, 'Ordered'],
        ['Magnet C9 spool', 'China', '', 'Bruce', 2712, 0, 'Ordered'],
        ['Zip wire 500 feet', 'China', '', '', 12750, 0, 'Ordered'],
        ['15k male / 20k female / 10k middle', 'China', '', 'Bruce', 14750, 0, 'Ordered'],
        ['End caps clear plastic', 'China', '', 'Bruce', 800, 0, 'Ordered'],
        ['Stakes', 'China', '', 'Bruce', 1905, 0, 'Ordered'],
        ['C9 orange', 'China', '', 'Bruce', 2950, 0, 'Ordered'],
        ['C9 purple', 'China', '', 'Bruce', 2950, 0, 'Ordered'],
        ['C9 green', 'China', '', 'Bruce', 5900, 0, 'Ordered'],
        ['C9 red', 'China', '', 'Bruce', 5900, 0, 'Ordered'],
        ['C9 WW 3000k', 'China', 'SD', 'Bruce', 17700, 0, 'Ordered'],
        ['C9 5-multi', 'China', 'SD', 'Bruce', 7375, 0, 'Ordered'],
        ['WW minis 3000k', 'China', 'SD', 'Bruce', 25000, 0, 'Ordered'],
        ['Red minis', 'China', 'SD', 'Bruce', 3750, 0, 'Ordered'],
        ['Green minis', 'China', 'SD', 'Bruce', 3750, 0, 'Ordered'],
        ['Pure white minis', 'China', 'SD', 'Bruce', 3000, 0, 'Ordered'],
        ['Multi-5 minis', 'China', 'SD', 'Bruce', 5000, 0, 'Ordered'],
        ['Mechanical timer', 'China', 'SD', 'Bruce', 3400, 0, 'Ordered'],
        ['Photocell timer', 'China', 'SD', 'Bruce', 880, 0, 'Ordered'],
        ['Digital timer', 'China', 'SD', 'Bruce', 2725, 0, 'Ordered'],
        ['Wreath 36" WW', 'China', 'SD', 'Bruce', 1764, 0, 'Ordered'],
        ['Garland', 'China', 'SD', 'Bruce', 2230, 0, 'Ordered'],
        ['Yard signs', 'China', '', 'Jolin', 5460, 5460, 'Paid'],
        ['Brochures', 'China', '', 'Jolin', 2740, 2740, 'Paid'],
        ['Samples (mini & C9)', 'China', '', 'Bruce', 450, 450, 'Paid'],
        ['Clips', 'Halo clips', '', '', 11050, 0, 'Ordered'],
      ];
      const toAdd = raw
        .filter(([name]) => !d.chinaOrder.some(c => (c.name || '').trim().toLowerCase() === name.toLowerCase()))
        .map(([name, source, branch, contact, amount, paid, sheetStatus], i) => {
          const bits = [];
          if (source !== 'China') bits.push(`Source: ${source}`);
          if (branch) bits.push(`Branch: ${branch}`);
          if (contact) bits.push(`Contact: ${contact}`);
          if (sheetStatus === 'Paid') bits.push('Paid in full');
          return {
            id: Date.now() + i, name, amount, paid,
            status: 'ordered', bucket: 'business', notes: bits.join(' · '),
          };
        });
      return { ...d, chinaOrderImported: true, chinaOrder: [...d.chinaOrder, ...toAdd] };
    });
  }, [loaded]);

  // One-time: give China order rows a real Contact field, and mark the 30% deposit
  // as already paid on every Bruce item (per the shipment tracker's deposit column)
  useEffect(() => {
    if (!loaded) return;
    setData(d => {
      if (d.chinaContactFix) return d;
      const ref = {
        'c9 spool': { contact: '', source: 'China', deposit: 3473 },
        'magnet c9 spool': { contact: 'Bruce', source: 'China', deposit: 814 },
        'zip wire 500 feet': { contact: '', source: 'China', deposit: 3825 },
        '15k male / 20k female / 10k middle': { contact: 'Bruce', source: 'China', deposit: 4425 },
        'end caps clear plastic': { contact: 'Bruce', source: 'China', deposit: 240 },
        'stakes': { contact: 'Bruce', source: 'China', deposit: 572 },
        'c9 orange': { contact: 'Bruce', source: 'China', deposit: 885 },
        'c9 purple': { contact: 'Bruce', source: 'China', deposit: 885 },
        'c9 green': { contact: 'Bruce', source: 'China', deposit: 1770 },
        'c9 red': { contact: 'Bruce', source: 'China', deposit: 1770 },
        'c9 ww 3000k': { contact: 'Bruce', source: 'China', deposit: 5310 },
        'c9 5-multi': { contact: 'Bruce', source: 'China', deposit: 2213 },
        'ww minis 3000k': { contact: 'Bruce', source: 'China', deposit: 7500 },
        'red minis': { contact: 'Bruce', source: 'China', deposit: 1125 },
        'green minis': { contact: 'Bruce', source: 'China', deposit: 1125 },
        'pure white minis': { contact: 'Bruce', source: 'China', deposit: 900 },
        'multi-5 minis': { contact: 'Bruce', source: 'China', deposit: 1500 },
        'mechanical timer': { contact: 'Bruce', source: 'China', deposit: 1020 },
        'photocell timer': { contact: 'Bruce', source: 'China', deposit: 264 },
        'digital timer': { contact: 'Bruce', source: 'China', deposit: 818 },
        'wreath 36" ww': { contact: 'Bruce', source: 'China', deposit: 529 },
        'garland': { contact: 'Bruce', source: 'China', deposit: 669 },
        'yard signs': { contact: 'Jolin', source: 'China', deposit: 0 },
        'brochures': { contact: 'Jolin', source: 'China', deposit: 0 },
        'samples (mini & c9)': { contact: 'Bruce', source: 'China', deposit: 0 },
        'clips': { contact: '', source: 'Halo clips', deposit: 3315 },
      };
      const chinaOrder = d.chinaOrder.map(row => {
        const info = ref[(row.name || '').trim().toLowerCase()];
        if (!info) return row;
        const next = { ...row, contact: row.contact || info.contact };
        // Bruce items: the 30% deposit has already been paid — bump paid up to
        // at least the deposit amount without clobbering any larger payment.
        if (info.contact === 'Bruce' && info.deposit > 0 && (next.paid || 0) < info.deposit) {
          next.paid = info.deposit;
        }
        const bits = [];
        if (info.source !== 'China') bits.push(`Source: ${info.source}`);
        const cleanedNotes = (row.notes || '').replace(/Contact:\s*\w+\s*·?\s*/i, '').replace(/Paid in full\s*·?\s*/i, '').trim();
        next.notes = [...bits, cleanedNotes].filter(Boolean).join(' · ');
        return next;
      });
      return { ...d, chinaContactFix: true, chinaOrder };
    });
  }, [loaded]);

  // One-time safety net: every Jolin item is paid in full. This only runs once —
  // after that, you have full control to edit paid/amount however you want.
  useEffect(() => {
    if (!loaded) return;
    setData(d => {
      if (d.chinaJolinFix) return d;
      const chinaOrder = d.chinaOrder.map(row =>
        (row.contact || '').trim().toLowerCase() === 'jolin' && (row.paid || 0) < (row.amount || 0)
          ? { ...row, paid: row.amount || 0 }
          : row
      );
      return { ...d, chinaJolinFix: true, chinaOrder };
    });
  }, [loaded]);

  // One-time: sort existing Owed rows into groups (credit cards / people / business)
  useEffect(() => {
    if (!loaded) return;
    setData(d => {
      if (d.owedGroupsFix) return d;
      const CARD_WORDS = /amex|plat\b|plat |platinum|gold|chase|noelle|visa|card|citi|wells|discover|capital one/i;
      const PEOPLE_WORDS = /^(luke|jerry|marcus|kai|vicki|stu|julio|perez|jer|noah)$|squeegee|crew/i;
      const cards = d.cards.map(row => {
        if (row.group) return row;
        const name = (row.name || '').trim();
        const group = row.plaidId || CARD_WORDS.test(name) ? 'credit card'
          : PEOPLE_WORDS.test(name) ? 'person'
          : 'business';
        return { ...row, group };
      });
      return { ...d, owedGroupsFix: true, cards };
    });
  }, [loaded]);

  // One-time: savings buckets are not debts — move any bucket-looking rows out
  // of Owed (and 0% cards) into their own Savings buckets tab.
  useEffect(() => {
    if (!loaded) return;
    setData(d => {
      if (d.savingsBucketsFix) return d;
      const isBucket = r => /saving|bucket/i.test(r.name || '');
      const fromCards = d.cards.filter(isBucket);
      const fromZero = (d.zeroCards || []).filter(isBucket);
      if (!fromCards.length && !fromZero.length) return { ...d, savingsBucketsFix: true };
      return {
        ...d,
        savingsBucketsFix: true,
        cards: d.cards.filter(r => !isBucket(r)),
        zeroCards: (d.zeroCards || []).filter(r => !isBucket(r)),
        savingsBuckets: [
          ...(d.savingsBuckets || []),
          ...fromCards.map(r => ({ id: r.id, name: r.name, amount: r.amount || 0, target: 0, date: '', link: r.link, notes: r.notes || '' })),
          ...fromZero.map(r => ({ id: r.id, name: r.name, amount: r.balance || 0, target: 0, date: '', link: r.link, notes: r.notes || '' })),
        ],
      };
    });
  }, [loaded]);

  // One-time: mortgage refi — first payment on the new loan is Oct 1
  useEffect(() => {
    if (!loaded) return;
    setData(d => {
      if (d.mortgageRefiDateSet) return d;
      const debts = d.debts.map(row =>
        /mortgage/i.test(row.name || '') && !row.due ? { ...row, due: '10/1' } : row
      );
      return { ...d, mortgageRefiDateSet: true, debts };
    });
  }, [loaded]);

  // One-time: convert a custom "savings buckets" tab into Goals
  useEffect(() => {
    if (!loaded) return;
    setData(d => {
      const sb = (d.customTabs || []).find(t => /saving|bucket/i.test(t.name || ''));
      if (!sb || (d.goals || []).length) return d;
      return {
        ...d,
        goals: (sb.rows || []).map(r => ({ id: r.id, name: r.name, target: r.amount || 0, saved: 0, date: '', notes: r.notes || '' })),
        customTabs: (d.customTabs || []).filter(t => t.id !== sb.id),
      };
    });
  }, [loaded]);
  const [sheetBusy, setSheetBusy] = useState(false);
  const [sheetMsg, setSheetMsg] = useState('');

  useEffect(() => {
    if (!supabase) {
      setLocalOnly(true);
      setAuthChecked(true);
      return;
    }
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setAuthChecked(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!authChecked) return;
    let local = SEED;
    try {
      const saved = localStorage.getItem('cyberdollar-data-v1');
      if (saved) local = { ...SEED, ...JSON.parse(saved) };
    } catch (e) { /* corrupted save — keep seed */ }

    if (session && supabase) {
      supabase.from('finance_data').select('data').eq('user_id', session.user.id).maybeSingle()
        .then(({ data: row, error }) => {
          if (row && row.data) {
            setData({ ...SEED, ...row.data });
            setSyncState('synced');
          } else {
            setData(local);
            if (error) {
              setSyncState('error');
            } else {
              supabase.from('finance_data')
                .upsert({ user_id: session.user.id, data: local, updated_at: new Date().toISOString() })
                .then(({ error: e2 }) => setSyncState(e2 ? 'error' : 'synced'));
            }
          }
          setLoaded(true);
        });
    } else {
      setData(local);
      setLoaded(true);
    }
  }, [authChecked, session]);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem('cyberdollar-data-v1', JSON.stringify(data));
    if (session && supabase) {
      setSyncState('saving');
      const t = setTimeout(() => {
        supabase.from('finance_data')
          .upsert({ user_id: session.user.id, data, updated_at: new Date().toISOString() })
          .then(({ error }) => setSyncState(error ? 'error' : 'synced'));
      }, 800);
      return () => clearTimeout(t);
    }
  }, [data, loaded, session]);

  const sendLink = async (e) => {
    if (e) e.preventDefault();
    setAuthErr('');
    if (!email.trim()) { setAuthErr('Enter your email first'); return; }
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: window.location.origin + '/dashboard' },
    });
    if (error) setAuthErr(error.message);
    else setLinkSent(true);
  };

  const signInPw = async (e) => {
    e.preventDefault();
    setAuthErr('');
    if (!email.trim() || !password) { setAuthErr('Enter email and password'); return; }
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) {
      if (/invalid login credentials/i.test(error.message)) {
        setAuthErr('Wrong password — or no password set yet. Use the email link below, then set a password in the sidebar.');
      } else {
        setAuthErr(error.message);
      }
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    setPwMsg('');
    if (!newPw || newPw.length < 8) { setPwMsg('Password needs at least 8 characters'); return; }
    const { error } = await supabase.auth.updateUser({ password: newPw });
    if (error) setPwMsg(error.message);
    else {
      setPwMsg('Password saved ✓ — use it to sign in from now on');
      setNewPw('');
      setTimeout(() => { setShowPwForm(false); setPwMsg(''); }, 3000);
    }
  };

  const signOut = async () => {
    if (supabase) await supabase.auth.signOut();
    setSession(null);
  };

  // ---------- Plaid bank connections ----------
  const [bankBusy, setBankBusy] = useState(false);
  const [bankErr, setBankErr] = useState('');
  const [pendingBank, setPendingBank] = useState([]);

  const loadPlaidScript = () => new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && window.Plaid) return resolve();
    const s = document.createElement('script');
    s.src = 'https://cdn.plaid.com/link/v2/stable/link-initialize.js';
    s.onload = resolve;
    s.onerror = () => reject(new Error('Could not load Plaid Link'));
    document.head.appendChild(s);
  });

  // Match a table row to a Plaid account by stored id, or by name + ··mask in the
  // label — collapses duplicate bank connections without confusing two cards
  // that share the same last-4 (e.g. two Amex cards both ··1006).
  const matchBankRow = (row, t) => row.plaidId === t.id
    || (t.mask && row.name && String(row.name).includes('··' + t.mask) && (!t.name || String(row.name).includes(t.name)));

  const applyBankAccounts = (list, institution) => {
    const ignored = data.bankIgnored || [];
    const fresh = [];
    list.forEach(t => {
      if (ignored.includes(t.id)) return;
      const pool = t.type === 'credit' ? [...data.cards, ...(data.zeroCards || [])]
        : t.type === 'loan' ? data.debts : data.accounts;
      if (!pool.some(r => matchBankRow(r, t))) fresh.push({ ...t, institution });
    });
    if (fresh.length) {
      setPendingBank(p => [...p, ...fresh.filter(f =>
        !p.some(x => x.id === f.id || (f.mask && x.mask === f.mask && x.name === f.name && x.institution === f.institution))
      )]);
    }
    setData(d => {
      const accounts = d.accounts.map(r => {
        const t = list.find(x => x.type !== 'credit' && x.type !== 'loan' && matchBankRow(r, x));
        return t ? { ...r, balance: t.available != null ? t.available : (t.current || 0) } : r;
      });
      const cards = d.cards.map(r => {
        const t = list.find(x => x.type === 'credit' && matchBankRow(r, x));
        return t ? { ...r, amount: Math.abs(t.current != null ? t.current : (t.available || 0)) } : r;
      });
      const zeroCards = (d.zeroCards || []).map(r => {
        const t = list.find(x => x.type === 'credit' && matchBankRow(r, x));
        return t ? { ...r, balance: Math.abs(t.current != null ? t.current : (t.available || 0)), limit: t.limit != null ? t.limit : r.limit } : r;
      });
      const debts = d.debts.map(r => {
        const t = list.find(x => x.type === 'loan' && matchBankRow(r, x));
        return t ? { ...r, amount: Math.abs(t.current || 0) } : r;
      });
      return { ...d, accounts, cards, zeroCards, debts, bankLastSync: new Date().toISOString() };
    });
  };

  const classifyBank = (acct, bucket) => {
    if (bucket === 'skip') {
      setData(d => ({ ...d, bankIgnored: [...(d.bankIgnored || []), acct.id] }));
    } else {
      const tag = bucket === 'business' ? 'Window Wizards' : bucket === 'zero' ? '0% card' : 'personal';
      setData(d => {
        const label = `${acct.institution || 'Bank'} ${acct.name}${acct.mask ? ' ··' + acct.mask : ''}`;
        const base = { id: Date.now() + Math.floor(Math.random() * 1000), plaidId: acct.id, bucket, notes: 'live · ' + tag };
        if (bucket === 'zero') {
          const bal = Math.abs(acct.current != null ? acct.current : (acct.available || 0));
          return { ...d, zeroCards: [...(d.zeroCards || []), { ...base, bucket: 'business', name: label, balance: bal, limit: acct.limit || 0, promoEnd: '' }] };
        }
        if (acct.type === 'credit') {
          const bal = Math.abs(acct.current != null ? acct.current : (acct.available || 0));
          return { ...d, cards: [...d.cards, { ...base, name: label, amount: bal, close: '', due: '', group: 'credit card' }] };
        }
        if (acct.type === 'loan') {
          return { ...d, debts: [...d.debts, { ...base, name: label, amount: Math.abs(acct.current || 0), limit: acct.limit || 0 }] };
        }
        const bal = acct.available != null ? acct.available : (acct.current || 0);
        return { ...d, accounts: [...d.accounts, { ...base, name: label, balance: bal, kind: 'bank' }] };
      });
    }
    setPendingBank(p => p.filter(x => x.id !== acct.id));
  };

  const refreshBalances = async (items) => {
    const list = items || data.plaidItems || [];
    if (!list.length) return;
    setBankBusy(true);
    setBankErr('');
    const errors = [];
    for (const item of list) {
      try {
        const res = await fetch('/api/plaid/balances', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: item.accessToken }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'refresh failed');
        applyBankAccounts(json, item.institution);
      } catch (e) {
        errors.push(`${item.institution || 'bank'}: ${String(e.message || e)}`);
      }
    }
    if (errors.length) setBankErr(errors.join(' · '));
    setBankBusy(false);
  };

  const connectBank = async () => {
    setBankErr('');
    setBankBusy(true);
    try {
      const r = await fetch('/api/plaid/create-link-token', { method: 'POST' });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Plaid not configured yet');
      await loadPlaidScript();
      const handler = window.Plaid.create({
        token: j.link_token,
        onSuccess: async (public_token, metadata) => {
          try {
            const ex = await fetch('/api/plaid/exchange', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ public_token }),
            });
            const ej = await ex.json();
            if (!ex.ok) throw new Error(ej.error || 'exchange failed');
            const inst = metadata && metadata.institution && metadata.institution.name;
            const newItem = { accessToken: ej.access_token, institution: inst || '' };
            setData(d => ({ ...d, plaidItems: [...(d.plaidItems || []), newItem] }));
            refreshBalances([newItem]);
          } catch (e) {
            setBankErr(String(e.message || e));
            setBankBusy(false);
          }
        },
        onExit: () => setBankBusy(false),
      });
      handler.open();
    } catch (e) {
      setBankErr(String(e.message || e));
      setBankBusy(false);
    }
  };

  // No auto-refresh on load, by request — Plaid balances and the account
  // classification prompt only ever fire from an explicit click on
  // "Connect bank" or "Refresh balances", never automatically on open.

  // ---------- Quick actions: full / partial pay + receive ----------
  const moveCash = (accounts, delta) => {
    const a = [...accounts];
    if (a.length) a[0] = { ...a[0], balance: (a[0].balance || 0) + delta };
    return a;
  };

  const logHistory = (d, kind, name, amount) =>
    [{ id: Date.now(), date: new Date().toISOString(), kind, name, amount }, ...(d.history || [])].slice(0, 50);

  const promptAmt = (label) => {
    const v = parseFloat(window.prompt(label, ''));
    return isNaN(v) || v <= 0 ? null : v;
  };

  const paidFull = (listKey, row) => {
    const label = row.name || 'this';
    const moving = listKey === 'chinaOrder'
      ? Math.max(0, (row.amount || 0) - (row.paid || 0))
      : listKey === 'zeroCards' ? (row.balance || 0) : (row.amount || 0);
    const msg = listKey === 'incoming'
      ? `Collect ${fmt(moving)} from ${label}? Adds to your first cash account.`
      : `Mark ${label} paid? Subtracts ${fmt(moving)} from your first cash account.`;
    if (!window.confirm(msg)) return;
    setData(d => {
      const name = row.name || 'item';
      if (listKey === 'incoming') {
        const amt = row.amount || 0;
        return { ...d, accounts: moveCash(d.accounts, amt), incoming: d.incoming.filter(x => x.id !== row.id), history: logHistory(d, 'collected', name, amt) };
      }
      if (listKey === 'cards') {
        const amt = row.amount || 0;
        return { ...d, accounts: moveCash(d.accounts, -amt), cards: d.cards.filter(x => x.id !== row.id), history: logHistory(d, 'paid', name, amt) };
      }
      if (listKey === 'chinaOrder') {
        const remaining = Math.max(0, (row.amount || 0) - (row.paid || 0));
        return { ...d, accounts: moveCash(d.accounts, -remaining), chinaOrder: d.chinaOrder.map(x => x.id === row.id ? { ...x, paid: x.amount || 0 } : x), history: logHistory(d, 'paid', name, remaining) };
      }
      if (listKey === 'debts' || listKey === 'zeroCards') {
        const field = listKey === 'debts' ? 'amount' : 'balance';
        const owed = row[field] || 0;
        return { ...d, accounts: moveCash(d.accounts, -owed), [listKey]: d[listKey].map(x => x.id === row.id ? { ...x, [field]: 0 } : x), history: logHistory(d, 'paid', name, owed) };
      }
      if (listKey === 'monthly') {
        const amt = row.amount || 0;
        return { ...d, accounts: moveCash(d.accounts, -amt), history: logHistory(d, 'paid', name, amt) };
      }
      if (listKey === 'personalPurchases') {
        const amt = row.amount || 0;
        return { ...d, accounts: moveCash(d.accounts, -amt), personalPurchases: d.personalPurchases.map(x => x.id === row.id ? { ...x, status: 'bought' } : x), history: logHistory(d, 'paid', name, amt) };
      }
      return d;
    });
  };

  const paidPartial = (listKey, row) => {
    const isIncoming = listKey === 'incoming';
    const amt = promptAmt(isIncoming
      ? `How much did ${row.name || 'they'} pay you?`
      : `How much did you pay toward ${row.name || 'this'}?`);
    if (!amt) return;
    setData(d => {
      const name = (row.name || 'item') + ' (partial)';
      if (isIncoming) {
        return { ...d, accounts: moveCash(d.accounts, amt), incoming: d.incoming.map(x => x.id === row.id ? { ...x, amount: Math.max(0, (x.amount || 0) - amt) } : x), history: logHistory(d, 'collected', name, amt) };
      }
      if (listKey === 'cards') {
        return { ...d, accounts: moveCash(d.accounts, -amt), cards: d.cards.map(x => x.id === row.id ? { ...x, amount: Math.max(0, (x.amount || 0) - amt) } : x), history: logHistory(d, 'paid', name, amt) };
      }
      if (listKey === 'chinaOrder') {
        return { ...d, accounts: moveCash(d.accounts, -amt), chinaOrder: d.chinaOrder.map(x => x.id === row.id ? { ...x, paid: (x.paid || 0) + amt } : x), history: logHistory(d, 'paid', name, amt) };
      }
      if (listKey === 'debts' || listKey === 'zeroCards') {
        const field = listKey === 'debts' ? 'amount' : 'balance';
        return { ...d, accounts: moveCash(d.accounts, -amt), [listKey]: d[listKey].map(x => x.id === row.id ? { ...x, [field]: Math.max(0, (x[field] || 0) - amt) } : x), history: logHistory(d, 'paid', name, amt) };
      }
      if (listKey === 'monthly') {
        return { ...d, accounts: moveCash(d.accounts, -amt), history: logHistory(d, 'paid', name, amt) };
      }
      if (listKey === 'personalPurchases') {
        return { ...d, accounts: moveCash(d.accounts, -amt), personalPurchases: d.personalPurchases.map(x => x.id === row.id ? { ...x, amount: Math.max(0, (x.amount || 0) - amt) } : x), history: logHistory(d, 'paid', name, amt) };
      }
      return d;
    });
  };

  const payButtons = (listKey, row, fullTitle, partialTitle) => (
    <>
      <button className="act-btn" title={fullTitle} onClick={() => paidFull(listKey, row)}>✓</button>
      <button className="act-btn partial" title={partialTitle} onClick={() => paidPartial(listKey, row)}>½</button>
    </>
  );

  // ---------- Defer: push a payment's due date out, with a paper trail ----------
  const fmtMD = (d) => `${d.getMonth() + 1}/${d.getDate()}`;

  const deferPayment = (row) => {
    const current = nextDue(row.due);
    const currentLabel = current ? fmtMD(current) : (row.due || 'no date set');
    const input = window.prompt(
      `Defer "${row.name || 'this'}" — currently due ${currentLabel}.\n\nType a number of days to push it out (e.g. 14), or type an exact new date (e.g. 9/20):`,
      '14'
    );
    if (input == null || !input.trim()) return;
    const trimmed = input.trim();
    let newDate;
    if (/^\d+$/.test(trimmed)) {
      newDate = new Date(current || new Date());
      newDate.setDate(newDate.getDate() + parseInt(trimmed, 10));
    } else {
      newDate = nextDue(trimmed);
      if (!newDate) {
        window.alert('Couldn\'t read that date — try a number of days, or M/D format like 9/20.');
        return;
      }
    }
    const newLabel = fmtMD(newDate);
    setData(d => ({
      ...d,
      cards: d.cards.map(c => c.id === row.id ? { ...c, due: newLabel, deferredFrom: c.deferredFrom || currentLabel } : c),
      history: [
        { id: Date.now(), date: new Date().toISOString(), kind: 'deferred', name: row.name || 'item', from: currentLabel, to: newLabel },
        ...(d.history || []),
      ].slice(0, 50),
    }));
  };

  const countToggle = (key) => (
    <label className="count-toggle" title="On = this tab counts in overview totals and projection. Off = tracked here only.">
      <input type="checkbox" checked={cnt(key)} onChange={e => setCounted(key, e.target.checked)} />
      counted
    </label>
  );

  // ---------- Move cards between Owed and 0% tabs ----------
  const moveToZero = (row) => {
    setData(d => ({
      ...d,
      cards: d.cards.filter(x => x.id !== row.id),
      zeroCards: [...(d.zeroCards || []), {
        id: Date.now(), plaidId: row.plaidId, name: row.name, balance: row.amount || 0,
        limit: row.limit || 0, promoEnd: '', bucket: row.bucket, link: row.link, notes: row.notes || '',
      }],
    }));
  };

  const moveToOwed = (row) => {
    setData(d => ({
      ...d,
      zeroCards: (d.zeroCards || []).filter(x => x.id !== row.id),
      cards: [...d.cards, {
        id: Date.now(), plaidId: row.plaidId, name: row.name, amount: row.balance || 0,
        close: '', due: '', bucket: row.bucket, link: row.link, notes: row.notes || '', group: 'credit card',
      }],
    }));
  };

  // ---------- Tag paths: link any row to any other row ----------
  const LINK_SOURCES = [
    ['incoming', 'Incoming'], ['cards', 'Owed'], ['accounts', 'Cash'], ['monthly', 'Monthly'],
    ['zeroCards', '0% card'], ['chinaOrder', 'China'], ['personalPurchases', 'Purchase'],
    ['debts', 'Debt'], ['goals', 'Goal'], ['savingsBuckets', 'Bucket'], ['refiAllocations', 'Refi'],
  ];
  const linkTargets = [
    ...LINK_SOURCES.flatMap(([k, label]) =>
      (data[k] || []).filter(r => r.name).map(r => ({ value: `${k}:${r.id}`, label: `${label}: ${r.name}` }))
    ),
    ...data.jobs.map(j => ({ value: `jobs:${j.id}`, label: `Job: ${j.name || 'Job'}` })),
    ...(data.customTabs || []).flatMap(t =>
      (t.rows || []).filter(r => r.name).map(r => ({ value: `custom-${t.id}:${r.id}`, label: `${t.name || 'Tab'}: ${r.name}` }))
    ),
  ];

  const jumpTo = (path) => {
    const [k, id] = String(path).split(':');
    const map = {
      accounts: 'cash', cards: 'owed', incoming: 'incoming', monthly: 'monthly',
      zeroCards: 'zero', chinaOrder: 'china', personalPurchases: 'purchases',
      debts: 'debts', goals: 'goals', savingsBuckets: 'savings', refiAllocations: 'refi',
    };
    if (k === 'jobs') {
      setTab('payroll');
      setPayrollView(parseFloat(id));
      return;
    }
    if (k.startsWith('custom-')) {
      setTab(k);
      return;
    }
    if (map[k]) setTab(map[k]);
  };

  // ---------- Backup / restore ----------
  const downloadBackup = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `cyberdollar-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const restoreBackup = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        setData({ ...SEED, ...parsed });
      } catch (err) {
        alert('That file is not a valid CyberDollar backup');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // ---------- Totals ----------
  const totalCash = data.accounts.reduce((s, a) => s + (a.balance || 0), 0);
  const totalOwed = data.cards.reduce((s, c) => s + (c.amount || 0), 0);
  const totalIncoming = data.incoming.reduce((s, i) => s + (i.amount || 0), 0);
  const totalMonthly = data.monthly.reduce((s, e) => s + (e.amount || 0), 0);
  const totalDebts = data.debts.reduce((s, d) => s + (d.amount || 0), 0);
  const totalZero = (data.zeroCards || []).reduce((s, z) => s + (z.balance || 0), 0);
  const chinaTotal = (data.chinaOrder || []).reduce((s, c) => s + (c.amount || 0), 0);
  const chinaPaid = (data.chinaOrder || []).reduce((s, c) => s + (c.paid || 0), 0);
  const chinaFunded = (data.chinaFunding || []).reduce((s, c) => s + (c.amount || 0), 0);
  const savingsTotal = (data.savingsBuckets || []).reduce((s, b) => s + (b.amount || 0), 0);
  const purchasesPlanned = (data.personalPurchases || []).filter(p => p.status === 'planned').reduce((s, p) => s + (p.amount || 0), 0);
  const purchasesBought = (data.personalPurchases || []).filter(p => p.status === 'bought').reduce((s, p) => s + (p.amount || 0), 0);
  // "counted" toggles — tabs switched off are excluded from every aggregate
  // China order is its own environment by default — funded via specific cards
  // (see Card funding), not double-counted into the main totals unless flipped on.
  const cnt = (key) => {
    const setting = ((data.tabSettings || {})[key] || {}).counted;
    if (setting !== undefined) return setting;
    return key !== 'china';
  };
  const setCounted = (key, v) => setData(d => ({
    ...d,
    tabSettings: { ...(d.tabSettings || {}), [key]: { ...((d.tabSettings || {})[key] || {}), counted: v } },
  }));

  const chinaRemaining = chinaTotal - chinaPaid;
  const aggCash = cnt('cash') ? totalCash : 0;
  const aggOwed = cnt('owed') ? totalOwed : 0;
  const aggIncoming = cnt('incoming') ? totalIncoming : 0;
  const aggMonthly = cnt('monthly') ? totalMonthly : 0;
  const aggZero = cnt('zero') ? totalZero : 0;
  const aggDebts = cnt('debts') ? totalDebts : 0;
  const aggChina = cnt('china') ? chinaRemaining : 0;

  const dailyBurn = aggMonthly / 30;
  const netNow = aggCash - aggOwed;
  const projected = netNow + aggIncoming;
  const runwayDays = dailyBurn > 0 ? Math.floor(netNow / dailyBurn) : Infinity;
  const trueNet = aggCash + aggIncoming - aggOwed - aggZero - aggDebts - aggChina;

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
    // New rows go on top so you never hunt for the empty row on long tables
    setData(d => ({ ...d, [key]: [{ ...blank, id: Date.now() }, ...(d[key] || [])] }));
  };
  const removeFromList = (key, id) => {
    setData(d => ({ ...d, [key]: d[key].filter(row => row.id !== id) }));
  };

  // ---------- Editable schemas + tab names ----------
  const getSchema = (key) => {
    const saved = (data.schemas || {})[key];
    const def = DEFAULT_SCHEMAS[key];
    if (!saved) return def;
    // Overlay structural flags from defaults (sums, % entry, dropdown options)
    // onto saved columns so improvements reach customized tables — labels and
    // user-added columns stay exactly as the user set them.
    const overlaid = saved.map(c => {
      const dc = def.find(x => x.key === c.key);
      if (!dc) return c;
      return {
        ...c,
        core: dc.core,
        noSum: dc.noSum,
        pctOf: dc.pctOf,
        options: dc.options || c.options,
        type: (dc.type === 'select' || dc.type === 'link') ? dc.type : c.type,
      };
    });
    const missing = def.filter(c => !saved.some(s => s.key === c.key));
    return missing.length ? [...overlaid, ...missing] : overlaid;
  };
  const setSchema = (key, cols) => setData(d => ({ ...d, schemas: { ...(d.schemas || {}), [key]: cols } }));
  const tabName = (key, def) => ((data.tabNames || {})[key]) || def;
  const setTabName = (key, v) => setData(d => ({ ...d, tabNames: { ...(d.tabNames || {}), [key]: v } }));

  // ---------- Payroll helpers (generic over standard + jobs) ----------
  const getWorkers = (target) => target === 'standard'
    ? (data.standardPayroll || { workers: [] }).workers
    : (data.jobs.find(j => j.id === target) || { workers: [] }).workers;

  const setWorkers = (target, updater) => {
    setData(d => {
      if (target === 'standard') {
        const sp = d.standardPayroll || { workers: [] };
        return { ...d, standardPayroll: { ...sp, workers: updater(sp.workers) } };
      }
      return { ...d, jobs: d.jobs.map(j => j.id === target ? { ...j, workers: updater(j.workers) } : j) };
    });
  };

  const updateWorker = (target, workerId, field, value) => {
    setWorkers(target, ws => ws.map(w => w.id === workerId ? { ...w, [field]: field === 'rate' ? (parseFloat(value) || 0) : value } : w));
  };
  const updateHours = (target, workerId, dayIdx, value) => {
    setWorkers(target, ws => ws.map(w => {
      if (w.id !== workerId) return w;
      const hours = [...w.hours];
      hours[dayIdx] = parseFloat(value) || 0;
      return { ...w, hours };
    }));
  };
  const addWorker = (target) => {
    setWorkers(target, ws => [...ws, { id: Date.now(), name: '', rate: 0, hours: Array(NUM_DAYS).fill(0), extra: {} }]);
  };
  const removeWorker = (target, workerId) => {
    setWorkers(target, ws => ws.filter(w => w.id !== workerId));
  };

  // ---------- Payroll grid: user-added columns (per standard crew / per job) ----------
  const getExtraCols = (target) => target === 'standard'
    ? ((data.standardPayroll || {}).extraCols || [])
    : ((data.jobs.find(j => j.id === target) || {}).extraCols || []);

  const setExtraCols = (target, cols) => {
    setData(d => {
      if (target === 'standard') {
        const sp = d.standardPayroll || { workers: [] };
        return { ...d, standardPayroll: { ...sp, extraCols: cols } };
      }
      return { ...d, jobs: d.jobs.map(j => j.id === target ? { ...j, extraCols: cols } : j) };
    });
  };

  const addExtraCol = (target) => setExtraCols(target, [...getExtraCols(target), { key: 'x_' + Date.now(), label: 'New column', type: 'text' }]);
  const renameExtraCol = (target, key, label) => setExtraCols(target, getExtraCols(target).map(c => c.key === key ? { ...c, label } : c));
  const retypeExtraCol = (target, key, type) => setExtraCols(target, getExtraCols(target).map(c => c.key === key ? { ...c, type } : c));
  const removeExtraCol = (target, key) => setExtraCols(target, getExtraCols(target).filter(c => c.key !== key));

  const updateWorkerExtraCell = (target, workerId, colKey, value, numeric) => {
    setWorkers(target, ws => ws.map(w => w.id === workerId
      ? { ...w, extra: { ...(w.extra || {}), [colKey]: numeric ? (parseFloat(value) || 0) : value } }
      : w));
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
    const id = Date.now();
    setData(d => ({
      ...d,
      jobs: [...d.jobs, { id, name: 'New job', workers: [], extras: [] }],
    }));
    setPayrollView(id);
  };
  const removeJob = (jobId) => {
    setData(d => ({ ...d, jobs: d.jobs.filter(j => j.id !== jobId) }));
    setPayrollView('overall');
  };
  const updateJobName = (jobId, name) => {
    setData(d => ({ ...d, jobs: d.jobs.map(j => j.id === jobId ? { ...j, name } : j) }));
  };

  const jobLabor = (job) => gridTotal(job.workers);
  const jobExtras = (job) => job.extras.reduce((s, e) => s + (e.amount || 0), 0);
  const standardTotal = gridTotal((data.standardPayroll || { workers: [] }).workers);
  const allJobsTotal = data.jobs.reduce((s, j) => s + jobLabor(j) + jobExtras(j), 0);

  const overallRows = () => {
    const names = [];
    const seen = new Set();
    const push = (n) => { if (n && !seen.has(n)) { seen.add(n); names.push(n); } };
    (data.standardPayroll || { workers: [] }).workers.forEach(w => push(w.name));
    data.jobs.forEach(j => j.workers.forEach(w => push(w.name)));
    return names.map(name => {
      const std = (data.standardPayroll || { workers: [] }).workers.filter(w => w.name === name).reduce((s, w) => s + workerTotal(w), 0);
      const per = data.jobs.map(j => j.workers.filter(w => w.name === name).reduce((s, w) => s + workerTotal(w), 0));
      return { name, std, per, total: std + per.reduce((a, b) => a + b, 0) };
    });
  };

  // ---------- Custom tabs ----------
  const addCustomTab = () => {
    const id = Date.now();
    setData(d => ({
      ...d,
      customTabs: [...(d.customTabs || []), { id, name: 'New tab', rows: [] }],
    }));
    setTab(`custom-${id}`);
  };
  const removeCustomTab = (id) => {
    setData(d => ({ ...d, customTabs: (d.customTabs || []).filter(t => t.id !== id) }));
    setTab('overview');
  };
  const updateCustomTab = (id, name) => {
    setData(d => ({ ...d, customTabs: (d.customTabs || []).map(t => t.id === id ? { ...t, name } : t) }));
  };
  const addCustomRow = (tabId) => {
    setData(d => ({
      ...d,
      customTabs: (d.customTabs || []).map(t => t.id === tabId ? { ...t, rows: [...t.rows, { id: Date.now(), name: '', amount: 0, date: '', notes: '' }] } : t),
    }));
  };
  const updateCustomRow = (tabId, rowId, field, value, numeric) => {
    setData(d => ({
      ...d,
      customTabs: (d.customTabs || []).map(t => t.id !== tabId ? t : {
        ...t,
        rows: t.rows.map(r => r.id === rowId ? { ...r, [field]: numeric ? (parseFloat(value) || 0) : value } : r),
      }),
    }));
  };
  const removeCustomRow = (tabId, rowId) => {
    setData(d => ({
      ...d,
      customTabs: (d.customTabs || []).map(t => t.id !== tabId ? t : { ...t, rows: t.rows.filter(r => r.id !== rowId) }),
    }));
  };

  // ---------- Google Sheet sync ----------
  const SHEET_KEYS = ['accounts', 'cards', 'incoming', 'monthly', 'zeroCards', 'chinaOrder', 'personalPurchases', 'debts'];
  const sheetPush = async () => {
    if (!data.sheetWebhook) { setSheetMsg('Paste your Apps Script URL first'); return; }
    setSheetBusy(true);
    setSheetMsg('');
    try {
      const payload = {};
      SHEET_KEYS.forEach(k => { payload[k] = data[k] || []; });
      const res = await fetch('/api/sheet-bridge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: data.sheetWebhook, action: 'push', payload }),
      });
      const json = await res.json();
      setSheetMsg(res.ok && json.ok ? 'Pushed to Google Sheet ✓' : 'Push failed: ' + (json.error || json.resp || 'unknown'));
    } catch (e) {
      setSheetMsg('Push failed: ' + String(e.message || e));
    }
    setSheetBusy(false);
  };
  const sheetPull = async () => {
    if (!data.sheetWebhook) { setSheetMsg('Paste your Apps Script URL first'); return; }
    setSheetBusy(true);
    setSheetMsg('');
    try {
      const res = await fetch('/api/sheet-bridge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: data.sheetWebhook, action: 'pull' }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || json.resp || 'pull failed');
      setData(d => {
        const next = { ...d };
        SHEET_KEYS.forEach(k => {
          if (Array.isArray(json.data[k]) && json.data[k].length) {
            next[k] = json.data[k].map((row, i) => {
              const r = { ...row, id: Date.now() + i };
              ['amount', 'balance', 'limit', 'paid', 'dueDay', 'cost'].forEach(f => {
                if (r[f] !== undefined && r[f] !== '') r[f] = parseFloat(r[f]) || 0;
              });
              return r;
            });
          }
        });
        return next;
      });
      setSheetMsg('Pulled from Google Sheet ✓');
    } catch (e) {
      setSheetMsg('Pull failed: ' + String(e.message || e));
    }
    setSheetBusy(false);
  };

  // ---------- QuickBooks reports ----------
  const qbDates = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    switch (qbPeriod) {
      case 'last_month': return { start: iso(new Date(y, m - 1, 1)), end: iso(new Date(y, m, 0)) };
      case 'this_quarter': return { start: iso(new Date(y, Math.floor(m / 3) * 3, 1)), end: iso(now) };
      case 'ytd': return { start: iso(new Date(y, 0, 1)), end: iso(now) };
      case 'last_year': return { start: iso(new Date(y - 1, 0, 1)), end: iso(new Date(y - 1, 11, 31)) };
      default: return { start: iso(new Date(y, m, 1)), end: iso(now) };
    }
  };

  const loadQbReports = async () => {
    if (!data.quickbooks) return;
    setQbBusy(true);
    setQbMsg('');
    try {
      const { start, end } = qbDates();
      const results = {};
      let rt = data.quickbooks.refreshToken;
      for (const type of ['pnl', 'bs']) {
        const res = await fetch('/api/quickbooks/report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: rt, realmId: data.quickbooks.realmId, type, start, end }),
        });
        const j = await res.json();
        if (!res.ok) throw new Error(j.error || 'report failed');
        results[type] = j.report;
        if (j.refreshToken) rt = j.refreshToken;
      }
      setQbReports(results);
      setData(d => ({ ...d, quickbooks: { ...d.quickbooks, refreshToken: rt } }));
    } catch (e) {
      setQbMsg(String(e.message || e));
    }
    setQbBusy(false);
  };

  const disconnectQb = () => {
    setData(d => {
      const next = { ...d };
      delete next.quickbooks;
      return next;
    });
    setQbReports(null);
  };

  // ---------- Projection ----------
  const buildEvents = (HORIZON, startOfToday) => {
    const events = [];
    if (cnt('owed')) data.cards.forEach(c => {
      if (!c.amount) return;
      const d = nextDue(c.due);
      if (!d) return;
      const dayOffset = Math.round((d - startOfToday) / 86400000);
      if (dayOffset >= 0 && dayOffset <= HORIZON) {
        events.push({ day: dayOffset, name: `${c.name} due`, amount: c.amount, sign: -1 });
      }
    });
    if (cnt('purchases')) (data.personalPurchases || []).forEach(p => {
      if (p.status !== 'planned' || !p.amount || !p.date) return;
      const d = new Date(p.date + 'T00:00:00');
      if (isNaN(d)) return;
      const dayOffset = Math.round((d - startOfToday) / 86400000);
      if (dayOffset >= 0 && dayOffset <= HORIZON) {
        events.push({ day: dayOffset, name: `${p.name || 'purchase'}`, amount: p.amount, sign: -1 });
      }
    });
    if (cnt('incoming')) data.incoming.forEach(i => {
      if (!i.amount || !i.expected) return;
      const d = new Date(i.expected + 'T00:00:00');
      if (isNaN(d)) return;
      const dayOffset = Math.round((d - startOfToday) / 86400000);
      if (dayOffset >= 0 && dayOffset <= HORIZON) {
        events.push({ day: dayOffset, name: `${i.name} pays`, amount: i.amount, sign: 1 });
      }
    });
    return events;
  };

  const buildProjection = () => {
    const HORIZON = 120;
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const events = buildEvents(HORIZON, startOfToday);

    const milestones = new Set([0, 7, 14, 21, 30, 45, 60, 90, 120]);
    events.forEach(e => milestones.add(e.day));
    const days = [...milestones].sort((a, b) => a - b).filter(d => d <= HORIZON);

    return days.map(day => {
      const date = new Date(startOfToday);
      date.setDate(date.getDate() + day);
      const flowSoFar = events.filter(e => e.day <= day).reduce((s, e) => s + e.amount * (e.sign || -1), 0);
      const cash = aggCash - dailyBurn * day + flowSoFar;
      const todaysEvents = events.filter(e => e.day === day);
      return { day, date, cash, events: todaysEvents };
    });
  };

  if (!authChecked) return <div className="dashboard-container" />;

  if (!session && !localOnly) {
    return (
      <div className="auth-screen">
        <div className="auth-card">
          <div className="logo-mark">$</div>
          <h1 className="auth-title">CyberDollar</h1>
          {linkSent ? (
            <>
              <p className="auth-text">Check your email — sign-in link sent to <strong>{email}</strong>. Click it and you'll land back here, signed in. Once you're in, set a password in the sidebar so next time is instant.</p>
              <button className="btn-add" onClick={() => setLinkSent(false)}>Back</button>
            </>
          ) : (
            <>
              <p className="auth-text">Sign in once — you stay signed in on this device until you sign out.</p>
              <form onSubmit={signInPw} className="auth-form">
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" autoComplete="email" required />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" autoComplete="current-password" />
                <button type="submit" className="btn-add">Sign in</button>
              </form>
              {authErr && <p className="auth-error">{authErr}</p>}
              <button className="auth-skip" onClick={() => sendLink()}>No password yet / forgot? Email me a sign-in link</button>
              <button className="auth-skip" onClick={() => setLocalOnly(true)}>Skip — use this device only</button>
            </>
          )}
        </div>
      </div>
    );
  }

  if (!loaded) return <div className="dashboard-container" />;

  const projection = buildProjection();

  // ---------- Urgency: what's coming in the next 30 days ----------
  const nowD = new Date();
  const todayStart = new Date(nowD.getFullYear(), nowD.getMonth(), nowD.getDate());
  const upNext = (() => {
    const ev = buildEvents(30, todayStart);
    if (cnt('monthly')) data.monthly.forEach(m => {
      if (!m.amount || !m.dueDay) return;
      let d = new Date(todayStart.getFullYear(), todayStart.getMonth(), m.dueDay);
      if (d < todayStart) d = new Date(todayStart.getFullYear(), todayStart.getMonth() + 1, m.dueDay);
      const day = Math.round((d - todayStart) / 86400000);
      if (day <= 30) ev.push({ day, name: `${m.name || 'bill'} (monthly)`, amount: m.amount, sign: -1 });
    });
    return ev.sort((a, b) => a.day - b.day).slice(0, 25);
  })();

  const daysUntilDue = (dueStr) => {
    const d = nextDue(dueStr);
    if (!d) return null;
    return Math.round((d - todayStart) / 86400000);
  };

  const dueInComputed = {
    label: 'Due in',
    fn: (row) => {
      const days = daysUntilDue(row.due);
      const base = days == null ? '—' : (days <= 0 ? 'TODAY' : days + 'd');
      if (!row.deferredFrom) return base;
      return <>{base} <span className="deferred-tag" title={`Originally due ${row.deferredFrom}, deferred`}>⏰</span></>;
    },
    className: (row) => {
      const days = daysUntilDue(row.due);
      if (days == null || !(row.amount > 0)) return 'utilization';
      return days <= 7 ? 'g-neg' : days <= 30 ? 'spent' : 'daily';
    },
  };

  const owedDueWithin = (days) => data.cards.reduce((s, c) => {
    const dd = daysUntilDue(c.due);
    return dd != null && dd <= days ? s + (c.amount || 0) : s;
  }, 0);

  const deferredCount = data.cards.filter(c => c.deferredFrom).length;

  const OWED_GROUPS = [['credit card', 'Credit cards'], ['person', 'People'], ['business', 'Business']];
  const activeCustom = tab.startsWith('custom-')
    ? (data.customTabs || []).find(t => `custom-${t.id}` === tab)
    : null;

  const renderWorkerGrid = (target, workers) => {
    const dayHourTotals = Array(NUM_DAYS).fill(0);
    workers.forEach(w => w.hours.forEach((h, i) => { dayHourTotals[i] += (h || 0); }));
    const extraCols = getExtraCols(target);
    return (
      <div className="spreadsheet payroll-scroll">
        <table className="data-table payroll-table">
          <thead>
            <tr>
              <th className="pin-1">Worker</th>
              <th className="col-rate pin-2">Rate</th>
              {Array.from({ length: NUM_DAYS }, (_, i) => <th key={i} className="col-hr">D{i + 1}</th>)}
              {extraCols.map(col => (
                <th key={col.key}>
                  <div className="th-edit">
                    <input className="th-input" value={col.label} onChange={e => renameExtraCol(target, col.key, e.target.value)} title="Click to rename column" />
                    <span className="th-tools">
                      <select className="th-type" value={col.type} onChange={e => retypeExtraCol(target, col.key, e.target.value)} title="Column type">
                        <option value="text">abc</option>
                        <option value="number">123</option>
                      </select>
                      <button className="th-del" title="Remove column" onClick={() => removeExtraCol(target, col.key)}>✕</button>
                    </span>
                  </div>
                </th>
              ))}
              <th className="col-amount">Total</th>
              <th className="col-x">
                <button className="th-add" title="Add a column" onClick={() => addExtraCol(target)}>＋ col</button>
              </th>
            </tr>
          </thead>
          <tbody>
            {workers.map(w => (
              <tr key={w.id}>
                <td className="pin-1"><input type="text" value={w.name} onChange={e => updateWorker(target, w.id, 'name', e.target.value)} placeholder="Name" /></td>
                <td className="pin-2"><input type="number" value={w.rate || ''} onChange={e => updateWorker(target, w.id, 'rate', e.target.value)} placeholder="0" /></td>
                {w.hours.map((h, idx) => (
                  <td key={idx}><input className="hr-input" type="number" value={h || ''} onChange={e => updateHours(target, w.id, idx, e.target.value)} placeholder="·" /></td>
                ))}
                {extraCols.map(col => (
                  <td key={col.key}>
                    <input
                      type={col.type === 'number' ? 'number' : 'text'}
                      value={(w.extra || {})[col.key] == null ? '' : (w.extra || {})[col.key]}
                      onChange={e => updateWorkerExtraCell(target, w.id, col.key, e.target.value, col.type === 'number')}
                    />
                  </td>
                ))}
                <td className="balance">{fmt(workerTotal(w))}</td>
                <td><button className="btn-delete" onClick={() => removeWorker(target, w.id)}>✕</button></td>
              </tr>
            ))}
            {workers.length > 0 && (
              <tr className="totals-row">
                <td className="pin-1">Day totals (hrs)</td>
                <td className="pin-2"></td>
                {dayHourTotals.map((t, i) => <td key={i} className="daily">{t || ''}</td>)}
                {extraCols.map(col => <td key={col.key}></td>)}
                <td className="balance">{fmt(gridTotal(workers))}</td>
                <td></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="logo-section">
          <div className="logo-mark">$</div>
          <h1>CyberDollar</h1>
        </div>
        <nav className="nav-tabs">
          <button className={`nav-btn ${tab === 'overview' ? 'active' : ''}`} onClick={() => setTab('overview')}>Overview</button>
          <button className={`nav-btn ${tab === 'cash' ? 'active' : ''}`} onClick={() => setTab('cash')}>{tabName('cash', 'Cash')}</button>
          <button className={`nav-btn ${tab === 'owed' ? 'active' : ''}`} onClick={() => setTab('owed')}>{tabName('owed', 'Owed now')}</button>
          <button className={`nav-btn ${tab === 'incoming' ? 'active' : ''}`} onClick={() => setTab('incoming')}>{tabName('incoming', 'Incoming')}</button>
          <button className={`nav-btn ${tab === 'monthly' ? 'active' : ''}`} onClick={() => setTab('monthly')}>{tabName('monthly', 'Monthly')}</button>
          <button className={`nav-btn ${tab === 'payroll' ? 'active' : ''}`} onClick={() => setTab('payroll')}>{tabName('payroll', 'Payroll')}</button>
          <button className={`nav-btn ${tab === 'zero' ? 'active' : ''}`} onClick={() => setTab('zero')}>{tabName('zero', '0% cards')}</button>
          <button className={`nav-btn ${tab === 'china' ? 'active' : ''}`} onClick={() => setTab('china')}>{tabName('china', 'China order')}</button>
          <button className={`nav-btn ${tab === 'purchases' ? 'active' : ''}`} onClick={() => setTab('purchases')}>{tabName('purchases', 'Purchases')}</button>
          <button className={`nav-btn ${tab === 'goals' ? 'active' : ''}`} onClick={() => setTab('goals')}>{tabName('goals', 'Goals')}</button>
          <button className={`nav-btn ${tab === 'debts' ? 'active' : ''}`} onClick={() => setTab('debts')}>{tabName('debts', 'Big debts')}</button>
          <button className={`nav-btn ${tab === 'refi' ? 'active' : ''}`} onClick={() => setTab('refi')}>{tabName('refi', 'Refi allocation')}</button>
          <button className={`nav-btn ${tab === 'projection' ? 'active' : ''}`} onClick={() => setTab('projection')}>Projection</button>
          <button className={`nav-btn ${tab === 'savings' ? 'active' : ''}`} onClick={() => setTab('savings')}>{tabName('savings', 'Savings buckets')}</button>
          <button className={`nav-btn ${tab === 'quickbooks' ? 'active' : ''}`} onClick={() => setTab('quickbooks')}>QuickBooks</button>
          {(data.customTabs || []).map(t => (
            <button key={t.id} className={`nav-btn custom ${tab === `custom-${t.id}` ? 'active' : ''}`} onClick={() => setTab(`custom-${t.id}`)}>
              {t.name || 'Untitled'}
            </button>
          ))}
          <button className="nav-btn new-tab" onClick={addCustomTab}>+ New tab</button>
        </nav>
        <div className="sidebar-foot">
          {session ? (
            <>
              <div className={`sync-badge ${syncState === 'error' ? 'err' : ''}`}>
                {syncState === 'saving' ? 'Saving…' : syncState === 'error' ? 'Sync error' : 'Synced ✓'}
              </div>
              <div className="user-email">{session.user.email}</div>
              {showPwForm ? (
                <form onSubmit={savePassword} className="pw-form">
                  <input
                    type="password"
                    value={newPw}
                    onChange={e => setNewPw(e.target.value)}
                    placeholder="New password (8+ chars)"
                    autoComplete="new-password"
                  />
                  <button type="submit" className="btn-add small">Save password</button>
                  {pwMsg && <div className="pw-msg">{pwMsg}</div>}
                </form>
              ) : (
                <button className="auth-skip" onClick={() => setShowPwForm(true)}>Set password</button>
              )}
              <button className="auth-skip" onClick={signOut}>Sign out</button>
            </>
          ) : (
            <>
              <div className="sync-badge local">This device only</div>
              {supabase && <button className="auth-skip" onClick={() => setLocalOnly(false)}>Sign in to sync</button>}
            </>
          )}
        </div>
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
              <div className={`metric-card ${trueNet >= 0 ? 'success' : 'danger'}`}>
                <div className="metric-label">True net — everything counted</div>
                <div className="metric-value">{fmt(trueNet)}</div>
                <div className="metric-subtext">cash + AR − owed − 0% − debts − china</div>
              </div>
            </div>

            <div className="quick-summary">
              <h3>Coming up — next 30 days</h3>
              {upNext.length === 0 && <p className="history-line">Nothing scheduled in the next 30 days. Add due dates on Owed, expected dates on Incoming, or due days on Monthly to build your timeline.</p>}
              {upNext.map((e, i) => (
                <div key={i} className="upnext-row">
                  <span className={`upnext-day ${e.day <= 7 && e.sign !== 1 ? 'urgent' : ''}`}>{e.day === 0 ? 'today' : `+${e.day}d`}</span>
                  <span className="upnext-name">{e.name}</span>
                  <span className={`upnext-amt ${e.sign === 1 ? 'g-pos' : 'g-neg'}`}>{e.sign === 1 ? '+' : '−'}{fmt(e.amount)}</span>
                </div>
              ))}
              {upNext.length > 0 && (
                <p className="projection-note">
                  Scheduled net over 30 days: <strong>{fmt(upNext.reduce((s, e) => s + e.amount * (e.sign || -1), 0))}</strong> · full curve on the Projection tab
                </p>
              )}
            </div>

            <div className="quick-summary">
              <h3>Everything at a glance</h3>
              <table className="glance-table">
                <tbody>
                  <tr onClick={() => setTab('cash')}><td>Cash on hand{!cnt('cash') && <span className="day-offset"> (off)</span>}</td><td className="g-pos">{fmt(totalCash)}</td></tr>
                  <tr onClick={() => setTab('incoming')}><td>Incoming (AR){!cnt('incoming') && <span className="day-offset"> (off)</span>}</td><td className="g-pos">+{fmt(totalIncoming)}</td></tr>
                  <tr onClick={() => setTab('owed')}><td>Owed now{!cnt('owed') && <span className="day-offset"> (off)</span>}</td><td className="g-neg">−{fmt(totalOwed)}</td></tr>
                  <tr onClick={() => setTab('zero')}><td>0% card balances{!cnt('zero') && <span className="day-offset"> (off)</span>}</td><td className="g-neg">−{fmt(totalZero)}</td></tr>
                  <tr onClick={() => setTab('china')}><td>China order remaining{!cnt('china') && <span className="day-offset"> (off — own environment)</span>}</td><td className="g-neg">−{fmt(chinaRemaining)}</td></tr>
                  <tr onClick={() => setTab('debts')}><td>Big debts{!cnt('debts') && <span className="day-offset"> (off)</span>}</td><td className="g-neg">−{fmt(totalDebts)}</td></tr>
                  <tr onClick={() => setTab('monthly')}><td>Fixed monthly burn{!cnt('monthly') && <span className="day-offset"> (off)</span>}</td><td className="g-mid">{fmt(totalMonthly)}/mo · {fmt2(totalMonthly / 30)}/day</td></tr>
                  <tr onClick={() => setTab('payroll')}><td>Payroll (all jobs + standard)</td><td className="g-mid">{fmt(standardTotal + allJobsTotal)}</td></tr>
                  <tr className="g-total"><td>True net</td><td className={trueNet >= 0 ? 'g-pos' : 'g-neg'}>{fmt(trueNet)}</td></tr>
                </tbody>
              </table>
            </div>

            {(data.history || []).length > 0 && (
              <div className="quick-summary">
                <h3>Recent activity</h3>
                {(data.history || []).slice(0, 8).map(h => (
                  <p key={h.id} className="history-line">
                    {h.kind === 'deferred' ? (
                      <>
                        <span className="g-mid">⏰ deferred</span>
                        {' '}<strong>{h.name}</strong>: {h.from} → {h.to}
                      </>
                    ) : (
                      <>
                        <span className={h.kind === 'collected' ? 'g-pos' : 'g-neg'}>{h.kind === 'collected' ? '+' : '−'}{fmt(h.amount)}</span>
                        {' '}{h.kind === 'collected' ? 'collected from' : 'paid'} <strong>{h.name}</strong>
                      </>
                    )}
                    <span className="day-offset"> · {new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </p>
                ))}
              </div>
            )}

            <div className="quick-summary">
              <h3>Where you stand</h3>
              <p>You have <strong>{fmt(totalCash)}</strong> and owe <strong>{fmt(totalOwed)}</strong> right now, leaving <strong>{fmt(netNow)}</strong> net. With <strong>{fmt(totalIncoming)}</strong> incoming, your projected position is <strong>{fmt(projected)}</strong>.</p>
              <p>Fixed expenses run <strong>{fmt(totalMonthly)}/month</strong> ({fmt2(dailyBurn)}/day). 0% cards carry <strong>{fmt(totalZero)}</strong>. Long-term debt sits at <strong>{fmt(totalDebts)}</strong>.</p>
              {chinaTotal > 0 && cnt('china') && <p>China order: <strong>{fmt(chinaTotal)}</strong> total, <strong>{fmt(chinaTotal - chinaPaid)}</strong> still to pay.</p>}
              {chinaTotal > 0 && !cnt('china') && <p className="day-offset">China order sits in its own tab, kept out of this page on purpose — see China order.</p>}
              {purchasesPlanned > 0 && <p>Planned personal purchases: <strong>{fmt(purchasesPlanned)}</strong> — already factored into your projection dates.</p>}
            </div>

            <div className="quick-summary sheet-panel">
              <h3>Google Sheet sync</h3>
              <p className="sheet-help">Two-way sync with your spreadsheet. One-time setup: in your Google Sheet go to Extensions → Apps Script, paste the script from <strong>google-sheet-sync.gs</strong> (ask Claude for it), deploy as Web app (access: anyone), and paste the URL here.</p>
              <div className="sheet-controls">
                <input
                  type="text"
                  value={data.sheetWebhook || ''}
                  onChange={e => setData(d => ({ ...d, sheetWebhook: e.target.value }))}
                  placeholder="https://script.google.com/macros/s/…/exec"
                />
                <button className="btn-add small" onClick={sheetPush} disabled={sheetBusy}>{sheetBusy ? '…' : '⬆ Push to Sheet'}</button>
                <button className="btn-add small" onClick={sheetPull} disabled={sheetBusy}>{sheetBusy ? '…' : '⬇ Pull from Sheet'}</button>
              </div>
              {sheetMsg && <p className="sheet-msg">{sheetMsg}</p>}
              <div className="sheet-controls backup-row">
                <button className="btn-add small" onClick={downloadBackup}>⬇ Download backup</button>
                <label className="btn-add small file-btn">
                  ⬆ Restore backup
                  <input type="file" accept=".json" onChange={restoreBackup} hidden />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ============ CASH ============ */}
        {tab === 'cash' && (
          <div className="tab-content">
            <div className="tab-header">
              <input className="job-name title-input" value={tabName('cash', 'Cash')} onChange={e => setTabName('cash', e.target.value)} />
              <div className="job-header-actions">
                {countToggle('cash')}
                <button className="btn-add small" onClick={connectBank} disabled={bankBusy}>
                  {bankBusy ? 'Working…' : '🔗 Connect bank (Plaid)'}
                </button>
                {(data.plaidItems || []).length > 0 && (
                  <button className="btn-add small" onClick={() => refreshBalances()} disabled={bankBusy}>
                    {bankBusy ? 'Refreshing…' : '↻ Refresh balances'}
                  </button>
                )}
                <button className="btn-add" onClick={() => addToList('accounts', { name: '', balance: 0, notes: '' })}>+ Add account</button>
              </div>
            </div>
            {bankErr && <p className="auth-error">{bankErr}</p>}
            {data.bankLastSync && (
              <p className="subtitle">Bank balances last synced {new Date(data.bankLastSync).toLocaleString()} — linked accounts update automatically here, in Owed now, and Big debts</p>
            )}
            <EditableTable
              columns={getSchema('accounts')}
              rows={data.accounts}
              onCell={(id, key, v, num) => updateList('accounts', id, key, v, num)}
              onDelRow={(id) => removeFromList('accounts', id)}
              onSchemaChange={(cols) => setSchema('accounts', cols)}
              linkTargets={linkTargets}
              onJump={jumpTo}
              footerExtras={[`Total I have: ${fmt(totalCash)}`]}
            />
          </div>
        )}

        {/* ============ OWED NOW ============ */}
        {tab === 'owed' && (
          <div className="tab-content">
            <div className="tab-header">
              <input className="job-name title-input" value={tabName('owed', 'Owed now')} onChange={e => setTabName('owed', e.target.value)} />
              <div className="job-header-actions">
                {countToggle('owed')}
              </div>
            </div>
            <p className="subtitle">Everything currently due, sorted by who you owe — with urgency countdowns</p>

            <div className="chip-bar">
              <button className={`chip ${owedFilter === 'all' ? 'active' : ''}`} onClick={() => setOwedFilter('all')}>All</button>
              {OWED_GROUPS.map(([g, label]) => (
                <button key={g} className={`chip ${owedFilter === g ? 'active' : ''}`} onClick={() => setOwedFilter(g)}>{label}</button>
              ))}
            </div>

            <div className="projection-info">
              <div className="info-box">
                <div className="info-label">Total owed</div>
                <div className="info-value">{fmt(totalOwed)}</div>
              </div>
              <div className="info-box">
                <div className="info-label">Due next 7 days</div>
                <div className="info-value">{fmt(owedDueWithin(7))}</div>
              </div>
              <div className="info-box">
                <div className="info-label">Due next 30 days</div>
                <div className="info-value">{fmt(owedDueWithin(30))}</div>
              </div>
              {deferredCount > 0 && (
                <div className="info-box warning">
                  <div className="info-label">Deferred payments</div>
                  <div className="info-value">{deferredCount}</div>
                </div>
              )}
            </div>

            {OWED_GROUPS
              .filter(([g]) => owedFilter === 'all' || owedFilter === g)
              .map(([g, label]) => {
                const rows = data.cards.filter(c => (c.group || 'business') === g);
                return (
                  <div key={g} className="sub-section">
                    <div className="sub-section-header">
                      <h3 className="sub-title">{label} — {fmt(rows.reduce((s, c) => s + (c.amount || 0), 0))}</h3>
                      <button className="btn-add small" onClick={() => addToList('cards', { name: '', amount: 0, close: '', due: '', notes: '', group: g })}>+ Add to {label.toLowerCase()}</button>
                    </div>
                    <EditableTable
                      columns={getSchema('cards')}
                      rows={rows}
                      computed={[dueInComputed]}
                      onCell={(id, key, v, num) => updateList('cards', id, key, v, num)}
                      onDelRow={(id) => removeFromList('cards', id)}
                      onSchemaChange={(cols) => setSchema('cards', cols)}
                      linkTargets={linkTargets}
                      onJump={jumpTo}
                      rowActions={(row) => (
                        <>
                          {payButtons('cards', row, 'Fully paid — subtracts from cash', 'Partial payment — enter how much you paid')}
                          <button className="act-btn defer" title="Defer — push this due date out" onClick={() => deferPayment(row)}>⏰</button>
                          {g === 'credit card' && <button className="act-btn zero" title="Move to 0% cards tab" onClick={() => moveToZero(row)}>0%</button>}
                        </>
                      )}
                    />
                  </div>
                );
              })}
            <p className="projection-note">Cash − owed: <strong>{fmt(netNow)}</strong></p>
          </div>
        )}

        {/* ============ INCOMING ============ */}
        {tab === 'incoming' && (
          <div className="tab-content">
            <div className="tab-header">
              <input className="job-name title-input" value={tabName('incoming', 'Incoming')} onChange={e => setTabName('incoming', e.target.value)} />
              <div className="job-header-actions">
                {countToggle('incoming')}
                <button className="btn-add" onClick={() => addToList('incoming', { name: '', amount: 0, notes: '' })}>+ Add invoice</button>
              </div>
            </div>
            <p className="subtitle">Who owes you money. Set an expected date and it shows up as income in your Projection. ✓ = collected (adds to your first cash account).</p>
            <EditableTable
              columns={getSchema('incoming')}
              rows={data.incoming}
              computed={[{
                label: 'Margin',
                fn: (row) => fmt((row.amount || 0) - (row.cost || 0)),
                className: (row) => (row.amount || 0) - (row.cost || 0) >= 0 ? 'daily' : 'spent',
              }]}
              onCell={(id, key, v, num) => updateList('incoming', id, key, v, num)}
              onDelRow={(id) => removeFromList('incoming', id)}
              onSchemaChange={(cols) => setSchema('incoming', cols)}
              linkTargets={linkTargets}
              onJump={jumpTo}
              rowActions={(row) => payButtons('incoming', row, 'Fully received — adds to cash', 'Partial payment received — enter how much')}
              footerExtras={[`Total margin: ${fmt(data.incoming.reduce((s, i) => s + (i.amount || 0) - (i.cost || 0), 0))}`]}
            />
          </div>
        )}

        {/* ============ MONTHLY ============ */}
        {tab === 'monthly' && (
          <div className="tab-content">
            <div className="tab-header">
              <input className="job-name title-input" value={tabName('monthly', 'Monthly')} onChange={e => setTabName('monthly', e.target.value)} />
              <div className="job-header-actions">
                {countToggle('monthly')}
              </div>
            </div>

            <div className="chip-bar">
              <button className={`chip ${monthlyFilter === 'all' ? 'active' : ''}`} onClick={() => setMonthlyFilter('all')}>All</button>
              <button className={`chip ${monthlyFilter === 'business' ? 'active' : ''}`} onClick={() => setMonthlyFilter('business')}>Business only</button>
              <button className={`chip ${monthlyFilter === 'personal' ? 'active' : ''}`} onClick={() => setMonthlyFilter('personal')}>Personal only</button>
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

            {[['business', 'Business', bizMonthly], ['personal', 'Personal', persMonthly]]
              .filter(([type]) => monthlyFilter === 'all' || monthlyFilter === type)
              .map(([type, label, rows]) => (
              <div key={type} className="sub-section">
                <div className="sub-section-header">
                  <h3 className="sub-title">{label} — {fmt(rows.reduce((s, e) => s + (e.amount || 0), 0))}/mo</h3>
                  <button className="btn-add small" onClick={() => addToList('monthly', { name: '', amount: 0, dueDay: 1, type })}>+ Add {label.toLowerCase()} expense</button>
                </div>
                <EditableTable
                  columns={getSchema('monthly')}
                  rows={rows}
                  computed={[{ label: 'Daily avg', fn: (row) => fmt2((row.amount || 0) / 30) }]}
                  onCell={(id, key, v, num) => updateList('monthly', id, key, v, num)}
                  onDelRow={(id) => removeFromList('monthly', id)}
                  onSchemaChange={(cols) => setSchema('monthly', cols)}
                  linkTargets={linkTargets}
                  onJump={jumpTo}
                  rowActions={(row) => payButtons('monthly', row, 'Paid this month — subtracts from cash, bill stays for next month', 'Partial payment — enter how much')}
                  footerExtras={[`Due per day: ${fmt2(rows.reduce((s, e) => s + (e.amount || 0), 0) / 30)}`]}
                />
              </div>
            ))}
          </div>
        )}

        {/* ============ PAYROLL ============ */}
        {tab === 'payroll' && (
          <div className="tab-content">
            <div className="tab-header">
              <input className="job-name title-input" value={tabName('payroll', 'Payroll')} onChange={e => setTabName('payroll', e.target.value)} />
              <button className="btn-add" onClick={addJob}>+ Add job</button>
            </div>

            <div className="chip-bar">
              <button className={`chip ${payrollView === 'overall' ? 'active' : ''}`} onClick={() => setPayrollView('overall')}>Overall</button>
              <button className={`chip ${payrollView === 'standard' ? 'active' : ''}`} onClick={() => setPayrollView('standard')}>Standard crew</button>
              {data.jobs.map(j => (
                <button key={j.id} className={`chip ${payrollView === j.id ? 'active' : ''}`} onClick={() => setPayrollView(j.id)}>{j.name || 'Job'}</button>
              ))}
            </div>

            {payrollView === 'overall' && (
              <>
                <p className="subtitle">Every worker across standard crew + all jobs</p>
                <div className="projection-info">
                  <div className="info-box">
                    <div className="info-label">Standard crew</div>
                    <div className="info-value">{fmt(standardTotal)}</div>
                  </div>
                  <div className="info-box">
                    <div className="info-label">All jobs (labor + extras)</div>
                    <div className="info-value">{fmt(allJobsTotal)}</div>
                  </div>
                  <div className="info-box">
                    <div className="info-label">Grand total</div>
                    <div className="info-value">{fmt(standardTotal + allJobsTotal)}</div>
                  </div>
                </div>
                <div className="spreadsheet payroll-scroll">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Worker</th>
                        <th className="col-amount">Standard</th>
                        {data.jobs.map(j => <th key={j.id} className="col-amount">{j.name || 'Job'}</th>)}
                        <th className="col-amount">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {overallRows().map(r => (
                        <tr key={r.name}>
                          <td>{r.name}</td>
                          <td className="daily">{r.std ? fmt(r.std) : '—'}</td>
                          {r.per.map((v, i) => <td key={i} className="daily">{v ? fmt(v) : '—'}</td>)}
                          <td className="balance">{fmt(r.total)}</td>
                        </tr>
                      ))}
                      <tr className="totals-row">
                        <td>Extras (food, materials…)</td>
                        <td className="daily">—</td>
                        {data.jobs.map(j => <td key={j.id} className="daily">{jobExtras(j) ? fmt(jobExtras(j)) : '—'}</td>)}
                        <td className="balance">{fmt(data.jobs.reduce((s, j) => s + jobExtras(j), 0))}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {payrollView === 'standard' && (
              <>
                <div className="job-header">
                  <h3 className="sub-title" style={{ margin: 0 }}>Standard payroll — regular days, not tied to one job</h3>
                  <button className="btn-add small" onClick={() => addWorker('standard')}>+ Worker</button>
                </div>
                {renderWorkerGrid('standard', (data.standardPayroll || { workers: [] }).workers)}
                <div className="table-footer job-footer">
                  <strong>Standard total: {fmt(standardTotal)}</strong>
                </div>
              </>
            )}

            {typeof payrollView === 'number' && (() => {
              const job = data.jobs.find(j => j.id === payrollView);
              if (!job) return null;
              return (
                <div className="job-block">
                  <div className="job-header">
                    <input className="job-name" type="text" value={job.name} onChange={e => updateJobName(job.id, e.target.value)} placeholder="Job name" />
                    <div className="job-header-actions">
                      <button className="btn-add small" onClick={() => addWorker(job.id)}>+ Worker</button>
                      <button className="btn-add small" onClick={() => addExtra(job.id)}>+ Extra</button>
                      <button className="btn-delete" onClick={() => removeJob(job.id)}>✕ Delete job</button>
                    </div>
                  </div>

                  {renderWorkerGrid(job.id, job.workers)}

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
              );
            })()}
          </div>
        )}

        {/* ============ 0% CARDS ============ */}
        {tab === 'zero' && (
          <div className="tab-content">
            <div className="tab-header">
              <input className="job-name title-input" value={tabName('zero', '0% cards')} onChange={e => setTabName('zero', e.target.value)} />
              <div className="job-header-actions">
                {countToggle('zero')}
                <button className="btn-add" onClick={() => addToList('zeroCards', { name: '', balance: 0, limit: 0, promoEnd: '', notes: '' })}>+ Add card</button>
              </div>
            </div>
            <p className="subtitle">No interest for now — watch the promo end dates</p>
            <EditableTable
              columns={getSchema('zeroCards')}
              rows={data.zeroCards || []}
              computed={[{
                label: 'Used',
                fn: (row) => row.limit > 0 ? Math.round((row.balance / row.limit) * 100) + '%' : '—',
                className: (row) => row.limit > 0 && (row.balance / row.limit) > 0.9 ? 'spent' : 'utilization',
              }]}
              onCell={(id, key, v, num) => updateList('zeroCards', id, key, v, num)}
              onDelRow={(id) => removeFromList('zeroCards', id)}
              onSchemaChange={(cols) => setSchema('zeroCards', cols)}
              linkTargets={linkTargets}
              onJump={jumpTo}
              rowActions={(row) => (
                <>
                  {payButtons('zeroCards', row, 'Pay off fully — subtracts from cash', 'Pay down — enter amount')}
                  <button className="act-btn zero" title="Move to Owed now tab" onClick={() => moveToOwed(row)}>→O</button>
                </>
              )}
            />
          </div>
        )}

        {/* ============ CHINA ORDER ============ */}
        {tab === 'china' && (
          <div className="tab-content">
            <div className="tab-header">
              <input className="job-name title-input" value={tabName('china', 'China order')} onChange={e => setTabName('china', e.target.value)} />
              <div className="job-header-actions">
                {countToggle('china')}
                {chinaView === 'shipments' && (
                  <button className="btn-add" onClick={() => addToList('chinaOrder', { name: '', amount: 0, paid: 0, status: 'quoted', notes: '' })}>+ Add item</button>
                )}
                {chinaView === 'funding' && (
                  <button className="btn-add" onClick={() => addToList('chinaFunding', { card: '', amount: 0, date: '', notes: '' })}>+ Add allocation</button>
                )}
              </div>
            </div>
            <p className="subtitle">
              This is its own environment{!cnt('china') && ' — off by default'}, funded by specific cards rather than folded into your main cash picture. Flip "counted" on if you'd rather have it hit your Overview and Projection directly.
            </p>

            <div className="chip-bar">
              <button className={`chip ${chinaView === 'shipments' ? 'active' : ''}`} onClick={() => setChinaView('shipments')}>Shipments</button>
              <button className={`chip ${chinaView === 'funding' ? 'active' : ''}`} onClick={() => setChinaView('funding')}>Card funding</button>
            </div>

            {chinaView === 'shipments' && (
              <EditableTable
                columns={getSchema('chinaOrder')}
                rows={data.chinaOrder || []}
                computed={[{
                  label: 'Remaining',
                  fn: (row) => fmt((row.amount || 0) - (row.paid || 0)),
                  className: (row) => (row.amount || 0) - (row.paid || 0) > 0 ? 'spent' : 'daily',
                }]}
                onCell={(id, key, v, num) => updateList('chinaOrder', id, key, v, num)}
                onDelRow={(id) => removeFromList('chinaOrder', id)}
                onSchemaChange={(cols) => setSchema('chinaOrder', cols)}
                linkTargets={linkTargets}
                onJump={jumpTo}
                rowActions={(row) => payButtons('chinaOrder', row, 'Pay remaining — subtracts from cash', 'Deposit / partial payment — enter amount')}
                footerExtras={[`Still owed: ${fmt(chinaTotal - chinaPaid)}`]}
              />
            )}

            {chinaView === 'funding' && (
              <>
                <p className="subtitle">Point specific card balances at this order — e.g. "$6,200 of Wells Fargo Signify is China spend." That money is already sitting in Owed/0% cards, so it isn't double-counted here.</p>
                <div className="projection-info">
                  <div className="info-box">
                    <div className="info-label">Order remaining</div>
                    <div className="info-value">{fmt(chinaTotal - chinaPaid)}</div>
                  </div>
                  <div className="info-box">
                    <div className="info-label">Funded from cards</div>
                    <div className="info-value">{fmt(chinaFunded)}</div>
                  </div>
                  <div className={`info-box ${chinaFunded >= (chinaTotal - chinaPaid) ? '' : 'warning'}`}>
                    <div className="info-label">Unfunded gap</div>
                    <div className="info-value">{fmt(Math.max(0, (chinaTotal - chinaPaid) - chinaFunded))}</div>
                  </div>
                </div>
                <EditableTable
                  columns={getSchema('chinaFunding')}
                  rows={data.chinaFunding || []}
                  onCell={(id, key, v, num) => updateList('chinaFunding', id, key, v, num)}
                  onDelRow={(id) => removeFromList('chinaFunding', id)}
                  onSchemaChange={(cols) => setSchema('chinaFunding', cols)}
                  linkTargets={linkTargets}
                  onJump={jumpTo}
                />
              </>
            )}
          </div>
        )}

        {/* ============ PERSONAL PURCHASES ============ */}
        {tab === 'purchases' && (
          <div className="tab-content">
            <div className="tab-header">
              <input className="job-name title-input" value={tabName('purchases', 'Purchases')} onChange={e => setTabName('purchases', e.target.value)} />
              <div className="job-header-actions">
                {countToggle('purchases')}
                <button className="btn-add" onClick={() => addToList('personalPurchases', { name: '', amount: 0, date: '', status: 'planned', notes: '' })}>+ Add purchase</button>
              </div>
            </div>
            <p className="subtitle">Planned purchases hit your Projection on their date — mark bought when done</p>

            <div className="quick-summary afford-box">
              <h3>Can I afford it?</h3>
              <div className="sheet-controls">
                <input
                  type="number"
                  value={affordAmt}
                  onChange={e => setAffordAmt(e.target.value)}
                  placeholder="Type a price… e.g. 45000"
                />
              </div>
              {(parseFloat(affordAmt) || 0) > 0 && (() => {
                const amt = parseFloat(affordAmt) || 0;
                const afterCash = totalCash - amt;
                const afterNet = netNow - amt;
                const afterRunway = dailyBurn > 0 ? Math.floor(afterNet / dailyBurn) : Infinity;
                const verdict = afterNet > totalMonthly * 2 ? 'good' : afterNet > 0 ? 'tight' : 'no';
                return (
                  <div className="afford-result">
                    <p>
                      {verdict === 'good' && <span className="g-pos">✓ You can afford this comfortably.</span>}
                      {verdict === 'tight' && <span className="g-mid">⚠ Doable, but tight — less than 2 months of buffer left.</span>}
                      {verdict === 'no' && <span className="g-neg">✕ This puts you underwater after paying what you owe.</span>}
                    </p>
                    <p>Cash after: <strong>{fmt(afterCash)}</strong> · Net after owed: <strong>{fmt(afterNet)}</strong> · Runway: <strong>{afterRunway === Infinity ? '∞' : afterRunway} days</strong></p>
                    <p className="day-offset">If all AR collects first: net would be {fmt(afterNet + totalIncoming)}</p>
                  </div>
                );
              })()}
            </div>

            <div className="projection-info">
              <div className="info-box">
                <div className="info-label">Planned (upcoming)</div>
                <div className="info-value">{fmt(purchasesPlanned)}</div>
              </div>
              <div className="info-box">
                <div className="info-label">Bought (tracked)</div>
                <div className="info-value">{fmt(purchasesBought)}</div>
              </div>
              <div className="info-box">
                <div className="info-label">Cash after planned</div>
                <div className="info-value">{fmt(netNow - purchasesPlanned)}</div>
              </div>
            </div>

            <EditableTable
              columns={getSchema('personalPurchases')}
              rows={data.personalPurchases || []}
              onCell={(id, key, v, num) => updateList('personalPurchases', id, key, v, num)}
              onDelRow={(id) => removeFromList('personalPurchases', id)}
              onSchemaChange={(cols) => setSchema('personalPurchases', cols)}
              linkTargets={linkTargets}
              onJump={jumpTo}
              rowActions={(row) => payButtons('personalPurchases', row, 'Bought it — subtracts from cash, marks bought', 'Deposit / partial — enter amount')}
              footerExtras={[`Planned: ${fmt(purchasesPlanned)}`, `Bought: ${fmt(purchasesBought)}`]}
            />
          </div>
        )}

        {/* ============ GOALS ============ */}
        {tab === 'goals' && (
          <div className="tab-content">
            <div className="tab-header">
              <input className="job-name title-input" value={tabName('goals', 'Goals')} onChange={e => setTabName('goals', e.target.value)} />
              <button className="btn-add" onClick={() => addToList('goals', { name: '', target: 0, saved: 0, date: '', notes: '' })}>+ Add goal</button>
            </div>
            <p className="subtitle">Just goals — nothing here counts toward your totals or projection, ever</p>
            <EditableTable
              columns={getSchema('goals')}
              rows={data.goals || []}
              computed={[{
                label: 'Progress',
                fn: (row) => row.target > 0 ? Math.min(100, Math.round(((row.saved || 0) / row.target) * 100)) + '%' : '—',
                className: (row) => row.target > 0 && (row.saved || 0) >= row.target ? 'daily' : 'utilization',
              }]}
              onCell={(id, key, v, num) => updateList('goals', id, key, v, num)}
              onDelRow={(id) => removeFromList('goals', id)}
              onSchemaChange={(cols) => setSchema('goals', cols)}
              linkTargets={linkTargets}
              onJump={jumpTo}
            />
          </div>
        )}

        {/* ============ BIG DEBTS ============ */}
        {tab === 'debts' && (
          <div className="tab-content">
            <div className="tab-header">
              <input className="job-name title-input" value={tabName('debts', 'Big debts')} onChange={e => setTabName('debts', e.target.value)} />
              <div className="job-header-actions">
                {countToggle('debts')}
                <button className="btn-add" onClick={() => addToList('debts', { name: '', amount: 0, limit: 0, notes: '' })}>+ Add debt</button>
              </div>
            </div>
            <p className="subtitle">Long-term: family, travel, mortgage — 0% cards have their own tab now. "Next payment" is informational only — the full balance never counts as due on that date.</p>
            <EditableTable
              columns={getSchema('debts')}
              rows={data.debts}
              computed={[
                {
                  label: 'Used',
                  fn: (row) => row.limit > 0 ? Math.round((row.amount / row.limit) * 100) + '%' : '—',
                  className: (row) => row.limit > 0 && (row.amount / row.limit) > 0.9 ? 'spent' : 'utilization',
                },
                {
                  label: 'Due in',
                  fn: (row) => {
                    const days = daysUntilDue(row.due);
                    return days == null ? '—' : (days <= 0 ? 'TODAY' : days + 'd');
                  },
                  className: (row) => {
                    const days = daysUntilDue(row.due);
                    return days == null ? 'utilization' : days <= 14 ? 'g-neg' : days <= 45 ? 'spent' : 'daily';
                  },
                },
              ]}
              onCell={(id, key, v, num) => updateList('debts', id, key, v, num)}
              onDelRow={(id) => removeFromList('debts', id)}
              onSchemaChange={(cols) => setSchema('debts', cols)}
              linkTargets={linkTargets}
              onJump={jumpTo}
              rowActions={(row) => payButtons('debts', row, 'Pay off fully — subtracts from cash', 'Pay down — enter amount')}
            />
          </div>
        )}

        {/* ============ REFI ALLOCATION ============ */}
        {tab === 'refi' && (
          <div className="tab-content">
            <div className="tab-header">
              <input className="job-name title-input" value={tabName('refi', 'Refi allocation')} onChange={e => setTabName('refi', e.target.value)} />
              <button className="btn-add" onClick={() => addToList('refiAllocations', { name: '', amount: 0, notes: '' })}>+ Add allocation</button>
            </div>
            <p className="subtitle">Planning tool for the mortgage refinance — its own environment, never counted in your totals or projection until money actually lands.</p>

            <div className="quick-summary">
              <h3>Expected proceeds</h3>
              <div className="sheet-controls">
                <input
                  type="number"
                  value={data.refiProceeds || ''}
                  onChange={e => setData(d => ({ ...d, refiProceeds: parseFloat(e.target.value) || 0 }))}
                  placeholder="How much are you getting?"
                />
              </div>
            </div>

            {(() => {
              const allocated = (data.refiAllocations || []).reduce((s, r) => s + (r.amount || 0), 0);
              const left = (data.refiProceeds || 0) - allocated;
              return (
                <div className="projection-info">
                  <div className="info-box">
                    <div className="info-label">Refi proceeds</div>
                    <div className="info-value">{fmt(data.refiProceeds || 0)}</div>
                  </div>
                  <div className="info-box">
                    <div className="info-label">Allocated</div>
                    <div className="info-value">{fmt(allocated)}</div>
                  </div>
                  <div className={`info-box ${left < 0 ? 'warning' : ''}`}>
                    <div className="info-label">{left < 0 ? 'Over-allocated by' : 'Unallocated'}</div>
                    <div className="info-value">{fmt(Math.abs(left))}</div>
                  </div>
                </div>
              );
            })()}

            <EditableTable
              columns={getSchema('refiAllocations')}
              rows={data.refiAllocations || []}
              onCell={(id, key, v, num) => updateList('refiAllocations', id, key, v, num)}
              onDelRow={(id) => removeFromList('refiAllocations', id)}
              onSchemaChange={(cols) => setSchema('refiAllocations', cols)}
              linkTargets={linkTargets}
              onJump={jumpTo}
            />
          </div>
        )}

        {/* ============ PROJECTION ============ */}
        {tab === 'projection' && (
          <div className="tab-content">
            <h2>Cash projection</h2>
            <p className="subtitle">Daily burn ({fmt2(dailyBurn)}/day) plus card dues and planned purchases hitting on their dates</p>

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
              {savingsTotal > 0 && (
                <div className="info-box">
                  <div className="info-label">Earmarked in buckets</div>
                  <div className="info-value">{fmt(savingsTotal)}</div>
                </div>
              )}
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
                          ? row.events.map((e, i) => (
                            <span key={i} className={`event-tag ${e.sign === 1 ? 'income' : ''}`}>
                              {e.name} {e.sign === 1 ? '+' : '−'}{fmt(e.amount)}
                            </span>
                          ))
                          : <span className="event-none">burn only</span>}
                      </td>
                      <td className={row.cash >= 0 ? 'balance' : 'spent'}>{fmt(row.cash)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="projection-note">Incoming AR only counts here when it has an expected date set (Incoming tab). AR without a date ({fmt(data.incoming.filter(i => !i.expected).reduce((s, i) => s + (i.amount || 0), 0))}) is upside not shown.</p>
            </div>
          </div>
        )}

        {/* ============ SAVINGS BUCKETS ============ */}
        {tab === 'savings' && (
          <div className="tab-content">
            <div className="tab-header">
              <input className="job-name title-input" value={tabName('savings', 'Savings buckets')} onChange={e => setTabName('savings', e.target.value)} />
              <button className="btn-add" onClick={() => addToList('savingsBuckets', { name: '', amount: 0, target: 0, date: '', notes: '' })}>+ Add bucket</button>
            </div>
            <p className="subtitle">Money you're earmarking — its own environment, never counted as owed and never in your totals or projection. Type "25%" in Set aside to take a percentage of target.</p>
            <EditableTable
              columns={getSchema('savingsBuckets')}
              rows={data.savingsBuckets || []}
              computed={[{
                label: 'Progress',
                fn: (row) => row.target > 0 ? Math.min(100, Math.round(((row.amount || 0) / row.target) * 100)) + '%' : '—',
                className: (row) => row.target > 0 && (row.amount || 0) >= row.target ? 'daily' : 'utilization',
              }]}
              onCell={(id, key, v, num) => updateList('savingsBuckets', id, key, v, num)}
              onDelRow={(id) => removeFromList('savingsBuckets', id)}
              onSchemaChange={(cols) => setSchema('savingsBuckets', cols)}
              linkTargets={linkTargets}
              onJump={jumpTo}
            />
          </div>
        )}

        {/* ============ QUICKBOOKS ============ */}
        {tab === 'quickbooks' && (
          <div className="tab-content">
            <div className="tab-header">
              <h2>QuickBooks</h2>
              {data.quickbooks && (
                <div className="job-header-actions">
                  <select value={qbPeriod} onChange={e => setQbPeriod(e.target.value)} className="qb-period">
                    <option value="this_month">This month</option>
                    <option value="last_month">Last month</option>
                    <option value="this_quarter">This quarter</option>
                    <option value="ytd">Year to date</option>
                    <option value="last_year">Last year</option>
                  </select>
                  <button className="btn-add small" onClick={loadQbReports} disabled={qbBusy}>
                    {qbBusy ? 'Loading…' : '⟳ Load reports'}
                  </button>
                  <button className="auth-skip" onClick={disconnectQb}>Disconnect</button>
                </div>
              )}
            </div>

            {!data.quickbooks && (
              <div className="quick-summary">
                <h3>Connect your QuickBooks</h3>
                <p className="auth-text">One-time authorization — then your P&L and Balance Sheet render right here, live from QuickBooks.</p>
                <button className="btn-add" onClick={() => { window.location.href = '/api/quickbooks/auth'; }}>Connect QuickBooks</button>
              </div>
            )}

            {qbMsg && <p className="sheet-msg">{qbMsg}</p>}

            {data.quickbooks && !qbReports && !qbBusy && (
              <p className="subtitle">Pick a period and hit “Load reports”.</p>
            )}

            {qbReports && ['pnl', 'bs'].map(key => {
              const rep = qbReports[key];
              if (!rep) return null;
              return (
                <div key={key} className="quick-summary qb-report">
                  <h3>{rep.title}</h3>
                  <p className="subtitle">{rep.period}</p>
                  {rep.rows.map((r, i) => (
                    <div key={i} className={`qb-row ${r.kind}`} style={{ paddingLeft: 8 + r.depth * 18 }}>
                      <span className="qb-label">{r.label}</span>
                      {r.amount != null && (
                        <span className={`qb-amt ${r.amount < 0 ? 'g-neg' : ''}`}>{fmt2(r.amount)}</span>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}

        {/* ============ CUSTOM TABS ============ */}
        {activeCustom && (
          <div className="tab-content">
            <div className="tab-header">
              <input className="job-name" type="text" value={activeCustom.name} onChange={e => updateCustomTab(activeCustom.id, e.target.value)} placeholder="Tab name" />
              <div className="job-header-actions">
                <button className="btn-add" onClick={() => addCustomRow(activeCustom.id)}>+ Add row</button>
                <button className="btn-delete" onClick={() => removeCustomTab(activeCustom.id)}>✕ Delete tab</button>
              </div>
            </div>
            <EditableTable
              columns={activeCustom.columns || CUSTOM_TAB_COLUMNS}
              rows={activeCustom.rows}
              onCell={(rowId, key, v, num) => updateCustomRow(activeCustom.id, rowId, key, v, num)}
              onDelRow={(rowId) => removeCustomRow(activeCustom.id, rowId)}
              onSchemaChange={(cols) => setData(d => ({
                ...d,
                customTabs: (d.customTabs || []).map(t => t.id === activeCustom.id ? { ...t, columns: cols } : t),
              }))}
              linkTargets={linkTargets}
              onJump={jumpTo}
            />
          </div>
        )}
      </main>

      {pendingBank.length > 0 && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>New accounts found</h2>
            </div>
            <p className="auth-text">Tell me what each one is and I'll file it in the right spot — business and personal accounts go to Cash / Owed / Debts, unrelated ones get ignored forever.</p>
            {pendingBank.map(a => (
              <div key={a.id} className="classify-row">
                <div className="classify-info">
                  <strong>{a.institution || 'Bank'} — {a.name}{a.mask ? ' ··' + a.mask : ''}</strong>
                  <span>{a.type}{a.subtype ? ' · ' + a.subtype : ''} · {fmt(Math.abs(a.current != null ? a.current : (a.available || 0)))}</span>
                </div>
                <div className="classify-btns">
                  <button className="btn-add small" onClick={() => classifyBank(a, 'business')}>🪟 Window Wizards</button>
                  <button className="btn-add small" onClick={() => classifyBank(a, 'personal')}>👤 Personal</button>
                  {a.type === 'credit' && (
                    <button className="btn-add small" onClick={() => classifyBank(a, 'zero')}>0️⃣ 0% card</button>
                  )}
                  <button className="auth-skip" onClick={() => classifyBank(a, 'skip')}>Unrelated — skip</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
