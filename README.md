# Chess Tournament Manager

A full-featured chess tournament manager with **working** Lichess and Chess.com player import.

## Why a server?

Lichess and Chess.com block direct browser requests from local files due to CORS policy. This project runs a tiny local Node.js proxy server (no npm install needed — uses only built-in Node.js modules) that forwards the API calls server-side where CORS doesn't apply.

---

## Quick Start

**Requirements:** Node.js (v14 or later). Check with: `node --version`

```bash
# 1. Open a terminal in this folder, then:
node server.js

# 2. Open your browser to:
http://localhost:3000
```

That's it. The app loads in your browser and all imports work.

To stop the server: press `Ctrl+C` in the terminal.

---

## Files

```
chess-tournament/
├── server.js     — local proxy server (Node.js, no dependencies)
├── index.html    — the full tournament manager app
└── README.md     — this file
```

---

## Using Player Import

### Lichess
1. Click **🌐 Import from Lichess / Chess.com** (in the player setup step, or from the Players tab during a tournament).
2. The **Lichess** tab is selected by default.
3. Type a username or real name — results appear as you type (500ms debounce).
4. Click **+ Add** next to any result to add that player with their ratings automatically filled in.

### Chess.com
1. Open the import dialog and click the **♞ Chess.com** tab.
2. Enter the player's **exact Chess.com username** (case-insensitive).
3. Click **Lookup** — the player's profile and ratings (Rapid, Blitz, Bullet, Daily) will appear.
4. Click **+ Add** to add them.

### Manual Entry (with optional USCF ID)
Use the manual add row at the top of the Players step:
- **Name**, **Rating**, **Fed.** fields as before.
- **USCF ID** field (optional) — stores the player's USCF member number for reference.
  You can look up their current rating at: https://www.uschess.org/msa/MbrDtlMain.php?MEMBERID

You can also edit a player's USCF ID at any time via the **✎ Edit** button on the Players tab.

---

## Ratings shown on import

| Platform   | Rating used for tournament | Also shown      |
|------------|---------------------------|-----------------|
| Lichess    | Classical → Rapid → Blitz → Bullet (first available) | All time controls |
| Chess.com  | Rapid → Blitz → Bullet → Daily (first available)     | All time controls |

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Z` / `Cmd+Z` | Undo |
| `Ctrl+Y` / `Cmd+Shift+Z` | Redo |
| `Ctrl+S` / `Cmd+S` | Export tournament JSON |
| `Esc` | Close modal |
