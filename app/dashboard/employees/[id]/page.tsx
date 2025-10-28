"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { 
  User, Car, FileText, Fuel, Clock, Calendar, 
  MapPin, Shield, Printer, ArrowLeft, Mail, Phone, 
  CreditCard, Upload, CheckCircle, AlertCircle, Settings
} from "lucide-react";

export default function EmployeeDetailPage() {
  const params = useParams();
  const employeeId = params.id;

  const [employee] = useState({
    id: employeeId,
    employee_code: "EMP001",
    name: "Rajesh Kumar",
    email: "rajesh.kumar@asms.com",
    phone: "+92-300-1234567",
    role: "employee",
    zone_id: "zone-1",
    allowed_quota_liters: 100,
    current_usage_liters: 45,
    status: "active",
    created_at: "2024-01-15",
    
    driver_license: {
      number: "PK-12345-67",
      expiry_date: "2026-12-31",
      front_image: "/license-front.jpg",
      back_image: "/license-back.jpg",
      verification_status: "verified"
    },
    
    assigned_vehicle: {
      id: "veh-1",
      reg_no: "MH-12-AB-3456",
      model: "Toyota Innova",
      ownership_type: "leased",
      lease_company: "Fleet Solutions Ltd",
      lease_start: "2023-01-15",
      lease_end: "2026-01-14",
      handover_date: "2023-01-15",
      handover_mileage: 50000,
      current_mileage: 54500,
      total_driven: 4500
    },
    
    maintenance_logs: [
      {
        id: "1",
        date: "2024-10-20",
        type: "Oil Change",
        mileage: 54000,
        cost: 3500,
        description: "Regular oil change and filter replacement"
      },
      {
        id: "2",
        date: "2024-08-15",
        type: "Battery Replacement",
        mileage: 52000,
        cost: 5000,
        description: "Battery replacement due to failure"
      }
    ],
    
    fuel_claims: [
      {
        id: "1",
        date: "2024-10-27",
        liters: 45.5,
        amount: 4733,
        location: "Mumbai Central",
        status: "approved",
        gps_lat: 19.0760,
        gps_lng: 72.8777,
        odometer_reading: 54320,
        ocr_text: {
          liters: 45.5,
          price: 4733,
          date: "2024-10-27",
          odometer: 54320
        },
        ocr_confidence: 92,
        photos: [
          "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400",
          "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400",
          "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400"
        ],
        timestamp: "2024-10-27T14:30:00Z"
      },
      {
        id: "2",
        date: "2024-10-25",
        liters: 42.0,
        amount: 4374,
        location: "Pune",
        status: "approved",
        gps_lat: 18.5204,
        gps_lng: 73.8567,
        odometer_reading: 54050,
        ocr_text: {
          liters: 42.0,
          price: 4374,
          date: "2024-10-25",
          odometer: 54050
        },
        ocr_confidence: 88,
        photos: [
          "https://images.unsplash.com/photo-1486074051793-e41332bf18fc?w=400",
          "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=400"
        ],
        timestamp: "2024-10-25T10:15:00Z"
      }
    ],
    
    app_restrictions: {
      enableCamera: true,
      requireLocation: true,
      maxDailyClaims: 3,
      requireNoncePhoto: true,
      offlineMode: true
    }
  });

  const totalFuelClaimed = employee.fuel_claims.reduce((sum: number, claim: any) => sum + claim.liters, 0);
  const totalCost = employee.fuel_claims.reduce((sum: number, claim: any) => sum + claim.amount, 0);
  const totalMaintenanceCost = employee.maintenance_logs.reduce((sum: number, log: any) => sum + log.cost, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a href="/dashboard/employees" style={{ textDecoration: 'none' }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#f3f4f6',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}>
              <ArrowLeft style={{ width: '20px', height: '20px', color: '#374151' }} />
            </div>
          </a>
          <div>
            <h1 style={{ fontSize: '30px', fontWeight: 'bold', background: 'linear-gradient(90deg, #2563eb, #1e40af)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' }}>
              {employee.name}
            </h1>
            <p style={{ color: '#4b5563', fontSize: '14px' }}>
              Employee Code: {employee.employee_code} • Role: {employee.role}
            </p>
          </div>
        </div>
        <button
          onClick={handlePrint}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}
        >
          <Printer style={{ width: '18px', height: '18px' }} />
          Print
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#dbeafe', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Fuel style={{ width: '20px', height: '20px', color: '#2563eb' }} />
            </div>
            <div>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Total Fuel</p>
              <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e40af' }}>{totalFuelClaimed.toFixed(1)}L</p>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#fce7f3', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CreditCard style={{ width: '20px', height: '20px', color: '#db2777' }} />
            </div>
            <div>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Total Cost</p>
              <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#be185d' }}>₨{totalCost.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#ecfdf5', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Car style={{ width: '20px', height: '20px', color: '#059669' }} />
            </div>
            <div>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Distance</p>
              <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#047857' }}>{employee.assigned_vehicle.total_driven.toLocaleString()} km</p>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#fef3c7', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Settings style={{ width: '20px', height: '20px', color: '#d97706' }} />
            </div>
            <div>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Maintenance</p>
              <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#92400e' }}>₨{totalMaintenanceCost.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Fuel Claims with Photos, OCR & Maps */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <FileText style={{ width: '24px', height: '24px', color: '#2563eb' }} />
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827' }}>Fuel Claims with Photos, OCR Details, Odometer & Maps</h2>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {employee.fuel_claims.map((claim) => (
            <ClaimDetailCard key={claim.id} claim={claim} />
          ))}
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body { padding: 20px; }
          button { display: none !important; }
          div[style*="boxShadow"] { box-shadow: none !important; border: 1px solid #e5e7eb !important; }
        }
      `}</style>
    </div>
  );
}

function ClaimDetailCard({ claim }: { claim: any }) {
  const [selectedPhoto, setSelectedPhoto] = useState(0);

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Calendar style={{ width: '18px', height: '18px', color: '#6b7280' }} />
            <p style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
              {new Date(claim.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock style={{ width: '14px', height: '14px', color: '#9ca3af' }} />
            <p style={{ fontSize: '12px', color: '#6b7280' }}>
              {new Date(claim.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
        <span style={{
          padding: '6px 12px',
          fontSize: '12px',
          fontWeight: '500',
          borderRadius: '9999px',
          backgroundColor: '#d1fae5',
          color: '#059669'
        }}>
          {claim.status}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        {/* Photos Gallery */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Upload style={{ width: '18px', height: '18px', color: '#2563eb' }} />
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>Mobile Photos ({claim.photos.length})</h3>
          </div>
          
          <div style={{ marginBottom: '12px', borderRadius: '12px', overflow: 'hidden', border: '2px solid #e5e7eb', backgroundColor: '#f9fafb', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img 
              src={claim.photos[selectedPhoto]} 
              alt={`Claim ${claim.id}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
            {claim.photos.map((photo: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setSelectedPhoto(idx)}
                style={{
                  flexShrink: 0,
                  width: '60px',
                  height: '60px',
                  border: selectedPhoto === idx ? '2px solid #2563eb' : '2px solid #e5e7eb',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  padding: 0,
                  background: 'none'
                }}
              >
                <img 
                  src={photo} 
                  alt={`Thumbnail ${idx}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* OCR Details */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <FileText style={{ width: '18px', height: '18px', color: '#2563eb' }} />
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>OCR Extracted Details</h3>
            <span style={{
              padding: '2px 8px',
              fontSize: '11px',
              fontWeight: '500',
              borderRadius: '9999px',
              backgroundColor: claim.ocr_confidence > 85 ? '#d1fae5' : '#fed7aa',
              color: claim.ocr_confidence > 85 ? '#059669' : '#9a3412'
            }}>
              {claim.ocr_confidence}% confidence
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', backgroundColor: '#f0f9ff', borderRadius: '8px' }}>
              <span style={{ fontSize: '13px', color: '#6b7280' }}>Liters:</span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e40af' }}>{claim.ocr_text.liters}L</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', backgroundColor: '#f0f9ff', borderRadius: '8px' }}>
              <span style={{ fontSize: '13px', color: '#6b7280' }}>Amount:</span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e40af' }}>₨{claim.amount.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', backgroundColor: '#fef3c7', borderRadius: '8px' }}>
              <span style={{ fontSize: '13px', color: '#6b7280' }}>Odometer:</span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#92400e' }}>{claim.odometer_reading.toLocaleString()} km</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', backgroundColor: '#f0f9ff', borderRadius: '8px' }}>
              <span style={{ fontSize: '13px', color: '#6b7280' }}>Date:</span>
              <span style={{ fontSize: '14px', color: '#374151' }}>{claim.ocr_text.date}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div style={{ marginTop: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <MapPin style={{ width: '18px', height: '18px', color: '#2563eb' }} />
          <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>Location: {claim.location}</h3>
        </div>
        <div style={{ height: '300px', borderRadius: '12px', overflow: 'hidden', border: '2px solid #e5e7eb' }}>
          <iframe
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={`https://www.google.com/maps/embed/v1/search?key=AIzaSyBFw0Qbyq9zTFTd-tUY6d-s6gd4W7B1hGo&q=fuel+station+near+${claim.gps_lat},${claim.gps_lng}&zoom=15&maptype=roadmap`}
          />
        </div>
        <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#d1fae5', borderRadius: '8px' }}>
          <p style={{ fontSize: '12px', color: '#059669', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle style={{ width: '14px', height: '14px' }} />
            Verified: Petrol pumps detected within 2 km radius of claim location
          </p>
        </div>
      </div>
    </div>
  );
}
