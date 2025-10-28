import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface OfflineClaim {
  id: string;
  employee_id: string;
  vehicle_id: string;
  liters: number;
  price: number;
  odometer_reading: number;
  gps_lat: number;
  gps_lng: number;
  photos: string[];
  ocr_text: any;
  timestamp: string;
  synced: boolean;
}

interface AuthStore {
  user: any | null;
  setUser: (user: any) => void;
  employee: any | null;
  setEmployee: (employee: any) => void;
}

interface OfflineStore {
  claims: OfflineClaim[];
  addClaim: (claim: OfflineClaim) => Promise<void>;
  syncClaims: () => Promise<void>;
  markSynced: (id: string) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  employee: null,
  setEmployee: (employee) => set({ employee }),
}));

export const useOfflineStore = create<OfflineStore>((set, get) => ({
  claims: [],
  
  addClaim: async (claim) => {
    const newClaims = [...get().claims, claim];
    set({ claims: newClaims });
    try {
      await AsyncStorage.setItem('offline_claims', JSON.stringify(newClaims));
    } catch (error) {
      console.error('Error saving claim:', error);
    }
  },
  
  markSynced: async (id) => {
    const updated = get().claims.map(c => 
      c.id === id ? { ...c, synced: true } : c
    );
    set({ claims: updated });
    try {
      await AsyncStorage.setItem('offline_claims', JSON.stringify(updated));
    } catch (error) {
      console.error('Error updating claim:', error);
    }
  },
  
  syncClaims: async () => {
    const unsynced = get().claims.filter(c => !c.synced);
    
    if (unsynced.length === 0) {
      console.log('All claims are synced');
      return;
    }

    console.log(`Syncing ${unsynced.length} claim(s) to backend...`);
    
    // DEMO MODE: Simulate syncing for now
    // TODO: Connect to real backend API
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mark all as synced in demo mode
    const updated = get().claims.map(c => ({ ...c, synced: true, status: 'submitted' }));
    set({ claims: updated });
    
    try {
      await AsyncStorage.setItem('offline_claims', JSON.stringify(updated));
    } catch (error) {
      console.error('Error syncing claims:', error);
    }
    
    console.log('✓ Claims synced successfully!');
    
    // Real sync would be like this:
    // for (const claim of unsynced) {
    //   try {
    //     await syncClaimToBackend(claim);
    //     get().markSynced(claim.id);
    //   } catch (error) {
    //     console.error('Failed to sync claim:', error);
    //   }
    // }
  },
}));

// Load from storage on app start
AsyncStorage.getItem('offline_claims').then((data) => {
  if (data) {
    useOfflineStore.setState({ claims: JSON.parse(data) });
  }
});

