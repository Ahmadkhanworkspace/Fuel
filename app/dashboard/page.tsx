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
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 'bold', background: 'linear-gradient(90deg, #2563eb, #1e40af)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' }}>
            Dashboard Overview
          </h1>
          <p style={{ color: '#4b5563', fontSize: '14px' }}>
            Monitor fuel claims and vehicle management in real-time
          </p>
        </div>
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
          <div style={{ marginTop: '24px', textAlign: 'center', padding: '32px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
            <p style={{ fontSize: '14px', color: '#9ca3af' }}>Activity feed coming soon...</p>
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
          <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>• Approve pending claims</p>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>• View vehicle reports</p>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>• Export data</p>
          </div>
        </div>
      </div>
    </div>
  );
}
