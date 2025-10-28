import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Briefcase, Plus, MapPin, Camera, Route } from '@expo/vector-icons';
import { useAuthStore } from '@/lib/zustand-store';

interface Trip {
  id: string;
  destination: string;
  trip_type: string;
  start_time: string;
  end_time?: string;
  trip_status: 'active' | 'completed' | 'pending' | 'cancelled';
  total_cost?: number;
}

export default function TripsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      // TODO: Fetch trips from API
      // const response = await fetch('/api/trips?employee_id=' + user?.id);
      // const data = await response.json();
      // setTrips(data);
      
      // Mock data for now
      setTrips([
        {
          id: '1',
          destination: 'Regional Office, Karachi',
          trip_type: 'Head Office',
          start_time: '2024-01-15T09:00:00',
          trip_status: 'completed',
          total_cost: 5000,
        },
        {
          id: '2',
          destination: 'Supplier Meeting, Lahore',
          trip_type: 'Supplier Meeting',
          start_time: '2024-01-20T10:00:00',
          trip_status: 'active',
        }
      ]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching trips:', error);
      Alert.alert('Error', 'Failed to load trips');
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'completed': return '#6366f1';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-PK', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Official Trips</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/(tabs)/trips/new')}
        >
          <Plus size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {loading ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Loading trips...</Text>
          </View>
        ) : trips.length === 0 ? (
          <View style={styles.emptyState}>
            <Briefcase size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>No Trips Yet</Text>
            <Text style={styles.emptyText}>Start a new official trip to begin tracking</Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => router.push('/(tabs)/trips/new')}
            >
              <Text style={styles.emptyButtonText}>Create Trip</Text>
            </TouchableOpacity>
          </View>
        ) : (
          trips.map((trip) => (
            <TouchableOpacity
              key={trip.id}
              style={styles.tripCard}
              onPress={() => router.push(`/(tabs)/trips/${trip.id}`)}
            >
              <View style={styles.tripHeader}>
                <View style={styles.tripIconContainer}>
                  <Briefcase size={24} color="#6366f1" />
                </View>
                <View style={styles.tripInfo}>
                  <Text style={styles.tripType}>{trip.trip_type}</Text>
                  <Text style={styles.tripDestination}>
                    <MapPin size={14} color="#6b7280" /> {trip.destination}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(trip.trip_status) + '20' }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(trip.trip_status) }]}>
                    {trip.trip_status.toUpperCase()}
                  </Text>
                </View>
              </View>

              <View style={styles.tripDetails}>
                <View style={styles.detailRow}>
                  <Route size={16} color="#6b7280" />
                  <Text style={styles.detailText}>{formatDate(trip.start_time)}</Text>
                </View>
                {trip.total_cost && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailText}>Total Cost: Rs {trip.total_cost.toLocaleString()}</Text>
                  </View>
                )}
              </View>

              {trip.trip_status === 'active' && (
                <View style={styles.activeIndicator}>
                  <View style={styles.activeDot} />
                  <Text style={styles.activeText}>Location tracking active</Text>
                </View>
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
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
    paddingTop: 50,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  tripCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tripHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tripIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eef2ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tripInfo: {
    flex: 1,
  },
  tripType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  tripDestination: {
    fontSize: 14,
    color: '#6b7280',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  tripDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    color: '#6b7280',
  },
  activeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  activeText: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
  },
});

