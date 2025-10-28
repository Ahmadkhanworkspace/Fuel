"use client";

import { useState, useEffect } from "react";
import { 
  Users, Plus, Edit, Trash2, Mail, Phone, MapPin, Settings, 
  AlertCircle, CheckCircle, Clock, Car, Fuel, FileText, 
  CreditCard, Shield, Printer, Calendar, TrendingUp, Search, Filter, X,
  Ban, Unlock, Lock, MapPinned, KeyRound, Eye, EyeOff, Bell, Send,
  Briefcase, Route, Building2, CheckSquare, FileCheck, ChevronDown, ChevronUp
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
  const [expandedEmployees, setExpandedEmployees] = useState<Set<string>>(new Set());
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [selectedEmployeeForNotification, setSelectedEmployeeForNotification] = useState<Employee | null>(null);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState<"info" | "warning" | "success" | "error">("info");
  const [sendEmailToo, setSendEmailToo] = useState(true);
  const [showTripModal, setShowTripModal] = useState(false);
  const [selectedEmployeeForTrip, setSelectedEmployeeForTrip] = useState<Employee | null>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);
  const itemsPerPage = 5;

  // Trip form state
  const [tripForm, setTripForm] = useState({
    vehicle_id: "",
    trip_type: "Head Office",
    destination: "",
    start_location: "",
    purpose: "",
  });

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
    // Driver License Fields
    driver_license_number: "",
    driver_license_expiry: "",
    // Vehicle Assignment Fields
    assigned_vehicle_reg_no: "",
    assigned_vehicle_model: "",
    ownership_type: "Company Owned",
    lease_company: "",
    lease_start: "",
    lease_end: "",
    handover_mileage: "",
    condition_at_handover: "",
    // App Settings
    enableCamera: true,
    requireLocation: true,
    maxDailyClaims: 3,
    requireNoncePhoto: true,
    offlineMode: true,
  });

  const [activeFormTab, setActiveFormTab] = useState("basic");

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
        allowed_zones: [],
        driver_license_number: "",
        driver_license_expiry: "",
        assigned_vehicle_reg_no: "",
        assigned_vehicle_model: "",
        ownership_type: "Company Owned",
        lease_company: "",
        lease_start: "",
        lease_end: "",
        handover_mileage: "",
        condition_at_handover: "",
        enableCamera: true,
        requireLocation: true,
        maxDailyClaims: 3,
        requireNoncePhoto: true,
        offlineMode: true,
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

  // Toggle employee card expansion
  const toggleEmployeeExpansion = (employeeId: string) => {
    setExpandedEmployees((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(employeeId)) {
        newSet.delete(employeeId);
      } else {
        newSet.add(employeeId);
      }
      return newSet;
    });
  };

  // Toggle ban status
  const handleToggleBan = async (id: string, is_banned: boolean) => {
    const action = is_banned ? "unban" : "ban";
    if (!window.confirm(`Are you sure you want to ${action} this employee?`)) {
      return;
    }

    try {
      const response = await fetch('/api/auth/employees', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_banned: !is_banned })
      });

      if (!response.ok) throw new Error('Failed to update employee');
      
      alert(`Employee ${action}ed successfully!`);
      // Real-time subscription will update the list
    } catch (error: any) {
      console.error('Error updating employee:', error);
      alert(`Failed to update employee: ${error.message}`);
    }
  };

  // Open notification modal
  const handleSendNotification = (employee: Employee) => {
    setSelectedEmployeeForNotification(employee);
    setShowNotificationModal(true);
  };

  // Send notification
  const handleSubmitNotification = async () => {
    if (!notificationMessage.trim()) {
      alert("Please enter a message");
      return;
    }

    try {
      // In a real implementation, this would call an API to send the notification
      alert(`Notification sent to ${selectedEmployeeForNotification?.name}${sendEmailToo ? ' (with email)' : ''}`);
      setShowNotificationModal(false);
      setNotificationMessage("");
    } catch (error: any) {
      console.error('Error sending notification:', error);
      alert(`Failed to send notification: ${error.message}`);
    }
  };

  // Fetch vehicles for trip creation
  const fetchVehicles = async () => {
    try {
      setIsLoadingVehicles(true);
      const response = await fetch('/api/vehicles');
      if (!response.ok) throw new Error('Failed to fetch vehicles');
      const data = await response.json();
      setVehicles(data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      alert('Failed to load vehicles');
    } finally {
      setIsLoadingVehicles(false);
    }
  };

  // Open trip modal
  const handleCreateTrip = (employee: Employee) => {
    setSelectedEmployeeForTrip(employee);
    setShowTripModal(true);
    fetchVehicles();
  };

  // Create trip
  const handleSubmitTrip = async () => {
    if (!tripForm.vehicle_id || !tripForm.destination) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      // Get current location
      let startLat, startLng;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          startLat = position.coords.latitude;
          startLng = position.coords.longitude;
          
          createTripWithLocation(startLat, startLng);
        }, () => {
          // If geolocation fails, create trip without location
          createTripWithLocation(null, null);
        });
      } else {
        createTripWithLocation(null, null);
      }
    } catch (error: any) {
      console.error('Error creating trip:', error);
      alert(`Failed to create trip: ${error.message}`);
    }
  };

  const createTripWithLocation = async (lat: number | null, lng: number | null) => {
    try {
      const response = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employee_id: selectedEmployeeForTrip?.id,
          vehicle_id: tripForm.vehicle_id,
          trip_type: tripForm.trip_type,
          destination: tripForm.destination,
          start_location: tripForm.start_location || 'Current Location',
          start_lat: lat,
          start_lng: lng,
          purpose: tripForm.purpose,
        }),
      });

      if (!response.ok) throw new Error('Failed to create trip');

      const data = await response.json();
      alert(`Official trip created successfully!\nTrip ID: ${data.id}`);
      setShowTripModal(false);
      setTripForm({
        vehicle_id: "",
        trip_type: "Head Office",
        destination: "",
        start_location: "",
        purpose: "",
      });
    } catch (error: any) {
      console.error('Error creating trip:', error);
      alert(`Failed to create trip: ${error.message}`);
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
            maxWidth: '900px',
            boxShadow: '0 20px 25px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '600', color: '#111827' }}>Add New Employee</h2>
              <button onClick={() => {
                setShowAddModal(false);
                setActiveFormTab("basic");
                setNewEmployee({
                  name: "",
                  email: "",
                  phone: "",
                  employee_code: "",
                  role: "employee",
                  department: "Operations",
                  zone_id: "",
                  allowed_quota_liters: 100,
                  allowed_zones: [],
                  driver_license_number: "",
                  driver_license_expiry: "",
                  assigned_vehicle_reg_no: "",
                  assigned_vehicle_model: "",
                  ownership_type: "Company Owned",
                  lease_company: "",
                  lease_start: "",
                  lease_end: "",
                  handover_mileage: "",
                  condition_at_handover: "",
                  enableCamera: true,
                  requireLocation: true,
                  maxDailyClaims: 3,
                  requireNoncePhoto: true,
                  offlineMode: true,
                });
              }}>
                <X style={{ width: '24px', height: '24px', color: '#6b7280' }} />
              </button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '2px solid #e5e7eb' }}>
              <button
                onClick={() => setActiveFormTab("basic")}
                style={{
                  padding: '12px 24px',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '8px 8px 0 0',
                  cursor: 'pointer',
                  borderBottom: activeFormTab === "basic" ? '3px solid #2563eb' : 'none',
                  color: activeFormTab === "basic" ? '#2563eb' : '#6b7280',
                  fontWeight: activeFormTab === "basic" ? '600' : '400'
                }}
              >
                👤 Basic Info
              </button>
              <button
                onClick={() => setActiveFormTab("license")}
                style={{
                  padding: '12px 24px',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '8px 8px 0 0',
                  cursor: 'pointer',
                  borderBottom: activeFormTab === "license" ? '3px solid #2563eb' : 'none',
                  color: activeFormTab === "license" ? '#2563eb' : '#6b7280',
                  fontWeight: activeFormTab === "license" ? '600' : '400'
                }}
              >
                🚗 License & Vehicle
              </button>
              <button
                onClick={() => setActiveFormTab("settings")}
                style={{
                  padding: '12px 24px',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '8px 8px 0 0',
                  cursor: 'pointer',
                  borderBottom: activeFormTab === "settings" ? '3px solid #2563eb' : 'none',
                  color: activeFormTab === "settings" ? '#2563eb' : '#6b7280',
                  fontWeight: activeFormTab === "settings" ? '600' : '400'
                }}
              >
                ⚙️ Settings
              </button>
            </div>

            <div style={{ maxHeight: '60vh', overflow: 'auto', paddingRight: '8px' }}>
              {/* Basic Info Tab */}
              {activeFormTab === "basic" && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Full Name *</label>
                      <input
                        type="text"
                        value={newEmployee.name}
                        onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                        placeholder="Rajesh Kumar"
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Employee Code *</label>
                      <input
                        type="text"
                        value={newEmployee.employee_code}
                        onChange={(e) => setNewEmployee({...newEmployee, employee_code: e.target.value})}
                        placeholder="EMP001"
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Email *</label>
                      <input
                        type="email"
                        value={newEmployee.email}
                        onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                        placeholder="rajesh@asms.com"
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Phone</label>
                      <input
                        type="tel"
                        value={newEmployee.phone}
                        onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                        placeholder="+92-300-1234567"
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Role *</label>
                      <select
                        value={newEmployee.role}
                        onChange={(e) => setNewEmployee({...newEmployee, role: e.target.value as any})}
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}
                      >
                        <option value="employee">Employee</option>
                        <option value="approver">Approver</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Department</label>
                      <input
                        type="text"
                        value={newEmployee.department}
                        onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                        placeholder="Operations"
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Monthly Fuel Quota (Liters) *</label>
                    <input
                      type="number"
                      value={newEmployee.allowed_quota_liters}
                      onChange={(e) => setNewEmployee({...newEmployee, allowed_quota_liters: parseFloat(e.target.value)})}
                      placeholder="100"
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                    />
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
                      Username and password will be auto-generated and shown after creation
                    </span>
                  </div>
                </div>
              )}

              {/* License & Vehicle Tab */}
              {activeFormTab === "license" && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Driver License</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>License Number</label>
                      <input
                        type="text"
                        value={newEmployee.driver_license_number}
                        onChange={(e) => setNewEmployee({...newEmployee, driver_license_number: e.target.value})}
                        placeholder="PK-12345-67"
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Expiry Date</label>
                      <input
                        type="date"
                        value={newEmployee.driver_license_expiry}
                        onChange={(e) => setNewEmployee({...newEmployee, driver_license_expiry: e.target.value})}
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                      />
                    </div>
                  </div>

                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginTop: '16px', marginBottom: '8px' }}>Assigned Vehicle</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Registration Number</label>
                      <input
                        type="text"
                        value={newEmployee.assigned_vehicle_reg_no}
                        onChange={(e) => setNewEmployee({...newEmployee, assigned_vehicle_reg_no: e.target.value})}
                        placeholder="ABC-123"
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Model</label>
                      <input
                        type="text"
                        value={newEmployee.assigned_vehicle_model}
                        onChange={(e) => setNewEmployee({...newEmployee, assigned_vehicle_model: e.target.value})}
                        placeholder="Toyota Corolla"
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Ownership Type</label>
                    <select
                      value={newEmployee.ownership_type}
                      onChange={(e) => setNewEmployee({...newEmployee, ownership_type: e.target.value})}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}
                    >
                      <option value="Company Owned">Company Owned</option>
                      <option value="Leased">Leased</option>
                    </select>
                  </div>

                  {newEmployee.ownership_type === "Leased" && (
                    <>
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Lease Company</label>
                        <input
                          type="text"
                          value={newEmployee.lease_company}
                          onChange={(e) => setNewEmployee({...newEmployee, lease_company: e.target.value})}
                          placeholder="ABC Lease Co"
                          style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Lease Start</label>
                          <input
                            type="date"
                            value={newEmployee.lease_start}
                            onChange={(e) => setNewEmployee({...newEmployee, lease_start: e.target.value})}
                            style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Lease End</label>
                          <input
                            type="date"
                            value={newEmployee.lease_end}
                            onChange={(e) => setNewEmployee({...newEmployee, lease_end: e.target.value})}
                            style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Handover Mileage</label>
                    <input
                      type="number"
                      value={newEmployee.handover_mileage}
                      onChange={(e) => setNewEmployee({...newEmployee, handover_mileage: e.target.value})}
                      placeholder="25000"
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Condition at Handover</label>
                    <textarea
                      value={newEmployee.condition_at_handover}
                      onChange={(e) => setNewEmployee({...newEmployee, condition_at_handover: e.target.value})}
                      placeholder="Excellent condition, minor scratches on bumper"
                      rows={3}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                    />
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeFormTab === "settings" && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>App Restrictions & Settings</h3>
                  
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '12px', background: newEmployee.enableCamera ? '#f0fdf4' : '#f9fafb', borderRadius: '8px' }}>
                    <input
                      type="checkbox"
                      checked={newEmployee.enableCamera}
                      onChange={(e) => setNewEmployee({...newEmployee, enableCamera: e.target.checked})}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span style={{ fontSize: '14px', color: '#374151' }}>Enable Camera for Claims</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '12px', background: newEmployee.requireLocation ? '#f0fdf4' : '#f9fafb', borderRadius: '8px' }}>
                    <input
                      type="checkbox"
                      checked={newEmployee.requireLocation}
                      onChange={(e) => setNewEmployee({...newEmployee, requireLocation: e.target.checked})}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span style={{ fontSize: '14px', color: '#374151' }}>Require GPS Location</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '12px', background: newEmployee.requireNoncePhoto ? '#f0fdf4' : '#f9fafb', borderRadius: '8px' }}>
                    <input
                      type="checkbox"
                      checked={newEmployee.requireNoncePhoto}
                      onChange={(e) => setNewEmployee({...newEmployee, requireNoncePhoto: e.target.checked})}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span style={{ fontSize: '14px', color: '#374151' }}>Require Nonce Photo</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '12px', background: newEmployee.offlineMode ? '#f0fdf4' : '#f9fafb', borderRadius: '8px' }}>
                    <input
                      type="checkbox"
                      checked={newEmployee.offlineMode}
                      onChange={(e) => setNewEmployee({...newEmployee, offlineMode: e.target.checked})}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span style={{ fontSize: '14px', color: '#374151' }}>Enable Offline Mode</span>
                  </label>

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Max Daily Claims</label>
                    <input
                      type="number"
                      value={newEmployee.maxDailyClaims}
                      onChange={(e) => setNewEmployee({...newEmployee, maxDailyClaims: parseInt(e.target.value)})}
                      placeholder="3"
                      min="1"
                      max="10"
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                    />
                  </div>

                  <div style={{ 
                    background: '#fef3c7', 
                    padding: '12px', 
                    borderRadius: '8px',
                    border: '1px solid #fbbf24'
                  }}>
                    <p style={{ fontSize: '12px', color: '#92400e' }}>
                      💡 Note: These settings can be updated later in employee profile
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px', paddingTop: '24px', borderTop: '2px solid #e5e7eb' }}>
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
                    opacity: isSubmitting ? 0.6 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {isSubmitting ? 'Creating...' : 'Create Employee'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                    <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => toggleEmployeeExpansion(employee.id)}>
                      <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>
                        {employee.name}
                      </h3>
                      {expandedEmployees.has(employee.id) ? (
                        <ChevronUp style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                      ) : (
                        <ChevronDown style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                      )}
                    </div>
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
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
                    <p style={{ fontSize: '13px', color: '#6b7280', background: '#f3f4f6', padding: '4px 8px', borderRadius: '4px' }}>
                      📋 {employee.employee_code}
                    </p>
                    <p style={{ fontSize: '13px', color: '#6b7280', background: '#f3f4f6', padding: '4px 8px', borderRadius: '4px' }}>
                      📧 {employee.email}
                    </p>
                    <p style={{ fontSize: '13px', color: '#6b7280', background: '#f3f4f6', padding: '4px 8px', borderRadius: '4px' }}>
                      📅 Joined: {new Date(employee.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '12px' }}>
                    {employee.username && (
                      <div>
                        <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>👤 Username</p>
                        <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>{employee.username}</p>
                      </div>
                    )}
                    {employee.phone && (
                      <div>
                        <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>📞 Phone</p>
                        <p style={{ fontSize: '14px', color: '#374151' }}>{employee.phone}</p>
                      </div>
                    )}
                    {employee.department && (
                      <div>
                        <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>🏢 Department</p>
                        <p style={{ fontSize: '14px', color: '#374151' }}>{employee.department}</p>
                      </div>
                    )}
                    <div>
                      <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>⛽ Fuel Quota</p>
                      <p style={{ fontSize: '14px', fontWeight: '600', color: '#059669' }}>{employee.allowed_quota_liters}L/month</p>
                    </div>
                  </div>

                  {employee.zone && (
                    <div style={{ marginTop: '12px', padding: '12px', background: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                      <p style={{ fontSize: '12px', color: '#1e40af', fontWeight: '600', marginBottom: '4px' }}>📍 Authorized Zone</p>
                      <p style={{ fontSize: '14px', color: '#1e40af' }}>{employee.zone.name}</p>
                    </div>
                  )}

                  {employee.allowed_zones && employee.allowed_zones.length > 0 && (
                    <div style={{ marginTop: '8px', padding: '12px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #86efac' }}>
                      <p style={{ fontSize: '12px', color: '#059669', fontWeight: '600', marginBottom: '4px' }}>✅ Allowed Zones</p>
                      <p style={{ fontSize: '14px', color: '#059669' }}>
                        {employee.allowed_zones.join(', ') || 'All zones'}
                      </p>
                    </div>
                  )}

                  {employee.is_banned && (
                    <div style={{ marginTop: '12px', padding: '12px', background: '#fee2e2', borderRadius: '8px', border: '1px solid #fecaca' }}>
                      <p style={{ fontSize: '12px', color: '#dc2626', fontWeight: '600' }}>⚠️ This employee is banned from system access</p>
                    </div>
                  )}

                  {/* Special Permissions */}
                  <div style={{ marginTop: '12px', padding: '12px', background: '#fef3c7', borderRadius: '8px', border: '1px solid #fde68a' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <Shield style={{ width: '16px', height: '16px', color: '#d97706' }} />
                      <p style={{ fontSize: '13px', color: '#92400e', fontWeight: '600' }}>Special Permissions</p>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      <span style={{ fontSize: '12px', padding: '4px 8px', background: '#fde68a', borderRadius: '4px', color: '#78350f' }}>
                        ✓ Can submit claims
                      </span>
                      {employee.role === 'approver' && (
                        <span style={{ fontSize: '12px', padding: '4px 8px', background: '#fde68a', borderRadius: '4px', color: '#78350f' }}>
                          ✓ Can approve claims
                        </span>
                      )}
                      <span style={{ fontSize: '12px', padding: '4px 8px', background: '#fde68a', borderRadius: '4px', color: '#78350f' }}>
                        ✓ Can view history
                      </span>
                      <span style={{ fontSize: '12px', padding: '4px 8px', background: '#fde68a', borderRadius: '4px', color: '#78350f' }}>
                        ✓ Can export data
                      </span>
                    </div>
                  </div>

                  {/* Company Designated Trips */}
                  <div style={{ marginTop: '12px', padding: '12px', background: '#ede9fe', borderRadius: '8px', border: '1px solid #ddd6fe' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Briefcase style={{ width: '16px', height: '16px', color: '#7c3aed' }} />
                        <p style={{ fontSize: '13px', color: '#6b21a8', fontWeight: '600' }}>Company Official Trips</p>
                      </div>
                      <button
                        onClick={() => handleCreateTrip(employee)}
                        style={{ padding: '4px 8px', background: '#a78bfa', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}
                      >
                        + Add Trip
                      </button>
                    </div>
                    <div style={{ fontSize: '13px', color: '#6b21a8' }}>
                      <div style={{ padding: '8px', background: 'white', borderRadius: '6px', marginBottom: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <p style={{ fontWeight: '600', marginBottom: '2px' }}>Regional Office Visit</p>
                          <p style={{ fontSize: '11px', color: '#6b7280' }}>Karachi • 2024-01-15</p>
                        </div>
                        <span style={{ fontSize: '11px', padding: '4px 8px', background: '#d1fae5', color: '#059669', borderRadius: '4px' }}>Completed</span>
                      </div>
                      <div style={{ padding: '8px', background: '#fef3c7', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <p style={{ fontWeight: '600', marginBottom: '2px' }}>Supplier Meeting</p>
                          <p style={{ fontSize: '11px', color: '#6b7280' }}>Lahore • 2024-01-20</p>
                        </div>
                        <span style={{ fontSize: '11px', padding: '4px 8px', background: '#fef3c7', color: '#d97706', borderRadius: '4px' }}>Upcoming</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details with Analytics */}
                {expandedEmployees.has(employee.id) && (
                  <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '2px solid #e5e7eb' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '20px' }}>Employee Analytics & Details</h4>
                    
                    {/* Analytics Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                      <div style={{ padding: '16px', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <Fuel style={{ width: '20px', height: '20px', color: '#0284c7' }} />
                          <p style={{ fontSize: '12px', color: '#0c4a6e', fontWeight: '600' }}>Fuel Usage</p>
                        </div>
                        <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#075985' }}>45L</p>
                        <p style={{ fontSize: '12px', color: '#0284c7' }}>of {employee.allowed_quota_liters}L quota</p>
                      </div>
                      
                      <div style={{ padding: '16px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #86efac' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <FileText style={{ width: '20px', height: '20px', color: '#059669' }} />
                          <p style={{ fontSize: '12px', color: '#064e3b', fontWeight: '600' }}>Total Claims</p>
                        </div>
                        <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#047857' }}>12</p>
                        <p style={{ fontSize: '12px', color: '#059669' }}>This month</p>
                      </div>
                      
                      <div style={{ padding: '16px', background: '#fef3c7', borderRadius: '8px', border: '1px solid #fde68a' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <CheckCircle style={{ width: '20px', height: '20px', color: '#d97706' }} />
                          <p style={{ fontSize: '12px', color: '#78350f', fontWeight: '600' }}>Approval Rate</p>
                        </div>
                        <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#92400e' }}>92%</p>
                        <p style={{ fontSize: '12px', color: '#d97706' }}>12/13 approved</p>
                      </div>
                      
                      <div style={{ padding: '16px', background: '#f5f3ff', borderRadius: '8px', border: '1px solid #c4b5fd' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <Clock style={{ width: '20px', height: '20px', color: '#7c3aed' }} />
                          <p style={{ fontSize: '12px', color: '#581c87', fontWeight: '600' }}>Avg Response</p>
                        </div>
                        <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#6b21a8' }}>2.5h</p>
                        <p style={{ fontSize: '12px', color: '#7c3aed' }}>per claim</p>
                      </div>
                    </div>

                    {/* Additional Details */}
                    <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                      <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                        <p style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>📊 Monthly Stats</p>
                        <div style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.8' }}>
                          <p>• Claims Submitted: 12</p>
                          <p>• Claims Approved: 11</p>
                          <p>• Claims Rejected: 1</p>
                          <p>• Total Cost: Rs 45,000</p>
                        </div>
                      </div>

                      <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                        <p style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>🎯 Recent Activity</p>
                        <div style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.8' }}>
                          <p>• Last claim: 2 days ago</p>
                          <p>• Last login: 5 hours ago</p>
                          <p>• Active zones: {employee.allowed_zones?.length || 0}/5</p>
                          <p>• Department: {employee.department || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                  <button
                    onClick={() => handleSendNotification(employee)}
                    title="Send Notification"
                    style={{
                      padding: '8px',
                      background: '#dbeafe',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      color: '#2563eb'
                    }}
                  >
                    <Bell style={{ width: '18px', height: '18px' }} />
                  </button>
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

      {/* Notification Modal */}
      {showNotificationModal && selectedEmployeeForNotification && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827' }}>Send Notification</h2>
              <button
                onClick={() => {
                  setShowNotificationModal(false);
                  setNotificationMessage("");
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  color: '#6b7280'
                }}
              >
                <X style={{ width: '24px', height: '24px' }} />
              </button>
            </div>

            <div style={{ marginBottom: '16px', padding: '12px', background: '#f3f4f6', borderRadius: '8px' }}>
              <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>To:</p>
              <p style={{ fontSize: '15px', fontWeight: '600', color: '#111827' }}>
                {selectedEmployeeForNotification.name} ({selectedEmployeeForNotification.email})
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                Notification Type
              </label>
              <select
                value={notificationType}
                onChange={(e) => setNotificationType(e.target.value as any)}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}
              >
                <option value="info">ℹ️ Info</option>
                <option value="warning">⚠️ Warning</option>
                <option value="success">✅ Success</option>
                <option value="error">❌ Error</option>
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                Message
              </label>
              <textarea
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
                placeholder="Enter your message here..."
                rows={4}
                style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', resize: 'vertical' }}
              />
            </div>

            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                checked={sendEmailToo}
                onChange={(e) => setSendEmailToo(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              <label style={{ fontSize: '14px', color: '#374151', cursor: 'pointer' }}>
                Also send as email notification
              </label>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  setShowNotificationModal(false);
                  setNotificationMessage("");
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitNotification}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'linear-gradient(90deg, #2563eb, #1e40af)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Send style={{ width: '16px', height: '16px' }} />
                Send Notification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trip Creation Modal */}
      {showTripModal && selectedEmployeeForTrip && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          overflowY: 'auto',
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            width: '90%',
            maxWidth: '600px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827' }}>Create Official Trip</h2>
                <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
                  For: {selectedEmployeeForTrip.name} ({selectedEmployeeForTrip.email})
                </p>
              </div>
              <button
                onClick={() => {
                  setShowTripModal(false);
                  setTripForm({
                    vehicle_id: "",
                    trip_type: "Head Office",
                    destination: "",
                    start_location: "",
                    purpose: "",
                  });
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  color: '#6b7280'
                }}
              >
                <X style={{ width: '24px', height: '24px' }} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Vehicle <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <select
                  value={tripForm.vehicle_id}
                  onChange={(e) => setTripForm({...tripForm, vehicle_id: e.target.value})}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}
                >
                  <option value="">Select vehicle...</option>
                  {isLoadingVehicles ? (
                    <option>Loading vehicles...</option>
                  ) : (
                    vehicles.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.reg_no} {vehicle.model ? `- ${vehicle.model}` : ''}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Trip Type <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <select
                  value={tripForm.trip_type}
                  onChange={(e) => setTripForm({...tripForm, trip_type: e.target.value})}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}
                >
                  <option value="Head Office">🏢 Head Office Visit</option>
                  <option value="Official Visit">🏛️ Official Visit</option>
                  <option value="Field Work">🌾 Field Work</option>
                  <option value="Supplier Meeting">🤝 Supplier Meeting</option>
                  <option value="Client Visit">👥 Client Visit</option>
                  <option value="Training">📚 Training</option>
                  <option value="Other">📍 Other</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Destination <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="text"
                  value={tripForm.destination}
                  onChange={(e) => setTripForm({...tripForm, destination: e.target.value})}
                  placeholder="e.g., Karachi Head Office"
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Start Location
                </label>
                <input
                  type="text"
                  value={tripForm.start_location}
                  onChange={(e) => setTripForm({...tripForm, start_location: e.target.value})}
                  placeholder="Auto-detected from GPS"
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Trip Purpose
                </label>
                <textarea
                  value={tripForm.purpose}
                  onChange={(e) => setTripForm({...tripForm, purpose: e.target.value})}
                  placeholder="Brief description of the trip purpose..."
                  rows={3}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', resize: 'vertical' }}
                />
              </div>

              <div style={{ 
                padding: '12px', 
                background: '#ede9fe', 
                borderRadius: '8px',
                border: '1px solid #ddd6fe'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Route style={{ width: '16px', height: '16px', color: '#7c3aed' }} />
                  <p style={{ fontSize: '13px', fontWeight: '600', color: '#6b21a8' }}>Location Tracking Enabled</p>
                </div>
                <p style={{ fontSize: '12px', color: '#6b21a8' }}>
                  Your location will be tracked throughout the trip. Make sure to enable GPS tracking for toll tax receipts and fuel purchases.
                </p>
              </div>

              <div style={{ 
                padding: '12px', 
                background: '#fef3c7', 
                borderRadius: '8px',
                border: '1px solid #fde68a'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <FileCheck style={{ width: '16px', height: '16px', color: '#d97706' }} />
                  <p style={{ fontSize: '13px', fontWeight: '600', color: '#92400e' }}>Receipt & Expense Tracking</p>
                </div>
                <p style={{ fontSize: '12px', color: '#78350f' }}>
                  After creating the trip, you can add toll tax receipts, fuel receipts, and other expenses with timestamps and location logs.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button
                onClick={() => {
                  setShowTripModal(false);
                  setTripForm({
                    vehicle_id: "",
                    trip_type: "Head Office",
                    destination: "",
                    start_location: "",
                    purpose: "",
                  });
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitTrip}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'linear-gradient(90deg, #2563eb, #1e40af)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Route style={{ width: '16px', height: '16px' }} />
                Create Trip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

