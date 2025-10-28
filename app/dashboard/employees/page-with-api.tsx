"use client";

import { useState, useEffect } from "react";
import { 
  Users, Plus, Edit, Trash2, Mail, Phone, MapPin, Settings, 
  AlertCircle, CheckCircle, Clock, Car, Fuel, FileText, 
  CreditCard, Shield, Printer, Calendar, TrendingUp, Search, Filter, X,
  Ban, Unlock, Lock, MapPinned, KeyRound, Eye, EyeOff
} from "lucide-react";
import { createClient } from '@/lib/supabase/browser';

interface Employee {
  id: string;
  employee_code: string;
  name: string;
  email: string;
  username?: string;
  phone?: string;
  role: 'employee' | 'approver' | 'admin';
  department?: string;
  zone_id?: string;
  allowed_quota_liters: number;
  is_banned: boolean;
  allowed_zones: string[];
  created_at: string;
  zone?: {
    name: string;
    id: string;
  };
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const itemsPerPage = 5;

  // New employee form state
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    employee_code: "",
    role: "employee" as 'employee' | 'approver' | 'admin',
    department: "Operations",
    zone_id: "",
    allowed_quota_liters: 100,
    allowed_zones: [] as string[],
  });

  // Fetch employees from API
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/employees');
      if (!response.ok) throw new Error('Failed to fetch employees');
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      alert('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  // Setup real-time sync with Supabase
  useEffect(() => {
    fetchEmployees();

    const supabase = createClient();
    
    const channel = supabase
      .channel('employees-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'employees' },
        () => {
          console.log('Employee change detected');
          fetchEmployees();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Create new employee with auto-generated credentials
  const handleAddEmployee = async () => {
    if (!newEmployee.name || !newEmployee.email || !newEmployee.employee_code) {
      alert("Please fill in all required fields!");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch('/api/auth/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEmployee)
      });

      if (!response.ok) throw new Error('Failed to create employee');

      const result = await response.json();
      
      // Show generated credentials
      setGeneratedPassword(result.generated_password);
      setShowPassword(true);
      
      alert(`Employee "${newEmployee.name}" created successfully!\nUsername: ${result.username}\nPassword: ${result.generated_password}`);
      
      // Reset form
      setNewEmployee({
        name: "",
        email: "",
        phone: "",
        employee_code: "",
        role: "employee",
        department: "Operations",
        zone_id: "",
        allowed_quota_liters: 100,
        allowed_zones: []
      });
      setShowAddModal(false);
      
      // Real-time subscription will update the list
    } catch (error: any) {
      console.error('Error creating employee:', error);
      alert(`Failed to create employee: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete employee
  const handleDeleteEmployee = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/auth/employees?id=${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete employee');
      
      alert("Employee deleted successfully!");
      // Real-time subscription will update the list
    } catch (error: any) {
      console.error('Error deleting employee:', error);
      alert(`Failed to delete employee: ${error.message}`);
    }
  };

  // Reset employee password
  const handleResetPassword = async (id: string, name: string) => {
    if (!window.confirm(`Reset password for "${name}"? A new password will be generated.`)) {
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employee_id: id })
      });

      if (!response.ok) throw new Error('Failed to reset password');

      const result = await response.json();
      setGeneratedPassword(result.new_password);
      setShowPassword(true);
      
      alert(`Password reset successfully for "${name}"!\nNew Password: ${result.new_password}`);
    } catch (error: any) {
      console.error('Error resetting password:', error);
      alert(`Failed to reset password: ${error.message}`);
    }
  };

  // Toggle ban status
  const handleToggleBan = async (id: string, is_banned: boolean) => {
    try {
      const response = await fetch('/api/auth/employees', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_banned: !is_banned })
      });

      if (!response.ok) throw new Error('Failed to update employee');
      
      // Real-time subscription will update the list
    } catch (error: any) {
      console.error('Error updating employee:', error);
      alert(`Failed to update employee: ${error.message}`);
    }
  };

  // Filter and paginate employees
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employee_code.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = filterRole === "all" || emp.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <div style={{ fontSize: '18px', color: '#6b7280' }}>Loading employees...</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 'bold', background: 'linear-gradient(90deg, #2563eb, #1e40af)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' }}>
            Employees
          </h1>
          <p style={{ color: '#4b5563', fontSize: '14px' }}>
            Manage employees with role-based access and authentication
          </p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            background: 'linear-gradient(90deg, #2563eb, #1e40af)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
          <Plus style={{ width: '18px', height: '18px' }} />
          Add Employee
        </button>
      </div>

      {/* Search and Filters */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
          <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#9ca3af' }} />
          <input
            type="text"
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '10px 12px 10px 40px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          style={{ padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}
        >
          <option value="all">All Roles</option>
          <option value="employee">Employee</option>
          <option value="approver">Approver</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Generated Password Display Modal */}
      {showPassword && generatedPassword && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div style={{
            background: 'white',
            padding: '32px',
            borderRadius: '16px',
            maxWidth: '500px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>
              🔐 Generated Credentials
            </h2>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
              Save these credentials securely. The password will not be shown again.
            </p>
            
            <div style={{ background: '#f3f4f6', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>Generated Password:</label>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  background: 'white',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '2px solid #3b82f6'
                }}>
                  <code style={{ fontSize: '18px', fontWeight: '600', color: '#1e40af', letterSpacing: '2px' }}>
                    {generatedPassword}
                  </code>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setShowPassword(false);
                setGeneratedPassword(null);
              }}
              style={{
                width: '100%',
                padding: '12px',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              I've Saved The Credentials
            </button>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          overflow: 'auto',
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            width: '90%',
            maxWidth: '600px',
            boxShadow: '0 20px 25px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#111827' }}>
                Add New Employee
              </h2>
              <button onClick={() => setShowAddModal(false)}>
                <X style={{ width: '24px', height: '24px', color: '#6b7280' }} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Employee Code *</label>
                <input
                  type="text"
                  value={newEmployee.employee_code}
                  onChange={(e) => setNewEmployee({ ...newEmployee, employee_code: e.target.value })}
                  placeholder="EMP001"
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Full Name *</label>
                <input
                  type="text"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                  placeholder="John Doe"
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Email *</label>
                <input
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                  placeholder="john@ashrafsugar.com"
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Phone</label>
                  <input
                    type="tel"
                    value={newEmployee.phone}
                    onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                    placeholder="+92-300-1234567"
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Department</label>
                  <input
                    type="text"
                    value={newEmployee.department}
                    onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                    placeholder="Operations"
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Role *</label>
                  <select
                    value={newEmployee.role}
                    onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value as any })}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}
                  >
                    <option value="employee">Employee</option>
                    <option value="approver">Approver</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Monthly Quota (Liters)</label>
                  <input
                    type="number"
                    value={newEmployee.allowed_quota_liters}
                    onChange={(e) => setNewEmployee({ ...newEmployee, allowed_quota_liters: parseFloat(e.target.value) })}
                    placeholder="100"
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                  />
                </div>
              </div>

              <div style={{ 
                background: '#eff6ff', 
                padding: '12px', 
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <KeyRound style={{ width: '20px', height: '20px', color: '#3b82f6' }} />
                <span style={{ fontSize: '13px', color: '#1e40af' }}>
                  Username and password will be auto-generated
                </span>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button
                  onClick={() => setShowAddModal(false)}
                  style={{
                    padding: '12px 24px',
                    background: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEmployee}
                  disabled={isSubmitting}
                  style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(90deg, #2563eb, #1e40af)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting ? 0.6 : 1
                  }}
                >
                  {isSubmitting ? 'Creating...' : 'Create Employee'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Employees List */}
      {paginatedEmployees.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Users style={{ width: '48px', height: '48px', color: '#9ca3af', margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#374151' }}>No Employees Found</h3>
          <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px' }}>Add your first employee to get started</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {paginatedEmployees.map((employee) => (
            <div key={employee.id} style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: employee.is_banned ? '2px solid #dc2626' : '2px solid transparent'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>
                      {employee.name}
                    </h3>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: employee.role === 'admin' ? '#fee2e2' : employee.role === 'approver' ? '#dbeafe' : '#d1fae5',
                      color: employee.role === 'admin' ? '#dc2626' : employee.role === 'approver' ? '#2563eb' : '#059669'
                    }}>
                      {employee.role.toUpperCase()}
                    </span>
                    {employee.is_banned && (
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: '#fee2e2',
                        color: '#dc2626'
                      }}>
                        BANNED
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
                    {employee.employee_code} • {employee.email}
                  </p>
                  
                  {employee.username && (
                    <p style={{ fontSize: '13px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Shield style={{ width: '14px', height: '14px' }} />
                      Username: <strong>{employee.username}</strong>
                    </p>
                  )}

                  <div style={{ display: 'flex', gap: '24px', marginTop: '12px', fontSize: '13px' }}>
                    {employee.phone && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6b7280' }}>
                        <Phone style={{ width: '14px', height: '14px' }} />
                        {employee.phone}
                      </div>
                    )}
                    {employee.zone && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6b7280' }}>
                        <MapPin style={{ width: '14px', height: '14px' }} />
                        {employee.zone.name}
                      </div>
                    )}
                    <div style={{ color: '#059669' }}>
                      Quota: {employee.allowed_quota_liters}L/month
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleResetPassword(employee.id, employee.name)}
                    title="Reset Password"
                    style={{
                      padding: '8px',
                      background: '#fef3c7',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      color: '#d97706'
                    }}
                  >
                    <KeyRound style={{ width: '18px', height: '18px' }} />
                  </button>
                  <button
                    onClick={() => handleToggleBan(employee.id, employee.is_banned)}
                    title={employee.is_banned ? "Unban" : "Ban"}
                    style={{
                      padding: '8px',
                      background: employee.is_banned ? '#d1fae5' : '#fee2e2',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      color: employee.is_banned ? '#059669' : '#dc2626'
                    }}
                  >
                    {employee.is_banned ? <Unlock style={{ width: '18px', height: '18px' }} /> : <Ban style={{ width: '18px', height: '18px' }} />}
                  </button>
                  <button
                    onClick={() => handleDeleteEmployee(employee.id, employee.name)}
                    title="Delete"
                    style={{
                      padding: '8px',
                      background: '#fee2e2',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      color: '#dc2626'
                    }}
                  >
                    <Trash2 style={{ width: '18px', height: '18px' }} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '20px' }}>
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            style={{
              padding: '8px 16px',
              background: currentPage === 1 ? '#f3f4f6' : '#3b82f6',
              color: currentPage === 1 ? '#9ca3af' : 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              fontSize: '14px'
            }}
          >
            Previous
          </button>
          <span style={{ fontSize: '14px', color: '#6b7280' }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            style={{
              padding: '8px 16px',
              background: currentPage === totalPages ? '#f3f4f6' : '#3b82f6',
              color: currentPage === totalPages ? '#9ca3af' : 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              fontSize: '14px'
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

