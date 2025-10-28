# Quick Commands - Just Run These!

## 1. Push to GitHub

Open terminal in your project folder and run:

```bash
git init
git add .
git commit -m "ASMS Vehicle Management System"
git remote add origin https://github.com/Ahmadkhanworkspace/Fuel.git
git branch -M main
git push -u origin main
```

Done! Your code is on GitHub.

---

## 2. Deploy to Vercel

Go to: https://vercel.com
- Click "Add New Project"
- Import from GitHub: Ahmadkhanworkspace/Fuel
- Add environment variables (copy from START_DEPLOYMENT.md)
- Click "Deploy"

Done! Dashboard is live.

---

## 3. Build Android APK

```bash
cd mobile
npm install -g eas-cli
eas login
eas build --platform android --profile preview
```

Wait for email with APK link. Done!

---

That's it! No scripts needed. Just run these commands.

