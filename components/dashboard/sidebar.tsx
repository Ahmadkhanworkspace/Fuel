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
      backgroundColor: '#1e293b',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      boxShadow: '2px 0 10px rgba(0,0,0,0.1)'
    }}>
      {/* Logo */}
      <div style={{ padding: '24px', borderBottom: '1px solid #334155' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Car className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              background: 'linear-gradient(90deg, #3b82f6, #2563eb)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              ASMS
            </h1>
            <p style={{ fontSize: '12px', color: '#94a3b8' }}>Vehicle Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '12px', overflowY: 'auto' }}>
        {visibleNavigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                marginBottom: '4px',
                borderRadius: '8px',
                backgroundColor: isActive ? 'linear-gradient(90deg, #3b82f6, #2563eb)' : 'transparent',
                color: isActive ? 'white' : '#cbd5e1',
                textDecoration: 'none',
                transition: 'all 0.2s'
              }}
            >
              <item.icon style={{ marginRight: '12px', width: '20px', height: '20px' }} />
              <span style={{ fontSize: '14px', fontWeight: '500' }}>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Role Footer */}
      <div style={{ padding: '16px', borderTop: '1px solid #334155', textAlign: 'center' }}>
        <div style={{ fontSize: '12px', color: '#94a3b8' }}>
          Role: <span style={{ fontWeight: '600', color: '#cbd5e1' }}>{currentRole?.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
}

