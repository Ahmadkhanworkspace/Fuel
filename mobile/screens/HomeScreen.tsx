import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert
} from 'react-native';
import { supabase } from '../lib/supabase';
import { useAuthStore, useOfflineStore } from '../lib/store';

export default function HomeScreen({ navigation }: any) {
  const { claims, syncClaims } = useOfflineStore();
  const { user, employee, setUser, setEmployee } = useAuthStore();
  const [stats, setStats] = useState({
    totalClaimed: 0,
    quotaLimit: 50000,
    usedQuota: 0,
    claimsThisMonth: 0,
    avgFuelConsumption: 0,
    pendingClaims: 0,
    syncedClaims: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    updateStats();
  }, [claims]);

  const handleSync = async () => {
    if (stats.pendingClaims === 0) {
      Alert.alert('Sync', 'All claims are already synced!');
      return;
    }
    
    Alert.alert('Sync', `Syncing ${stats.pendingClaims} pending claim(s)...`);
    await syncClaims();
    Alert.alert('Success', 'Claims synced successfully!');
  };

  const updateStats = () => {
    const pending = claims.filter((c: any) => !c.synced).length;
    const synced = claims.filter((c: any) => c.synced).length;
    const totalLiters = claims.reduce((sum: number, c: any) => sum + (c.liters || 0), 0);
    const avg = claims.length > 0 ? totalLiters / claims.length : 0;
    
    setStats({
      totalClaimed: totalLiters,
      quotaLimit: 50000,
      usedQuota: (totalLiters / 50000 * 100),
      claimsThisMonth: claims.length,
      avgFuelConsumption: avg,
      pendingClaims: pending,
      syncedClaims: synced
    });
  };

  const fetchStats = async () => {
    // Stats now update from offline claims
    if (!employee) return;

    // Original stats fetch code (disabled for demo)
    /*
    try {
      const { data: claims } = await supabase
        .from('claims')
        .select('liters_claimed, created_at')
        .eq('employee_id', employee.id)
        .order('created_at', { ascending: false });

      if (claims) {
        const total = claims.reduce((sum, c) => sum + c.liters_claimed, 0);
        const monthClaims = claims.filter(c => {
          const date = new Date(c.created_at);
          const now = new Date();
          return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        }).length;

        setStats({
          totalClaimed: total,
          usedQuota: employee.allowed_quota_liters ? (total / employee.allowed_quota_liters * 100) : 0,
          claimsThisMonth: monthClaims,
          avgFuelConsumption: claims.length > 0 ? total / claims.length : 0
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
    */
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          // DEMO MODE - Just navigate to login
          setUser(null);
          setEmployee(null);
          navigation.replace('Login');
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header with Profile */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Settings')} 
          style={styles.profileHeader}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {employee?.name?.charAt(0) || 'U'}
            </Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>👋 Welcome back!</Text>
            <Text style={styles.name}>{employee?.name || 'Demo User'}</Text>
            <Text style={styles.designation}>{employee?.designation || 'Employee'}</Text>
          </View>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Employee Card */}
        <View style={styles.employeeCard}>
          <View style={styles.employeeHeader}>
            <View>
              <Text style={styles.employeeName}>{employee?.name || 'Demo User'}</Text>
              <Text style={styles.employeeDesignation}>{employee?.designation || 'Employee'}</Text>
              <Text style={styles.employeeCode}>ID: {employee?.employee_code || 'EMP001'}</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>✓ Active</Text>
            </View>
          </View>

          <View style={styles.employeeDetails}>
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>📧</Text>
              <Text style={styles.detailText}>{employee?.email || 'demo@asms.com'}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>🚗</Text>
              <Text style={styles.detailText}>{employee?.assigned_vehicle?.reg_no || 'N/A'} {employee?.assigned_vehicle?.model || ''}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>🏢</Text>
              <Text style={styles.detailText}>{employee?.department || 'Operations'}</Text>
            </View>
          </View>
        </View>

        {/* Fuel Quota Card */}
        <View style={styles.quotaCard}>
          <View style={styles.quotaCardHeader}>
            <Text style={styles.quotaCardTitle}>⛽ Monthly Fuel Quota</Text>
            <View style={styles.quotaAmount}>
              <Text style={styles.quotaAmountText}>{stats.quotaLimit.toLocaleString()}L</Text>
            </View>
          </View>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${Math.min(stats.usedQuota, 100)}%` }
                ]} 
              />
            </View>
            <View style={styles.quotaStats}>
              <Text style={styles.quotaStatText}>
                <Text style={styles.quotaStatValue}>{stats.totalClaimed.toFixed(1)}L</Text> used
              </Text>
              <Text style={styles.quotaStatText}>
                {stats.usedQuota.toFixed(1)}% of quota
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, styles.statCardBlue]}>
            <Text style={{ fontSize: 36, marginBottom: 8 }}>⛽</Text>
            <Text style={styles.statValue}>{stats.totalClaimed.toFixed(1)}L</Text>
            <Text style={styles.statLabel}>Total Fuel Used</Text>
          </View>

          <View style={[styles.statCard, styles.statCardGreen]}>
            <Text style={{ fontSize: 36, marginBottom: 8 }}>📊</Text>
            <Text style={styles.statValue}>{claims.length}</Text>
            <Text style={styles.statLabel}>Total Claims</Text>
          </View>

          <View style={[styles.statCard, styles.statCardOrange]}>
            <Text style={{ fontSize: 36, marginBottom: 8 }}>⏳</Text>
            <Text style={styles.statValue}>{stats.pendingClaims}</Text>
            <Text style={styles.statLabel}>Pending Sync</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('ClaimFuel')}
          >
            <Text style={{ fontSize: 28, marginRight: 12 }}>⛽</Text>
            <View>
              <Text style={styles.primaryButtonText}>Claim Fuel</Text>
              <Text style={styles.primaryButtonSubtext}>Submit a new fuel claim</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.actionButtonsRow}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('History')}
            >
              <Text style={{ fontSize: 24, marginBottom: 8 }}>📄</Text>
              <Text style={styles.secondaryButtonText}>History</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleSync}
            >
              <Text style={{ fontSize: 24, marginBottom: 8 }}>🔄</Text>
              <Text style={styles.secondaryButtonText}>Sync</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerText: {
    flex: 1,
  },
  settingsIcon: {
    fontSize: 24,
  },
  greeting: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  designation: {
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '500',
  },
  logoutButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  employeeCard: {
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    backgroundColor: '#4f46e5',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  employeeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  employeeName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  employeeDesignation: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    marginBottom: 4,
  },
  employeeCode: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  statusBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  employeeDetails: {
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailIcon: {
    fontSize: 18,
  },
  detailText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '500',
  },
  quotaCard: {
    backgroundColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    backgroundColor: '#ef4444',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  quotaCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  quotaCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  quotaAmount: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  quotaAmountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  progressContainer: {
    gap: 12,
  },
  quotaStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quotaStatText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  quotaStatValue: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  vehicleCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  vehicleInfo: {
    marginBottom: 16,
  },
  vehicleLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  vehicleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  vehicleSubtext: {
    fontSize: 14,
    color: '#9ca3af',
  },
  quotaBar: {
    marginTop: 12,
  },
  quotaLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  quotaText: {
    fontSize: 14,
    color: '#6b7280',
  },
  quotaValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
  },
  progressBar: {
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
  },
  quotaUsed: {
    fontSize: 12,
    color: '#6b7280',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 4,
  },
  statCardBlue: {
    backgroundColor: '#eff6ff',
    borderWidth: 2,
    borderColor: '#bfdbfe',
  },
  statCardGreen: {
    backgroundColor: '#f0fdf4',
    borderWidth: 2,
    borderColor: '#bbf7d0',
  },
  statCardOrange: {
    backgroundColor: '#fff7ed',
    borderWidth: 2,
    borderColor: '#fed7aa',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  actions: {
    gap: 12,
    marginTop: 16,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    borderRadius: 16,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  primaryButtonSubtext: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.9,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  secondaryButtonText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '600',
  },
});

