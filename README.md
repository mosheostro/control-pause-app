# Control Pause App — Deployment Guide

A wellness web application for measuring the Buteyko Control Pause breath-hold test and tracking health progress over time.

---

## Option 1: Deploy to Vercel (Recommended — Free)

### Step 1 — Create a free account
Go to https://vercel.com and sign up (free account is enough).

### Step 2 — Install Vercel CLI (optional, or use the website)
```
npm install -g vercel
```

### Step 3a — Deploy via Website (easiest)
1. Go to https://vercel.com/new
2. Click **"Import Git Repository"** — or use **"Upload"** option
3. Drag and drop this entire project folder (or ZIP file)
4. Vercel will auto-detect Vite settings
5. Click **Deploy**
6. Your app will be live at: `https://your-project-name.vercel.app`

### Step 3b — Deploy via CLI
```bash
cd control-pause
npm install
vercel
```
Follow the prompts. Your app will be deployed in ~1 minute.

---

## Option 2: Deploy to Netlify (Also Free)

1. Go to https://netlify.com and create a free account
2. Click **"Add new site" → "Deploy manually"**
3. Run locally first:
   ```bash
   npm install
   npm run build
   ```
4. Drag and drop the `dist/` folder onto the Netlify deploy area
5. Done — your app is live instantly

---

## Option 3: Run Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173 in your browser
```

---

## Project Structure

```
control-pause/
├── index.html          # HTML entry point
├── package.json        # Dependencies and scripts
├── vite.config.js      # Build configuration
├── vercel.json         # Vercel deployment config
└── src/
    ├── main.jsx        # React root
    └── App.jsx         # Full application (all features)
```

---

## Features

- ⏱ Control Pause timer with countdown and breath-hold measurement
- 👥 Multi-user system — track multiple people
- 📊 Health zone chart with colored progress visualization
- 📋 Results table with per-row delete
- ➕ Manual result entry
- 🌍 3 languages: English, Russian, Hebrew (RTL)
- 💾 All data saved in browser localStorage
- 📱 Mobile responsive

---

## Notes

- No backend or database needed — all data is stored in the user's browser (localStorage)
- Each user's browser stores their own data independently
- The app works offline after first load
