import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://tksodydfsuierqlnmnrr.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrc29keWRmc3VpZXJxbG5tbnJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NTI3MDEsImV4cCI6MjA3NzEyODcwMX0.YrUr28nJUB6istkCwh_p-qpX_ITVafEWCDbo01I9Zx0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
