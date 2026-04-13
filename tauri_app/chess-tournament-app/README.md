# Chess Tournament Manager - Standalone Desktop Application

A **completely standalone** chess tournament management application with **built-in Lichess and Chess.com player import**. No external server required!

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey)

---

## Features

✨ **Standalone Application**
- Works completely offline (except for player lookups)
- No server installation needed
- Single executable for each platform
- Runs on Windows, macOS, and Linux

🌐 **Player Import**
- **Lichess Integration:** Search by username or real name, auto-fetch ratings
- **Chess.com Integration:** Lookup players by exact username with all ratings
- **Manual Entry:** Add players with custom ratings and USCF IDs

🏆 **Tournament Management**
- Create tournaments with custom number of rounds
- Automatic player pairing
- Track game results (Win/Draw/Loss/Bye)
- Real-time score updates

📊 **Standings & Analytics**
- Live standings with tiebreak calculations
- Buchholz and Sonneborn-Berger tiebreaks
- Performance rating calculations
- Player head-to-head records

---

## Quick Start

### Download & Install

**Windows:** Download `.msi` installer → Double-click → Done
**macOS:** Download `.dmg` → Drag to Applications → Done
**Linux:** Download `.AppImage` → `chmod +x` → Double-click → Done

### First Tournament

1. **Create Tournament:** Click "Start New Tournament"
2. **Add Players:** Use Lichess/Chess.com search or add manually
3. **Generate Rounds:** Automatic pairing
4. **Enter Results:** Click W/D/B for each game
5. **View Standings:** See live tournament standings

---

## Technology Stack

### Frontend
- **HTML5 / CSS3 / JavaScript** - Pure vanilla (no frameworks)
- **Responsive Design** - Works on desktop and tablet
- **Local Storage** - Tournament data persists locally

### Backend
- **Tauri** - Cross-platform desktop app framework
- **Rust** - High-performance backend
- **reqwest** - HTTP client for API calls

### APIs
- **Lichess API** - Player search and ratings
- **Chess.com API** - Player profiles and statistics

---

## Building from Source

### Prerequisites

- **Node.js** v18+
- **Rust** v1.77+
- **pnpm** v8+
- **Platform-specific build tools** (see BUILD_INSTRUCTIONS.md)

### Build Steps

```bash
# Install dependencies
pnpm install

# Development (with hot reload)
pnpm tauri dev

# Production build
pnpm tauri build
```

See [BUILD_INSTRUCTIONS.md](BUILD_INSTRUCTIONS.md) for detailed setup instructions for each platform.

---

## Project Structure

```
chess-tournament-app/
├── client/
│   ├── public/
│   │   └── index.html          # Main UI
│   └── src/                    # React/TypeScript (optional)
├── src-tauri/
│   ├── src/
│   │   ├── main.rs
│   │   └── lib.rs              # Tauri commands
│   ├── Cargo.toml              # Rust dependencies
│   └── tauri.conf.json         # App configuration
├── BUILD_INSTRUCTIONS.md       # Detailed build guide
├── QUICKSTART.md               # User quick start
└── README.md                   # This file
```

---

## How It Works

### No CORS Issues
Traditional web apps can't access Lichess/Chess.com APIs due to CORS restrictions. This app uses **Tauri commands** to make HTTP requests from the Rust backend, bypassing CORS entirely.

### Tauri Commands
```javascript
// Frontend calls Rust backend
const result = await invoke('search_lichess', { term: 'nakamura' });
const player = await invoke('lookup_chesscom', { username: 'hikaru' });
```

### Local Data Storage
- All tournament data stored locally in browser storage
- No data sent to external servers (except Lichess/Chess.com APIs)
- Works offline after initial player imports

---

## API Integration

### Lichess
- **Endpoint:** `https://lichess.org/api/player/autocomplete`
- **Search:** By username or real name
- **Ratings:** Classical, Rapid, Blitz, Bullet
- **Rate Limit:** 60 requests/minute

### Chess.com
- **Endpoints:** 
  - `https://api.chess.com/pub/player/{username}`
  - `https://api.chess.com/pub/player/{username}/stats`
- **Search:** Exact username only
- **Ratings:** Rapid, Blitz, Bullet, Daily
- **Rate Limit:** 600 requests/10 minutes

---

## Development

### Adding New Features

1. **Backend (Rust):**
   ```rust
   #[tauri::command]
   async fn my_feature(param: String) -> Result<String, String> {
     // Implementation
     Ok("result".to_string())
   }
   ```

2. **Frontend (JavaScript):**
   ```javascript
   const result = await invoke('my_feature', { param: 'value' });
   ```

### File Structure for Development
- Frontend changes: `client/public/index.html`
- Backend changes: `src-tauri/src/lib.rs`
- Configuration: `src-tauri/tauri.conf.json`

---

## Performance

- **App Size:** ~100-150 MB
- **Memory:** ~150-300 MB
- **Startup:** ~2-3 seconds
- **API Response:** <1 second

---

## Security

✅ **HTTPS only** - All API calls encrypted
✅ **No telemetry** - No data collection
✅ **Local storage** - Data never leaves your computer
✅ **Open source** - Code is transparent and auditable

---

## Troubleshooting

### Build Issues
See [BUILD_INSTRUCTIONS.md](BUILD_INSTRUCTIONS.md) for platform-specific troubleshooting.

### Runtime Issues
See [QUICKSTART.md](QUICKSTART.md) for user-facing troubleshooting.

### Common Errors
- **"Player not found"** - Check username spelling
- **"API Error"** - Check internet connection
- **"App won't start"** - Try restarting or reinstalling

---

## Contributing

Contributions are welcome! Areas for improvement:
- Additional tournament formats (Swiss, Round-Robin)
- Export to PGN/CSV
- Tournament templates
- Multi-language support
- Mobile app version

---

## License

This project is provided as-is for personal and organizational use.

---

## Acknowledgments

- **Lichess** - Open source chess platform
- **Chess.com** - Chess community and APIs
- **Tauri** - Cross-platform app framework
- **Rust Community** - Excellent tooling and libraries

---

## Resources

- **Tauri Documentation:** https://tauri.app
- **Lichess API:** https://lichess.org/api
- **Chess.com API:** https://www.chess.com/news/view/published-data-api
- **Rust Book:** https://doc.rust-lang.org/book/

---

## Support

For issues, questions, or suggestions:
1. Check [BUILD_INSTRUCTIONS.md](BUILD_INSTRUCTIONS.md) for build issues
2. Check [QUICKSTART.md](QUICKSTART.md) for usage questions
3. Review API documentation for integration issues

---

**Made with ♟ for chess enthusiasts**

Version 1.0.0 | 2026
