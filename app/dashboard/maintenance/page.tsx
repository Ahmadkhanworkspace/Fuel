"use client";

import { useState } from "react";
import { Wrench, Calendar, AlertTriangle, CheckCircle, Clock } from "lucide-react";

export default function MaintenancePage() {
  const [activeTab, setActiveTab] = useState("upcoming");

  const upcomingMaintenance = [
    {
      id: "1",
      vehicle: "MH-12-AB-3456",
      type: "Oil Change",
      dueDate: "2025-11-05",
      estimatedCost: 1200,
      lastService: "2025-08-05"
    },
    {
      id: "2",
      vehicle: "MH-12-CD-7890",
      type: "Brake Inspection",
      dueDate: "2025-11-10",
      estimatedCost: 1500,
      lastService: "2025-06-10"
    },
    {
      id: "3",
      vehicle: "MH-12-EF-1234",
      type: "Tire Replacement",
      dueDate: "2025-11-15",
      estimatedCost: 8000,
      lastService: "2025-02-15"
    },
  ];

  const recentMaintenance = [
    {
      id: "1",
      vehicle: "MH-12-AB-3456",
      type: "Battery Replacement",
      date: "2025-10-20",
      cost: 3500,
      status: "completed"
    },
    {
      id: "2",
      vehicle: "MH-12-CD-7890",
      type: "Engine Tune-up",
      date: "2025-10-18",
      cost: 4500,
      status: "completed"
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 'bold', background: 'linear-gradient(90deg, #2563eb, #1e40af)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' }}>
            Maintenance
          </h1>
          <p style={{ color: '#4b5563', fontSize: '14px' }}>
            Manage vehicle maintenance and repairs
          </p>
        </div>
        <button style={{
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
          <Wrench style={{ width: '18px', height: '18px' }} />
          Schedule Maintenance
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => setActiveTab("upcoming")}
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: activeTab === "upcoming" ? '#dbeafe' : 'white',
            color: activeTab === "upcoming" ? '#2563eb' : '#6b7280',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          Upcoming
        </button>
        <button
          onClick={() => setActiveTab("history")}
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: activeTab === "history" ? '#dbeafe' : 'white',
            color: activeTab === "history" ? '#2563eb' : '#6b7280',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          History
        </button>
      </div>

      {/* Content */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        {activeTab === "upcoming" && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {upcomingMaintenance.map((item) => (
              <div key={item.id} style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                padding: '20px',
                background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                borderRadius: '10px',
                border: '1px solid #fbbf24'
              }}>
                <div>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Vehicle</p>
                  <p style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>{item.vehicle}</p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Type</p>
                  <p style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>{item.type}</p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Due Date</p>
                  <p style={{ fontSize: '16px', fontWeight: '600', color: '#92400e' }}>{item.dueDate}</p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Estimated Cost</p>
                  <p style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>₨{item.estimatedCost.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "history" && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {recentMaintenance.map((item) => (
              <div key={item.id} style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                padding: '20px',
                background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
                borderRadius: '10px',
                border: '1px solid #34d399'
              }}>
                <div>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Vehicle</p>
                  <p style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>{item.vehicle}</p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Type</p>
                  <p style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>{item.type}</p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Date</p>
                  <p style={{ fontSize: '16px', fontWeight: '600', color: '#047857' }}>{item.date}</p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Cost</p>
                  <p style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>₨{item.cost.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
