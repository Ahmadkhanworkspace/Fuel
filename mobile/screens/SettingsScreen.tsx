import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Switch
} from 'react-native';
import { useAuthStore } from '../lib/store';

export default function SettingsScreen({ navigation }: any) {
  const { employee, setUser, setEmployee } = useAuthStore();
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          setUser(null);
          setEmployee(null);
          navigation.replace('Login');
        }
      }
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>⚙️ Account Settings</Text>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {employee?.name?.charAt(0) || 'U'}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{employee?.name || 'Demo User'}</Text>
              <Text style={styles.profileDesignation}>{employee?.designation || 'Employee'}</Text>
              <Text style={styles.profileCode}>Code: {employee?.employee_code || 'EMP001'}</Text>
            </View>
          </View>

          <View style={styles.profileDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>📧 Email</Text>
              <Text style={styles.detailValue}>{employee?.email || 'demo@asms.com'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>🏢 Department</Text>
              <Text style={styles.detailValue}>{employee?.department || 'Operations'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>🚗 Assigned Vehicle</Text>
              <Text style={styles.detailValue}>{employee?.assigned_vehicle?.reg_no || 'N/A'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>⛽ Monthly Quota</Text>
              <Text style={styles.detailValue}>{employee?.quota_limit || 50000}L</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>🔑 Status</Text>
              <Text style={[styles.detailValue, { color: '#10b981', fontWeight: '600' }]}>
                Active
              </Text>
            </View>
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔔 Notifications</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Push Notifications</Text>
              <Text style={styles.settingDescription}>Receive real-time updates</Text>
            </View>
            <Switch value={pushNotifications} onValueChange={setPushNotifications} />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Email Notifications</Text>
              <Text style={styles.settingDescription}>Receive claim status emails</Text>
            </View>
            <Switch value={emailNotifications} onValueChange={setEmailNotifications} />
          </View>
        </View>

        {/* Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔒 Security</Text>
          
          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Biometric Login</Text>
              <Text style={styles.settingDescription}>Use fingerprint or face ID</Text>
            </View>
            <Switch value={biometricEnabled} onValueChange={setBiometricEnabled} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Change Password</Text>
              <Text style={styles.settingDescription}>Update your password</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📱 App Settings</Text>
          
          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Language</Text>
              <Text style={styles.settingDescription}>English (US)</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Data Usage</Text>
              <Text style={styles.settingDescription}>Sync over Wi-Fi only</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ℹ️ About</Text>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>App Version</Text>
            <Text style={styles.settingValue}>1.0.0</Text>
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Company</Text>
            <Text style={styles.settingValue}>Ashraf Sugar Mills</Text>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>🚪 Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#2563eb',
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 24,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  profileDesignation: {
    fontSize: 16,
    color: '#2563eb',
    fontWeight: '600',
    marginBottom: 4,
  },
  profileCode: {
    fontSize: 14,
    color: '#6b7280',
  },
  profileDetails: {
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
    textAlign: 'right',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: '#6b7280',
  },
  settingValue: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  arrow: {
    fontSize: 24,
    color: '#9ca3af',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});


