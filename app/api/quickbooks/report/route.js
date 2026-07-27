export const runtime = 'nodejs';

function flattenRows(rows, depth = 0, out = []) {
  (rows || []).forEach(r => {
    if (r.type === 'Section' || r.Rows) {
      const label = r.Header && r.Header.ColData && r.Header.ColData[0] && r.Header.ColData[0].value;
      if (label) out.push({ label, depth, kind: 'section', amount: null });
      flattenRows(r.Rows && r.Rows.Row, depth + 1, out);
      if (r.Summary && r.Summary.ColData) {
        const s = r.Summary.ColData;
        const amt = parseFloat((s[s.length - 1] || {}).value);
        out.push({ label: (s[0] && s[0].value) || 'Total', amount: isNaN(amt) ? null : amt, depth, kind: 'total' });
      }
    } else if (r.ColData) {
      const c = r.ColData;
      const amt = parseFloat((c[c.length - 1] || {}).value);
      out.push({ label: c[0] && c[0].value, amount: isNaN(amt) ? null : amt, depth, kind: 'data' });
    }
  });
  return out;
}

export async function POST(req) {
  const id = process.env.QB_CLIENT_ID;
  const secret = process.env.QB_CLIENT_SECRET;
  if (!id || !secret) return Response.json({ error: 'QuickBooks not configured' }, { status: 400 });

  let body;
  try {
    body = await req.json();
  } catch (e) {
    return Response.json({ error: 'bad request' }, { status: 400 });
  }
  const { refreshToken, realmId, type, start, end } = body || {};
  if (!refreshToken || !realmId) return Response.json({ error: 'not connected' }, { status: 400 });

  const basic = Buffer.from(`${id}:${secret}`).toString('base64');
  try {
    const tr = await fetch('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + basic,
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refreshToken }),
    });
    const tj = await tr.json();
    if (!tr.ok || !tj.access_token) {
      return Response.json({ error: 'QuickBooks session expired — hit Connect again' }, { status: 401 });
    }

    const reportName = type === 'bs' ? 'BalanceSheet' : 'ProfitAndLoss';
    const params = new URLSearchParams({ start_date: start, end_date: end, minorversion: '73' });
    const rr = await fetch(`https://quickbooks.api.intuit.com/v3/company/${realmId}/reports/${reportName}?${params}`, {
      headers: { Authorization: 'Bearer ' + tj.access_token, Accept: 'application/json' },
    });
    const rj = await rr.json();
    if (!rr.ok) {
      const msg = rj.Fault && rj.Fault.Error && rj.Fault.Error[0] && rj.Fault.Error[0].Message;
      return Response.json({ error: msg || 'report fetch failed' }, { status: 502 });
    }

    const header = rj.Header || {};
    return Response.json({
      report: {
        title: header.ReportName === 'BalanceSheet' ? 'Balance sheet' : 'Profit & loss',
        period: `${header.StartPeriod || start} → ${header.EndPeriod || end}`,
        currency: header.Currency || 'USD',
        rows: flattenRows(rj.Rows && rj.Rows.Row),
      },
      refreshToken: tj.refresh_token || refreshToken,
    });
  } catch (e) {
    return Response.json({ error: 'connection failed', detail: String(e) }, { status: 502 });
  }
}
