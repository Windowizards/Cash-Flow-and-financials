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
  let public_token;
  try {
    ({ public_token } = await req.json());
  } catch (e) {
    return Response.json({ error: 'bad request' }, { status: 400 });
  }
  if (!public_token) return Response.json({ error: 'missing public_token' }, { status: 400 });

  const host = HOSTS[process.env.PLAID_ENV || 'sandbox'] || HOSTS.sandbox;
  try {
    const r = await fetch(host + '/item/public_token/exchange', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id, secret, public_token }),
    });
    const j = await r.json();
    if (!r.ok) return Response.json({ error: j.error_message || 'exchange failed' }, { status: 502 });
    return Response.json({ access_token: j.access_token, item_id: j.item_id });
  } catch (e) {
    return Response.json({ error: 'connection failed', detail: String(e) }, { status: 502 });
  }
}
