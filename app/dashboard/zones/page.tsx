"use client";

import { useState } from "react";
import { MapPin, Plus, Edit, Trash2, CheckCircle } from "lucide-react";

export default function ZonesPage() {
  const zones = [
    {
      id: "1",
      name: "Mumbai Central Zone",
      center: { lat: 19.0760, lng: 72.8777 },
      radius: 5,
      status: "active",
      vehicles: 12,
      violations: 2
    },
    {
      id: "2",
      name: "Pune Central Zone",
      center: { lat: 18.5204, lng: 73.8567 },
      radius: 8,
      status: "active",
      vehicles: 8,
      violations: 1
    },
    {
      id: "3",
      name: "Thane Extended Zone",
      center: { lat: 19.2183, lng: 72.9781 },
      radius: 10,
      status: "inactive",
      vehicles: 5,
      violations: 0
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 'bold', background: 'linear-gradient(90deg, #2563eb, #1e40af)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' }}>
            Zones
          </h1>
          <p style={{ color: '#4b5563', fontSize: '14px' }}>
            Manage geofencing zones for fuel claims
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
          <Plus style={{ width: '18px', height: '18px' }} />
          Create Zone
        </button>
      </div>

      {/* Zones Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
        {zones.map((zone) => (
          <div key={zone.id} style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '2px solid',
            borderColor: zone.status === "active" ? '#86efac' : '#e5e7eb'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <MapPin style={{ width: '20px', height: '20px', color: '#2563eb' }} />
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>{zone.name}</h3>
                </div>
                <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                  {zone.status === "active" ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#059669' }}>
                      <CheckCircle style={{ width: '14px', height: '14px' }} />
                      Active
                    </span>
                  ) : (
                    <span style={{ color: '#9ca3af' }}>Inactive</span>
                  )}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{
                  padding: '6px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  borderRadius: '6px'
                }}>
                  <Edit style={{ width: '18px', height: '18px', color: '#6b7280' }} />
                </button>
                <button style={{
                  padding: '6px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  borderRadius: '6px'
                }}>
                  <Trash2 style={{ width: '18px', height: '18px', color: '#dc2626' }} />
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
              <div>
                <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Center Coordinates</p>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>{zone.center.lat}, {zone.center.lng}</p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Radius</p>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>{zone.radius} km</p>
              </div>
              <div style={{ display: 'flex', gap: '24px' }}>
                <div>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Vehicles</p>
                  <p style={{ fontSize: '18px', fontWeight: '600', color: '#2563eb' }}>{zone.vehicles}</p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Violations</p>
                  <p style={{ fontSize: '18px', fontWeight: '600', color: '#dc2626' }}>{zone.violations}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
