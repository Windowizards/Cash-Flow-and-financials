export const runtime = 'nodejs';

export async function GET(req) {
  const id = process.env.QB_CLIENT_ID;
  if (!id) return new Response('QuickBooks not configured — add QB_CLIENT_ID and QB_CLIENT_SECRET', { status: 400 });
  const host = req.headers.get('host') || '';
  const proto = host.includes('localhost') ? 'http' : 'https';
  const redirect = `${proto}://${host}/api/quickbooks/callback`;
  const url = 'https://appcenter.intuit.com/connect/oauth2'
    + '?client_id=' + encodeURIComponent(id)
    + '&response_type=code'
    + '&scope=' + encodeURIComponent('com.intuit.quickbooks.accounting')
    + '&redirect_uri=' + encodeURIComponent(redirect)
    + '&state=cyberdollar';
  return Response.redirect(url, 302);
}
