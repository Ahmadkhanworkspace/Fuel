"use client";

import { useState, useEffect } from "react";
import { MapPin, Plus, Edit, Trash2, CheckCircle, Save, X, AlertCircle } from "lucide-react";
import { createClient } from '@/lib/supabase/browser';

interface Zone {
  id: string;
  name: string;
  center_lat: number | null;
  center_lng: number | null;
  radius_km: number | null;
  active: boolean;
  vehicle_count: number;
  violation_count: number;
}

export default function ZonesPage() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newZone, setNewZone] = useState({
    name: "",
    center_lat: 29.4000,
    center_lng: 71.6833,
    radius_km: 5
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load zones from database
  const fetchZones = async () => {
    try {
      const response = await fetch('/api/zones');
      if (!response.ok) throw new Error('Failed to fetch zones');
      const data = await response.json();
      setZones(data);
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching zones:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  // Setup real-time sync with Supabase
  useEffect(() => {
    fetchZones();

    // Setup Supabase real-time subscription
    const supabase = createClient();
    
    const channel = supabase
      .channel('zones-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'zones' },
        (payload) => {
          console.log('Zone change detected:', payload);
          fetchZones(); // Refresh zones when database changes
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleDeleteZone = async (id: string) => {
    const zoneName = zones.find(z => z.id === id)?.name;
    if (window.confirm(`Are you sure you want to delete zone "${zoneName}"? This action cannot be undone.`)) {
      try {
        setIsSubmitting(true);
        const response = await fetch(`/api/zones?id=${id}`, {
          method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete zone');
        
        alert("Zone deleted successfully!");
        // Don't need to update state manually - real-time subscription will handle it
      } catch (err: any) {
        console.error('Error deleting zone:', err);
        alert(`Failed to delete zone: ${err.message}`);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleCreateZone = async () => {
    if (!newZone.name || !newZone.radius_km || newZone.radius_km <= 0) {
      alert("Please fill in all fields correctly!");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch('/api/zones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newZone.name,
          center_lat: newZone.center_lat,
          center_lng: newZone.center_lng,
          radius_km: newZone.radius_km,
          active: true
        })
      });

      if (!response.ok) throw new Error('Failed to create zone');
      
      alert(`Zone "${newZone.name}" created successfully!`);
      setShowAddModal(false);
      setNewZone({ name: "", center_lat: 29.4000, center_lng: 71.6833, radius_km: 5 });
      // Real-time subscription will update the list automatically
    } catch (err: any) {
      console.error('Error creating zone:', err);
      alert(`Failed to create zone: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openGoogleMaps = (lat: number | null, lng: number | null) => {
    if (!lat || !lng) return;
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <div style={{ fontSize: '18px', color: '#6b7280' }}>Loading zones...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '24px', 
        background: '#fef2f2', 
        border: '1px solid #fecaca', 
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <AlertCircle style={{ width: '24px', height: '24px', color: '#dc2626' }} />
        <div>
          <div style={{ fontSize: '16px', fontWeight: '600', color: '#dc2626' }}>Error</div>
          <div style={{ fontSize: '14px', color: '#991b1b' }}>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 'bold', background: 'linear-gradient(90deg, #2563eb, #1e40af)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' }}>
            Zones
          </h1>
          <p style={{ color: '#4b5563', fontSize: '14px' }}>
            Manage geofencing zones with real-time sync
          </p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          disabled={isSubmitting}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            background: 'linear-gradient(90deg, #2563eb, #1e40af)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            opacity: isSubmitting ? 0.6 : 1
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
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Zone Name *
                </label>
                <input
                  type="text"
                  value={newZone.name}
                  onChange={(e) => setNewZone({ ...newZone, name: e.target.value })}
                  placeholder="e.g., Bahawalpur Central Zone"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '12px' }}>
                  📍 Select Zone Location
                </label>
                <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>
                  Enter coordinates or use Google Maps to find the exact location
                </p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Latitude</label>
                    <input
                      type="number"
                      value={newZone.center_lat}
                      onChange={(e) => setNewZone({ ...newZone, center_lat: parseFloat(e.target.value) })}
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
                      value={newZone.center_lng}
                      onChange={(e) => setNewZone({ ...newZone, center_lng: parseFloat(e.target.value) })}
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
                  onClick={() => openGoogleMaps(newZone.center_lat, newZone.center_lng)}
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
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Radius (km) *
                </label>
                <input
                  type="number"
                  value={newZone.radius_km}
                  onChange={(e) => setNewZone({ ...newZone, radius_km: parseFloat(e.target.value) })}
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
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button
                  onClick={() => setShowAddModal(false)}
                  disabled={isSubmitting}
                  style={{
                    padding: '12px 24px',
                    background: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateZone}
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
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    opacity: isSubmitting ? 0.6 : 1
                  }}
                >
                  <Save style={{ width: '18px', height: '18px' }} />
                  {isSubmitting ? 'Creating...' : 'Create Zone'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Zones Grid */}
      {zones.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <MapPin style={{ width: '48px', height: '48px', color: '#9ca3af', margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>No Zones Yet</h3>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>Create your first zone to get started</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
          {zones.map((zone) => (
            <div key={zone.id} style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '2px solid',
              borderColor: zone.active ? '#86efac' : '#e5e7eb'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <MapPin style={{ width: '20px', height: '20px', color: '#2563eb' }} />
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>{zone.name}</h3>
                  </div>
                  <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                    {zone.active ? (
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
                    disabled={isSubmitting}
                    title="Delete zone"
                    style={{
                      padding: '6px',
                      border: 'none',
                      background: 'transparent',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      borderRadius: '6px',
                      opacity: isSubmitting ? 0.5 : 1
                    }}>
                    <Trash2 style={{ width: '18px', height: '18px', color: '#dc2626' }} />
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                {zone.center_lat && zone.center_lng && (
                  <div>
                    <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Center Coordinates</p>
                    <button
                      onClick={() => openGoogleMaps(zone.center_lat, zone.center_lng)}
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
                        {zone.center_lat}, {zone.center_lng}
                      </p>
                      <MapPin style={{ width: '14px', height: '14px', color: '#3b82f6' }} />
                    </button>
                  </div>
                )}
                {zone.radius_km && (
                  <div>
                    <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Radius</p>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>{zone.radius_km} km</p>
                  </div>
                )}
                <div style={{ display: 'flex', gap: '24px' }}>
                  <div>
                    <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Vehicles</p>
                    <p style={{ fontSize: '18px', fontWeight: '600', color: '#2563eb' }}>{zone.vehicle_count}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Violations</p>
                    <p style={{ fontSize: '18px', fontWeight: '600', color: '#dc2626' }}>{zone.violation_count}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
