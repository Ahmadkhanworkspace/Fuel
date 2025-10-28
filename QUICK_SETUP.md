# ⚡ Quick Setup - 3 Steps to Dashboard

## ✅ Step 1: Restart Server (IMPORTANT)

Your server is currently running. You need to restart it to load the new environment variables.

### Option A: Stop and Restart
1. In the terminal window where the server is running, press **Ctrl+C**
2. Run: `npm run dev`
3. Server will restart with Supabase connected

### Option B: Just Restart
```bash
# Press Ctrl+C in the server terminal
npm run dev
```

## 📋 Step 2: Create Admin User in Supabase

1. Open your browser
2. Go to: https://supabase.com/dashboard/project/tksodydfsuierqlnmnrr
3. Click **"Authentication"** in the left sidebar
4. Click **"Users"** tab
5. Click **"+ Add User"** button
6. Fill in:
   - **Email**: `admin@svfms.com`
   - **Password**: `admin123`
7. Click **"Create User"**

## 📝 Step 3: Run Database Setup

1. In Supabase dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New Query"**
3. Open `database-setup.sql` file in this project
4. Copy ALL the SQL code
5. Paste it into the SQL editor
6. Click **"Run"** button (or press Ctrl+Enter)
7. Wait for ✅ Success message

## 🌐 Step 4: Login to Dashboard

1. Go to: **http://localhost:3000**
2. Click **"Sign in"**
3. Enter:
   - Email: `admin@svfms.com`
   - Password: `admin123`
4. You're in! 🎉

## 🎨 What You'll See

- **Blue-themed dashboard** with 6 KPI cards
- **Claims Queue** - Ready to manage fuel claims
- **Vehicles** - Fleet management
- **Location Logs** - GPS tracking
- **Role Management** - User permissions
- **Zones** - Geofencing
- **Analytics** - Reports
- **Settings** - Configuration

## 🚀 All Features Working

- ✅ Login with Supabase
- ✅ Premium blue UI
- ✅ Real database connection
- ✅ Location logging
- ✅ Zone restrictions
- ✅ Roles & permissions
- ✅ OCR ready
- ✅ Fraud detection ready
- ✅ Bulk operations
- ✅ CSV export

## 🎊 Enjoy Your Dashboard!

Everything is connected and ready to use.

