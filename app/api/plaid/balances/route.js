export const runtime = 'nodejs';

const HOSTS = {
  sandbox: 'https://sandbox.plaid.com',
  production: 'https://production.plaid.com',
};

export async function POST(req) {
  const client_id = process.env.PLAID_CLIENT_ID;
  const secret = process.env.PLAID_SECRET;
  if (!client_id || !secret) {
    return Response.json({ error: 'Plaid not configured' }, { status: 400 });
  }
  let token;
  try {
    ({ token } = await req.json());
  } catch (e) {
    return Response.json({ error: 'bad request' }, { status: 400 });
  }
  if (!token) return Response.json({ error: 'missing token' }, { status: 400 });

  const host = HOSTS[process.env.PLAID_ENV || 'sandbox'] || HOSTS.sandbox;
  try {
    const r = await fetch(host + '/accounts/balance/get', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id, secret, access_token: token }),
    });
    const j = await r.json();
    if (!r.ok) return Response.json({ error: j.error_message || 'balance fetch failed' }, { status: 502 });
    const out = (j.accounts || []).map(a => ({
      id: a.account_id,
      name: a.name || a.official_name || 'Account',
      mask: a.mask,
      type: a.type,
      subtype: a.subtype,
      available: a.balances && a.balances.available,
      current: a.balances && a.balances.current,
      limit: a.balances && a.balances.limit,
    }));
    return Response.json(out);
  } catch (e) {
    return Response.json({ error: 'connection failed', detail: String(e) }, { status: 502 });
  }
}
