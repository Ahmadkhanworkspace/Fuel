import { createClient } from '@/lib/supabase/server';
import { Employee } from './supabase/types';

export async function getCurrentUser() {
  const supabase = await createClient();
  
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

export async function getCurrentUserWithRole(): Promise<(Employee & { user: any }) | null> {
  const supabase = await createClient();
  const user = await getCurrentUser();
  
  if (!user) return null;

  const { data: employee } = await supabase
    .from('employees')
    .select('*')
    .eq('email', user.email)
    .single();

  if (!employee) return null;

  return { ...employee, user };
}

export async function hasRole(allowedRoles: string[]): Promise<boolean> {
  const userWithRole = await getCurrentUserWithRole();
  
  if (!userWithRole) return false;
  
  return allowedRoles.includes(userWithRole.role);
}

export async function requireRole(allowedRoles: string[]) {
  const hasAccess = await hasRole(allowedRoles);
  
  if (!hasAccess) {
    throw new Error('Unauthorized');
  }
}

