import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // DEMO MODE: Mock user data
  const mockUser = {
    id: "demo-user-id",
    email: "admin@svfms.com",
    role: "admin"
  };

  const mockEmployee = {
    id: "demo-employee",
    employee_code: "ADMIN001",
    name: "Demo Admin",
    email: "admin@svfms.com",
    phone: null,
    role: "admin" as const,
    zone_id: null,
    allowed_quota_liters: 100,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar currentRole="admin" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <Header user={mockUser} employee={mockEmployee} />
        <main style={{ flex: 1, padding: '24px', overflow: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
