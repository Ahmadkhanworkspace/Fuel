"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Car,
  Wrench,
  BarChart3,
  Settings,
  MapPin,
  Shield,
  MapPinIcon,
  Users,
  Bell,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  roles?: string[];
}

const navigation: NavigationItem[] = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Claims Queue", href: "/dashboard/claims", icon: FileText, roles: ['approver', 'admin'] },
  { name: "Vehicles", href: "/dashboard/vehicles", icon: Car },
  { name: "Maintenance", href: "/dashboard/maintenance", icon: Wrench },
  { name: "Zones", href: "/dashboard/zones", icon: MapPin, roles: ['admin'] },
  { name: "Location Logs", href: "/dashboard/location-logs", icon: MapPinIcon, roles: ['approver', 'admin'] },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Employees", href: "/dashboard/employees", icon: Users, roles: ['admin'] },
  { name: "Role Management", href: "/dashboard/roles", icon: Shield, roles: ['admin'] },
  { name: "Notifications", href: "/dashboard/notifications", icon: Mail, roles: ['admin'] },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar({ currentRole }: { currentRole?: string }) {
  const pathname = usePathname();

  // Filter navigation based on role
  const visibleNavigation = navigation.filter(item => 
    !item.roles || (currentRole && item.roles.includes(currentRole))
  );

  return (
    <div style={{
      width: '256px',
      backgroundColor: 'white',
      color: '#202124',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      boxShadow: '1px 0 3px 0 rgba(60,64,67,.3), 0 8px 24px 4px rgba(60,64,67,.15)',
      borderRight: '1px solid #e8eaed'
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 16px', borderBottom: '1px solid #e8eaed' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: '#1976d2',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Car className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 style={{
              fontSize: '22px',
              fontWeight: 400,
              color: '#202124',
              margin: 0
            }}>
              ASMS
            </h1>
            <p style={{ fontSize: '12px', color: '#94a3b8' }}>Vehicle Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '8px', overflowY: 'auto' }}>
        {visibleNavigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px 16px',
                marginBottom: '2px',
                borderRadius: '24px',
                backgroundColor: isActive ? '#e8f0fe' : 'transparent',
                color: isActive ? '#1967d2' : '#5f6368',
                textDecoration: 'none',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <item.icon style={{ marginRight: '16px', width: '20px', height: '20px' }} />
              <span style={{ fontSize: '14px', fontWeight: isActive ? 500 : 400, letterSpacing: 0 }}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Role Footer */}
      <div style={{ padding: '16px', borderTop: '1px solid #e8eaed', textAlign: 'center' }}>
        <div style={{ fontSize: '13px', color: '#5f6368' }}>
          Role: <span style={{ fontWeight: 500, color: '#202124' }}>{currentRole?.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
}

