/**
 * Chess Tournament Manager — Local Proxy Server
 * Uses only Node.js built-in modules (no npm install required).
 * Run: node server.js
 * Then open: http://localhost:3000
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;

// ─── Tiny HTTPS fetch helper ──────────────────────────────────────────────────
function httpsGet(reqUrl, options = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(reqUrl);
    const reqOptions = {
      hostname: parsed.hostname,
      path: parsed.pathname + (parsed.search || ''),
      method: options.method || 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'ChessTournamentManager/1.0 (local proxy)',
        ...(options.headers || {})
      }
    };

    const req = https.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, body: data, headers: res.headers });
      });
    });

    req.on('error', reject);

    if (options.body) req.write(options.body);
    req.end();
  });
}

// ─── Route handlers ───────────────────────────────────────────────────────────

async function handleLichessSearch(query, res) {
  const term = query.term || '';
  if (!term || term.length < 2) {
    return jsonResponse(res, 400, { error: 'Search term too short' });
  }

  try {
    // 1. Try autocomplete
    const acUrl = `https://lichess.org/api/player/autocomplete?term=${encodeURIComponent(term)}&object=1`;
    const acResult = await httpsGet(acUrl);
    let usernames = [];

    if (acResult.status === 200) {
      try {
        const acData = JSON.parse(acResult.body);
        usernames = (acData.result || []).slice(0, 8).map(u => u.name || u.id).filter(Boolean);
      } catch (_) {}
    }

    if (!usernames.length) {
      // 2. Fall back to direct user lookup
      const directUrl = `https://lichess.org/api/user/${encodeURIComponent(term.toLowerCase())}`;
      const directResult = await httpsGet(directUrl);
      if (directResult.status === 200) {
        const user = JSON.parse(directResult.body);
        return jsonResponse(res, 200, { users: [user] });
      } else {
        return jsonResponse(res, 200, { users: [] });
      }
    }

    // 3. Bulk fetch full profiles
    const bulkResult = await httpsGet('https://lichess.org/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain', 'Accept': 'application/json' },
      body: usernames.join(',')
    });

    if (bulkResult.status === 200) {
      const users = JSON.parse(bulkResult.body);
      return jsonResponse(res, 200, { users });
    } else {
      // Return basic stubs from autocomplete
      const stubs = usernames.map(u => ({ id: u, username: u }));
      return jsonResponse(res, 200, { users: stubs });
    }
  } catch (e) {
    return jsonResponse(res, 500, { error: e.message });
  }
}

async function handleLichessUser(username, res) {
  try {
    const result = await httpsGet(`https://lichess.org/api/user/${encodeURIComponent(username.toLowerCase())}`);
    if (result.status === 200) {
      return jsonResponse(res, 200, JSON.parse(result.body));
    }
    return jsonResponse(res, result.status, { error: 'User not found' });
  } catch (e) {
    return jsonResponse(res, 500, { error: e.message });
  }
}

async function handleChessComPlayer(username, res) {
  try {
    const slug = encodeURIComponent(username.toLowerCase());
    const [profileResult, statsResult] = await Promise.all([
      httpsGet(`https://api.chess.com/pub/player/${slug}`),
      httpsGet(`https://api.chess.com/pub/player/${slug}/stats`)
    ]);

    if (profileResult.status !== 200) {
      return jsonResponse(res, 404, { error: `Player "${username}" not found on Chess.com` });
    }

    const profile = JSON.parse(profileResult.body);
    const stats = statsResult.status === 200 ? JSON.parse(statsResult.body) : {};

    return jsonResponse(res, 200, { profile, stats });
  } catch (e) {
    return jsonResponse(res, 500, { error: e.message });
  }
}

// ─── HTTP helpers ─────────────────────────────────────────────────────────────

function jsonResponse(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(body);
}

function serveFile(res, filePath, contentType) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

// ─── Main server ──────────────────────────────────────────────────────────────

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  const pathname = parsed.pathname;
  const query = parsed.query;

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  // API routes
  if (pathname === '/api/lichess/search') {
    return handleLichessSearch(query, res);
  }

  if (pathname.startsWith('/api/lichess/user/')) {
    const username = pathname.replace('/api/lichess/user/', '');
    return handleLichessUser(username, res);
  }

  if (pathname.startsWith('/api/chesscom/player/')) {
    const username = pathname.replace('/api/chesscom/player/', '');
    return handleChessComPlayer(username, res);
  }

  // Serve static files
  if (pathname === '/' || pathname === '/index.html') {
    return serveFile(res, path.join(__dirname, 'index.html'), 'text/html');
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`\n♟  Chess Tournament Manager`);
  console.log(`   Server running at: http://localhost:${PORT}`);
  console.log(`   Open this URL in your browser.\n`);
});
