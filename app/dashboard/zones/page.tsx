"use client";

import { useState } from "react";
import { MapPin, Plus, Edit, Trash2, CheckCircle, Save, X } from "lucide-react";

interface Zone {
  id: string;
  name: string;
  center: { lat: number; lng: number };
  radius: number;
  status: "active" | "inactive";
  vehicles: number;
  violations: number;
}

export default function ZonesPage() {
  const [zones, setZones] = useState<Zone[]>([
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
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newZone, setNewZone] = useState({
    name: "",
    center: { lat: 29.4000, lng: 71.6833 }, // Default Bahawalpur center
    radius: 5
  });

  const handleDeleteZone = (id: string) => {
    const zoneName = zones.find(z => z.id === id)?.name;
    if (window.confirm(`Are you sure you want to delete zone "${zoneName}"? This action cannot be undone.`)) {
      setZones(zones.filter(z => z.id !== id));
      alert("Zone deleted successfully!");
    }
  };

  const handleToggleStatus = (id: string) => {
    setZones(zones.map(zone => 
      zone.id === id 
        ? { ...zone, status: zone.status === "active" ? "inactive" : "active" }
        : zone
    ));
  };

  const handleCreateZone = () => {
    if (!newZone.name || newZone.radius <= 0) {
      alert("Please fill in all fields correctly!");
      return;
    }

    const zone: Zone = {
      id: Date.now().toString(),
      name: newZone.name,
      center: newZone.center,
      radius: newZone.radius,
      status: "active",
      vehicles: 0,
      violations: 0
    };

    setZones([...zones, zone]);
    setShowAddModal(false);
    setNewZone({ name: "", center: { lat: 29.4000, lng: 71.6833 }, radius: 5 });
    alert(`Zone "${zone.name}" created successfully!`);
  };

  const openGoogleMaps = (center: { lat: number; lng: number }) => {
    const url = `https://www.google.com/maps?q=${center.lat},${center.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 'bold', background: 'linear-gradient(90deg, #2563eb, #1e40af)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' }}>
            Zones
          </h1>
          <p style={{ color: '#4b5563', fontSize: '14px' }}>
            Manage geofencing zones for fuel claims with Google Maps integration
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
          Create Zone
        </button>
      </div>

      {/* Create Zone Modal */}
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
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '800px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#111827' }}>Create New Zone</h2>
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                <X style={{ width: '24px', height: '24px' }} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Zone Name */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Zone Name *
                </label>
                <input
                  type="text"
                  value={newZone.name}
                  onChange={(e) => setNewZone({ ...newZone, name: e.target.value })}
                  placeholder="e.g., Karachi Central Zone"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              {/* Coordinates Selection */}
              <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '12px' }}>
                  📍 Select Zone Location
                </label>
                <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>
                  Enter coordinates or click the button below to open Google Maps for visual selection
                </p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Latitude</label>
                    <input
                      type="number"
                      value={newZone.center.lat}
                      onChange={(e) => setNewZone({ ...newZone, center: { ...newZone.center, lat: parseFloat(e.target.value) } })}
                      step="0.000001"
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Longitude</label>
                    <input
                      type="number"
                      value={newZone.center.lng}
                      onChange={(e) => setNewZone({ ...newZone, center: { ...newZone.center, lng: parseFloat(e.target.value) } })}
                      step="0.000001"
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => openGoogleMaps(newZone.center)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <MapPin style={{ width: '18px', height: '18px' }} />
                  Open in Google Maps
                </button>
                
                <div style={{ marginTop: '12px', padding: '12px', background: '#eff6ff', borderRadius: '6px', border: '1px solid #bfdbfe' }}>
                  <p style={{ fontSize: '12px', color: '#1e40af', fontWeight: '600', marginBottom: '4px' }}>💡 How to find coordinates:</p>
                  <ol style={{ fontSize: '11px', color: '#6b7280', margin: 0, paddingLeft: '20px' }}>
                    <li>Click "Open in Google Maps" button above</li>
                    <li>Right-click on the desired location on the map</li>
                    <li>Copy the latitude and longitude from the popup</li>
                    <li>Paste them into the input fields above</li>
                  </ol>
                </div>
              </div>

              {/* Radius */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Radius (km) *
                </label>
                <input
                  type="number"
                  value={newZone.radius}
                  onChange={(e) => setNewZone({ ...newZone, radius: parseFloat(e.target.value) })}
                  min="0.1"
                  step="0.1"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
                <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                  Set the radius in kilometers around the center point
                </p>
              </div>

              {/* Action Buttons */}
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
                  onClick={handleCreateZone}
                  style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(90deg, #2563eb, #1e40af)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Save style={{ width: '18px', height: '18px' }} />
                  Create Zone
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                <button 
                  onClick={() => alert("Edit functionality coming soon!")}
                  title="Edit zone"
                  style={{
                    padding: '6px',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    borderRadius: '6px'
                  }}>
                  <Edit style={{ width: '18px', height: '18px', color: '#6b7280' }} />
                </button>
                <button 
                  onClick={() => handleDeleteZone(zone.id)}
                  title="Delete zone"
                  style={{
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
                <button
                  onClick={() => openGoogleMaps(zone.center)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  <p style={{ fontSize: '14px', fontWeight: '500', color: '#3b82f6', textDecoration: 'underline' }}>
                    {zone.center.lat}, {zone.center.lng}
                  </p>
                  <MapPin style={{ width: '14px', height: '14px', color: '#3b82f6' }} />
                </button>
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
