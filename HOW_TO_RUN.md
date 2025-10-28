# 🚀 How to Run Your SVFMS Dashboard

## ✅ Everything is Ready!

All files are created, Node.js is installed, and dependencies are installed.

## 🎯 To Start the Dashboard

### **Method 1: Using the batch file** (Easiest)

1. Double-click `start.bat` in the project folder
2. Wait for the server to start
3. Browser will open automatically OR go to http://localhost:3000

### **Method 2: Using PowerShell**

1. Open a **NEW PowerShell window** (close any existing terminals)
2. Run these commands:

```powershell
cd "d:\ASML Vehicle Management system"
npm run dev
```

3. Wait for: `- ready started server on 0.0.0.0:3000`
4. Open http://localhost:3000 in your browser

### **Method 3: Using Command Prompt**

1. Open Command Prompt
2. Run:

```cmd
cd "d:\ASML Vehicle Management system"
npm run dev
```

3. Open http://localhost:3000 in your browser

---

## 🌐 Once Server is Running

The dashboard will be available at:
```
http://localhost:3000
```

### What You'll See:

#### Login Page
- Email: `admin@svfms.com` (or any Supabase user)
- Password: (Your Supabase password)

#### Dashboard Features:
- ✅ **Overview**: 6 KPI cards with blue theme
- ✅ **Claims Queue**: Searchable data table
- ✅ **Location Logs**: GPS tracking page
- ✅ **Role Management**: User permissions
- ✅ **Zones**: Geofencing configuration
- ✅ **Vehicles**: Fleet management
- ✅ **Analytics**: Reports and charts
- ✅ **Settings**: Configuration

---

## ⚙️ Setup Required (First Time Only)

### 1. Supabase Setup

1. Go to https://supabase.com
2. Sign up (free)
3. Create a new project
4. Wait for database to initialize

### 2. Create Environment File

Create a file named `.env.local` in the project folder:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Run Database Migrations

In Supabase Dashboard:
1. Go to SQL Editor
2. Copy SQL from `STARTER_GUIDE.md`
3. Run the SQL to create tables

### 4. Create a User

Go to Supabase Authentication:
1. Click "Add User"
2. Enter email and password
3. This becomes your login

---

## ✅ All Features Implemented

- ✅ Premium UI with blue theme
- ✅ Location logging
- ✅ Zone restrictions
- ✅ Roles & permissions
- ✅ OCR integration
- ✅ Fraud detection
- ✅ EXIF validation
- ✅ Bulk operations
- ✅ CSV export
- ✅ Real Supabase integration

---

## 🎉 Ready!

**Just run `start.bat` or `npm run dev` and open http://localhost:3000**

Your dashboard is production-ready! 🚀

