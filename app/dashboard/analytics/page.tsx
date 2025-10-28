"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, BarChart3, PieChart, Activity } from "lucide-react";

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  // Mock data for charts
  const fuelConsumptionData = [
    { month: "Jan", liters: 1250, cost: 130000 },
    { month: "Feb", liters: 1180, cost: 122000 },
    { month: "Mar", liters: 1350, cost: 140000 },
    { month: "Apr", liters: 1420, cost: 148000 },
    { month: "May", liters: 1380, cost: 143000 },
    { month: "Jun", liters: 1500, cost: 156000 },
  ];

  const vehiclePerformanceData = [
    { vehicle: "MH-12-AB-3456", avgMileage: 12.5, totalLiters: 450, totalCost: 46800 },
    { vehicle: "MH-12-CD-7890", avgMileage: 10.2, totalLiters: 380, totalCost: 39560 },
    { vehicle: "MH-12-EF-1234", avgMileage: 14.8, totalLiters: 520, totalCost: 54200 },
  ];

  const fraudDetectionData = [
    { type: "Low Risk", count: 145, percentage: 80 },
    { type: "Medium Risk", count: 25, percentage: 14 },
    { type: "High Risk", count: 10, percentage: 6 },
  ];

  const costAnalysisData = [
    { category: "Fuel", amount: 450000, percentage: 70 },
    { category: "Maintenance", amount: 85000, percentage: 13 },
    { category: "Repairs", amount: 60000, percentage: 9 },
    { category: "Insurance", amount: 50000, percentage: 8 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 'bold', background: 'linear-gradient(90deg, #2563eb, #1e40af)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' }}>
            Analytics
          </h1>
          <p style={{ color: '#4b5563', fontSize: '14px' }}>
            View reports and insights
          </p>
        </div>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          style={{
            padding: '8px 16px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '14px',
            backgroundColor: 'white'
          }}
        >
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="quarter">Last Quarter</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      {/* Fuel Consumption Chart */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{ width: '40px', height: '40px', backgroundColor: '#dbeafe', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BarChart3 style={{ width: '24px', height: '24px', color: '#2563eb' }} />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827' }}>Fuel Consumption</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px' }}>
          {fuelConsumptionData.map((data, index) => (
            <div key={index} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              padding: '16px',
              background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
              borderRadius: '10px',
              border: '1px solid #bfdbfe'
            }}>
              <span style={{ fontSize: '12px', color: '#4b5563', fontWeight: '500' }}>{data.month}</span>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e40af' }}>{data.liters}L</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>₨{data.cost.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Vehicle Performance */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{ width: '40px', height: '40px', backgroundColor: '#ecfdf5', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity style={{ width: '24px', height: '24px', color: '#059669' }} />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827' }}>Vehicle Performance</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {vehiclePerformanceData.map((vehicle, index) => (
            <div key={index} style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '16px',
              padding: '20px',
              background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)',
              borderRadius: '10px',
              border: '1px solid #86efac'
            }}>
              <div>
                <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Vehicle</p>
                <p style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>{vehicle.vehicle}</p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Avg Mileage</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <p style={{ fontSize: '16px', fontWeight: '600', color: '#047857' }}>{vehicle.avgMileage} km/L</p>
                  <TrendingUp style={{ width: '16px', height: '16px', color: '#059669' }} />
                </div>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Total Liters</p>
                <p style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>{vehicle.totalLiters}L</p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Total Cost</p>
                <p style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>₨{vehicle.totalCost.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fraud Detection */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#fef2f2', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PieChart style={{ width: '24px', height: '24px', color: '#dc2626' }} />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827' }}>Fraud Detection</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {fraudDetectionData.map((data, index) => {
              let color = '#d1fae5';
              let textColor = '#065f46';
              if (data.type === 'Medium Risk') {
                color = '#fed7aa';
                textColor = '#9a3412';
              } else if (data.type === 'High Risk') {
                color = '#fee2e2';
                textColor = '#991b1b';
              }
              return (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  backgroundColor: color,
                  borderRadius: '8px',
                  border: '1px solid #d1d5db'
                }}>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: textColor }}>{data.type}</p>
                    <p style={{ fontSize: '12px', color: '#6b7280' }}>{data.count} claims</p>
                  </div>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: `8px solid ${textColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: textColor }}>{data.percentage}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cost Analysis */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#fdf4ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingDown style={{ width: '24px', height: '24px', color: '#9333ea' }} />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827' }}>Cost Analysis</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {costAnalysisData.map((data, index) => {
              const colors = ['#dbeafe', '#ecfdf5', '#fef3c7', '#fce7f3'];
              const textColors = ['#1e40af', '#047857', '#92400e', '#9f1239'];
              return (
                <div key={index}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>{data.category}</span>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: textColors[index] }}>₨{data.amount.toLocaleString()}</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: '#f3f4f6', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${data.percentage}%`,
                      backgroundColor: textColors[index],
                      borderRadius: '4px',
                      transition: 'width 0.3s'
                    }} />
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>{data.percentage}% of total</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
