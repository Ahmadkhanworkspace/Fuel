import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/lib/zustand-store';

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuthStore();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/(auth)/login');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.welcomeCard}>
        <Text style={styles.welcomeText}>Welcome back!</Text>
        <Text style={styles.emailText}>{user?.email}</Text>
      </View>

      <View style={styles.cardsContainer}>
        <TouchableOpacity
          style={[styles.card, styles.primaryCard]}
          onPress={() => router.push('/(tabs)/claims/new')}
        >
          <Text style={styles.cardEmoji}>⛽</Text>
          <Text style={styles.cardTitle}>Submit Fuel Claim</Text>
          <Text style={styles.cardDescription}>Add new fuel receipt</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('/(tabs)/claims')}
        >
          <Text style={styles.cardEmoji}>📋</Text>
          <Text style={styles.cardTitle}>My Claims</Text>
          <Text style={styles.cardDescription}>View claim history</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('/(tabs)/maintenance')}
        >
          <Text style={styles.cardEmoji}>🔧</Text>
          <Text style={styles.cardTitle}>Maintenance</Text>
          <Text style={styles.cardDescription}>Request service</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('/(tabs)/vehicles')}
        >
          <Text style={styles.cardEmoji}>🚗</Text>
          <Text style={styles.cardTitle}>My Vehicle</Text>
          <Text style={styles.cardDescription}>Vehicle details</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.offlineIndicator}
        onPress={() => router.push('/(tabs)/sync')}
      >
        <Text style={styles.offlineText}>📡 Check Pending Uploads</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  logoutText: {
    color: '#ff4444',
    fontSize: 16,
  },
  welcomeCard: {
    backgroundColor: '#4A90E2',
    margin: 15,
    padding: 20,
    borderRadius: 15,
  },
  welcomeText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 5,
  },
  emailText: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },
  cardsContainer: {
    padding: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryCard: {
    borderLeftWidth: 5,
    borderLeftColor: '#4A90E2',
  },
  cardEmoji: {
    fontSize: 40,
    marginRight: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
  },
  offlineIndicator: {
    backgroundColor: '#fff3cd',
    padding: 15,
    margin: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  offlineText: {
    color: '#856404',
    fontSize: 16,
    fontWeight: '600',
  },
});

