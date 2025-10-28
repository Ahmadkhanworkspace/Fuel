import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import RolesManagement from "@/components/dashboard/roles-management";

export const dynamic = 'force-dynamic';

export default async function RolesPage() {
  await requireRole(['admin']);

  const supabase = await createClient();

  // Fetch all employees with their roles
  const { data: employees, error } = await supabase
    .from('employees')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching employees:', error);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Role Management
        </h1>
        <p className="text-gray-600 mt-1">Manage user roles and permissions</p>
      </div>
      <RolesManagement initialEmployees={employees || []} />
    </div>
  );
}

