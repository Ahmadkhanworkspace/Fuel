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
      borderBottom: '1px solid #e8eaed',
      padding: '12px 24px',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 400, color: '#202124', letterSpacing: 0, margin: 0 }}>
          Dashboard
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {employee && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              background: '#fef3c7',
              borderRadius: '20px',
            }}>
              <Shield style={{ width: '16px', height: '16px', color: '#f59e0b' }} />
              <span style={{ fontSize: '13px', fontWeight: 500, color: '#92400e', textTransform: 'capitalize' }}>
                {employee.role}
              </span>
            </div>
          )}
          
          {/* Notification Center */}
          <NotificationCenter />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#5f6368', padding: '8px 12px', borderRadius: '28px' }}>
            <User style={{ width: '18px', height: '18px', color: '#5f6368' }} />
            <span>{user?.email || 'admin@svfms.com'}</span>
          </div>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              fontSize: '14px',
              color: '#5f6368',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '28px',
              fontWeight: 500,
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f3f4'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <LogOut style={{ width: '18px', height: '18px' }} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}

