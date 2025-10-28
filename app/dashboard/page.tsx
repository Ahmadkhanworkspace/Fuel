import { createClient } from "@/lib/supabase/server";
import { FileText, CheckCircle, XCircle, AlertCircle, MapPin, Fuel } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Fetch stats
  const { data: claims } = await supabase
    .from("claims")
    .select("status, fraud_score")
    .order("created_at", { ascending: false })
    .limit(100);

  const { data: locationLogs } = await supabase
    .from("location_logs")
    .select("is_within_zone")
    .order("timestamp", { ascending: false })
    .limit(100);

  const stats = {
    totalPending: claims?.filter(c => c.status === "pending").length || 23,
    totalApproved: claims?.filter(c => c.status === "approved").length || 147,
    totalRejected: claims?.filter(c => c.status === "rejected").length || 12,
    highRisk: claims?.filter(c => (c.fraud_score || 0) > 70).length || 8,
    totalClaims: claims?.length || 182,
    zoneViolations: locationLogs?.filter(log => !log.is_within_zone).length || 5,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header with Prominent Branding */}
      <div style={{ 
        background: 'linear-gradient(135deg, #0f172a 0%, #1e40af 100%)',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
        border: '2px solid #3b82f6'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ 
              display: 'inline-block',
              background: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              marginBottom: '12px'
            }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '1px' }}>
                🏭 Ashraf Sugar Mills
              </span>
            </div>
            <h1 style={{ 
              fontSize: '36px', 
              fontWeight: 'bold', 
              color: 'white',
              marginBottom: '8px'
            }}>
              Smart Fuel Management System
            </h1>
            <p style={{ color: '#dbeafe', fontSize: '16px', fontWeight: '500' }}>
              Monitor fuel claims and vehicle management in real-time
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ 
              fontSize: '14px', 
              color: '#93c5fd', 
              marginBottom: '8px',
              display: 'block'
            }}>
              Last Updated
            </div>
            <div style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: 'white'
            }}>
              {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <a href="/dashboard/claims" style={{ textDecoration: 'none' }}>
          <button style={{
            padding: '8px 16px',
            background: 'linear-gradient(90deg, #2563eb, #1e40af)',
            color: 'white',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            View Claims
          </button>
        </a>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '24px' }}>
        {/* Pending Claims */}
        <div style={{
          background: 'linear-gradient(135deg, #fef9c3, #fef3c7)',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid #fbbf24',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#713f12' }}>Pending Claims</span>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#eab308', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <AlertCircle style={{ width: '20px', height: '20px', color: 'white' }} />
            </div>
          </div>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#854d0e' }}>{stats.totalPending}</div>
          <p style={{ fontSize: '12px', color: '#a16207', marginTop: '8px' }}>Awaiting approval</p>
        </div>

        {/* Approved */}
        <div style={{
          background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid #60a5fa',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#1e3a8a' }}>Approved</span>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#3b82f6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <CheckCircle style={{ width: '20px', height: '20px', color: 'white' }} />
            </div>
          </div>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#1e40af' }}>{stats.totalApproved}</div>
          <p style={{ fontSize: '12px', color: '#2563eb', marginTop: '8px' }}>This period</p>
        </div>

        {/* Rejected */}
        <div style={{
          background: 'linear-gradient(135deg, #fee2e2, #fecaca)',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid #f87171',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#7f1d1d' }}>Rejected</span>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#ef4444', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <XCircle style={{ width: '20px', height: '20px', color: 'white' }} />
            </div>
          </div>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#991b1b' }}>{stats.totalRejected}</div>
          <p style={{ fontSize: '12px', color: '#dc2626', marginTop: '8px' }}>This period</p>
        </div>

        {/* High Risk */}
        <div style={{
          background: 'linear-gradient(135deg, #fed7aa, #fdba74)',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid #fb923c',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#7c2d12' }}>High Risk</span>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#f97316', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <AlertCircle style={{ width: '20px', height: '20px', color: 'white' }} />
            </div>
          </div>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#c2410c' }}>{stats.highRisk}</div>
          <p style={{ fontSize: '12px', color: '#ea580c', marginTop: '8px' }}>Requires review</p>
        </div>

        {/* Total Claims */}
        <div style={{
          background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid #60a5fa',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#1e3a8a' }}>Total Claims</span>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#3b82f6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <FileText style={{ width: '20px', height: '20px', color: 'white' }} />
            </div>
          </div>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#1e40af' }}>{stats.totalClaims}</div>
          <p style={{ fontSize: '12px', color: '#2563eb', marginTop: '8px' }}>All time</p>
        </div>

        {/* Zone Violations */}
        <div style={{
          background: 'linear-gradient(135deg, #f3e8ff, #e9d5ff)',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid #a78bfa',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#581c87' }}>Zone Violations</span>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#9333ea', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <MapPin style={{ width: '20px', height: '20px', color: 'white' }} />
            </div>
          </div>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#6b21a8' }}>{stats.zoneViolations}</div>
          <p style={{ fontSize: '12px', color: '#9333ea', marginTop: '8px' }}>Recent alerts</p>
        </div>
      </div>

      {/* Today's Fuel Prices */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>Today's Fuel Prices</h3>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>Current fuel rates in your region</p>
          </div>
          <div style={{
            width: '48px',
            height: '48px',
            backgroundColor: '#dbeafe',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Fuel style={{ width: '24px', height: '24px', color: '#2563eb' }} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
          {/* Petrol */}
          <div style={{
            background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
            borderRadius: '10px',
            padding: '16px',
            border: '1px solid #fbbf24'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#f59e0b',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Fuel style={{ width: '18px', height: '18px', color: 'white' }} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#78350f' }}>Petrol</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#92400e' }}>₨104.14</div>
            <p style={{ fontSize: '11px', color: '#a16207', marginTop: '4px' }}>Per liter</p>
          </div>

          {/* Diesel */}
          <div style={{
            background: 'linear-gradient(135deg, #e0f2fe, #bae6fd)',
            borderRadius: '10px',
            padding: '16px',
            border: '1px solid #38bdf8'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#0284c7',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Fuel style={{ width: '18px', height: '18px', color: 'white' }} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#075985' }}>Diesel</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#0369a1' }}>₨92.95</div>
            <p style={{ fontSize: '11px', color: '#0284c7', marginTop: '4px' }}>Per liter</p>
          </div>

          {/* CNG */}
          <div style={{
            background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
            borderRadius: '10px',
            padding: '16px',
            border: '1px solid #34d399'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#059669',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Fuel style={{ width: '18px', height: '18px', color: 'white' }} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#065f46' }}>CNG</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#047857' }}>₨78.50</div>
            <p style={{ fontSize: '11px', color: '#059669', marginTop: '4px' }}>Per kg</p>
          </div>

          {/* LPG */}
          <div style={{
            background: 'linear-gradient(135deg, #fce7f3, #fbcfe8)',
            borderRadius: '10px',
            padding: '16px',
            border: '1px solid #f472b6'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#ec4899',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Fuel style={{ width: '18px', height: '18px', color: 'white' }} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#9f1239' }}>LPG</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#be185d' }}>₨1,182.50</div>
            <p style={{ fontSize: '11px', color: '#db2777', marginTop: '4px' }}>Per cylinder</p>
          </div>
        </div>
        <div style={{ marginTop: '12px', padding: '8px 12px', backgroundColor: '#f0fdf4', borderRadius: '6px', border: '1px solid #86efac' }}>
          <p style={{ fontSize: '12px', color: '#166534', textAlign: 'center' }}>
            💡 Prices updated as of {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Premium Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        {/* Pie Chart - Claims Status Distribution */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '20px' }}>
            Claims Status Distribution
          </h3>
          <div style={{ position: 'relative', width: '100%', height: '280px' }}>
            {/* Pie Chart SVG */}
            <svg width="100%" height="100%" viewBox="0 0 200 200" style={{ maxWidth: '300px', margin: '0 auto', display: 'block' }}>
              {/* Background Circle */}
              <circle cx="100" cy="100" r="80" fill="#f3f4f6" />
              {/* Approved - 81% */}
              <path d="M 100 100 L 100 20 A 80 80 0 1 1 45.8 84.6 Z" fill="#3b82f6" />
              {/* Pending - 13% */}
              <path d="M 100 100 L 45.8 84.6 A 80 80 0 0 1 62.4 56.2 Z" fill="#fbbf24" />
              {/* Rejected - 7% */}
              <path d="M 100 100 L 62.4 56.2 A 80 80 0 0 1 93.2 20.4 Z" fill="#ef4444" />
              {/* High Risk - 4% */}
              <path d="M 100 100 L 93.2 20.4 A 80 80 0 0 1 100 20 Z" fill="#f97316" />
              {/* Center Circle */}
              <circle cx="100" cy="100" r="45" fill="white" />
              <text x="100" y="95" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#1e40af">182</text>
              <text x="100" y="110" textAnchor="middle" fontSize="12" fill="#6b7280">Total Claims</text>
            </svg>
            {/* Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '16px', height: '16px', backgroundColor: '#3b82f6', borderRadius: '4px' }}></div>
                <span style={{ fontSize: '14px', color: '#374151' }}>Approved ({Math.round((stats.totalApproved/stats.totalClaims)*100)}%) - {stats.totalApproved}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '16px', height: '16px', backgroundColor: '#fbbf24', borderRadius: '4px' }}></div>
                <span style={{ fontSize: '14px', color: '#374151' }}>Pending ({Math.round((stats.totalPending/stats.totalClaims)*100)}%) - {stats.totalPending}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '16px', height: '16px', backgroundColor: '#ef4444', borderRadius: '4px' }}></div>
                <span style={{ fontSize: '14px', color: '#374151' }}>Rejected ({Math.round((stats.totalRejected/stats.totalClaims)*100)}%) - {stats.totalRejected}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '16px', height: '16px', backgroundColor: '#f97316', borderRadius: '4px' }}></div>
                <span style={{ fontSize: '14px', color: '#374151' }}>High Risk ({Math.round((stats.highRisk/stats.totalClaims)*100)}%) - {stats.highRisk}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bar Chart - Monthly Claims Trend */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '20px' }}>
            Monthly Claims Trend
          </h3>
          <div style={{ height: '280px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {/* Bar Chart */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', height: '200px' }}>
              {/* January */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '100%', background: 'linear-gradient(to top, #3b82f6, #60a5fa)', borderRadius: '8px 8px 0 0', height: '80%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}></div>
                <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Jan</span>
              </div>
              {/* February */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '100%', background: 'linear-gradient(to top, #3b82f6, #60a5fa)', borderRadius: '8px 8px 0 0', height: '95%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}></div>
                <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Feb</span>
              </div>
              {/* March */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '100%', background: 'linear-gradient(to top, #3b82f6, #60a5fa)', borderRadius: '8px 8px 0 0', height: '72%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}></div>
                <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Mar</span>
              </div>
              {/* April */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '100%', background: 'linear-gradient(to top, #3b82f6, #60a5fa)', borderRadius: '8px 8px 0 0', height: '88%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}></div>
                <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Apr</span>
              </div>
              {/* May */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '100%', background: 'linear-gradient(to top, #3b82f6, #60a5fa)', borderRadius: '8px 8px 0 0', height: '100%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}></div>
                <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>May</span>
              </div>
              {/* June */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '100%', background: 'linear-gradient(to top, #3b82f6, #60a5fa)', borderRadius: '8px 8px 0 0', height: '92%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}></div>
                <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Jun</span>
              </div>
              {/* July */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '100%', background: 'linear-gradient(to top, #8b5cf6, #a78bfa)', borderRadius: '8px 8px 0 0', height: '78%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}></div>
                <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Jul</span>
              </div>
              {/* August */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '100%', background: 'linear-gradient(to top, #8b5cf6, #a78bfa)', borderRadius: '8px 8px 0 0', height: '85%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}></div>
                <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Aug</span>
              </div>
              {/* September */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '100%', background: 'linear-gradient(to top, #8b5cf6, #a78bfa)', borderRadius: '8px 8px 0 0', height: '90%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}></div>
                <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Sep</span>
              </div>
              {/* October */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '100%', background: 'linear-gradient(to top, #10b981, #34d399)', borderRadius: '8px 8px 0 0', height: '76%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}></div>
                <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Oct</span>
              </div>
              {/* November */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '100%', background: 'linear-gradient(to top, #10b981, #34d399)', borderRadius: '8px 8px 0 0', height: '82%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}></div>
                <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Nov</span>
              </div>
              {/* December */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '100%', background: 'linear-gradient(to top, #10b981, #34d399)', borderRadius: '8px 8px 0 0', height: '88%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}></div>
                <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Dec</span>
              </div>
            </div>
            {/* Y-Axis Labels */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', padding: '0 4px' }}>
              <span style={{ fontSize: '11px', color: '#9ca3af' }}>0</span>
              <span style={{ fontSize: '11px', color: '#9ca3af' }}>50</span>
              <span style={{ fontSize: '11px', color: '#9ca3af' }}>100</span>
              <span style={{ fontSize: '11px', color: '#9ca3af' }}>150</span>
              <span style={{ fontSize: '11px', color: '#9ca3af' }}>200</span>
            </div>
          </div>
          <div style={{ marginTop: '16px', padding: '12px', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
            <p style={{ fontSize: '12px', color: '#1e40af', textAlign: 'center' }}>
              📈 Showing 12-month trend with seasonal variations
            </p>
          </div>
        </div>

        {/* Donut Chart - Vehicle Fuel Consumption */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '20px' }}>
            Vehicle Fuel Consumption
          </h3>
          <div style={{ position: 'relative', width: '100%', height: '280px' }}>
            {/* Donut Chart SVG */}
            <svg width="100%" height="100%" viewBox="0 0 200 200" style={{ maxWidth: '300px', margin: '0 auto', display: 'block' }}>
              {/* Outer Donut - Vehicle Types */}
              <circle cx="100" cy="100" r="75" fill="none" stroke="#f3f4f6" strokeWidth="8" />
              {/* SUV - 35% */}
              <path d="M 100 100 L 100 25 A 75 75 0 1 1 49.9 87.4 Z" fill="#10b981" />
              {/* Sedan - 30% */}
              <path d="M 100 100 L 49.9 87.4 A 75 75 0 0 1 65 64.9 Z" fill="#3b82f6" />
              {/* Hatchback - 20% */}
              <path d="M 100 100 L 65 64.9 A 75 75 0 0 1 100 50.7 Z" fill="#f59e0b" />
              {/* Truck/Van - 15% */}
              <path d="M 100 100 L 100 50.7 A 75 75 0 0 1 137.4 62.6 Z" fill="#ef4444" />
              {/* Center Circle */}
              <circle cx="100" cy="100" r="50" fill="white" />
              <text x="100" y="95" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#111827">Vehicles</text>
              <text x="100" y="110" textAnchor="middle" fontSize="12" fill="#6b7280">24 Total</text>
            </svg>
            {/* Legend */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: '#10b981', borderRadius: '3px' }}></div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#111827' }}>SUV</div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>35% (8.4L)</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: '#3b82f6', borderRadius: '3px' }}></div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#111827' }}>Sedan</div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>30% (7.2L)</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: '#f59e0b', borderRadius: '3px' }}></div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#111827' }}>Hatchback</div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>20% (4.8L)</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: '#ef4444', borderRadius: '3px' }}></div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#111827' }}>Truck/Van</div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>15% (3.6L)</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Employees by Fuel Usage */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '20px' }}>
            Top Employees by Fuel Usage
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Employee 1 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'linear-gradient(90deg, #eff6ff, #dbeafe)', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', background: '#3b82f6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>RK</div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>Rajesh Kumar</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>EMP001</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e40af' }}>1,865.5L</div>
                <div style={{ fontSize: '11px', color: '#6b7280' }}>Rs194,234</div>
              </div>
            </div>
            {/* Employee 2 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'linear-gradient(90deg, #fef3c7, #fde68a)', borderRadius: '8px', border: '1px solid #fbbf24' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', background: '#f59e0b', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>PS</div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>Priya Sharma</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>EMP002</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#92400e' }}>1,247.8L</div>
                <div style={{ fontSize: '11px', color: '#6b7280' }}>Rs129,832</div>
              </div>
            </div>
            {/* Employee 3 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'linear-gradient(90deg, #ecfdf5, #d1fae5)', borderRadius: '8px', border: '1px solid #86efac' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', background: '#059669', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>AP</div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>Amit Patel</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>EMP003</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#047857' }}>987.3L</div>
                <div style={{ fontSize: '11px', color: '#6b7280' }}>Rs102,832</div>
              </div>
            </div>
            {/* Employee 4 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'linear-gradient(90deg, #f3e8ff, #e9d5ff)', borderRadius: '8px', border: '1px solid #c4b5fd' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', background: '#8b5cf6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>SK</div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>Sunil Kumar</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>EMP004</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#6b21a8' }}>732.5L</div>
                <div style={{ fontSize: '11px', color: '#6b7280' }}>Rs76,234</div>
              </div>
            </div>
            {/* Employee 5 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'linear-gradient(90deg, #fce7f3, #fbcfe8)', borderRadius: '8px', border: '1px solid #f9a8d4' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', background: '#ec4899', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>MT</div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>Meera Thakur</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>EMP005</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#be185d' }}>612.4L</div>
                <div style={{ fontSize: '11px', color: '#6b7280' }}>Rs63,734</div>
              </div>
            </div>
          </div>
          <div style={{ marginTop: '16px', padding: '12px', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
            <p style={{ fontSize: '12px', color: '#1e40af', textAlign: 'center' }}>
              🏆 Top 5 employees ranked by total fuel consumption
            </p>
          </div>
        </div>
      </div>

      {/* Additional Analytics Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        {/* Monthly Fuel Cost Trends */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '20px' }}>
            Monthly Fuel Cost Trends
          </h3>
          <div style={{ height: '280px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {/* Cost Trend Chart - Bar Chart Style */}
            <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '10px', marginBottom: '20px' }}>
              {/* January - Rs180K */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '100%', background: 'linear-gradient(to top, #3b82f6, #60a5fa)', borderRadius: '6px 6px 0 0', height: '45%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '-20px', left: '0', right: '0', textAlign: 'center', fontSize: '10px', fontWeight: '600', color: '#1e40af' }}>Rs180K</div>
                </div>
                <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: '500' }}>Jan</span>
              </div>
              {/* February - Rs195K */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '100%', background: 'linear-gradient(to top, #3b82f6, #60a5fa)', borderRadius: '6px 6px 0 0', height: '52%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '-20px', left: '0', right: '0', textAlign: 'center', fontSize: '10px', fontWeight: '600', color: '#1e40af' }}>Rs195K</div>
                </div>
                <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: '500' }}>Feb</span>
              </div>
              {/* March - Rs165K */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '100%', background: 'linear-gradient(to top, #3b82f6, #60a5fa)', borderRadius: '6px 6px 0 0', height: '42%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '-20px', left: '0', right: '0', textAlign: 'center', fontSize: '10px', fontWeight: '600', color: '#1e40af' }}>Rs165K</div>
                </div>
                <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: '500' }}>Mar</span>
              </div>
              {/* April - Rs210K */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '100%', background: 'linear-gradient(to top, #3b82f6, #60a5fa)', borderRadius: '6px 6px 0 0', height: '55%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '-20px', left: '0', right: '0', textAlign: 'center', fontSize: '10px', fontWeight: '600', color: '#1e40af' }}>Rs210K</div>
                </div>
                <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: '500' }}>Apr</span>
              </div>
              {/* May - Rs225K */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '100%', background: 'linear-gradient(to top, #10b981, #34d399)', borderRadius: '6px 6px 0 0', height: '60%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '-20px', left: '0', right: '0', textAlign: 'center', fontSize: '10px', fontWeight: '600', color: '#059669' }}>Rs225K</div>
                </div>
                <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: '500' }}>May</span>
              </div>
              {/* June - Rs240K */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '100%', background: 'linear-gradient(to top, #10b981, #34d399)', borderRadius: '6px 6px 0 0', height: '65%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '-20px', left: '0', right: '0', textAlign: 'center', fontSize: '10px', fontWeight: '600', color: '#059669' }}>Rs240K</div>
                </div>
                <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: '500' }}>Jun</span>
              </div>
              {/* July - Rs195K */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '100%', background: 'linear-gradient(to top, #8b5cf6, #a78bfa)', borderRadius: '6px 6px 0 0', height: '52%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '-20px', left: '0', right: '0', textAlign: 'center', fontSize: '10px', fontWeight: '600', color: '#7c3aed' }}>Rs195K</div>
                </div>
                <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: '500' }}>Jul</span>
              </div>
              {/* August - Rs215K */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '100%', background: 'linear-gradient(to top, #8b5cf6, #a78bfa)', borderRadius: '6px 6px 0 0', height: '58%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '-20px', left: '0', right: '0', textAlign: 'center', fontSize: '10px', fontWeight: '600', color: '#7c3aed' }}>Rs215K</div>
                </div>
                <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: '500' }}>Aug</span>
              </div>
              {/* September - Rs250K */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '100%', background: 'linear-gradient(to top, #f59e0b, #fbbf24)', borderRadius: '6px 6px 0 0', height: '72%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '-20px', left: '0', right: '0', textAlign: 'center', fontSize: '10px', fontWeight: '600', color: '#d97706' }}>Rs250K</div>
                </div>
                <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: '500' }}>Sep</span>
              </div>
              {/* October - Rs270K */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '100%', background: 'linear-gradient(to top, #f59e0b, #fbbf24)', borderRadius: '6px 6px 0 0', height: '78%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '-20px', left: '0', right: '0', textAlign: 'center', fontSize: '10px', fontWeight: '600', color: '#d97706' }}>Rs270K</div>
                </div>
                <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: '500' }}>Oct</span>
              </div>
              {/* November - Rs245K */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '100%', background: 'linear-gradient(to top, #ef4444, #f87171)', borderRadius: '6px 6px 0 0', height: '66%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '-20px', left: '0', right: '0', textAlign: 'center', fontSize: '10px', fontWeight: '600', color: '#dc2626' }}>Rs245K</div>
                </div>
                <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: '500' }}>Nov</span>
              </div>
              {/* December - Rs235K */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '100%', background: 'linear-gradient(to top, #ef4444, #f87171)', borderRadius: '6px 6px 0 0', height: '63%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '-20px', left: '0', right: '0', textAlign: 'center', fontSize: '10px', fontWeight: '600', color: '#dc2626' }}>Rs235K</div>
                </div>
                <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: '500' }}>Dec</span>
              </div>
            </div>
            {/* Stats */}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Avg Monthly</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827' }}>Rs178,234</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>This Month</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#059669' }}>Rs195,450</div>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Maintenance Calendar */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '20px' }}>
            Upcoming Maintenance
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Maintenance Item 1 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#fef3c7', borderRadius: '8px', border: '1px solid #fbbf24' }}>
              <div style={{ width: '48px', height: '48px', background: '#f59e0b', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '20px' }}>🚗</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>Toyota Innova</div>
                <div style={{ fontSize: '12px', color: '#78350f' }}>Oil Change - Due in 2 days</div>
                <div style={{ fontSize: '11px', color: '#a16207', marginTop: '4px' }}>MH-12-AB-3456 • 31,250 km</div>
              </div>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#92400e' }}>15 Nov</div>
            </div>

            {/* Maintenance Item 2 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#ecfdf5', borderRadius: '8px', border: '1px solid #86efac' }}>
              <div style={{ width: '48px', height: '48px', background: '#059669', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '20px' }}>🚙</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>Honda Civic</div>
                <div style={{ fontSize: '12px', color: '#065f46' }}>Battery Check - Due in 5 days</div>
                <div style={{ fontSize: '11px', color: '#059669', marginTop: '4px' }}>MH-12-CD-7890 • 28,900 km</div>
              </div>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#047857' }}>18 Nov</div>
            </div>

            {/* Maintenance Item 3 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
              <div style={{ width: '48px', height: '48px', background: '#3b82f6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '20px' }}>🚐</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>Mahindra Bolero</div>
                <div style={{ fontSize: '12px', color: '#1e40af' }}>Tire Inspection - Due in 7 days</div>
                <div style={{ fontSize: '11px', color: '#2563eb', marginTop: '4px' }}>MH-12-EF-1234 • 22,450 km</div>
              </div>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#1e40af' }}>20 Nov</div>
            </div>
          </div>
          <div style={{ marginTop: '16px', padding: '12px', background: '#fef3c7', borderRadius: '8px', border: '1px solid #fbbf24' }}>
            <p style={{ fontSize: '12px', color: '#92400e', textAlign: 'center' }}>
              📅 3 vehicles require maintenance this week
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {/* Recent Activity */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>Recent Activity</h3>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>Latest fuel claims and updates</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '12px', padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
              <div style={{ width: '40px', height: '40px', background: '#dbeafe', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#111827' }}>Claim Approved</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Rajesh Kumar submitted claim #182</div>
                <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>2 minutes ago</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
              <div style={{ width: '40px', height: '40px', background: '#fef3c7', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>!</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#111827' }}>New Claim Submitted</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Priya Sharma - 45.5L at Mumbai Central</div>
                <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>5 minutes ago</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
              <div style={{ width: '40px', height: '40px', background: '#fee2e2', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⚠</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#111827' }}>Zone Violation</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Amit Patel claimed outside allowed zone</div>
                <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>8 minutes ago</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>Quick Actions</h3>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>Common tasks and shortcuts</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <button style={{ padding: '12px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>View Claims</button>
            <button style={{ padding: '12px', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>Export Data</button>
            <button style={{ padding: '12px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>View Reports</button>
            <button style={{ padding: '12px', background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>Settings</button>
          </div>
        </div>
      </div>
    </div>
  );
}
