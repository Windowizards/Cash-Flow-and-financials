export const runtime = 'nodejs';

const HOSTS = {
  sandbox: 'https://sandbox.plaid.com',
  production: 'https://production.plaid.com',
};

export async function POST() {
  const client_id = process.env.PLAID_CLIENT_ID;
  const secret = process.env.PLAID_SECRET;
  if (!client_id || !secret) {
    return Response.json({ error: 'Plaid not configured yet — add PLAID_CLIENT_ID and PLAID_SECRET' }, { status: 400 });
  }
  const host = HOSTS[process.env.PLAID_ENV || 'sandbox'] || HOSTS.sandbox;
  try {
    const r = await fetch(host + '/link/token/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id,
        secret,
        client_name: 'CyberDollar',
        language: 'en',
        country_codes: ['US'],
        user: { client_user_id: 'cyberdollar-user' },
        products: ['transactions'],
      }),
    });
    const j = await r.json();
    if (!r.ok) return Response.json({ error: j.error_message || 'link token failed' }, { status: 502 });
    return Response.json({ link_token: j.link_token });
  } catch (e) {
    return Response.json({ error: 'connection failed', detail: String(e) }, { status: 502 });
  }
}
