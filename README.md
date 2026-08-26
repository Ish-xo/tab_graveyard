# ☠ TAB GRAVEYARD

> **"Your browser has too many tabs. We know."**  
> Paste your tabs. We'll find the ones ready to die.

**Tab Graveyard** is a gorgeous, privacy-first, 100% client-side web application designed to analyze, categorize, and clean up your browser tabs. It runs entirely inside your browser sandbox—no backend, no database, and no server leaks.

---

## ✨ Features

- **💡 Privacy-First Engine**: All parsing, duplicate detection, and tab score processing are run locally in the browser sandbox. No data leaves your machine.
- **⚡ Advanced Normalization**: Auto-strips tracking parameters (`utm_*`, `gclid`, `ref`, etc.) to match duplicates cleanly.
- **🗂️ Domain Clustering & Categorization**: Groups tabs into standard categories (Dev, Research, Shopping, Media, etc.).
- **📊 Death Score Metrics**: Multi-factor calculations flag dead (stale), duplicate, or redundant tabs ready to be "buried."
- **🎨 Modern Glassmorphic Dark UI**: Retro-terminal theme with responsive grids, particle crumbling animations, and micro-interactions.
- **📱 Responsive Layout**: Seamless scaling across mobile, tablet, and desktop viewports, with dynamic UI layout substitutions for smaller screens.
- **🔒 Tamper Protection**: Automated integrity verification safeguarding creator attributions and donation links.

---

## 🚀 Live Demo

Check out the live deployment here:  
👉 **[tabgraveyard.vercel.app](https://tabgraveyard.vercel.app)** *(or your custom configured domain)*

---

## 🛠️ Technology Stack

- **HTML5**: Semantic layout.
- **Vanilla CSS**: Clean, custom responsive design with neon variables, animations, and typography scaling.
- **Vanilla JS (ES6)**: Parsing engine, score scoring, duplicate resolution, animations, and security system.

---

## 💻 Local Setup & Development

To run Tab Graveyard locally:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Ish-xo/tab_graveyard.git
   cd tab_graveyard
   ```

2. **Serve it locally**:
   - **Using Node (npx)**:
     ```bash
     npx serve
     ```
   - **Using Python**:
     ```bash
     python -m http.server 8000
     ```

3. Open your browser and navigate to the address shown in the terminal (usually `http://localhost:3000` or `http://localhost:8000`).

---

## 📦 Deployment

This project is ready to be hosted instantly on **Vercel** or **GitHub Pages**:

### Deploy to Vercel via Terminal:
```bash
npx vercel --prod
```

---

## ☕ Support

If this tool helped clear your browser RAM, consider supporting my work!  
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/danielpark12)
