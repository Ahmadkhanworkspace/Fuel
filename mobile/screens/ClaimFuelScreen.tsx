import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  TextInput,
  ActivityIndicator,
  Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useAuthStore, useOfflineStore } from '../lib/store';

export default function ClaimFuelScreen({ navigation }: any) {
  const { employee } = useAuthStore();
  const { addClaim } = useOfflineStore();
  
  const [receiptPhoto, setReceiptPhoto] = useState<string | null>(null);
  const [odometerPhoto, setOdometerPhoto] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationAddress, setLocationAddress] = useState<string>('');
  const [odometer, setOdometer] = useState('');
  const [liters, setLiters] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrResults, setOcrResults] = useState<any>(null);

  useEffect(() => {
    requestPermissions();
    getLocation();
  }, []);

  const requestPermissions = async () => {
    // Request camera and location permissions
    await ImagePicker.requestCameraPermissionsAsync();
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Location permission is needed');
    }
  };

  const getLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      setLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
      
      // Get address from coordinates
      try {
        const [address] = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        if (address) {
          setLocationAddress(`${address.street}, ${address.city || address.district}`);
        }
      } catch (e) {
        setLocationAddress(`${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}`);
      }
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const takePhoto = async (type: 'receipt' | 'odometer') => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        if (type === 'receipt') {
          setReceiptPhoto(result.assets[0].uri);
          // Run OCR on receipt
          runOCR(result.assets[0].uri, 'receipt');
        } else {
          setOdometerPhoto(result.assets[0].uri);
          // Run OCR on odometer
          runOCR(result.assets[0].uri, 'odometer');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const runOCR = async (imageUri: string, type: string) => {
    setOcrLoading(true);
    
    // DEMO MODE - Simulate OCR processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate OCR results based on type
    if (type === 'receipt') {
      setOcrResults({
        liters: liters || '45.50',
        price: price || '4733.00',
        confidence: 0.95
      });
      if (!liters) setLiters('45.50');
      if (!price) setPrice('4733.00');
    } else if (type === 'odometer') {
      setOcrResults({
        odometer: odometer || '54320',
        confidence: 0.92
      });
      if (!odometer) setOdometer('54320');
    }
    
    setOcrLoading(false);
    Alert.alert('OCR Complete', `Successfully scanned ${type}. Please verify the values.`);
    
    /* Real OCR implementation would be:
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    });
    
    try {
      const response = await fetch('http://your-ocr-api.com/scan', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setOcrResults(data);
    } catch (error) {
      console.error('OCR error:', error);
    }
    */
  };

  const handleSubmit = async () => {
    if (!receiptPhoto) {
      Alert.alert('Error', 'Please take a photo of the receipt');
      return;
    }

    if (!odometerPhoto) {
      Alert.alert('Error', 'Please take a photo of the odometer');
      return;
    }

    if (!location) {
      Alert.alert('Error', 'Location is required');
      return;
    }

    if (!liters || !price || !odometer) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);

    try {
      // Create offline claim (stored locally until synced)
      const claim = {
        id: `claim_${Date.now()}`,
        employee_id: employee?.id || 'demo-employee-id',
        vehicle_id: 'demo-vehicle-id',
        liters: parseFloat(liters),
        price: parseFloat(price),
        odometer_reading: parseInt(odometer),
        gps_lat: location.lat,
        gps_lng: location.lng,
        location_address: locationAddress,
        photos: {
          receipt: receiptPhoto,
          odometer: odometerPhoto
        },
        ocr_results: ocrResults,
        timestamp: new Date().toISOString(),
        status: 'pending',
        synced: false,
      };

      await addClaim(claim as any);
      
      Alert.alert('Success', 'Fuel claim saved successfully! Will sync when online.', [
        { 
          text: 'OK', 
          onPress: () => {
            // Reset form
            setReceiptPhoto(null);
            setOdometerPhoto(null);
            setLiters('');
            setPrice('');
            setOdometer('');
            setOcrResults(null);
            navigation.goBack();
          }
        }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save claim');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>⛽ Claim Fuel</Text>
        
        {/* Receipt Photo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📄 Receipt Photo (Required)</Text>
          <TouchableOpacity
            style={styles.photoButton}
            onPress={() => takePhoto('receipt')}
          >
            {receiptPhoto ? (
              <Image source={{ uri: receiptPhoto }} style={styles.photo} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Text style={styles.photoIcon}>📄</Text>
                <Text style={styles.photoText}>Tap to take receipt photo</Text>
              </View>
            )}
          </TouchableOpacity>
          {ocrLoading && receiptPhoto && (
            <View style={styles.ocrStatus}>
              <ActivityIndicator size="small" color="#2563eb" />
              <Text style={styles.ocrText}>Scanning receipt...</Text>
            </View>
          )}
        </View>

        {/* Odometer Photo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚗 Odometer Photo (Required)</Text>
          <TouchableOpacity
            style={styles.photoButton}
            onPress={() => takePhoto('odometer')}
          >
            {odometerPhoto ? (
              <Image source={{ uri: odometerPhoto }} style={styles.photo} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Text style={styles.photoIcon}>🚗</Text>
                <Text style={styles.photoText}>Tap to take odometer photo</Text>
              </View>
            )}
          </TouchableOpacity>
          {ocrLoading && odometerPhoto && (
            <View style={styles.ocrStatus}>
              <ActivityIndicator size="small" color="#2563eb" />
              <Text style={styles.ocrText}>Scanning odometer...</Text>
            </View>
          )}
        </View>

        {/* Fuel Details (Auto-filled by OCR) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Fuel Details (Auto-scanned)</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>⛽ Liters</Text>
            <TextInput
              style={styles.input}
              value={liters}
              onChangeText={setLiters}
              placeholder="45.50"
              keyboardType="decimal-pad"
              editable={!ocrLoading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>💰 Price (₨)</Text>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              placeholder="4733.00"
              keyboardType="decimal-pad"
              editable={!ocrLoading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>📏 Odometer Reading (km)</Text>
            <TextInput
              style={styles.input}
              value={odometer}
              onChangeText={setOdometer}
              placeholder="54320"
              keyboardType="numeric"
              editable={!ocrLoading}
            />
          </View>

          {ocrResults && (
            <View style={styles.ocrInfo}>
              <Text style={styles.ocrInfoText}>
                ✅ OCR Confidence: {((ocrResults.confidence || 0) * 100).toFixed(0)}%
              </Text>
              <Text style={styles.ocrInfoSubtext}>
                Please verify the values above are correct
              </Text>
            </View>
          )}
        </View>

        {/* Location Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📍 GPS Location</Text>
          <View style={styles.locationCard}>
            <Text style={styles.locationText}>
              📍 {locationAddress || (location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Getting location...')}
            </Text>
            <TouchableOpacity onPress={getLocation} style={styles.refreshButton}>
              <Text style={styles.refreshText}>🔄 Refresh Location</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading || ocrLoading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>✅ Submit Claim</Text>
          )}
        </TouchableOpacity>

        {/* Offline Notice */}
        <View style={styles.offlineNotice}>
          <Text style={styles.offlineText}>
            💾 This claim will be saved offline and synced when connection is available
          </Text>
        </View>
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
    marginBottom: 12,
  },
  photoButton: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    alignItems: 'center',
  },
  photoIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  photoText: {
    color: '#6b7280',
    fontSize: 14,
    textAlign: 'center',
  },
  ocrStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  ocrText: {
    color: '#2563eb',
    fontSize: 14,
  },
  ocrInfo: {
    backgroundColor: '#f0f9ff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bae6fd',
    marginTop: 12,
  },
  ocrInfoText: {
    color: '#0369a1',
    fontSize: 14,
    fontWeight: '600',
  },
  ocrInfoSubtext: {
    color: '#0284c7',
    fontSize: 12,
    marginTop: 4,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  locationCard: {
    backgroundColor: '#f0f9ff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  locationText: {
    fontSize: 14,
    color: '#0369a1',
    marginBottom: 8,
  },
  refreshButton: {
    alignItems: 'center',
    paddingTop: 8,
  },
  refreshText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  offlineNotice: {
    backgroundColor: '#fef3c7',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#fde047',
  },
  offlineText: {
    color: '#92400e',
    fontSize: 12,
    textAlign: 'center',
  },
});
