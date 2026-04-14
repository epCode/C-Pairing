# ♟️ Chess Tournament Manager

A fast, offline-first desktop application for managing chess tournaments. Built with vanilla web technologies and powered by **Tauri**, this tool allows arbiters and organizers to easily pair rounds, calculate tiebreaks, and import player data directly from popular chess platforms.

## ✨ Features

* **Multiple Pairing Systems:** Supports Swiss, Round Robin, Double Round Robin, Scheveningen, and Single Elimination (Knockout) formats.
* **Automated Tiebreaks:** Built-in calculators for Buchholz, Buchholz Cut 1, Sonneborn-Berger, Direct Encounter, Number of Wins, and more.
* **Platform Integrations:** Fetch player profiles and current ratings directly from **Lichess** and **Chess.com** via built-in API proxies.
* **Robust State Management:** Auto-saves to local storage, features full Undo/Redo history for round management, and allows you to Export/Import entire tournaments as JSON files.
* **Intuitive UI:** A clean, responsive, dark-themed interface built with vanilla HTML/CSS/JS—no heavy frontend frameworks required.

## 🛠️ Tech Stack

* **Frontend:** Vanilla HTML, CSS, and JavaScript.
* **Backend / Window Management:** [Tauri v2](https://v2.tauri.app/) (Rust).
* **Package Management:** Node.js / npm.

---

## 🚀 Getting Started

### Prerequisites

To build and run this project, you will need to set up the Tauri environment. Ensure you have the following installed on your system:

1.  **Node.js & npm:** [Download Node.js](https://nodejs.org/) (v16+ recommended).
2.  **Rust:** Install via [rustup](https://rustup.rs/).
3.  **OS-Specific Build Tools:**
    * **Windows:** Visual Studio C++ Build Tools.
    * **macOS:** Xcode Command Line Tools (`xcode-select --install`).
    * **Linux:** WebKit2GTK and base build essentials (e.g., `sudo apt install libwebkit2gtk-4.1-dev build-essential curl wget file libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev`).

*Note: For detailed environment setup, refer to the [Tauri Prerequisites Guide](https://v2.tauri.app/start/prerequisites/).*

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/yourusername/chess-tournament-manager.git](https://github.com/yourusername/chess-tournament-manager.git)
    cd chess-tournament-manager
    ```

2.  **Install Node dependencies:**
    This will install the Tauri CLI and other required packages.
    ```bash
    npm install
    ```

### How to Build and Run

**Development Mode:**
To run the application in development mode with hot-reloading (if configured) and debugging tools enabled:
```bash
npx tauri dev
```

**Production Build:**
To compile a standalone, optimized executable for your operating system:

```bash
npx tauri build
```
Once the build is complete, you can find your compiled application executable inside the src-tauri/target/release/bundle/ directory.

### Project Structure
`index.html`: The core frontend application (UI, logic, and styling).

`tauri.conf.json`: Configuration file for the Tauri application (window settings, bundle info, permissions).

`build.rs`: Rust build script required by Tauri.

`package.json / package-lock.json`: Node dependencies and project metadata.