# 🚀 SVFMS Setup Instructions

## ✅ Step 1: Environment File Created

I've created `.env.local` with your Supabase credentials!

## 📋 Step 2: Set Up Database

### Go to Supabase Dashboard:
1. Visit: https://supabase.com/dashboard/project/tksodydfsuierqlnmnrr
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy and paste the contents of `database-setup.sql`
5. Click "Run" or press Ctrl+Enter
6. Wait for success message ✅

### What this creates:
- ✅ All database tables (employees, vehicles, claims, zones, etc.)
- ✅ Row Level Security policies
- ✅ Sample data (3 users, 3 vehicles)
- ✅ Test zone

## 👤 Step 3: Create an Admin User

### In Supabase Dashboard:
1. Go to "Authentication" → "Users"
2. Click "Add User"
3. Fill in:
   - Email: `admin@svfms.com`
   - Password: `admin123` (or any password you prefer)
4. Click "Create User"

## 🔄 Step 4: Restart the Server

Since we added the environment file, restart the dev server:

### In your terminal where the server is running:
1. Press **Ctrl+C** to stop the server
2. Run: `npm run dev` again

Or use the **start.bat** file again.

## 🌐 Step 5: Access the Dashboard

1. Go to: **http://localhost:3000**
2. Click "Login"
3. Enter:
   - Email: `admin@svfms.com`
   - Password: `admin123` (or what you set)
4. You should see the dashboard!

## 🎉 What You'll See

- **Dashboard Overview**: 6 blue KPI cards
- **Claims Queue**: Fuel claims management
- **Vehicles**: Fleet management  
- **Location Logs**: GPS tracking
- **Role Management**: User permissions
- **Zones**: Geofencing configuration
- **Analytics**: Reports
- **Settings**: Configuration

## ✅ Quick Test

After setup, try:
1. Go to `/dashboard/vehicles` - See your fleet
2. Go to `/dashboard/location-logs` - View GPS logs
3. Go to `/dashboard/roles` - Manage users
4. Go to `/dashboard/claims` - Manage fuel claims

## 🚨 If You Get Errors

### Issue: "Supabase connection error"
**Solution**: Make sure `.env.local` is in the root folder (same level as package.json)

### Issue: "Cannot find module"
**Solution**: 
```bash
npm install
npm run dev
```

### Issue: "Authentication failed"
**Solution**: Make sure you created the user in Supabase Auth section

## 📝 Next Steps After Login

1. **Add more users**: Go to `/dashboard/roles` and add employees
2. **Add vehicles**: Go to `/dashboard/vehicles` and register fleet
3. **Create zones**: Go to `/dashboard/zones` and define allowed areas
4. **View claims**: Go to `/dashboard/claims` to see fuel claims

## 🎊 Ready!

Your dashboard is now fully connected to Supabase and ready to use!

