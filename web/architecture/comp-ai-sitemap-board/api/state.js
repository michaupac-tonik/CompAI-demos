// Vercel Serverless Function: shared sitemap board state stored as JSON in a GitHub repository.
// GET  /api/state  → { state }
// POST /api/state  → body = { type: 'set', page, field: scope|status|stage|phase|name|sub, value } → { state }
//
// Environment variables (Vercel → Project → Settings → Environment Variables):
//   GITHUB_TOKEN   fine-grained token with Contents: Read and write, limited to the data repo
//   GITHUB_REPO    e.g. "michaupac-tonik/compai-sitemap-data"
//   GITHUB_BRANCH  optional, default "main"
//   GITHUB_PATH    optional, default "sitemap-state.json"
// The token never reaches the browser.

const SCOPE = ['scope', 'no-scope', 'estimate'];
const STATUS = ['todo', 'wip', 'review', 'hold', 'ready'];
const STAGE = ['', 'wireframe', 'design', 'development'];
const PHASE = ['', '1', '2'];   // client tranche   // '' = no stage selected
const TEXT_MAX = { name: 60, sub: 80 };
const PAGE_ID = /^[a-z0-9][a-z0-9-]{0,63}$/;

const env = (k, d) => process.env[k] || d;
const GH = 'https://api.github.com';

function gh(path, init = {}) {
  return fetch(GH + path, {
    ...init,
    headers: {
      Authorization: `Bearer ${env('GITHUB_TOKEN')}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'compai-sitemap-board',
      ...(init.headers || {}),
    },
  });
}

async function readState() {
  const repo = env('GITHUB_REPO'), branch = env('GITHUB_BRANCH', 'main'), file = env('GITHUB_PATH', 'sitemap-state.json');
  const r = await gh(`/repos/${repo}/contents/${encodeURIComponent(file)}?ref=${encodeURIComponent(branch)}`);
  if (r.status === 404) return { state: { version: 1, pages: {} }, sha: null };
  if (!r.ok) throw new Error(`GitHub read ${r.status}`);
  const j = await r.json();
  return { state: JSON.parse(Buffer.from(j.content, 'base64').toString('utf8')), sha: j.sha };
}

async function writeState(state, sha, message) {
  const repo = env('GITHUB_REPO'), branch = env('GITHUB_BRANCH', 'main'), file = env('GITHUB_PATH', 'sitemap-state.json');
  const body = {
    message, branch,
    content: Buffer.from(JSON.stringify(state, null, 2) + '\n').toString('base64'),
    ...(sha ? { sha } : {}),
  };
  const r = await gh(`/repos/${repo}/contents/${encodeURIComponent(file)}`, { method: 'PUT', body: JSON.stringify(body) });
  if (r.status === 409 || r.status === 422) return false;      // someone saved in the meantime → retry
  if (!r.ok) throw new Error(`GitHub write ${r.status}`);
  return true;
}

function validate(op) {
  if (!op || typeof op !== 'object') return 'Missing operation';
  if (!PAGE_ID.test(op.page || '')) return 'Invalid page';
  if (op.type !== 'set') return 'Unknown operation';
  if (op.field in TEXT_MAX) {
    if (typeof op.value !== 'string') return 'Invalid value';
    op.value = op.value.replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, TEXT_MAX[op.field]);
    if (op.field === 'name' && !op.value) return 'Title cannot be empty';
    return null;
  }
  const allowed = { scope: SCOPE, status: STATUS, stage: STAGE, phase: PHASE }[op.field];
  if (!allowed || !allowed.includes(op.value)) return 'Invalid value';
  return null;
}

// Same logic as applyOp in index.html
function applyOp(st, op) {
  st.pages = st.pages || {};
  const p = st.pages[op.page] = st.pages[op.page] || {};
  p[op.field] = op.value;
  p.updatedAt = new Date().toISOString();
  return st;
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex');
  try {
    if (!process.env.GITHUB_TOKEN || !process.env.GITHUB_REPO) {
      return res.status(503).json({ error: 'Missing GITHUB_TOKEN / GITHUB_REPO configuration' });
    }
    if (req.method === 'GET') {
      const { state } = await readState();
      return res.status(200).json({ state });
    }
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const op = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const err = validate(op);
    if (err) return res.status(400).json({ error: err });

    for (let attempt = 0; attempt < 4; attempt++) {
      const { state, sha } = await readState();
      applyOp(state, op);
      const msg = `sitemap: ${op.page}: ${op.field} → ${op.value}`;
      if (await writeState(state, sha, msg)) return res.status(200).json({ state });
      await new Promise(r => setTimeout(r, 150 + Math.random() * 250));
    }
    return res.status(409).json({ error: 'Save conflict, please try again' });
  } catch (e) {
    return res.status(e.status || 500).json({ error: e.message || 'Server error' });
  }
};
