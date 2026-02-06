# GitHub Pages Deployment Guide

## Overview

This guide covers deploying the Money Manager frontend to GitHub Pages and troubleshooting common issues.

## Quick Deployment

```bash
npm run deploy
```

This command will:
1. Build the production version (`npm run build`)
2. Create a `.nojekyll` file
3. Deploy to GitHub Pages using the `gh-pages` package

## Common Issues and Solutions

### 1. "Filename too long" Error (Windows)

**Problem:**
```
error: unable to create file frontend-package/node_modules/...: Filename too long
fatal: unable to checkout working tree
```

**Root Cause:**
- Windows has a default MAX_PATH limit of 260 characters
- The `gh-pages` package clones your repository to: `node_modules/.cache/gh-pages/`
- This creates very long paths that exceed Windows limits

**Solution A: Clean Repository (Recommended)**

Ensure your repository doesn't have committed `node_modules`:

```bash
# Check if node_modules is tracked
git ls-files | grep node_modules

# If found, remove them
git rm -r frontend-package/node_modules
git rm -r node_modules
git commit -m "Remove node_modules from repository"
git push
```

**Solution B: Enable Long Paths in Windows**

1. **Using Git:**
   ```bash
   git config --global core.longpaths true
   ```

2. **Using Windows Registry** (requires admin privileges):
   - Open Registry Editor (Win+R, type `regedit`)
   - Navigate to: `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\FileSystem`
   - Create or modify `LongPathsEnabled` (DWORD) = `1`
   - Restart your computer

3. **Using PowerShell** (run as Administrator):
   ```powershell
   New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" `
     -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force
   ```

**Solution C: Clear gh-pages Cache**

```bash
# Delete the cache directory
rm -rf node_modules/.cache/gh-pages

# Or on Windows
rmdir /s /q node_modules\.cache\gh-pages

# Then try deploying again
npm run deploy
```

### 2. "Your local changes would be overwritten" Error

**Problem:**
```
error: Your local changes to the following files would be overwritten by checkout:
        index.html
Please commit your changes or stash them before you switch branches.
Aborting
```

**Root Cause:**
- The `gh-pages` package needs to checkout/switch to the gh-pages branch during deployment
- It finds uncommitted changes to files in the working directory
- Git refuses to checkout to avoid losing local changes

**Solution:**

The deploy script has been updated to use the `--add` flag:
```json
"deploy": "gh-pages -d dist --dotfiles --add --no-cache"
```

**What the flags do:**
- `--dotfiles`: Includes dotfiles like `.nojekyll` in deployment
- `--add`: Only adds new files, doesn't remove existing ones (prevents checkout conflicts)
- `--no-cache`: Forces a fresh deployment without using cache

**If you still encounter this error:**

1. **Ensure working directory is clean before deploying:**
   ```bash
   git status
   # If there are uncommitted changes, commit or stash them
   git add .
   git commit -m "Save changes before deploy"
   # Then deploy
   npm run deploy
   ```

2. **Clear the gh-pages cache:**
   ```bash
   rm -rf node_modules/.cache/gh-pages
   npm run deploy
   ```

3. **Use git stash if you have temporary changes:**
   ```bash
   git stash
   npm run deploy
   git stash pop
   ```

### 3. Blank Page After Deployment

**Problem:** The site loads but shows only a white/blank page.

**Solutions:**

1. **Check Base Path** in `vite.config.ts`:
   ```typescript
   export default defineConfig({
     base: '/money-manager-frontend/', // Must match your repo name
     // ... other config
   });
   ```

2. **Verify GitHub Pages Settings:**
   - Go to Repository Settings → Pages
   - Source: `gh-pages` branch
   - Folder: `/ (root)`

3. **Check for `.nojekyll` File:**
   ```bash
   # After building, verify it exists
   ls dist/.nojekyll
   ```

4. **Clear Browser Cache:**
   - Chrome/Edge: Ctrl+Shift+R (Cmd+Shift+R on Mac)
   - Firefox: Ctrl+Shift+Delete, clear cache

5. **Check Browser Console:**
   - Open Developer Tools (F12)
   - Look for 404 errors on assets
   - Verify asset paths match your base path

### 3. Authentication Failed

**Problem:**
```
fatal: Authentication failed for 'https://github.com/...'
```

**Solutions:**

1. **Use SSH Instead:**
   ```bash
   # Change remote to SSH
   git remote set-url origin git@github.com:NarendraKolukula/money-manager-frontend.git
   ```

2. **Use Personal Access Token:**
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Generate new token with `repo` scope
   - Use it as password when prompted

3. **Use GitHub CLI:**
   ```bash
   gh auth login
   ```

### 4. Deployment Takes Too Long

**Problem:** Deployment is very slow or times out.

**Solutions:**

1. **Use `--no-cache` flag** (already in package.json):
   ```json
   "deploy": "gh-pages -d dist --no-cache"
   ```

2. **Reduce Bundle Size:**
   - Check `dist` folder size
   - Consider code splitting
   - Optimize images and assets

3. **Check Internet Connection:**
   - Slow upload speeds can cause timeouts
   - Try from a different network

## Alternative: GitHub Actions Deployment

For more reliable deployments, consider using GitHub Actions:

### Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Upload artifact
      uses: actions/upload-pages-artifact@v3
      with:
        path: './dist'
        
    - name: Deploy to GitHub Pages
      uses: actions/deploy-pages@v4
```

