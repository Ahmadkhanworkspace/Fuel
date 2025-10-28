"use client";

import { useState } from "react";
import { MapPin, AlertTriangle, CheckCircle } from "lucide-react";
import type { LocationLog } from "@/lib/supabase/types";

interface LocationLogWithDetails extends LocationLog {
  employee?: { name: string; employee_code: string };
  vehicle?: { reg_no: string; model: string };
  zone?: { name: string };
}

export default function LocationLogsTable({ initialLogs }: { initialLogs: LocationLogWithDetails[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterZoneCompliance, setFilterZoneCompliance] = useState<string>("all");

  // Mock some sample logs with detailed data
  const mockLogs: LocationLogWithDetails[] = [
    {
      id: "1",
      claim_id: "claim-1",
      employee_id: "emp-1",
      vehicle_id: "veh-1",
      latitude: 19.0760,
      longitude: 72.8777,
      address: "Mumbai Central Station, Mumbai",
      is_within_zone: true,
      zone_id: "zone-1",
      timestamp: new Date().toISOString(),
      employee: { name: "Rajesh Kumar", employee_code: "EMP001" },
      vehicle: { reg_no: "MH-12-AB-3456", model: "Toyota Innova" },
      zone: { name: "Mumbai Central Zone" },
    },
    {
      id: "2",
      claim_id: "claim-2",
      employee_id: "emp-2",
      vehicle_id: "veh-2",
      latitude: 18.5204,
      longitude: 73.8567,
      address: "Pune Station, Pune",
      is_within_zone: true,
      zone_id: "zone-2",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      employee: { name: "Priya Sharma", employee_code: "EMP002" },
      vehicle: { reg_no: "MH-12-CD-7890", model: "Mahindra Bolero" },
      zone: { name: "Pune Central Zone" },
    },
    {
      id: "3",
      claim_id: "claim-3",
      employee_id: "emp-3",
      vehicle_id: "veh-3",
      latitude: 19.1383,
      longitude: 72.9199,
      address: "Borivali, Mumbai",
      is_within_zone: false,
      zone_id: null,
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      employee: { name: "Amit Patel", employee_code: "EMP003" },
      vehicle: { reg_no: "MH-12-EF-1234", model: "Maruti Swift" },
      zone: { name: null },
    },
  ];

  const logs = initialLogs.length > 0 ? initialLogs : mockLogs;

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.employee?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.vehicle?.reg_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.address?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesZone =
      filterZoneCompliance === "all" ||
      (filterZoneCompliance === "compliant" && log.is_within_zone) ||
      (filterZoneCompliance === "violation" && !log.is_within_zone);
    
    return matchesSearch && matchesZone;
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
          Location Tracking Logs
        </h2>
        <p style={{ fontSize: '14px', color: '#4b5563' }}>
          {filteredLogs.length} logs found
        </p>
      </div>

      {/* Filters */}
      <div style={{ padding: '24px', paddingBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <MapPin style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#9ca3af' }} />
            <input
              type="text"
              placeholder="Search by employee, vehicle, or address"
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
            value={filterZoneCompliance}
            onChange={(e) => setFilterZoneCompliance(e.target.value)}
            style={{
              padding: '8px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              minWidth: '150px'
            }}
          >
            <option value="all">All Locations</option>
            <option value="compliant">Within Zone</option>
            <option value="violation">Zone Violation</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                Employee
              </th>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                Vehicle
              </th>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                Coordinates
              </th>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                Address
              </th>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                Zone Status
              </th>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                Timestamp
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '16px' }}>
                  <div style={{ fontWeight: '500', color: '#111827' }}>
                    {log.employee?.name || 'Unknown'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                    {log.employee?.employee_code}
                  </div>
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ fontWeight: '500', color: '#2563eb', fontSize: '14px' }}>
                    {log.vehicle?.reg_no}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                    {log.vehicle?.model}
                  </div>
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ fontSize: '12px', fontFamily: 'monospace', color: '#374151' }}>
                    {log.latitude.toFixed(6)}, {log.longitude.toFixed(6)}
                  </div>
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ fontSize: '14px', color: '#374151' }}>
                    {log.address || 'Not available'}
                  </div>
                  {log.zone?.name && (
                    <div style={{ fontSize: '12px', color: '#2563eb', marginTop: '2px' }}>
                      Zone: {log.zone.name}
                    </div>
                  )}
                </td>
                <td style={{ padding: '16px' }}>
                  {log.is_within_zone ? (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      fontSize: '12px',
                      fontWeight: '500',
                      backgroundColor: '#d1fae5',
                      color: '#065f46'
                    }}>
                      <CheckCircle style={{ width: '12px', height: '12px', marginRight: '4px' }} />
                      Within Zone
                    </span>
                  ) : (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      fontSize: '12px',
                      fontWeight: '500',
                      backgroundColor: '#fee2e2',
                      color: '#991b1b'
                    }}>
                      <AlertTriangle style={{ width: '12px', height: '12px', marginRight: '4px' }} />
                      Zone Violation
                    </span>
                  )}
                </td>
                <td style={{ padding: '16px', fontSize: '14px', color: '#374151' }}>
                  {formatDate(log.timestamp)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredLogs.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px', color: '#6b7280' }}>
            No location logs found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
}
