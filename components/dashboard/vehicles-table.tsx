"use client";

import { Plus } from "lucide-react";

// Mock data
const mockVehicles = [
  {
    id: "1",
    reg_no: "MH-12-AB-3456",
    model: "Toyota Innova",
    assigned_employee: "Rajesh Kumar",
    last_odometer: 45230,
    avg_mileage: 12.5,
    next_service_km: 46000,
    fuelEfficiency: 12.5,
    totalFuelCost: 194234,
    totalKmDriven: 6250,
    costPerKm: 31.08,
    maintenanceHistory: [
      { date: "2024-10-20", type: "Oil Change", cost: 3500, mileage: 45000 },
      { date: "2024-08-15", type: "Battery Replacement", cost: 5000, mileage: 44000 },
      { date: "2024-05-10", type: "Tire Replacement", cost: 8000, mileage: 43000 }
    ]
  },
  {
    id: "2",
    reg_no: "MH-12-CD-7890",
    model: "Mahindra Bolero",
    assigned_employee: "Priya Sharma",
    last_odometer: 78920,
    avg_mileage: 10.2,
    next_service_km: 80000,
    fuelEfficiency: 10.2,
    totalFuelCost: 159832,
    totalKmDriven: 8900,
    costPerKm: 17.96,
    maintenanceHistory: [
      { date: "2024-10-05", type: "General Service", cost: 4500, mileage: 78900 },
      { date: "2024-07-20", type: "Brake Pad Replacement", cost: 5500, mileage: 76500 }
    ]
  },
];

export default function VehiclesTable() {
  return (
    <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
              Fleet Management
            </h2>
            <p style={{ fontSize: '14px', color: '#4b5563' }}>
              {mockVehicles.length} vehicles registered
            </p>
          </div>
          <button style={{
            display: 'flex',
            alignItems: 'center',
            padding: '6px 16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer'
          }}>
            <Plus style={{ width: '16px', height: '16px', marginRight: '8px' }} />
            Add Vehicle
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ padding: '24px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                Registration
              </th>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                Model
              </th>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                Assigned Driver
              </th>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                Last Odometer
              </th>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                Avg Mileage (km/L)
              </th>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                Next Service
              </th>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                Cost/Km
              </th>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {mockVehicles.map((vehicle) => (
              <tr key={vehicle.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px 16px', fontWeight: '500', color: '#111827' }}>{vehicle.reg_no}</td>
                <td style={{ padding: '12px 16px', color: '#111827' }}>{vehicle.model}</td>
                <td style={{ padding: '12px 16px', color: '#111827' }}>{vehicle.assigned_employee}</td>
                <td style={{ padding: '12px 16px', color: '#111827' }}>{vehicle.last_odometer.toLocaleString()} km</td>
                <td style={{ padding: '12px 16px', color: '#111827' }}>{vehicle.avg_mileage} km/L</td>
                <td style={{ padding: '12px 16px', color: '#111827' }}>
                  {vehicle.next_service_km.toLocaleString()} km
                </td>
                <td style={{ padding: '12px 16px', color: '#111827', fontWeight: '600' }}>
                  ₹{vehicle.costPerKm.toFixed(2)}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <button style={{
                    padding: '6px 12px',
                    fontSize: '14px',
                    color: '#3b82f6',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '6px'
                  }}>
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
