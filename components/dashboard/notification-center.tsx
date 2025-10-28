'use client';

import { useState, useEffect } from 'react';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info' | 'claim' | 'fraud' | 'maintenance' | 'zone-violation';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'claim',
      title: 'New Claim Submitted',
      message: 'Rajesh Kumar submitted a fuel claim for ₹5,450',
      timestamp: new Date(Date.now() - 30000),
      read: false,
      actionUrl: '/dashboard/claims'
    },
    {
      id: '2',
      type: 'fraud',
      title: 'High Risk Claim Detected',
      message: 'Claim #CLM-2024-00123 flagged as high risk (Score: 85/100)',
      timestamp: new Date(Date.now() - 300000),
      read: false,
      actionUrl: '/dashboard/claims'
    },
    {
      id: '3',
      type: 'maintenance',
      title: 'Vehicle Maintenance Due',
      message: 'Toyota Innova (UP32AB1234) due for service in 3 days',
      timestamp: new Date(Date.now() - 600000),
      read: false,
      actionUrl: '/dashboard/maintenance'
    },
    {
      id: '4',
      type: 'zone-violation',
      title: 'Zone Violation Alert',
      message: 'Zone violation detected for Amit Patel at Zone-001',
      timestamp: new Date(Date.now() - 1200000),
      read: false,
      actionUrl: '/dashboard/zones'
    },
    {
      id: '5',
      type: 'info',
      title: 'Daily Summary',
      message: 'Today: 15 claims processed, ₹78,450 approved',
      timestamp: new Date(Date.now() - 3600000),
      read: false
    },
    {
      id: '6',
      type: 'success',
      title: 'Bulk Approval Complete',
      message: 'Successfully approved 12 pending claims',
      timestamp: new Date(Date.now() - 7200000),
      read: true
    },
    {
      id: '7',
      type: 'warning',
      title: 'Low Fuel Quota',
      message: 'Amit Patel has 15% fuel quota remaining for this month',
      timestamp: new Date(Date.now() - 10800000),
      read: false,
      actionUrl: '/dashboard/employees'
    }
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('unread');

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'claim': return '🚗';
      case 'fraud': return '⚠️';
      case 'maintenance': return '🔧';
      case 'zone-violation': return '📍';
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'claim': return '#3b82f6';
      case 'fraud': return '#ef4444';
      case 'maintenance': return '#f59e0b';
      case 'zone-violation': return '#8b5cf6';
      case 'success': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'error': return '#ef4444';
      case 'info': return '#06b6d4';
      default: return '#6b7280';
    }
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read) 
    : notifications;

  const formatTime = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Notification Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'relative',
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
      >
        <span style={{ fontSize: '20px' }}>🔔</span>
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              background: '#ef4444',
              color: 'white',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: 'bold',
              border: '2px solid white'
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 12px)',
            right: 0,
            width: '420px',
            maxHeight: '600px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
            border: '1px solid #e5e7eb',
            zIndex: 1000,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Header */}
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'white', margin: 0 }}>
              🔔 Notifications ({unreadCount} new)
            </h3>
            <button
              onClick={markAllAsRead}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Mark all read
            </button>
          </div>

          {/* Filter Tabs */}
          <div style={{ 
            padding: '12px 16px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            gap: '8px',
            background: '#f9fafb'
          }}>
            <button
              onClick={() => setFilter('unread')}
              style={{
                padding: '6px 16px',
                borderRadius: '8px',
                border: 'none',
                background: filter === 'unread' ? '#667eea' : 'transparent',
                color: filter === 'unread' ? 'white' : '#6b7280',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Unread
            </button>
            <button
              onClick={() => setFilter('all')}
              style={{
                padding: '6px 16px',
                borderRadius: '8px',
                border: 'none',
                background: filter === 'all' ? '#667eea' : 'transparent',
                color: filter === 'all' ? 'white' : '#6b7280',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              All
            </button>
          </div>

          {/* Notifications List */}
          <div style={{ flex: 1, overflowY: 'auto', maxHeight: '500px' }}>
            {filteredNotifications.length === 0 ? (
              <div style={{ 
                padding: '60px 20px',
                textAlign: 'center',
                color: '#9ca3af'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔕</div>
                <div style={{ fontSize: '14px', fontWeight: '600' }}>No notifications</div>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => {
                    markAsRead(notification.id);
                    if (notification.actionUrl) {
                      window.location.href = notification.actionUrl;
                    }
                  }}
                  style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid #f3f4f6',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    background: notification.read ? 'white' : '#eff6ff'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                  onMouseLeave={(e) => e.currentTarget.style.background = notification.read ? 'white' : '#eff6ff'}
                >
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    {/* Icon */}
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: `${getNotificationColor(notification.type)}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      flexShrink: 0
                    }}>
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#111827',
                        marginBottom: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        {notification.title}
                        {!notification.read && (
                          <span style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: '#667eea'
                          }} />
                        )}
                      </div>
                      <div style={{
                        fontSize: '13px',
                        color: '#6b7280',
                        marginBottom: '6px',
                        lineHeight: '1.4'
                      }}>
                        {notification.message}
                      </div>
                      <div style={{
                        fontSize: '11px',
                        color: '#9ca3af'
                      }}>
                        {formatTime(notification.timestamp)}
                      </div>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#9ca3af',
                        cursor: 'pointer',
                        padding: '4px',
                        fontSize: '16px',
                        opacity: 0.6,
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div style={{
            padding: '12px 20px',
            borderTop: '1px solid #e5e7eb',
            background: '#f9fafb',
            textAlign: 'center'
          }}>
            <button
              style={{
                background: '#667eea',
                border: 'none',
                color: 'white',
                padding: '8px 24px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#5568d3'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#667eea'}
              onClick={() => window.location.href = '/dashboard/settings'}
            >
              Manage Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