### Enable GitHub Actions Deployment:

1. Go to Repository Settings → Pages
2. Source: GitHub Actions
3. Commit the workflow file
4. Push to main branch
5. Check Actions tab for deployment status

**Benefits:**
- ✅ No Windows path length issues
- ✅ Automatic deployment on push
- ✅ Better error reporting
- ✅ No local authentication needed
- ✅ Faster deployment

## Verification

After successful deployment:

1. **Check GitHub Pages URL:**
   ```
   https://narendrakolukula.github.io/money-manager-frontend/
   ```

2. **Verify Assets Load:**
   - Open browser Developer Tools (F12)
   - Check Network tab
   - All assets should return 200 status

3. **Test Functionality:**
   - Dashboard loads
   - Charts render
   - Transactions can be added
   - Local storage works

## Best Practices

1. **Keep Repository Clean:**
   - Never commit `node_modules/`
   - Never commit `dist/` folder
   - Use `.gitignore` properly

2. **Regular Deployments:**
   - Test locally before deploying: `npm run preview`
   - Review build output for warnings
   - Check bundle sizes

3. **Version Control:**
   - Use semantic versioning
   - Tag releases
   - Maintain changelog

4. **Monitoring:**
   - Check GitHub Actions status
   - Monitor site uptime
   - Review user feedback

## Getting Help

If you encounter issues not covered here:

1. Check GitHub repository issues
2. Review GitHub Pages documentation
3. Check browser console for errors
4. Verify all files are committed and pushed
5. Try deploying from a different machine/OS

## Repository Structure

Correct structure for deployment:

```
money-manager-frontend/
├── .github/
│   └── workflows/          # Optional: GitHub Actions
├── dist/                   # Build output (gitignored)
│   ├── .nojekyll
│   ├── index.html
│   └── assets/
├── node_modules/           # Dependencies (gitignored)
├── src/                    # Source code
├── .gitignore              # Must exclude node_modules, dist
├── package.json
├── vite.config.ts          # Must have correct base path
└── README.md
```

**What NOT to commit:**
- ❌ `node_modules/` directories (anywhere)
- ❌ `dist/` folder
- ❌ `.cache/` folders
- ❌ Build artifacts
- ❌ IDE-specific files (`.idea/`, `.vscode/` etc.)

## Summary

The main fix for the "Filename too long" error was:
1. ✅ Removed `frontend-package/node_modules` from git (14,826 files)
2. ✅ Updated `.gitignore` to use `**/node_modules/` pattern
3. ✅ Reduced repository size by 47%
4. ✅ Deployment now works on Windows

For future prevention:
- Always check `.gitignore` before committing
- Use `git status` to verify what's being committed
- Keep the repository clean and minimal
