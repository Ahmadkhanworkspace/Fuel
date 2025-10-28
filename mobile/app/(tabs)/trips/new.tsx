import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Briefcase, MapPin, FileText } from '@expo/vector-icons';
import { useAuthStore } from '@/lib/zustand-store';

const TRIP_TYPES = [
  { value: 'Head Office', label: '🏢 Head Office Visit', icon: 'building' },
  { value: 'Official Visit', label: '🏛️ Official Visit', icon: 'building' },
  { value: 'Field Work', label: '🌾 Field Work', icon: 'map-pin' },
  { value: 'Supplier Meeting', label: '🤝 Supplier Meeting', icon: 'user' },
  { value: 'Client Visit', label: '👥 Client Visit', icon: 'users' },
  { value: 'Training', label: '📚 Training', icon: 'book' },
  { value: 'Other', label: '📍 Other', icon: 'map-pin' },
];

export default function NewTripScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [selectedType, setSelectedType] = useState('');
  const [destination, setDestination] = useState('');
  const [purpose, setPurpose] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedType || !destination) {
      Alert.alert('Required Fields', 'Please select trip type and enter destination');
      return;
    }

    setSubmitting(true);
    try {
      // Get current location
      const location = await getCurrentLocation();
      
      const tripData = {
        employee_id: user?.id,
        trip_type: selectedType,
        destination,
        purpose,
        start_lat: location.latitude,
        start_lng: location.longitude,
        start_location: 'Current Location',
      };

      const response = await fetch('http://your-api-url/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tripData),
      });

      if (!response.ok) throw new Error('Failed to create trip');

      Alert.alert('Success', 'Official trip created successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error creating trip:', error);
      Alert.alert('Error', 'Failed to create trip. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getCurrentLocation = (): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Location error:', error);
          resolve({ latitude: 0, longitude: 0 }); // Fallback
        }
      );
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Official Trip</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Trip Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trip Type</Text>
          <View style={styles.optionsContainer}>
            {TRIP_TYPES.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.optionCard,
                  selectedType === type.value && styles.optionCardSelected
                ]}
                onPress={() => setSelectedType(type.value)}
              >
                <Text style={styles.optionText}>{type.label}</Text>
                {selectedType === type.value && (
                  <View style={styles.selectedIndicator} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Destination */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Destination *</Text>
          <View style={styles.inputContainer}>
            <MapPin size={20} color="#6b7280" />
            <TextInput
              style={styles.input}
              placeholder="e.g., Karachi Head Office"
              value={destination}
              onChangeText={setDestination}
              placeholderTextColor="#9ca3af"
            />
          </View>
        </View>

        {/* Purpose */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trip Purpose</Text>
          <View style={styles.textAreaContainer}>
            <FileText size={20} color="#6b7280" />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Brief description of the trip purpose..."
              value={purpose}
              onChangeText={setPurpose}
              multiline
              numberOfLines={4}
              placeholderTextColor="#9ca3af"
            />
          </View>
        </View>

        {/* Info Boxes */}
        <View style={styles.infoBox}>
          <Briefcase size={20} color="#6366f1" />
          <Text style={styles.infoText}>
            Your location will be tracked throughout the trip for official record
          </Text>
        </View>

        <View style={styles.infoBox}>
          <MapPin size={20} color="#f59e0b" />
          <Text style={styles.infoText}>
            You can add toll tax receipts, fuel receipts, and expenses during the trip
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={styles.submitButtonText}>
            {submitting ? 'Creating Trip...' : 'Start Trip'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  optionsContainer: {
    gap: 8,
  },
  optionCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  optionCardSelected: {
    borderColor: '#4f46e5',
    backgroundColor: '#eef2ff',
  },
  optionText: {
    fontSize: 15,
    color: '#111827',
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4f46e5',
    borderWidth: 6,
    borderColor: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    paddingVertical: 14,
  },
  textAreaContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
    padding: 0,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#92400e',
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

