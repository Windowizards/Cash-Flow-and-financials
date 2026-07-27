export const runtime = 'nodejs';

const ALLOWED = /^https:\/\/script\.google(?:usercontent)?\.com\//;

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch (e) {
    return Response.json({ error: 'bad request' }, { status: 400 });
  }
  const { url, action, payload } = body || {};
  if (!url || !ALLOWED.test(url)) {
    return Response.json({ error: 'URL must be a script.google.com web app URL' }, { status: 400 });
  }

  try {
    if (action === 'push') {
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload || {}),
        redirect: 'follow',
      });
      const text = await r.text();
      let ok = r.ok;
      try {
        ok = ok && JSON.parse(text).ok === true;
      } catch (e) { /* non-JSON response from script */ }
      return Response.json({ ok, resp: text.slice(0, 300) }, { status: ok ? 200 : 502 });
    }

    const r = await fetch(url, { redirect: 'follow' });
    const text = await r.text();
    try {
      return Response.json({ ok: true, data: JSON.parse(text) });
    } catch (e) {
      return Response.json({ error: 'Sheet script did not return JSON', resp: text.slice(0, 300) }, { status: 502 });
    }
  } catch (e) {
    return Response.json({ error: 'connection failed', detail: String(e) }, { status: 502 });
  }
}
