"use client";

import { FileText, CheckCircle, XCircle, AlertCircle, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [stats] = useState({
    totalPending: 23,
    totalApproved: 147,
    totalRejected: 12,
    highRisk: 8,
    totalClaims: 182,
    zoneViolations: 5,
  });

  const statCards = [
    {
      icon: FileText,
      label: 'Total Claims',
      value: stats.totalClaims.toLocaleString(),
      change: '+12.5%',
      trend: 'up',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      icon: CheckCircle,
      label: 'Approved',
      value: stats.totalApproved.toLocaleString(),
      change: '+8.2%',
      trend: 'up',
      color: 'bg-green-50 text-green-600'
    },
    {
      icon: XCircle,
      label: 'Rejected',
      value: stats.totalRejected.toLocaleString(),
      change: '-3.1%',
      trend: 'down',
      color: 'bg-red-50 text-red-600'
    },
    {
      icon: AlertCircle,
      label: 'High Risk',
      value: stats.highRisk.toLocaleString(),
      change: '+1.5%',
      trend: 'up',
      color: 'bg-orange-50 text-orange-600'
    },
  ];

  return (
    <div style={{ padding: '24px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Material Design Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: 400,
          color: '#202124', 
          marginBottom: '4px',
          letterSpacing: '0'
        }}>
          Dashboard
        </h1>
        <p style={{ 
          fontSize: '14px', 
          color: '#5f6368',
          fontWeight: 400,
          margin: 0
        }}>
          Fuel management and vehicle tracking overview
        </p>
      </div>

      {/* Stats Grid - Material Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '16px',
        marginBottom: '32px'
      }}>
        {statCards.map((stat, index) => (
          <div
            key={index}
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '20px',
              boxShadow: '0 1px 3px 0 rgba(60,64,67,.3), 0 4px 8px 3px rgba(60,64,67,.15)',
              transition: 'all 0.2s',
              cursor: 'pointer',
              border: '1px solid #e8eaed'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 6px 2px rgba(60,64,67,.15), 0 8px 12px 4px rgba(60,64,67,.15)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(60,64,67,.3), 0 4px 8px 3px rgba(60,64,67,.15)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ 
                padding: '8px', 
                borderRadius: '50%',
                backgroundColor: stat.color.includes('blue') ? '#e3f2fd' : 
                                stat.color.includes('green') ? '#e8f5e9' :
                                stat.color.includes('red') ? '#ffebee' : '#fff3e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <stat.icon size={24} color={
                  stat.color.includes('blue') ? '#1976d2' :
                  stat.color.includes('green') ? '#388e3c' :
                  stat.color.includes('red') ? '#d32f2f' : '#f57c00'
                } />
              </div>
              <span style={{
                fontSize: '13px',
                color: stat.trend === 'up' ? '#137333' : '#e52535',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <TrendingUp size={14} />
                {stat.change}
              </span>
            </div>
            <div style={{ fontSize: '34px', fontWeight: 400, color: '#202124', marginBottom: '4px' }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '13px', color: '#5f6368' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Claims - Material Design Table */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px 0 rgba(60,64,67,.3), 0 4px 8px 3px rgba(60,64,67,.15)',
        overflow: 'hidden',
        border: '1px solid #e8eaed'
      }}>
        <div style={{ 
          padding: '16px 20px',
          borderBottom: '1px solid #e8eaed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 400, color: '#202124', margin: 0 }}>
            Recent Claims
          </h2>
          <a 
            href="/dashboard/claims" 
            style={{ 
              fontSize: '14px', 
              color: '#1976d2', 
              textDecoration: 'none',
              fontWeight: 500
            }}
          >
            View all
          </a>
        </div>
        
        <div style={{ padding: '8px 0' }}>
          {[
            { id: '1', employee: 'Ahmad Khan', liters: 25, status: 'approved', date: '2 hours ago' },
            { id: '2', employee: 'Ali Hassan', liters: 30, status: 'pending', date: '4 hours ago' },
            { id: '3', employee: 'Sajid Ali', liters: 20, status: 'approved', date: '5 hours ago' },
            { id: '4', employee: 'Faisal Ahmed', liters: 35, status: 'rejected', date: '6 hours ago' },
          ].map((claim, idx) => (
            <div 
              key={claim.id}
              style={{
                padding: '12px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: idx < 3 ? '1px solid #f1f3f4' : 'none',
                cursor: 'pointer',
                transition: 'background-color 0.1s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#202124' }}>
                    {claim.employee}
                  </span>
                  <span style={{
                    fontSize: '12px',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: 
                      claim.status === 'approved' ? '#e8f5e9' :
                      claim.status === 'pending' ? '#e3f2fd' : '#ffebee',
                    color:
                      claim.status === 'approved' ? '#1b5e20' :
                      claim.status === 'pending' ? '#1565c0' : '#c62828',
                    fontWeight: 500
                  }}>
                    {claim.status.toUpperCase()}
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: '#5f6368', marginTop: '4px' }}>
                  {claim.liters}L • {claim.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
