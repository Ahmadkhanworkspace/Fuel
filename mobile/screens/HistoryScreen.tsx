import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useAuthStore, useOfflineStore } from '../lib/store';

export default function HistoryScreen({ navigation }: any) {
  const { employee } = useAuthStore();
  const { claims, markSynced, syncClaims } = useOfflineStore();
  const [loading, setLoading] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<any>(null);

  useEffect(() => {
    // Auto-sync claims in background
    const interval = setInterval(() => {
      syncClaims();
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const renderClaim = ({ item }: any) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'approved': return '#10b981';
        case 'rejected': return '#ef4444';
        case 'pending': return '#f59e0b';
        case 'syncing': return '#3b82f6';
        default: return '#6b7280';
      }
    };

    const status = item.status || 'pending';
    const isSynced = item.synced || false;

    return (
      <TouchableOpacity 
        style={styles.claimCard}
        onPress={() => setSelectedClaim(item)}
      >
        <View style={styles.claimHeader}>
          <View>
            <Text style={styles.claimLiters}>{item.liters}L</Text>
            <Text style={styles.claimAmount}>₨{item.price.toLocaleString()}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(status) }]}>
              {isSynced ? 'SYNCED' : 'PENDING'}
            </Text>
          </View>
        </View>
        
        <View style={styles.claimDetails}>
          <Text style={styles.claimDetail}>
            📏 Odometer: {item.odometer_reading} km
          </Text>
          <Text style={styles.claimDetail}>
            📍 {item.location_address || `${item.gps_lat?.toFixed(2)}, ${item.gps_lng?.toFixed(2)}`}
          </Text>
          <Text style={styles.claimDetail}>
            🕒 {new Date(item.timestamp).toLocaleString('en-US')}
          </Text>
        </View>

        {item.photos && (
          <View style={styles.photosContainer}>
            {item.photos.receipt && (
              <View style={styles.photoThumb}>
                <Image source={{ uri: item.photos.receipt }} style={styles.photoThumbnail} />
                <Text style={styles.photoLabel}>📄 Receipt</Text>
              </View>
            )}
            {item.photos.odometer && (
              <View style={styles.photoThumb}>
                <Image source={{ uri: item.photos.odometer }} style={styles.photoThumbnail} />
                <Text style={styles.photoLabel}>🚗 Odometer</Text>
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const ClaimDetailModal = () => {
    if (!selectedClaim) return null;

    return (
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Claim Details</Text>
              <TouchableOpacity onPress={() => setSelectedClaim(null)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Fuel Information</Text>
              <Text style={styles.modalDetail}>⛽ Liters: {selectedClaim.liters}L</Text>
              <Text style={styles.modalDetail}>💰 Price: ₨{selectedClaim.price.toLocaleString()}</Text>
              <Text style={styles.modalDetail}>📏 Odometer: {selectedClaim.odometer_reading} km</Text>
            </View>

            {selectedClaim.location_address && (
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Location</Text>
                <Text style={styles.modalDetail}>📍 {selectedClaim.location_address}</Text>
                <Text style={styles.modalSubtext}>
                  GPS: {selectedClaim.gps_lat?.toFixed(4)}, {selectedClaim.gps_lng?.toFixed(4)}
                </Text>
              </View>
            )}

            {selectedClaim.ocr_results && (
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>OCR Results</Text>
                <Text style={styles.modalDetail}>
                  ✅ Confidence: {((selectedClaim.ocr_results.confidence || 0) * 100).toFixed(0)}%
                </Text>
                <Text style={styles.modalSubtext}>
                  Values were automatically scanned from receipt
                </Text>
              </View>
            )}

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Photos</Text>
              {selectedClaim.photos?.receipt && (
                <View style={styles.modalPhoto}>
                  <Text style={styles.modalPhotoLabel}>📄 Receipt</Text>
                  <Image source={{ uri: selectedClaim.photos.receipt }} style={styles.modalPhotoImage} />
                </View>
              )}
              {selectedClaim.photos?.odometer && (
                <View style={styles.modalPhoto}>
                  <Text style={styles.modalPhotoLabel}>🚗 Odometer</Text>
                  <Image source={{ uri: selectedClaim.photos.odometer }} style={styles.modalPhotoImage} />
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Loading claims...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.headerInfo}>
          <View>
            <Text style={styles.title}>📄 Claim History</Text>
            <Text style={styles.subtitle}>
              {claims.length} total claim{claims.length !== 1 ? 's' : ''} • {claims.filter((c: any) => c.synced).length} synced
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.syncButton}
            onPress={() => {
              setLoading(true);
              syncClaims().finally(() => setLoading(false));
            }}
          >
            <Text style={styles.syncButtonText}>🔄 Sync</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={claims}
        renderItem={renderClaim}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>No claims yet</Text>
            <Text style={styles.emptySubtext}>
              Submit your first fuel claim to get started
            </Text>
          </View>
        }
      />

      <ClaimDetailModal />
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
  headerTop: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  backButton: {
    padding: 4,
  },
  backButtonText: {
    fontSize: 16,
    color: '#2563eb',
    fontWeight: '600',
  },
  headerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  syncButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  syncButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#6b7280',
    fontSize: 14,
  },
  list: {
    padding: 16,
  },
  claimCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  claimHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  claimLiters: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  claimAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  claimDetails: {
    gap: 4,
    marginBottom: 12,
  },
  claimDetail: {
    fontSize: 13,
    color: '#6b7280',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  photosContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  photoThumb: {
    flex: 1,
  },
  photoThumbnail: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 8,
    marginBottom: 4,
  },
  photoLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  empty: {
    padding: 48,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    color: '#6b7280',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  modalClose: {
    fontSize: 24,
    color: '#6b7280',
  },
  modalSection: {
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  modalDetail: {
    fontSize: 15,
    color: '#374151',
    marginBottom: 8,
  },
  modalSubtext: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
  },
  modalPhoto: {
    marginTop: 12,
  },
  modalPhotoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  modalPhotoImage: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 8,
  },
});
