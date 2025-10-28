"use client";

import { useRouter } from "next/navigation";
import { User, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import NotificationCenter from "./notification-center";

interface HeaderProps {
  user: any;
  employee?: any;
}

export default function Header({ user, employee }: HeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    window.location.href = '/login';
  };

  return (
    <header style={{
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb',
      padding: '16px 24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
          Dashboard
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {employee && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 12px',
              background: 'linear-gradient(90deg, #dbeafe, #bfdbfe)',
              borderRadius: '8px',
              border: '1px solid #93c5fd'
            }}>
              <Shield style={{ width: '16px', height: '16px', color: '#2563eb' }} />
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#1e40af', textTransform: 'capitalize' }}>
                {employee.role}
              </span>
            </div>
          )}
          
          {/* Notification Center */}
          <NotificationCenter />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#374151' }}>
            <User style={{ width: '16px', height: '16px' }} />
            <span>{user?.email || 'admin@svfms.com'}</span>
          </div>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              fontSize: '14px',
              color: '#dc2626',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '6px'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <LogOut style={{ width: '16px', height: '16px' }} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

