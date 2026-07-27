export const runtime = 'nodejs';

export async function GET(req) {
  const u = new URL(req.url);
  const code = u.searchParams.get('code');
  const realmId = u.searchParams.get('realmId');
  const host = req.headers.get('host') || '';
  const proto = host.includes('localhost') ? 'http' : 'https';
  const home = `${proto}://${host}/dashboard`;
  if (!code || !realmId) return Response.redirect(home + '#qberr=cancelled', 302);

  const basic = Buffer.from(`${process.env.QB_CLIENT_ID}:${process.env.QB_CLIENT_SECRET}`).toString('base64');
  try {
    const r = await fetch('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + basic,
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${proto}://${host}/api/quickbooks/callback`,
      }),
    });
    const j = await r.json();
    if (!r.ok || !j.refresh_token) return Response.redirect(home + '#qberr=token', 302);
    const payload = Buffer.from(JSON.stringify({ refresh_token: j.refresh_token, realmId })).toString('base64');
    return Response.redirect(home + '#qb=' + encodeURIComponent(payload), 302);
  } catch (e) {
    return Response.redirect(home + '#qberr=connect', 302);
  }
}
