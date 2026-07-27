import https from 'https';

export const runtime = 'nodejs';

function tellerFetch(path, token) {
  const cert = process.env.TELLER_CERT_B64 ? Buffer.from(process.env.TELLER_CERT_B64, 'base64') : undefined;
  const key = process.env.TELLER_KEY_B64 ? Buffer.from(process.env.TELLER_KEY_B64, 'base64') : undefined;
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.teller.io',
      path,
      method: 'GET',
      auth: `${token}:`,
      cert,
      key,
      headers: { Accept: 'application/json' },
    }, res => {
      let body = '';
      res.on('data', c => { body += c; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, json: JSON.parse(body || 'null') });
        } catch (e) {
          resolve({ status: res.statusCode, json: null });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

export async function POST(req) {
  let token;
  try {
    ({ token } = await req.json());
  } catch (e) {
    return Response.json({ error: 'bad request' }, { status: 400 });
  }
  if (!token) return Response.json({ error: 'missing token' }, { status: 400 });

  try {
    const accounts = await tellerFetch('/accounts', token);
    if (accounts.status !== 200 || !Array.isArray(accounts.json)) {
      return Response.json({ error: 'teller error', detail: accounts.json }, { status: 502 });
    }

    const out = [];
    for (const a of accounts.json) {
      const bal = await tellerFetch(`/accounts/${a.id}/balances`, token);
      out.push({
        id: a.id,
        name: a.name,
        institution: a.institution && a.institution.name,
        type: a.type,
        subtype: a.subtype,
        last_four: a.last_four,
        ledger: bal.json && bal.json.ledger != null ? parseFloat(bal.json.ledger) : null,
        available: bal.json && bal.json.available != null ? parseFloat(bal.json.available) : null,
      });
    }
    return Response.json(out);
  } catch (e) {
    return Response.json({ error: 'connection failed', detail: String(e) }, { status: 502 });
  }
}
