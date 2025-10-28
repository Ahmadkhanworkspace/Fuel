"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Search, Filter, Download, FileDown, FileText, CheckSquare, Square } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ClaimsTable() {
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClaims, setSelectedClaims] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [bulkActionMode, setBulkActionMode] = useState(false);

  useEffect(() => {
    fetchClaims();
    
    // Auto-refresh every 30 seconds to get new claims
    const interval = setInterval(fetchClaims, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('claims')
        .select(`
          *,
          employee:employees(id, name, employee_code, email),
          vehicle:vehicles(id, reg_no, model)
        `)
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      
      // Transform data to match the table structure
      const transformedClaims = (data || []).map((claim: any) => ({
        id: claim.id,
        employee_name: claim.employee?.name || 'Unknown',
        employee_code: claim.employee?.employee_code || '',
        reg_no: claim.vehicle?.reg_no || 'N/A',
        liters: claim.liters_claimed || 0,
        price: claim.price || 0,
        odometer: claim.odometer_reading || 0,
        status: claim.status || 'pending',
        fraud_score: claim.fraud_score || 0,
        gps_lat: claim.gps_lat,
        gps_lng: claim.gps_lng,
        photos: claim.photos,
        ocr_text: claim.ocr_text,
        created_at: claim.created_at,
      }));
      
      setClaims(transformedClaims);
    } catch (error) {
      console.error('Error fetching claims:', error);
      // Fall back to mock data if database fetch fails
      setClaims([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredClaims = claims.filter((claim) => {
    const matchesSearch =
      claim.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.reg_no.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || claim.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = async (claimId: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('claims')
        .update({ status: 'approved' })
        .eq('id', claimId);
      
      if (error) throw error;
      
      alert('Claim approved successfully!');
      fetchClaims(); // Refresh list
    } catch (error: any) {
      alert('Error approving claim: ' + error.message);
    }
  };

  const handleReject = async (claimId: string) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;
    
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('claims')
        .update({ 
          status: 'rejected',
          rejection_reason: reason 
        })
        .eq('id', claimId);
      
      if (error) throw error;
      
      alert('Claim rejected successfully!');
      fetchClaims(); // Refresh list
    } catch (error: any) {
      alert('Error rejecting claim: ' + error.message);
    }
  };

  const handleBulkApprove = async () => {
    if (selectedClaims.length === 0) {
      alert("Please select claims to approve");
      return;
    }
    
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('claims')
        .update({ status: 'approved' })
        .in('id', selectedClaims);
      
      if (error) throw error;
      
      alert(`Approved ${selectedClaims.length} claims successfully!`);
      setSelectedClaims([]);
      setBulkActionMode(false);
      fetchClaims();
    } catch (error: any) {
      alert('Error approving claims: ' + error.message);
    }
  };

  const handleBulkReject = async () => {
    if (selectedClaims.length === 0) {
      alert("Please select claims to reject");
      return;
    }
    const reason = prompt("Enter rejection reason:");
    if (reason) {
      console.log("Rejecting claims:", selectedClaims, "Reason:", reason);
      alert(`Rejected ${selectedClaims.length} claims`);
      setSelectedClaims([]);
      setBulkActionMode(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedClaims.length === filteredClaims.length) {
      setSelectedClaims([]);
    } else {
      setSelectedClaims(filteredClaims.map(c => c.id));
    }
  };

  const handleSelectClaim = (claimId: string) => {
    if (selectedClaims.includes(claimId)) {
      setSelectedClaims(selectedClaims.filter(id => id !== claimId));
    } else {
      setSelectedClaims([...selectedClaims, claimId]);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Employee', 'Vehicle', 'Liters', 'Amount', 'Status', 'Risk Score', 'Date'];
    const rows = filteredClaims.map(claim => [
      claim.employee_name,
      claim.reg_no,
      claim.liters,
      claim.price,
      claim.status,
      claim.fraud_score,
      formatDate(claim.created_at)
    ]);
    
    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `claims_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleExportPDF = () => {
    // For now, export as HTML that can be printed as PDF
    window.print();
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; text: string }> = {
      pending: { bg: '#fef3c7', text: '#92400e' },
      approved: { bg: '#d1fae5', text: '#065f46' },
      rejected: { bg: '#fee2e2', text: '#991b1b' },
    };
    const style = styles[status] || { bg: '#f3f4f6', text: '#1f2937' };
    
    return (
      <span
        style={{
          padding: '4px 12px',
          fontSize: '12px',
          fontWeight: '500',
          borderRadius: '9999px',
          backgroundColor: style.bg,
          color: style.text
        }}
      >
        {status}
      </span>
    );
  };

  const getRiskBadge = (score: number) => {
    if (score > 70) return { bg: '#fee2e2', text: '#991b1b' };
    if (score > 40) return { bg: '#fed7aa', text: '#9a3412' };
    return { bg: '#d1fae5', text: '#065f46' };
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: '2-digit' });
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden', padding: '48px', textAlign: 'center' }}>
        <p style={{ color: '#6b7280' }}>Loading claims...</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
              Fuel Claims {loading && '(Loading...)'}
            </h2>
            <p style={{ fontSize: '14px', color: '#4b5563' }}>
              {filteredClaims.length} claims found {selectedClaims.length > 0 && `• ${selectedClaims.length} selected`}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={fetchClaims}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                backgroundColor: 'white',
                color: '#374151',
                cursor: 'pointer',
              }}
            >
              🔄 Refresh
            </button>
            {bulkActionMode && selectedClaims.length > 0 && (
              <>
                <button
                  onClick={handleBulkApprove}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    background: 'linear-gradient(90deg, #10b981, #059669)',
                    color: 'white',
                    fontWeight: '500'
                  }}
                >
                  <CheckCircle style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                  Approve Selected
                </button>
                <button
                  onClick={handleBulkReject}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    background: 'linear-gradient(90deg, #ef4444, #dc2626)',
                    color: 'white',
                    fontWeight: '500'
                  }}
                >
                  <XCircle style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                  Reject Selected
                </button>
              </>
            )}
            <button
              onClick={() => setBulkActionMode(!bulkActionMode)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer',
                backgroundColor: bulkActionMode ? '#dbeafe' : 'white',
                color: bulkActionMode ? '#1e40af' : '#374151'
              }}
            >
              {bulkActionMode ? <CheckSquare style={{ width: '16px', height: '16px', marginRight: '8px' }} /> : <Square style={{ width: '16px', height: '16px', marginRight: '8px' }} />}
              Bulk Actions
            </button>
            <button
              onClick={handleExportCSV}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer',
                backgroundColor: 'white'
              }}
            >
              <FileDown style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              Export CSV
            </button>
            <button
              onClick={handleExportPDF}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer',
                backgroundColor: 'white'
              }}
            >
              <FileText style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ padding: '24px', paddingBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#9ca3af' }} />
            <input
              type="text"
              placeholder="Search by employee or vehic"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '8px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              minWidth: '120px'
            }}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  {bulkActionMode && (
                    <th style={{ textAlign: 'center', padding: '12px 16px', fontSize: '14px', fontWeight: '500', color: '#374151', width: '50px' }}>
                      <button
                        onClick={handleSelectAll}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                      >
                        {selectedClaims.length === filteredClaims.length ? <CheckSquare style={{ width: '18px', height: '18px' }} /> : <Square style={{ width: '18px', height: '18px' }} />}
                      </button>
                    </th>
                  )}
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    Employee
                  </th>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                Vehicle
              </th>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                Liters
              </th>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                Amount
              </th>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                Status
              </th>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                Risk Score
              </th>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                Date
              </th>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredClaims.map((claim) => {
              const riskStyle = getRiskBadge(claim.fraud_score);
              const isSelected = selectedClaims.includes(claim.id);
              return (
                <tr key={claim.id} style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: isSelected ? '#f0f9ff' : 'transparent' }}>
                  {bulkActionMode && (
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleSelectClaim(claim.id)}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                      >
                        {isSelected ? <CheckSquare style={{ width: '18px', height: '18px', color: '#2563eb' }} /> : <Square style={{ width: '18px', height: '18px', color: '#9ca3af' }} />}
                      </button>
                    </td>
                  )}
                  <td style={{ padding: '12px 16px', color: '#111827' }}>{claim.employee_name}</td>
                  <td style={{ padding: '12px 16px', color: '#111827' }}>{claim.reg_no}</td>
                  <td style={{ padding: '12px 16px', color: '#111827' }}>{claim.liters}L</td>
                  <td style={{ padding: '12px 16px', color: '#111827' }}>{formatCurrency(claim.price)}</td>
                  <td style={{ padding: '12px 16px' }}>{getStatusBadge(claim.status)}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span
                      style={{
                        padding: '4px 12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        borderRadius: '9999px',
                        backgroundColor: riskStyle.bg,
                        color: riskStyle.text
                      }}
                    >
                      {claim.fraud_score}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#4b5563' }}>
                    {formatDate(claim.created_at)}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleApprove(claim.id)}
                        disabled={claim.status !== "pending"}
                        style={{
                          padding: '4px',
                          border: 'none',
                          background: 'transparent',
                          cursor: claim.status === "pending" ? 'pointer' : 'not-allowed',
                          opacity: claim.status !== "pending" ? 0.3 : 1
                        }}
                      >
                        <CheckCircle style={{ width: '16px', height: '16px', color: '#16a34a' }} />
                      </button>
                      <button
                        onClick={() => handleReject(claim.id)}
                        disabled={claim.status !== "pending"}
                        style={{
                          padding: '4px',
                          border: 'none',
                          background: 'transparent',
                          cursor: claim.status === "pending" ? 'pointer' : 'not-allowed',
                          opacity: claim.status !== "pending" ? 0.3 : 1
                        }}
                      >
                        <XCircle style={{ width: '16px', height: '16px', color: '#dc2626' }} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredClaims.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px', color: '#6b7280' }}>
            No claims found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
}
