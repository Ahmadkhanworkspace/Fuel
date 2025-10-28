"use client";

import { AlertTriangle, CheckCircle, XCircle, Shield } from "lucide-react";
import { useState } from "react";
import React from "react";

export default function FraudDetectionSimple({ claimId }: { claimId: string }) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const runFraudCheck = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/fraud/detect-simple", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          claim_id: claimId,
          location: { lat: 19.0760, lng: 72.8777, liters: 45.5 },
        }),
      });

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Fraud check failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!results && !loading) {
    return (
      <div style={{ padding: '20px', backgroundColor: '#f0f9ff', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
        <button
          onClick={runFraudCheck}
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
            fontWeight: '500'
          }}
        >
          <Shield style={{ width: '18px', height: '18px' }} />
          Run Fraud Detection
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
        Running fraud detection...
      </div>
    );
  }

  const { fraud_score, flags, recommendations } = results || {};
  
  let scoreColor = '#10b981';
  let scoreIcon = CheckCircle;
  if (fraud_score > 70) {
    scoreColor = '#dc2626';
    scoreIcon = XCircle;
  } else if (fraud_score > 40) {
    scoreColor = '#f59e0b';
    scoreIcon = AlertTriangle;
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <Shield style={{ width: '20px', height: '20px', color: '#2563eb' }} />
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>Fraud Detection Results</h3>
      </div>

      {/* Fraud Score */}
      <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#ffffff', borderRadius: '8px', border: '2px solid', borderColor: scoreColor }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Risk Score</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {React.createElement(scoreIcon, { width: '20px', height: '20px', color: scoreColor })}
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: scoreColor }}>{fraud_score}</span>
          </div>
        </div>
      </div>

      {/* Flags */}
      {flags && flags.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '12px' }}>Detected Issues:</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {flags.map((flag: any, idx: number) => {
              let iconColor = '#9ca3af';
              let bgColor = '#f3f4f6';
              if (flag.severity === 'critical') {
                iconColor = '#dc2626';
                bgColor = '#fee2e2';
              } else if (flag.severity === 'high') {
                iconColor = '#f59e0b';
                bgColor = '#fef3c7';
              } else if (flag.severity === 'medium') {
                iconColor = '#f97316';
                bgColor = '#fed7aa';
              }

              return (
                <div key={idx} style={{ padding: '12px', backgroundColor: bgColor, borderRadius: '8px', display: 'flex', alignItems: 'start', gap: '12px' }}>
                  <AlertTriangle style={{ width: '18px', height: '18px', color: iconColor, flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '13px', fontWeight: '500', color: '#111827', marginBottom: '2px' }}>
                      {flag.type.replace(/_/g, ' ').toUpperCase()}
                    </p>
                    <p style={{ fontSize: '12px', color: '#6b7280' }}>{flag.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '12px' }}>Recommendations:</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {recommendations.map((rec: string, idx: number) => (
              <div key={idx} style={{ padding: '10px 12px', backgroundColor: '#dbeafe', borderRadius: '6px', fontSize: '13px', color: '#1e40af' }}>
                • {rec}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

