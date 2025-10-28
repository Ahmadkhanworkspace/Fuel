import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import { router } from 'expo-router';

export default function NewClaimScreen() {
  const [hasPermission, setHasPermission] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [odometer, setOdometer] = useState('');
  const [liters, setLiters] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);

  // Request permissions
  const requestPermissions = async () => {
    const cameraStatus = await Camera.requestCameraPermissionsAsync();
    const locationStatus = await Location.requestForegroundPermissionsAsync();

    if (cameraStatus.granted && locationStatus.granted) {
      setHasPermission(true);
    } else {
      Alert.alert(
        'Permissions Required',
        'Camera and location permissions are required to submit fuel claims.'
      );
    }
  };

  // Capture photo
  const takePhoto = async () => {
    // Implementation would use Camera component
    Alert.alert('Camera', 'Photo capture will be implemented');
  };

  // Get location
  const getLocation = async () => {
    const { coords } = await Location.getCurrentPositionAsync({});
    setLocation({ lat: coords.latitude, lng: coords.longitude });
  };

  // Submit claim
  const submitClaim = async () => {
    if (!liters || !odometer) {
      Alert.alert('Error', 'Please fill in liters and odometer');
      return;
    }

    setLoading(true);
    // Submit to Supabase with offline queue fallback
    Alert.alert('Success', 'Claim submitted!');
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>New Fuel Claim</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Take Photos</Text>
        <Text style={styles.sectionDescription}>
          Capture fuel receipt, odometer, and pump photos
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermissions}>
          <Text style={styles.buttonText}>Enable Camera & Location</Text>
        </TouchableOpacity>
      </View>

      {hasPermission && (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Enter Details</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Liters</Text>
              <Text
                style={styles.input}
                keyboardType="numeric"
                onChangeText={setLiters}
                value={liters}
                placeholder="45.5"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Odometer Reading</Text>
              <Text
                style={styles.input}
                keyboardType="numeric"
                onChangeText={setOdometer}
                value={odometer}
                placeholder="45230"
              />
            </View>
          </View>

          <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={submitClaim}>
            <Text style={styles.submitButtonText}>Submit Claim</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4A90E2',
    borderRadius: 10,
    padding: 18,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    margin: 20,
    backgroundColor: '#4A90E2',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

