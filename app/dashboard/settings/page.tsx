"use client";

import { useState } from "react";
import { Settings, Bell, MapPin, Shield, Fuel, Users, Database, Save } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState({
    general: {
      companyName: "SVFMS",
      timezone: "Asia/Karachi",
      currency: "PKR",
      dateFormat: "DD/MM/YYYY",
      enableNotifications: true,
      enableSMS: true,
      enableEmail: true,
    },
    fuel: {
      defaultFuelPrice: 104.14,
      priceUpdateFrequency: "daily",
      enableAutoPriceUpdate: true,
      maxLitersPerClaim: 100,
      requireLocationVerification: true,
    },
    fraud: {
      enableFraudDetection: true,
      fraudThresholdScore: 70,
      enablePHashChecking: true,
      enableEXIFValidation: true,
      enableDuplicateCheck: true,
      requireNonceOverlay: true,
    },
    zones: {
      enableGeofencing: true,
      defaultZoneRadius: 5,
      requireZoneCompliance: true,
      violationAlertThreshold: 10,
    },
    notifications: {
      newClaimAlert: true,
      highRiskAlert: true,
      zoneViolationAlert: true,
      dailySummaryReport: true,
      weeklyReportEmail: true,
      claimApproved: true,
      claimRejected: true,
      maintenanceDue: true,
      fuelQuotaLow: true,
      licenseExpiry: true,
      systemUpdates: true,
      thresholdAlerts: true,
      bulkActionComplete: true,
    },
    system: {
      enableAuditLog: true,
      dataRetentionDays: 365,
      enableBackup: true,
      backupFrequency: "daily",
      enableAutoMaintenance: true,
    },
    advanced: {
      enableAPI: true,
      apiRateLimit: 100,
      enableWebhooks: true,
      enableCaching: true,
      cacheTTL: 3600,
      enableAnalytics: true,
      enableRealTimeSync: true,
    }
  });

  const handleSave = () => {
    console.log("Saving settings:", settings);
    alert("Settings saved successfully!");
  };

  const tabs = [
    { id: "general", label: "General", icon: Settings },
    { id: "fuel", label: "Fuel Management", icon: Fuel },
    { id: "fraud", label: "Fraud Detection", icon: Shield },
    { id: "zones", label: "Zones", icon: MapPin },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "system", label: "System", icon: Database },
    { id: "advanced", label: "Advanced", icon: Settings },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '30px', fontWeight: 'bold', background: 'linear-gradient(90deg, #2563eb, #1e40af)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' }}>
          Settings
        </h1>
        <p style={{ color: '#4b5563', fontSize: '14px' }}>
          Configure system preferences and manage your fuel management setup
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '24px' }}>
        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: activeTab === tab.id ? '#dbeafe' : 'transparent',
                color: activeTab === tab.id ? '#2563eb' : '#4b5563',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              <tab.icon style={{ width: '18px', height: '18px' }} />
              {tab.label}
            </button>
          ))}
          <button
            onClick={handleSave}
            style={{
              marginTop: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(90deg, #2563eb, #1e40af)',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            <Save style={{ width: '18px', height: '18px' }} />
            Save All Settings
          </button>
        </div>

        {/* Content */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          {activeTab === "general" && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>General Settings</h2>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>Configure your company details and basic preferences</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Company Name</label>
                  <input
                    type="text"
                    value={settings.general.companyName}
                    onChange={(e) => setSettings({...settings, general: {...settings.general, companyName: e.target.value}})}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Timezone</label>
                    <select
                      value={settings.general.timezone}
                      onChange={(e) => setSettings({...settings, general: {...settings.general, timezone: e.target.value}})}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                    >
                      <option value="Asia/Karachi">Pakistan (PKT)</option>
                      <option value="Asia/Kolkata">India (IST)</option>
                      <option value="America/New_York">US Eastern</option>
                      <option value="Europe/London">UK (GMT)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Currency</label>
                    <select
                      value={settings.general.currency}
                      onChange={(e) => setSettings({...settings, general: {...settings.general, currency: e.target.value}})}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                    >
                      <option value="PKR">₨ PKR</option>
                      <option value="USD">$ USD</option>
                      <option value="INR">₹ INR</option>
                      <option value="EUR">€ EUR</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Date Format</label>
                  <select
                    value={settings.general.dateFormat}
                    onChange={(e) => setSettings({...settings, general: {...settings.general, dateFormat: e.target.value}})}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>

                <div style={{ marginTop: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={settings.general.enableNotifications}
                      onChange={(e) => setSettings({...settings, general: {...settings.general, enableNotifications: e.target.checked}})}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span style={{ fontSize: '14px', color: '#374151' }}>Enable Push Notifications</span>
                  </label>
                </div>

                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={settings.general.enableSMS}
                      onChange={(e) => setSettings({...settings, general: {...settings.general, enableSMS: e.target.checked}})}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span style={{ fontSize: '14px', color: '#374151' }}>Enable SMS Notifications</span>
                  </label>
                </div>

                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={settings.general.enableEmail}
                      onChange={(e) => setSettings({...settings, general: {...settings.general, enableEmail: e.target.checked}})}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span style={{ fontSize: '14px', color: '#374151' }}>Enable Email Notifications</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === "fuel" && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>Fuel Management</h2>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>Configure fuel pricing and claim management</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Default Fuel Price (₨/Liter)</label>
                  <input
                    type="number"
                    value={settings.fuel.defaultFuelPrice}
                    onChange={(e) => setSettings({...settings, fuel: {...settings.fuel, defaultFuelPrice: parseFloat(e.target.value)}})}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Price Update Frequency</label>
                  <select
                    value={settings.fuel.priceUpdateFrequency}
                    onChange={(e) => setSettings({...settings, fuel: {...settings.fuel, priceUpdateFrequency: e.target.value}})}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div style={{ marginTop: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={settings.fuel.enableAutoPriceUpdate}
                      onChange={(e) => setSettings({...settings, fuel: {...settings.fuel, enableAutoPriceUpdate: e.target.checked}})}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span style={{ fontSize: '14px', color: '#374151' }}>Enable Auto Price Update</span>
                  </label>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Max Liters Per Claim</label>
                  <input
                    type="number"
                    value={settings.fuel.maxLitersPerClaim}
                    onChange={(e) => setSettings({...settings, fuel: {...settings.fuel, maxLitersPerClaim: parseInt(e.target.value)}})}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                  />
                </div>

                <div style={{ marginTop: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={settings.fuel.requireLocationVerification}
                      onChange={(e) => setSettings({...settings, fuel: {...settings.fuel, requireLocationVerification: e.target.checked}})}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span style={{ fontSize: '14px', color: '#374151' }}>Require Location Verification</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === "fraud" && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>Fraud Detection</h2>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>Configure fraud detection and security settings</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ marginTop: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={settings.fraud.enableFraudDetection}
                      onChange={(e) => setSettings({...settings, fraud: {...settings.fraud, enableFraudDetection: e.target.checked}})}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span style={{ fontSize: '14px', color: '#374151' }}>Enable Fraud Detection</span>
                  </label>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Fraud Threshold Score (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={settings.fraud.fraudThresholdScore}
                    onChange={(e) => setSettings({...settings, fraud: {...settings.fraud, fraudThresholdScore: parseInt(e.target.value)}})}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                  />
                  <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Claims above this score require manual review</p>
                </div>

                <div style={{ marginTop: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={settings.fraud.enablePHashChecking}
                      onChange={(e) => setSettings({...settings, fraud: {...settings.fraud, enablePHashChecking: e.target.checked}})}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span style={{ fontSize: '14px', color: '#374151' }}>Enable Perceptual Hash Checking</span>
                  </label>
                </div>

                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={settings.fraud.enableEXIFValidation}
                      onChange={(e) => setSettings({...settings, fraud: {...settings.fraud, enableEXIFValidation: e.target.checked}})}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span style={{ fontSize: '14px', color: '#374151' }}>Enable EXIF Validation</span>
                  </label>
                </div>

                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={settings.fraud.enableDuplicateCheck}
                      onChange={(e) => setSettings({...settings, fraud: {...settings.fraud, enableDuplicateCheck: e.target.checked}})}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span style={{ fontSize: '14px', color: '#374151' }}>Enable Duplicate Image Check</span>
                  </label>
                </div>

                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={settings.fraud.requireNonceOverlay}
                      onChange={(e) => setSettings({...settings, fraud: {...settings.fraud, requireNonceOverlay: e.target.checked}})}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span style={{ fontSize: '14px', color: '#374151' }}>Require Nonce Overlay</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === "zones" && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>Zone Management</h2>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>Configure geofencing and zone compliance</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ marginTop: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={settings.zones.enableGeofencing}
                      onChange={(e) => setSettings({...settings, zones: {...settings.zones, enableGeofencing: e.target.checked}})}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span style={{ fontSize: '14px', color: '#374151' }}>Enable Geofencing</span>
                  </label>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Default Zone Radius (km)</label>
                  <input
                    type="number"
                    value={settings.zones.defaultZoneRadius}
                    onChange={(e) => setSettings({...settings, zones: {...settings.zones, defaultZoneRadius: parseInt(e.target.value)}})}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                  />
                </div>

                <div style={{ marginTop: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={settings.zones.requireZoneCompliance}
                      onChange={(e) => setSettings({...settings, zones: {...settings.zones, requireZoneCompliance: e.target.checked}})}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span style={{ fontSize: '14px', color: '#374151' }}>Require Zone Compliance</span>
                  </label>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Violation Alert Threshold</label>
                  <input
                    type="number"
                    value={settings.zones.violationAlertThreshold}
                    onChange={(e) => setSettings({...settings, zones: {...settings.zones, violationAlertThreshold: parseInt(e.target.value)}})}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                  />
                  <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Number of violations before alerting admin</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>Notification Settings</h2>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>Configure notification preferences and alerts</p>
              
              {/* Claim Notifications */}
              <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  🚗 Claim Notifications
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '10px', background: 'white', borderRadius: '8px' }}>
                    <input
                      type="checkbox"
                      checked={settings.notifications.newClaimAlert}
                      onChange={(e) => setSettings({...settings, notifications: {...settings.notifications, newClaimAlert: e.target.checked}})}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>New Claim Submission</div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>Alert admins when a new claim is submitted</div>
                    </div>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '10px', background: 'white', borderRadius: '8px' }}>
                    <input
                      type="checkbox"
                      checked={settings.notifications.claimApproved}
                      onChange={(e) => setSettings({...settings, notifications: {...settings.notifications, claimApproved: e.target.checked}})}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Claim Approved</div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>Notify employee when their claim is approved</div>
                    </div>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '10px', background: 'white', borderRadius: '8px' }}>
                    <input
                      type="checkbox"
                      checked={settings.notifications.claimRejected}
                      onChange={(e) => setSettings({...settings, notifications: {...settings.notifications, claimRejected: e.target.checked}})}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Claim Rejected</div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>Notify employee when their claim is rejected</div>
                    </div>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '10px', background: 'white', borderRadius: '8px' }}>
                    <input
                      type="checkbox"
                      checked={settings.notifications.highRiskAlert}
                      onChange={(e) => setSettings({...settings, notifications: {...settings.notifications, highRiskAlert: e.target.checked}})}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>High Risk Claims</div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>Alert when a claim is flagged as high-risk</div>
                    </div>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '10px', background: 'white', borderRadius: '8px' }}>
                    <input
                      type="checkbox"
                      checked={settings.notifications.bulkActionComplete}
                      onChange={(e) => setSettings({...settings, notifications: {...settings.notifications, bulkActionComplete: e.target.checked}})}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Bulk Actions Complete</div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>Notify when bulk approve/reject is completed</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Zone & Location Notifications */}
              <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  📍 Zone & Location Alerts
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '10px', background: 'white', borderRadius: '8px' }}>
                    <input
                      type="checkbox"
                      checked={settings.notifications.zoneViolationAlert}
                      onChange={(e) => setSettings({...settings, notifications: {...settings.notifications, zoneViolationAlert: e.target.checked}})}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Zone Violations</div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>Alert when claim is submitted outside authorized zone</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Maintenance Notifications */}
              <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  🔧 Maintenance Alerts
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '10px', background: 'white', borderRadius: '8px' }}>
                    <input
                      type="checkbox"
                      checked={settings.notifications.maintenanceDue}
                      onChange={(e) => setSettings({...settings, notifications: {...settings.notifications, maintenanceDue: e.target.checked}})}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Vehicle Maintenance Due</div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>Alert when vehicle maintenance is due</div>
                    </div>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '10px', background: 'white', borderRadius: '8px' }}>
                    <input
                      type="checkbox"
                      checked={settings.notifications.licenseExpiry}
                      onChange={(e) => setSettings({...settings, notifications: {...settings.notifications, licenseExpiry: e.target.checked}})}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>License Expiry</div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>Alert when vehicle license is about to expire</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Fuel Quota Notifications */}
              <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  ⛽ Fuel Quota Alerts
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '10px', background: 'white', borderRadius: '8px' }}>
                    <input
                      type="checkbox"
                      checked={settings.notifications.fuelQuotaLow}
                      onChange={(e) => setSettings({...settings, notifications: {...settings.notifications, fuelQuotaLow: e.target.checked}})}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Low Fuel Quota Warning</div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>Alert when employee fuel quota is below 20%</div>
                    </div>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '10px', background: 'white', borderRadius: '8px' }}>
                    <input
                      type="checkbox"
                      checked={settings.notifications.thresholdAlerts}
                      onChange={(e) => setSettings({...settings, notifications: {...settings.notifications, thresholdAlerts: e.target.checked}})}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Budget Threshold Alerts</div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>Alert when monthly fuel budget exceeds threshold</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Reports & Summaries */}
              <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  📊 Reports & Summaries
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '10px', background: 'white', borderRadius: '8px' }}>
                    <input
                      type="checkbox"
                      checked={settings.notifications.dailySummaryReport}
                      onChange={(e) => setSettings({...settings, notifications: {...settings.notifications, dailySummaryReport: e.target.checked}})}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Daily Summary Report</div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>Send daily summary email to administrators</div>
                    </div>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '10px', background: 'white', borderRadius: '8px' }}>
                    <input
                      type="checkbox"
                      checked={settings.notifications.weeklyReportEmail}
                      onChange={(e) => setSettings({...settings, notifications: {...settings.notifications, weeklyReportEmail: e.target.checked}})}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Weekly Report Email</div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>Send comprehensive weekly report every Monday</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* System Notifications */}
              <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  ⚙️ System Updates
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '10px', background: 'white', borderRadius: '8px' }}>
                    <input
                      type="checkbox"
                      checked={settings.notifications.systemUpdates}
                      onChange={(e) => setSettings({...settings, notifications: {...settings.notifications, systemUpdates: e.target.checked}})}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>System Updates</div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>Notify about system updates, upgrades, and downtime</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === "system" && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>System Settings</h2>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>Configure system preferences and maintenance</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ marginTop: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={settings.system.enableAuditLog}
                      onChange={(e) => setSettings({...settings, system: {...settings.system, enableAuditLog: e.target.checked}})}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span style={{ fontSize: '14px', color: '#374151' }}>Enable Audit Logging</span>
                  </label>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Data Retention Period (Days)</label>
                  <input
                    type="number"
                    value={settings.system.dataRetentionDays}
                    onChange={(e) => setSettings({...settings, system: {...settings.system, dataRetentionDays: parseInt(e.target.value)}})}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                  />
                </div>

                <div style={{ marginTop: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={settings.system.enableBackup}
                      onChange={(e) => setSettings({...settings, system: {...settings.system, enableBackup: e.target.checked}})}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span style={{ fontSize: '14px', color: '#374151' }}>Enable Automatic Backup</span>
                  </label>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Backup Frequency</label>
                  <select
                    value={settings.system.backupFrequency}
                    onChange={(e) => setSettings({...settings, system: {...settings.system, backupFrequency: e.target.value}})}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div style={{ marginTop: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={settings.system.enableAutoMaintenance}
                      onChange={(e) => setSettings({...settings, system: {...settings.system, enableAutoMaintenance: e.target.checked}})}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span style={{ fontSize: '14px', color: '#374151' }}>Enable Auto Maintenance</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === "advanced" && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>Advanced Settings</h2>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>Configure advanced system settings and APIs</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ marginTop: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={settings.advanced.enableAPI}
                      onChange={(e) => setSettings({...settings, advanced: {...settings.advanced, enableAPI: e.target.checked}})}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span style={{ fontSize: '14px', color: '#374151' }}>Enable Public API Access</span>
                  </label>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>API Rate Limit (requests/hour)</label>
                  <input
                    type="number"
                    value={settings.advanced.apiRateLimit}
                    onChange={(e) => setSettings({...settings, advanced: {...settings.advanced, apiRateLimit: parseInt(e.target.value)}})}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                  />
                </div>

                <div style={{ marginTop: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={settings.advanced.enableWebhooks}
                      onChange={(e) => setSettings({...settings, advanced: {...settings.advanced, enableWebhooks: e.target.checked}})}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span style={{ fontSize: '14px', color: '#374151' }}>Enable Webhooks</span>
                  </label>
                </div>

                <div style={{ marginTop: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={settings.advanced.enableCaching}
                      onChange={(e) => setSettings({...settings, advanced: {...settings.advanced, enableCaching: e.target.checked}})}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span style={{ fontSize: '14px', color: '#374151' }}>Enable Data Caching</span>
                  </label>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Cache TTL (seconds)</label>
                  <input
                    type="number"
                    value={settings.advanced.cacheTTL}
                    onChange={(e) => setSettings({...settings, advanced: {...settings.advanced, cacheTTL: parseInt(e.target.value)}})}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                  />
                </div>

                <div style={{ marginTop: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={settings.advanced.enableAnalytics}
                      onChange={(e) => setSettings({...settings, advanced: {...settings.advanced, enableAnalytics: e.target.checked}})}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span style={{ fontSize: '14px', color: '#374151' }}>Enable Analytics Tracking</span>
                  </label>
                </div>

                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={settings.advanced.enableRealTimeSync}
                      onChange={(e) => setSettings({...settings, advanced: {...settings.advanced, enableRealTimeSync: e.target.checked}})}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span style={{ fontSize: '14px', color: '#374151' }}>Enable Real-time Sync</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
