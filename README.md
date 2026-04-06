# MS-CIT Manager

A modern React-based Class Management System for MS-CIT training institutes.

## 🚀 Quick Start

### Development
```bash
npm install
npm run dev
```
Opens at: `http://localhost:8080`

### Production Build
```bash
npm run build
cd dist && python -m http.server 3000
```
Opens at: `http://localhost:3000`

## 📋 Demo Credentials

- **Admin:** admin@mscit.com / admin123
- **Student:** aarav@gmail.com / student123

## ⚠️ Important: Don't Open HTML Files Directly

**❌ Wrong:** Double-clicking `index.html` or `dist/index.html` → White screen
**✅ Right:** Always use a local server (Python/Node.js)

### Why?
Modern browsers block JavaScript modules when opening HTML files directly due to security policies. Always use:
- `python -m http.server 3000` (from dist folder)
- `npm run serve` (Node.js server)
- `npm run dev` (development server)

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run serve` - Serve built app with Node.js
- `npm run preview` - Preview built app

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── lib/           # Utilities and data
└── hooks/         # Custom React hooks

dist/              # Built production files
```

## 🚀 Deployment

See `DEPLOYMENT.md` for deployment options (Vercel, Netlify, GitHub Pages, etc.)
