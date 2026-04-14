# Chess Tournament Manager (Desktop)

A high-performance, native desktop application for managing chess tournaments. This version is built with **Tauri v2** and **Rust**, providing a lightweight alternative to Electron with built-in API proxying for Lichess and Chess.com.

## 🚀 Features

- **Native Performance:** Small binary size and low memory usage.
- **Cross-Platform:** Support for Linux (AppImage/Deb), Windows (MSI/Exe), and macOS (DMG).
- **Direct API Integration:** Uses a Rust-based backend to bypass CORS, allowing seamless player imports from Lichess and Chess.com.
- **Keyboard Optimized:** Full support for `Ctrl+Z` (Undo), `Ctrl+Y` (Redo), and `Ctrl+S` (Export).

---

## 🛠️ Development Setup

### Prerequisites
1. **Rust:** Install via [rustup.rs](https://rustup.rs/).
2. **Node.js:** (LTS recommended).
3. **Linux Dependencies (Arch):**
   ```bash
   sudo pacman -S --needed base-devel curl wget file openssl appmenu-gtk-module gtk3 libappindicator-gtk3 librsvg libxdo webkit2gtk-4.1 fuse2