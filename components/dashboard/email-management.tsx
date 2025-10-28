'use client';

import { useState } from 'react';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: 'claim' | 'fraud' | 'maintenance' | 'zone' | 'general' | 'report';
  enabled: boolean;
}

interface EmailLog {
  id: string;
  recipient: string;
  template: string;
  subject: string;
  status: 'sent' | 'failed' | 'pending';
  timestamp: Date;
}

export default function EmailManagement() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([
    {
      id: '1',
      name: 'Claim Approved',
      subject: 'Your Fuel Claim #{{claim_id}} Has Been Approved',
      body: `Dear {{employee_name}},

Your fuel claim #{{claim_id}} has been approved.

Details:
- Date: {{claim_date}}
- Amount: ₹{{claim_amount}}
- Vehicle: {{vehicle}}
- Liters: {{liters}}L

Thank you for following our fuel management guidelines.

Best regards,
Ashraf Sugar Mills`,
      category: 'claim',
      enabled: true
    },
    {
      id: '2',
      name: 'Claim Rejected',
      subject: 'Your Fuel Claim #{{claim_id}} Has Been Rejected',
      body: `Dear {{employee_name}},

Your fuel claim #{{claim_id}} has been rejected.

Reason: {{rejection_reason}}

Please contact admin if you have any questions.

Best regards,
Ashraf Sugar Mills`,
      category: 'claim',
      enabled: true
    },
    {
      id: '3',
      name: 'Fraud Alert',
      subject: 'High Risk Claim Detected - Immediate Action Required',
      body: `Administrator Alert,

A high-risk claim has been detected:
- Claim ID: #{{claim_id}}
- Employee: {{employee_name}}
- Risk Score: {{risk_score}}/100
- Issue: {{fraud_issue}}

Please review immediately.

System: ASMS`,
      category: 'fraud',
      enabled: true
    },
    {
      id: '4',
      name: 'Zone Violation',
      subject: 'Geofence Violation Detected',
      body: `Dear {{employee_name}},

A zone violation has been detected for claim #{{claim_id}}.

Details:
- Zone: {{zone_name}}
- Required: {{zone_name}}
- Detected: {{actual_location}}
- Time: {{violation_time}}

Please ensure you are within the authorized zone for fuel claims.

Best regards,
Ashraf Sugar Mills`,
      category: 'zone',
      enabled: true
    },
    {
      id: '5',
      name: 'Maintenance Reminder',
      subject: 'Vehicle Maintenance Due Soon',
      body: `Dear {{employee_name}},

Your vehicle {{vehicle}} is due for maintenance.

Maintenance Type: {{maintenance_type}}
Due Date: {{due_date}}
Days Remaining: {{days_remaining}}

Please schedule a service appointment.

Best regards,
Ashraf Sugar Mills`,
      category: 'maintenance',
      enabled: true
    },
    {
      id: '6',
      name: 'Daily Summary',
      subject: 'Daily Fuel Management Summary - {{date}}',
      body: `Daily Report - {{date}}

Summary:
- Total Claims: {{total_claims}}
- Approved: {{approved_claims}}
- Pending: {{pending_claims}}
- Total Amount: ₹{{total_amount}}
- Zone Violations: {{violations}}

View full report: https://asms.ashrafsugar.com/dashboard

System: ASMS`,
      category: 'report',
      enabled: true
    }
  ]);

  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [emailLogs] = useState<EmailLog[]>([
    {
      id: '1',
      recipient: 'rajesh.kumar@ashrafsugar.com',
      template: 'Claim Approved',
      subject: 'Your Fuel Claim #CLM-2024-00123 Has Been Approved',
      status: 'sent',
      timestamp: new Date(Date.now() - 3600000)
    },
    {
      id: '2',
      recipient: 'admin@ashrafsugar.com',
      template: 'Fraud Alert',
      subject: 'High Risk Claim Detected - Immediate Action Required',
      status: 'sent',
      timestamp: new Date(Date.now() - 7200000)
    },
    {
      id: '3',
      recipient: 'priya.sharma@ashrafsugar.com',
      template: 'Zone Violation',
      subject: 'Geofence Violation Detected',
      status: 'failed',
      timestamp: new Date(Date.now() - 10800000)
    }
  ]);

  const handleToggleTemplate = (id: string) => {
    setTemplates(templates.map(t => 
      t.id === id ? { ...t, enabled: !t.enabled } : t
    ));
  };

  const handleEditTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setIsEditMode(true);
  };

  const handleSaveTemplate = () => {
    if (selectedTemplate) {
      setTemplates(templates.map(t => 
        t.id === selectedTemplate.id ? selectedTemplate : t
      ));
      setIsEditMode(false);
      setSelectedTemplate(null);
    }
  };

  const sendTestEmail = (templateId: string) => {
    alert(`Test email sent successfully!`);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
          📧 Email Management System
        </h1>
        <p style={{ color: '#6b7280', fontSize: '15px' }}>
          Manage email templates, configure notifications, and view email logs
        </p>
      </div>

      {/* Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '16px',
        marginBottom: '32px'
      }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#3b82f6' }}>{templates.length}</div>
          <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>Email Templates</div>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#10b981' }}>{emailLogs.filter(e => e.status === 'sent').length}</div>
          <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>Emails Sent Today</div>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#f59e0b' }}>{templates.filter(t => t.enabled).length}</div>
          <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>Templates Active</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Email Templates */}
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>Email Templates</h2>
              <button style={{
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                + New Template
              </button>
            </div>
          </div>

          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {templates.map((template) => (
              <div
                key={template.id}
                style={{
                  padding: '16px',
                  borderBottom: '1px solid #f3f4f6',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                onClick={() => handleEditTemplate(template)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: {
                          claim: '#dbeafe',
                          fraud: '#fee2e2',
                          maintenance: '#fef3c7',
                          zone: '#e9d5ff',
                          general: '#e5e7eb',
                          report: '#d1fae5'
                        }[template.category],
                        color: {
                          claim: '#1e40af',
                          fraud: '#dc2626',
                          maintenance: '#d97706',
                          zone: '#7c3aed',
                          general: '#374151',
                          report: '#059669'
                        }[template.category]
                      }}>
                        {template.category.toUpperCase()}
                      </span>
                      <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: template.enabled ? '#10b981' : '#9ca3af'
                      }} />
                    </div>
                    <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                      {template.name}
                    </h3>
                    <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>
                      {template.subject}
                    </p>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          sendTestEmail(template.id);
                        }}
                        style={{
                          background: '#f3f4f6',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          color: '#6b7280'
                        }}
                      >
                        Test Send
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleTemplate(template.id);
                        }}
                        style={{
                          background: template.enabled ? '#fef3c7' : '#f3f4f6',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          color: template.enabled ? '#d97706' : '#6b7280'
                        }}
                      >
                        {template.enabled ? '✓ Active' : 'Inactive'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Email Logs */}
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>Recent Emails</h2>
          </div>

          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {emailLogs.map((log) => (
              <div
                key={log.id}
                style={{
                  padding: '16px',
                  borderBottom: '1px solid #f3f4f6'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <span style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '600',
                    background: log.status === 'sent' ? '#d1fae5' : log.status === 'failed' ? '#fee2e2' : '#fef3c7',
                    color: log.status === 'sent' ? '#059669' : log.status === 'failed' ? '#dc2626' : '#d97706'
                  }}>
                    {log.status.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '13px', color: '#9ca3af' }}>
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                  {log.subject}
                </div>
                <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
                  To: {log.recipient}
                </div>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                  Template: {log.template}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {selectedTemplate && isEditMode && (
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
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
              Edit Template: {selectedTemplate.name}
            </h2>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                Subject
              </label>
              <input
                type="text"
                value={selectedTemplate.subject}
                onChange={(e) => setSelectedTemplate({ ...selectedTemplate, subject: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                Body
              </label>
              <textarea
                value={selectedTemplate.body}
                onChange={(e) => setSelectedTemplate({ ...selectedTemplate, body: e.target.value })}
                rows={12}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'monospace'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setIsEditMode(false);
                  setSelectedTemplate(null);
                }}
                style={{
                  background: '#f3f4f6',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTemplate}
                style={{
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

