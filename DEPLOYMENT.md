# Deployment Guide - MS-CIT Manager

This guide covers how to build and deploy your React/Vite application to various hosting platforms.

## Local Development & Testing

### Run Development Server
```bash
npm run dev
```
- Opens at `http://localhost:8080`
- Features hot reload and source maps
- Use this for local development

### Build for Production
```bash
npm run build
```
- Optimizes and minifies code
- Creates `dist/` folder with production build
- Reduces bundle size by ~90%

### Preview Production Build
```bash
npm npm audit fix --forcerun preview
```
- Tests production build locally
- Opens at `http://localhost:4173`
- Verify everything before deploying

## Deployment Options

### Option 1: Vercel (Recommended - Free & Fast)

1. **Sign up** at [vercel.com](https://vercel.com)
2. **Connect your Git repository** (GitHub/GitLab/Bitbucket)
3. **Vercel auto-detects Vite settings** from `vercel.json`
4. **Deploy** - automatically deploys on every push to main branch

```bash
# Manual deployment (install Vercel CLI first)
npm i -g vercel
vercel
```

### Option 2: Netlify (Free & Easy)

1. **Sign up** at [netlify.com](https://netlify.com)
2. **Connect Git repository** or drag & drop `dist/` folder
3. **Build settings** auto-configured from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. **Deploy** - takes ~2 minutes

```bash
# Manual deployment (install Netlify CLI)
npm install -g netlify-cli
netlify deploy --prod
```

### Option 3: GitHub Pages (Free)

1. Update `vite.config.ts` base path:
```typescript
export default defineConfig({
  base: '/your-repo-name/',  // Change this
  // ... rest of config
});
```

2. Add to `package.json`:
```json
"deploy": "npm run build && gh-pages -d dist"
```

3. Deploy:
```bash
npm run deploy
```

### Option 4: Docker (Advanced)

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

### Option 5: Traditional Hosting (Cpanel, etc.)

1. Run `npm run build`
2. Upload `dist/` folder contents to your hosting
3. Set index.html as default document
4. Enable 404 → index.html redirect (for SPA routing)

## Environment Variables

1. Copy `.env.example` to `.env.local`
2. Update values for your environment
3. Vercel/Netlify: Set variables in dashboard
4. Variables prefixed with `VITE_` are exposed to client

## Performance & Security

- ✅ Minified & optimized bundles (~200KB gzipped)
- ✅ Code splitting for faster loads
- ✅ All data stored in browser (localStorage)
- ✅ No backend required for MVP
- ⚠️ Add authentication backend for production
- ⚠️ Validate data before using in forms

## Next Steps

1. **Choose a platform** above
2. **Run `npm run build`** and test locally with `npm run preview`
3. **Push to Git** and connect to hosting
4. **Monitor performance** in hosting dashboard

## Troubleshooting Deployment

**Blank page after deploy?**
- Clear browser cache
- Check browser console (F12) for errors
- Verify `base` path in `vite.config.ts`

**404 errors on page reload?**
- Enable SPA routing (see netlify.toml for example)
- Redirect all requests to index.html

**Build fails?**  
- Check Node.js version (use 18+)
- Run `npm run build` locally to see errors
- Check build logs in hosting dashboard

**Styles not loading?**
- Clear cache
- Verify Tailwind CSS compiled correctly
- Check import paths in CSS files

