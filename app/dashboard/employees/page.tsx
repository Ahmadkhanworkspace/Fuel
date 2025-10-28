"use client";

import { useState } from "react";
import { 
  Users, Plus, Edit, Trash2, Mail, Phone, MapPin, Settings, 
  AlertCircle, CheckCircle, Clock, Car, Fuel, FileText, 
  CreditCard, Shield, Printer, Calendar, TrendingUp, Search, Filter, X,
  Ban, Unlock, Lock, MapPinned
} from "lucide-react";

export default function EmployeesPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  const [employees, setEmployees] = useState([
    {
      id: "1",
      employee_code: "EMP001",
      name: "Rajesh Kumar",
      email: "rajesh.kumar@asms.com",
      phone: "+92-300-1234567",
      role: "employee",
      zone_id: "zone-1",
      allowed_quota_liters: 100,
      current_usage_liters: 45,
      status: "active",
      is_banned: false,
      allowed_zones: ["zone-1", "zone-2"], // Zones where employee can claim
      created_at: "2024-01-15",
      
      driver_license: {
        number: "PK-12345-67",
        expiry_date: "2026-12-31",
        verification_status: "verified"
      },
      
      assigned_vehicle: {
        id: "veh-1",
        reg_no: "ABC-123",
        model: "Toyota Corolla 2020",
        ownership_type: "Company Owned",
        handover_date: "2024-01-20",
        handover_mileage: 25000,
        current_mileage: 31250,
        total_driven: 6250,
        condition_at_handover: "Excellent - Minor scratches only"
      },
      
      maintenance_logs: [
        { date: "2024-10-20", type: "Oil Change", mileage: 31000, cost: 3500 },
        { date: "2024-08-15", type: "Battery Replacement", mileage: 29000, cost: 5000 }
      ],
      
      fuel_claims_summary: {
        total_claims: 45,
        total_liters: 1865.5,
        total_amount: 195234,
        last_claim_date: "2024-10-27"
      },
      
      app_restrictions: {
        enableCamera: true,
        requireLocation: true,
        maxDailyClaims: 3,
        requireNoncePhoto: true,
        offlineMode: true
      }
    },
    {
      id: "2",
      employee_code: "EMP002",
      name: "Priya Sharma",
      email: "priya.sharma@asms.com",
      phone: "+92-300-1234568",
      role: "employee",
      zone_id: "zone-2",
      allowed_quota_liters: 80,
      current_usage_liters: 60,
      status: "active",
      is_banned: false,
      allowed_zones: ["zone-2", "zone-3"],
      created_at: "2024-02-20",
      
      driver_license: {
        number: "PK-67890-12",
        expiry_date: "2027-06-30",
        verification_status: "verified"
      },
      
      assigned_vehicle: {
        id: "veh-2",
        reg_no: "XYZ-789",
        model: "Honda Civic 2019",
        ownership_type: "Leased",
        lease_company: "ABC Lease Co",
        lease_start: "2024-02-01",
        lease_end: "2027-01-31",
        handover_date: "2024-02-05",
        handover_mileage: 42000,
        current_mileage: 47800,
        total_driven: 5800,
        condition_at_handover: "Good - Regular wear and tear"
      },
      
      maintenance_logs: [
        { date: "2024-09-10", type: "Tire Replacement", mileage: 47000, cost: 8000 },
        { date: "2024-07-20", type: "Brake Service", mileage: 45000, cost: 6000 }
      ],
      
      fuel_claims_summary: {
        total_claims: 38,
        total_liters: 1520.8,
        total_amount: 159832,
        last_claim_date: "2024-10-25"
      },
      
      app_restrictions: {
        enableCamera: true,
        requireLocation: true,
        maxDailyClaims: 2,
        requireNoncePhoto: true,
        offlineMode: false
      }
    }
  ]);

  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    employee_code: "",
    designation: "",
    username: "",
    password: "",
    role: "employee",
    is_driver: false,
    zone_id: "zone-1",
    allowed_quota_liters: 100,
    driver_license: {
      number: "",
      expiry_date: "",
      front_image: "",
      back_image: ""
    },
    assigned_vehicle: {
      reg_no: "",
      model: "",
      ownership_type: "Company Owned",
      lease_company: "",
      lease_start: "",
      lease_end: "",
      handover_mileage: "",
      condition_at_handover: ""
    },
    app_restrictions: {
      enableCamera: true,
      requireLocation: true,
      maxDailyClaims: 3,
      requireNoncePhoto: true,
      offlineMode: true
    }
  });

  const [activeFormTab, setActiveFormTab] = useState("basic");

  const handleAddEmployee = () => {
    const employee = {
      id: Date.now().toString(),
      employee_code: `EMP${String(employees.length + 1).padStart(3, '0')}`,
      name: newEmployee.name,
      email: newEmployee.email,
      phone: newEmployee.phone,
      role: newEmployee.role,
      is_banned: false,
      allowed_zones: [],
      current_usage_liters: 0,
      zone_id: newEmployee.role === "employee" ? "zone-1" : null,
      allowed_quota_liters: newEmployee.allowed_quota_liters,
      created_at: new Date().toISOString().split('T')[0],
      status: "active",
      driver_license: newEmployee.driver_license || {
        number: "",
        expiry_date: "",
        verification_status: "pending"
      },
      assigned_vehicle: newEmployee.assigned_vehicle || null,
      maintenance_logs: [],
      fuel_claims_summary: {
        total_claims: 0,
        total_liters: 0,
        total_amount: 0,
        last_claim_date: "N/A"
      },
      app_restrictions: newEmployee.app_restrictions || {
        enableCamera: true,
        requireLocation: true,
        maxDailyClaims: 3,
        requireNoncePhoto: true,
        offlineMode: true
      }
    };
    setEmployees([...employees, employee] as any);
    setShowAddModal(false);
    setNewEmployee({
      name: "",
      email: "",
      phone: "",
      employee_code: "",
      designation: "",
      username: "",
      password: "",
      role: "employee",
      is_driver: false,
      zone_id: "zone-1",
      allowed_quota_liters: 100,
      driver_license: {
        number: "",
        expiry_date: "",
        front_image: "",
        back_image: ""
      },
      assigned_vehicle: {
        reg_no: "",
        model: "",
        ownership_type: "Company Owned",
        lease_company: "",
        lease_start: "",
        lease_end: "",
        handover_mileage: "",
        condition_at_handover: ""
      },
      app_restrictions: {
        enableCamera: true,
        requireLocation: true,
        maxDailyClaims: 3,
        requireNoncePhoto: true,
        offlineMode: true
      }
    });
  };

  const handleDeleteEmployee = (id: string) => {
    const employee = employees.find(emp => emp.id === id);
    if (!employee) return;
    
    if (window.confirm(`Are you sure you want to delete "${employee.name}"? This action cannot be undone.`)) {
      setEmployees(employees.filter(emp => emp.id !== id));
      alert(`Employee "${employee.name}" has been deleted successfully!`);
    }
  };

  const toggleBanEmployee = (id: string) => {
    const employee = employees.find(emp => emp.id === id);
    if (!employee) return;
    
    const action = employee.is_banned ? 'unban' : 'ban';
    const confirmMsg = employee.is_banned 
      ? `Are you sure you want to unban ${employee.name}?`
      : `Are you sure you want to ban ${employee.name}? This will prevent them from submitting fuel claims.`;
    
    if (window.confirm(confirmMsg)) {
      setEmployees(employees.map(emp => 
        emp.id === id 
          ? { ...emp, is_banned: !emp.is_banned, status: !emp.is_banned ? 'banned' : 'active' }
          : emp
      ));
      alert(`Employee ${employee.is_banned ? 'unbanned' : 'banned'} successfully!`);
    }
  };

  const openZoneRestrictionModal = (id: string) => {
    const employee = employees.find(emp => emp.id === id);
    if (!employee) return;
    
    const zones = ['zone-1', 'zone-2', 'zone-3', 'zone-4', 'zone-5'];
    const currentZones = employee.allowed_zones || [];
    
    const zoneInputs = zones.map(zone => 
      `<label style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #f9fafb; border-radius: 6px;">
        <input type="checkbox" ${currentZones.includes(zone) ? 'checked' : ''} value="${zone}" name="zones">
        <span style="font-weight: 500;">${zone.toUpperCase()}</span>
      </label>`
    ).join('');
    
    const html = `
      <div style="padding: 20px;">
        <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 16px;">Zone Restrictions for ${employee.name}</h3>
        <p style="color: #6b7280; font-size: 14px; margin-bottom: 16px;">
          Select zones where this employee can submit fuel claims. If no zones are selected, they cannot submit claims.
        </p>
        <div style="display: flex; flex-direction: column; gap: 8px; max-height: 300px; overflow-y: auto; border: 1px solid #e5e7eb; padding: 12px; border-radius: 8px;">
          ${zoneInputs}
        </div>
      </div>
    `;
    
    const container = document.createElement('div');
    container.innerHTML = html;
    
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    const selectedZones: string[] = [];
    
    checkboxes.forEach((checkbox) => {
      if ((checkbox as HTMLInputElement).checked) selectedZones.push((checkbox as HTMLInputElement).value);
    });
    
    const newWindow = window.open('', '_blank', 'width=500,height=400');
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>Zone Restrictions - ${employee.name}</title>
            <style>
              body { font-family: system-ui, sans-serif; margin: 0; }
              label { cursor: pointer; }
            </style>
          </head>
          <body>${html}</body>
        </html>
      `);
      
      newWindow.document.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement;
        if (target.type === 'checkbox' && target.name === 'zones') {
          if (target.checked) {
            selectedZones.push(target.value);
          } else {
            selectedZones.splice(selectedZones.indexOf(target.value), 1);
          }
        }
      });
    }
    
    // Simple version with prompt for now
    const availableZones = ['zone-1', 'zone-2', 'zone-3', 'zone-4', 'zone-5'];
    const input = prompt(
      `Set allowed zones for ${employee.name} (comma-separated)\nAvailable: ${availableZones.join(', ')}\nCurrent: ${currentZones.join(', ') || 'none'}`
    );
    
    if (input !== null) {
      const allowedZones = input.split(',').map(z => z.trim().toLowerCase()).filter(Boolean);
      setEmployees(employees.map(emp => 
        emp.id === id 
          ? { ...emp, allowed_zones: allowedZones }
          : emp
      ));
      alert(`Zone restrictions updated for ${employee.name}!\nAllowed zones: ${allowedZones.join(', ') || 'none'}`);
    }
  };

  // Filter and Search Logic
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      searchQuery === "" ||
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employee_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.phone.includes(searchQuery) ||
      (emp.assigned_vehicle && emp.assigned_vehicle.reg_no.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesRole = filterRole === "all" || emp.role === filterRole;
    const matchesStatus = filterStatus === "all" || 
      (filterStatus === "banned" && emp.is_banned) ||
      (filterStatus === "active" && emp.status === "active" && !emp.is_banned) ||
      (filterStatus === "inactive" && emp.status === "inactive" && !emp.is_banned);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);

  const totalEmployees = filteredEmployees.length;
  const activeEmployees = filteredEmployees.filter(e => e.status === 'active').length;
  const totalQuota = filteredEmployees.reduce((sum, e) => sum + e.allowed_quota_liters, 0);
  const withRestrictions = filteredEmployees.filter(e => e.app_restrictions.maxDailyClaims > 0).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 'bold', background: 'linear-gradient(90deg, #2563eb, #1e40af)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' }}>
            Employee Management
          </h1>
          <p style={{ color: '#4b5563', fontSize: '14px' }}>
            Manage employees, vehicles, quotas, and restrictions
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
          }}
        >
          <Plus style={{ width: '18px', height: '18px' }} />
            Add Employee
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#dbeafe', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users style={{ width: '20px', height: '20px', color: '#2563eb' }} />
            </div>
            <div>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Total Employees</p>
              <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>{totalEmployees}</p>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#d1fae5', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle style={{ width: '20px', height: '20px', color: '#059669' }} />
            </div>
            <div>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Active</p>
              <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#047857' }}>{activeEmployees}</p>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#fef3c7', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertCircle style={{ width: '20px', height: '20px', color: '#d97706' }} />
            </div>
            <div>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Quota Limit</p>
              <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#92400e' }}>{totalQuota}L</p>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#fce7f3', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Settings style={{ width: '20px', height: '20px', color: '#db2777' }} />
            </div>
            <div>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>With Restrictions</p>
              <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#be185d' }}>{withRestrictions}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
          {/* Search Input - Full Width */}
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: '#9ca3af' }} />
            <input
              type="text"
              placeholder="Search by name, code, email, phone, vehicle..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                width: '100%',
                padding: '10px 16px 10px 40px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  padding: '4px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <X style={{ width: '16px', height: '16px', color: '#9ca3af' }} />
              </button>
            )}
          </div>

          {/* Filters Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
            {/* Role Filter */}
            <select
              value={filterRole}
              onChange={(e) => {
                setFilterRole(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                padding: '10px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white',
                width: '100%',
                boxSizing: 'border-box'
              }}
            >
              <option value="all">All Roles</option>
              <option value="employee">Employee</option>
              <option value="approver">Approver</option>
              <option value="admin">Admin</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                padding: '10px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white',
                width: '100%',
                boxSizing: 'border-box'
              }}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="banned">Banned</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', color: '#6b7280' }}>
          <p>Showing {startIndex + 1}-{Math.min(endIndex, filteredEmployees.length)} of {filteredEmployees.length} employees</p>
          {searchQuery && (
            <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter style={{ width: '16px', height: '16px' }} />
              Active Filters
            </p>
          )}
        </div>
      </div>

      {/* Detailed Employee Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {paginatedEmployees.map((employee) => {
          const usagePercent = employee.allowed_quota_liters > 0 
            ? (employee.current_usage_liters / employee.allowed_quota_liters) * 100 
            : 0;
          const totalMaintenanceCost = employee.maintenance_logs?.reduce((sum, log) => sum + log.cost, 0) || 0;
          
          return (
            <div key={employee.id}             style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '16px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              border: '1px solid #e5e7eb',
              width: '100%',
              boxSizing: 'border-box',
              overflow: 'hidden'
            }}>
              {/* Employee Header */}
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', paddingBottom: '20px', borderBottom: '2px solid #e5e7eb', gap: '16px' }}>
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px', flexWrap: 'wrap' }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      backgroundColor: '#dbeafe',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Users style={{ width: '30px', height: '30px', color: '#2563eb' }} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>
                        {employee.name}
                      </h3>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', color: '#6b7280' }}>{employee.employee_code}</span>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '9999px',
                          fontSize: '12px',
                          fontWeight: '500',
                          backgroundColor: employee.status === 'active' ? '#d1fae5' : '#fee2e2',
                          color: employee.status === 'active' ? '#059669' : '#dc2626'
                        }}>
                          {employee.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '0' }}>
                      <Mail style={{ width: '16px', height: '16px', color: '#6b7280', flexShrink: 0 }} />
                      <span style={{ fontSize: '14px', color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{employee.email}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '0' }}>
                      <Phone style={{ width: '16px', height: '16px', color: '#6b7280', flexShrink: 0 }} />
                      <span style={{ fontSize: '14px', color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{employee.phone}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '0' }}>
                      <Shield style={{ width: '16px', height: '16px', color: '#6b7280', flexShrink: 0 }} />
                      <span style={{ fontSize: '14px', color: '#374151', textTransform: 'capitalize' }}>{employee.role}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => toggleBanEmployee(employee.id)}
                    style={{ 
                      padding: '8px', 
                      border: employee.is_banned ? '1px solid #ef4444' : 'none', 
                      background: employee.is_banned ? '#fee2e2' : '#f3f4f6', 
                      borderRadius: '8px', 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                    title={employee.is_banned ? 'Unban user' : 'Ban user'}
                  >
                    {employee.is_banned ? (
                      <>
                        <Unlock style={{ width: '18px', height: '18px', color: '#10b981' }} />
                        <span style={{ fontSize: '12px', color: '#10b981', fontWeight: '600' }}>Unban</span>
                      </>
                    ) : (
                      <>
                        <Ban style={{ width: '18px', height: '18px', color: '#ef4444' }} />
                        <span style={{ fontSize: '12px', color: '#ef4444', fontWeight: '600' }}>Ban</span>
                      </>
                    )}
                  </button>
                  <button 
                    onClick={() => openZoneRestrictionModal(employee.id)}
                    style={{ 
                      padding: '8px', 
                      border: 'none', 
                      background: '#f3f4f6', 
                      borderRadius: '8px', 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                    title="Zone Restrictions"
                  >
                    <MapPinned style={{ width: '18px', height: '18px', color: '#8b5cf6' }} />
                    <span style={{ fontSize: '12px', color: '#8b5cf6', fontWeight: '600' }}>Zones</span>
                  </button>
                  <button 
                    onClick={() => setSelectedEmployee(employee as any)}
                    style={{ padding: '8px', border: 'none', background: '#f3f4f6', borderRadius: '8px', cursor: 'pointer' }}
                    title="Edit employee"
                  >
                    <Edit style={{ width: '18px', height: '18px', color: '#2563eb' }} />
                  </button>
                  <button
                    onClick={() => handleDeleteEmployee(employee.id)}
                    style={{ padding: '8px', border: 'none', background: '#f3f4f6', borderRadius: '8px', cursor: 'pointer' }}
                    title="Delete employee"
                  >
                    <Trash2 style={{ width: '18px', height: '18px', color: '#dc2626' }} />
                  </button>
                </div>
              </div>

              {/* Main Content Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                
                {/* Driver License */}
                <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <CreditCard style={{ width: '20px', height: '20px', color: '#2563eb' }} />
                    <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>Driver License</h4>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div>
                      <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>License Number</p>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>{employee.driver_license.number}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Expiry Date</p>
                      <p style={{ fontSize: '14px', color: '#111827' }}>{new Date(employee.driver_license.expiry_date).toLocaleDateString('en-IN')}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Status</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {employee.driver_license.verification_status === 'verified' ? (
                          <>
                            <CheckCircle style={{ width: '14px', height: '14px', color: '#10b981' }} />
                            <span style={{ fontSize: '12px', color: '#059669', fontWeight: '500' }}>Verified</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle style={{ width: '14px', height: '14px', color: '#ef4444' }} />
                            <span style={{ fontSize: '12px', color: '#dc2626', fontWeight: '500' }}>Pending</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Assigned Vehicle */}
                {employee.assigned_vehicle && (
                  <div style={{ padding: '16px', backgroundColor: '#f0f9ff', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                      <Car style={{ width: '20px', height: '20px', color: '#2563eb' }} />
                      <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>Assigned Vehicle</h4>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div>
                        <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Registration</p>
                        <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e40af' }}>{employee.assigned_vehicle.reg_no}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Model</p>
                        <p style={{ fontSize: '14px', color: '#111827' }}>{employee.assigned_vehicle.model}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Ownership</p>
                        <p style={{ fontSize: '14px', color: '#111827' }}>{employee.assigned_vehicle.ownership_type}</p>
                      </div>
                      {employee.assigned_vehicle.lease_company && (
                        <div>
                          <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Lease Company</p>
                          <p style={{ fontSize: '14px', color: '#111827' }}>{employee.assigned_vehicle.lease_company}</p>
                        </div>
                      )}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px' }}>
                        <div>
                          <p style={{ fontSize: '11px', color: '#6b7280', marginBottom: '2px' }}>Handover</p>
                          <p style={{ fontSize: '12px', fontWeight: '500', color: '#111827' }}>{employee.assigned_vehicle.handover_mileage.toLocaleString()} km</p>
                        </div>
                        <div>
                          <p style={{ fontSize: '11px', color: '#6b7280', marginBottom: '2px' }}>Current</p>
                          <p style={{ fontSize: '12px', fontWeight: '500', color: '#111827' }}>{employee.assigned_vehicle.current_mileage.toLocaleString()} km</p>
                        </div>
                      </div>
                      <div style={{ marginTop: '8px', padding: '8px', backgroundColor: '#dbeafe', borderRadius: '6px' }}>
                        <p style={{ fontSize: '11px', color: '#6b7280', marginBottom: '2px' }}>Total Driven</p>
                        <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e40af' }}>{employee.assigned_vehicle.total_driven.toLocaleString()} km</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Fuel Claims Summary */}
                <div style={{ padding: '16px', backgroundColor: '#fef3c7', borderRadius: '12px', border: '1px solid #fde68a' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <Fuel style={{ width: '20px', height: '20px', color: '#d97706' }} />
                    <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>Fuel Claims</h4>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '12px', color: '#92400e' }}>Total Claims:</span>
                      <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#78350f' }}>{employee.fuel_claims_summary.total_claims}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '12px', color: '#92400e' }}>Total Liters:</span>
                      <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#78350f' }}>{employee.fuel_claims_summary.total_liters.toFixed(1)}L</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '12px', color: '#92400e' }}>Total Amount:</span>
                      <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#78350f' }}>₨{employee.fuel_claims_summary.total_amount.toLocaleString()}</span>
                    </div>
                    <div style={{ marginTop: '8px', padding: '8px', backgroundColor: '#fef9c3', borderRadius: '6px', border: '1px solid #fde68a' }}>
                      <p style={{ fontSize: '10px', color: '#92400e', marginBottom: '4px' }}>Current Usage</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#78350f' }}>{usagePercent.toFixed(0)}%</span>
                        <span style={{ fontSize: '12px', color: '#a16207' }}>{employee.current_usage_liters}/{employee.allowed_quota_liters}L</span>
                      </div>
                      <div style={{ marginTop: '4px', height: '4px', backgroundColor: '#fef3c7', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${usagePercent}%`,
                          backgroundColor: usagePercent > 80 ? '#dc2626' : usagePercent > 50 ? '#f59e0b' : '#10b981',
                          borderRadius: '2px'
                        }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Maintenance Summary */}
                {employee.maintenance_logs && employee.maintenance_logs.length > 0 && (
                  <div style={{ padding: '16px', backgroundColor: '#ecfdf5', borderRadius: '12px', border: '1px solid #86efac' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                      <Clock style={{ width: '20px', height: '20px', color: '#059669' }} />
                      <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>Maintenance</h4>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '12px', color: '#065f46' }}>Total Services:</span>
                        <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#047857' }}>{employee.maintenance_logs.length}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '12px', color: '#065f46' }}>Total Cost:</span>
                        <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#047857' }}>₨{totalMaintenanceCost.toLocaleString()}</span>
                      </div>
                      <div style={{ marginTop: '8px' }}>
                        <p style={{ fontSize: '11px', color: '#065f46', marginBottom: '4px' }}>Recent Maintenance</p>
                        {employee.maintenance_logs.slice(0, 2).map((log, idx) => (
                          <div key={idx} style={{ fontSize: '12px', color: '#047857', marginBottom: '2px' }}>
                            {log.type} - {new Date(log.date).toLocaleDateString('en-IN')}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Account Status & Zone Restrictions */}
                <div style={{ padding: '16px', backgroundColor: employee.is_banned ? '#fee2e2' : '#f3f4f6', borderRadius: '12px', border: employee.is_banned ? '1px solid #ef4444' : '1px solid #d1d5db' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Shield style={{ width: '20px', height: '20px', color: employee.is_banned ? '#ef4444' : '#6b7280' }} />
                      <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>Account Status</h4>
                    </div>
                    {employee.is_banned && (
                      <span style={{ 
                        padding: '4px 12px', 
                        borderRadius: '9999px', 
                        fontSize: '12px', 
                        fontWeight: '600', 
                        backgroundColor: '#ef4444', 
                        color: 'white' 
                      }}>
                        BANNED
                      </span>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span style={{ color: '#6b7280' }}>Status:</span>
                      <span style={{ fontWeight: '600', color: employee.status === 'active' ? '#10b981' : '#ef4444' }}>
                        {employee.status.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span style={{ color: '#6b7280' }}>Allowed Zones:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>
                        {employee.allowed_zones && employee.allowed_zones.length > 0 ? employee.allowed_zones.length : 'NONE'}
                      </span>
                    </div>
                  </div>
                  
                  {employee.allowed_zones && employee.allowed_zones.length > 0 && (
                    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #d1d5db' }}>
                      <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '6px' }}>Zone Access:</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {employee.allowed_zones.map((zone, idx) => (
                          <span key={idx} style={{ 
                            padding: '2px 8px', 
                            borderRadius: '4px', 
                            fontSize: '10px', 
                            backgroundColor: '#dbeafe', 
                            color: '#2563eb',
                            fontWeight: '600'
                          }}>
                            {zone.toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* App Restrictions */}
                <div style={{ padding: '16px', backgroundColor: '#f3f4f6', borderRadius: '12px', border: '1px solid #d1d5db' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <Settings style={{ width: '20px', height: '20px', color: '#6b7280' }} />
                    <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>App Restrictions</h4>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span style={{ color: '#6b7280' }}>Max Daily Claims:</span>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{employee.app_restrictions.maxDailyClaims}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span style={{ color: '#6b7280' }}>GPS Required:</span>
                      <CheckCircle style={{ width: '14px', height: '14px', color: employee.app_restrictions.requireLocation ? '#10b981' : '#9ca3af' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span style={{ color: '#6b7280' }}>Nonce Photo:</span>
                      <CheckCircle style={{ width: '14px', height: '14px', color: employee.app_restrictions.requireNoncePhoto ? '#10b981' : '#9ca3af' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span style={{ color: '#6b7280' }}>Offline Mode:</span>
                      <CheckCircle style={{ width: '14px', height: '14px', color: employee.app_restrictions.offlineMode ? '#10b981' : '#9ca3af' }} />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          );
        })}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{
                padding: '8px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                backgroundColor: currentPage === 1 ? '#f9fafb' : 'white',
                color: currentPage === 1 ? '#9ca3af' : '#374151',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Previous
            </button>
            
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      style={{
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        backgroundColor: page === currentPage ? '#2563eb' : 'white',
                        color: page === currentPage ? 'white' : '#374151',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        minWidth: '40px'
                      }}
                    >
                      {page}
                    </button>
                  );
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return <span key={page} style={{ padding: '8px' }}>...</span>;
                }
                return null;
              })}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{
                padding: '8px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                backgroundColor: currentPage === totalPages ? '#f9fafb' : 'white',
                color: currentPage === totalPages ? '#9ca3af' : '#374151',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Next
            </button>
          </div>
        )}

        {/* No Results */}
        {filteredEmployees.length === 0 && (
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '48px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <Users style={{ width: '48px', height: '48px', color: '#9ca3af', margin: '0 auto 16px' }} />
            <p style={{ fontSize: '16px', fontWeight: '500', color: '#111827', marginBottom: '8px' }}>No employees found</p>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Add Employee Modal - Comprehensive */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          overflow: 'auto',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '32px',
            width: '90%',
            maxWidth: '900px',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 25px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{ fontSize: '28px', fontWeight: '600', color: '#111827', marginBottom: '24px' }}>
              Add New Employee
            </h2>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>
              <button
                onClick={() => setActiveFormTab("basic")}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  background: 'transparent',
                  color: activeFormTab === "basic" ? '#2563eb' : '#6b7280',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  borderBottom: activeFormTab === "basic" ? '2px solid #2563eb' : '2px solid transparent',
                  marginBottom: '-10px'
                }}
              >
                Basic Info
              </button>
              <button
                onClick={() => setActiveFormTab("license")}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  background: 'transparent',
                  color: activeFormTab === "license" ? '#2563eb' : '#6b7280',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  borderBottom: activeFormTab === "license" ? '2px solid #2563eb' : '2px solid transparent',
                  marginBottom: '-10px'
                }}
              >
                License & Vehicle
              </button>
              <button
                onClick={() => setActiveFormTab("settings")}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  background: 'transparent',
                  color: activeFormTab === "settings" ? '#2563eb' : '#6b7280',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  borderBottom: activeFormTab === "settings" ? '2px solid #2563eb' : '2px solid transparent',
                  marginBottom: '-10px'
                }}
              >
                Settings & Restrictions
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
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Designation *</label>
                      <input
                        type="text"
                        value={newEmployee.designation}
                        onChange={(e) => setNewEmployee({...newEmployee, designation: e.target.value})}
                        placeholder="Driver, Manager, etc."
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                      />
                    </div>
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
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Phone *</label>
                      <input
                        type="tel"
                        value={newEmployee.phone}
                        onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                        placeholder="+92-300-1234567"
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Username *</label>
                      <input
                        type="text"
                        value={newEmployee.username}
                        onChange={(e) => setNewEmployee({...newEmployee, username: e.target.value})}
                        placeholder="rajesh.kumar"
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Password *</label>
                      <input
                        type="password"
                        value={newEmployee.password}
                        onChange={(e) => setNewEmployee({...newEmployee, password: e.target.value})}
                        placeholder="Enter password"
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Role *</label>
                      <select
                        value={newEmployee.role}
                        onChange={(e) => setNewEmployee({...newEmployee, role: e.target.value})}
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                      >
                        <option value="employee">Employee</option>
                        <option value="approver">Approver</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Allowed Fuel Quota (L) *</label>
                      <input
                        type="number"
                        value={newEmployee.allowed_quota_liters}
                        onChange={(e) => setNewEmployee({...newEmployee, allowed_quota_liters: parseInt(e.target.value)})}
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: '16px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={newEmployee.is_driver}
                        onChange={(e) => setNewEmployee({...newEmployee, is_driver: e.target.checked})}
                        style={{ width: '18px', height: '18px' }}
                      />
                      <span style={{ fontSize: '14px', color: '#374151' }}>Is Driver (Requires vehicle assignment)</span>
                    </label>
                  </div>
                </div>
              )}

              {/* License & Vehicle Tab */}
              {activeFormTab === "license" && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {/* Driver License */}
                  <div style={{ padding: '20px', backgroundColor: '#f9fafb', borderRadius: '12px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>Driver License Information</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>License Number</label>
                        <input
                          type="text"
                          value={newEmployee.driver_license.number}
                          onChange={(e) => setNewEmployee({
                            ...newEmployee,
                            driver_license: {...newEmployee.driver_license, number: e.target.value}
                          })}
                          placeholder="PK-12345-67"
                          style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Expiry Date</label>
                        <input
                          type="date"
                          value={newEmployee.driver_license.expiry_date}
                          onChange={(e) => setNewEmployee({
                            ...newEmployee,
                            driver_license: {...newEmployee.driver_license, expiry_date: e.target.value}
                          })}
                          style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                        />
                      </div>
                    </div>
                    <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>License Front Image</label>
                        <div style={{ border: '2px dashed #d1d5db', borderRadius: '8px', padding: '20px', textAlign: 'center', backgroundColor: 'white', cursor: 'pointer' }}>
                          <CreditCard style={{ width: '32px', height: '32px', color: '#9ca3af', margin: '0 auto 8px' }} />
                          <p style={{ fontSize: '12px', color: '#6b7280' }}>Click to upload front</p>
                        </div>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>License Back Image</label>
                        <div style={{ border: '2px dashed #d1d5db', borderRadius: '8px', padding: '20px', textAlign: 'center', backgroundColor: 'white', cursor: 'pointer' }}>
                          <CreditCard style={{ width: '32px', height: '32px', color: '#9ca3af', margin: '0 auto 8px' }} />
                          <p style={{ fontSize: '12px', color: '#6b7280' }}>Click to upload back</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Assignment */}
                  <div style={{ padding: '20px', backgroundColor: '#f0f9ff', borderRadius: '12px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>Vehicle Assignment</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Vehicle Registration</label>
                        <input
                          type="text"
                          value={newEmployee.assigned_vehicle.reg_no}
                          onChange={(e) => setNewEmployee({
                            ...newEmployee,
                            assigned_vehicle: {...newEmployee.assigned_vehicle, reg_no: e.target.value}
                          })}
                          placeholder="ABC-123"
                          style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Vehicle Model</label>
                        <input
                          type="text"
                          value={newEmployee.assigned_vehicle.model}
                          onChange={(e) => setNewEmployee({
                            ...newEmployee,
                            assigned_vehicle: {...newEmployee.assigned_vehicle, model: e.target.value}
                          })}
                          placeholder="Toyota Corolla 2020"
                          style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Ownership Type</label>
                        <select
                          value={newEmployee.assigned_vehicle.ownership_type}
                          onChange={(e) => setNewEmployee({
                            ...newEmployee,
                            assigned_vehicle: {...newEmployee.assigned_vehicle, ownership_type: e.target.value}
                          })}
                          style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                        >
                          <option value="Company Owned">Company Owned</option>
                          <option value="Leased">Leased</option>
                        </select>
                      </div>
                      {newEmployee.assigned_vehicle.ownership_type === "Leased" && (
                        <>
                          <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Lease Company</label>
                            <input
                              type="text"
                              value={newEmployee.assigned_vehicle.lease_company}
                              onChange={(e) => setNewEmployee({
                                ...newEmployee,
                                assigned_vehicle: {...newEmployee.assigned_vehicle, lease_company: e.target.value}
                              })}
                              placeholder="ABC Lease Co"
                              style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Lease Start Date</label>
                            <input
                              type="date"
                              value={newEmployee.assigned_vehicle.lease_start}
                              onChange={(e) => setNewEmployee({
                                ...newEmployee,
                                assigned_vehicle: {...newEmployee.assigned_vehicle, lease_start: e.target.value}
                              })}
                              style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Lease End Date</label>
                            <input
                              type="date"
                              value={newEmployee.assigned_vehicle.lease_end}
                              onChange={(e) => setNewEmployee({
                                ...newEmployee,
                                assigned_vehicle: {...newEmployee.assigned_vehicle, lease_end: e.target.value}
                              })}
                              style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                            />
                          </div>
                        </>
                      )}
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Handover Mileage</label>
                        <input
                          type="number"
                          value={newEmployee.assigned_vehicle.handover_mileage}
                          onChange={(e) => setNewEmployee({
                            ...newEmployee,
                            assigned_vehicle: {...newEmployee.assigned_vehicle, handover_mileage: e.target.value}
                          })}
                          placeholder="25000"
                          style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                        />
                      </div>
                    </div>
                    <div style={{ marginTop: '16px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Condition at Handover</label>
                      <textarea
                        value={newEmployee.assigned_vehicle.condition_at_handover}
                        onChange={(e) => setNewEmployee({
                          ...newEmployee,
                          assigned_vehicle: {...newEmployee.assigned_vehicle, condition_at_handover: e.target.value}
                        })}
                        placeholder="Excellent - Minor scratches only"
                        rows={3}
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', resize: 'vertical' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Settings & Restrictions Tab */}
              {activeFormTab === "settings" && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ padding: '20px', backgroundColor: '#fef3c7', borderRadius: '12px', border: '1px solid #fde68a' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>App Restrictions</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: 'white', borderRadius: '8px' }}>
                        <span style={{ fontSize: '14px', color: '#374151' }}>Require GPS Location</span>
                        <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                          <input
                            type="checkbox"
                            checked={newEmployee.app_restrictions.requireLocation}
                            onChange={(e) => setNewEmployee({
                              ...newEmployee,
                              app_restrictions: {...newEmployee.app_restrictions, requireLocation: e.target.checked}
                            })}
                            style={{ opacity: 0, width: 0, height: 0 }}
                          />
                          <span style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: newEmployee.app_restrictions.requireLocation ? '#2563eb' : '#d1d5db',
                            borderRadius: '24px',
                            transition: '.4s',
                            cursor: 'pointer'
                          }}>
                            <span style={{
                              position: 'absolute',
                              height: '18px',
                              width: '18px',
                              left: newEmployee.app_restrictions.requireLocation ? '22px' : '3px',
                              bottom: '3px',
                              backgroundColor: 'white',
                              borderRadius: '50%',
                              transition: '.4s'
                            }} />
                          </span>
                        </label>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: 'white', borderRadius: '8px' }}>
                        <span style={{ fontSize: '14px', color: '#374151' }}>Require Nonce Photo</span>
                        <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                          <input
                            type="checkbox"
                            checked={newEmployee.app_restrictions.requireNoncePhoto}
                            onChange={(e) => setNewEmployee({
                              ...newEmployee,
                              app_restrictions: {...newEmployee.app_restrictions, requireNoncePhoto: e.target.checked}
                            })}
                            style={{ opacity: 0, width: 0, height: 0 }}
                          />
                          <span style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: newEmployee.app_restrictions.requireNoncePhoto ? '#2563eb' : '#d1d5db',
                            borderRadius: '24px',
                            transition: '.4s',
                            cursor: 'pointer'
                          }}>
                            <span style={{
                              position: 'absolute',
                              height: '18px',
                              width: '18px',
                              left: newEmployee.app_restrictions.requireNoncePhoto ? '22px' : '3px',
                              bottom: '3px',
                              backgroundColor: 'white',
                              borderRadius: '50%',
                              transition: '.4s'
                            }} />
                          </span>
                        </label>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: 'white', borderRadius: '8px' }}>
                        <span style={{ fontSize: '14px', color: '#374151' }}>Enable Offline Mode</span>
                        <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                          <input
                            type="checkbox"
                            checked={newEmployee.app_restrictions.offlineMode}
                            onChange={(e) => setNewEmployee({
                              ...newEmployee,
                              app_restrictions: {...newEmployee.app_restrictions, offlineMode: e.target.checked}
                            })}
                            style={{ opacity: 0, width: 0, height: 0 }}
                          />
                          <span style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: newEmployee.app_restrictions.offlineMode ? '#2563eb' : '#d1d5db',
                            borderRadius: '24px',
                            transition: '.4s',
                            cursor: 'pointer'
                          }}>
                            <span style={{
                              position: 'absolute',
                              height: '18px',
                              width: '18px',
                              left: newEmployee.app_restrictions.offlineMode ? '22px' : '3px',
                              bottom: '3px',
                              backgroundColor: 'white',
                              borderRadius: '50%',
                              transition: '.4s'
                            }} />
                          </span>
                        </label>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Max Daily Claims</label>
                        <input
                          type="number"
                          value={newEmployee.app_restrictions.maxDailyClaims}
                          onChange={(e) => setNewEmployee({
                            ...newEmployee,
                            app_restrictions: {...newEmployee.app_restrictions, maxDailyClaims: parseInt(e.target.value)}
                          })}
                          style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
              <button
                onClick={handleAddEmployee}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  background: 'linear-gradient(90deg, #2563eb, #1e40af)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Add Employee
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  backgroundColor: '#f3f4f6',
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
