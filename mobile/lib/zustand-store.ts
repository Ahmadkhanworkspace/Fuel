import { create } from 'zustand';

interface OfflineClaim {
  id: string;
  vehicle_id: string;
  liters: number;
  price: number;
  odometer: number;
  latitude: number;
  longitude: number;
  photos: string[];
  timestamp: Date;
  synced: boolean;
}

interface AuthStore {
  user: any;
  setUser: (user: any) => void;
}

interface OfflineStore {
  claims: OfflineClaim[];
  addClaim: (claim: OfflineClaim) => void;
  removeClaim: (id: string) => void;
  markSynced: (id: string) => void;
  getUnsyncedClaims: () => OfflineClaim[];
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

export const useOfflineStore = create<OfflineStore>((set, get) => ({
  claims: [],
  addClaim: (claim) => set((state) => ({ claims: [...state.claims, claim] })),
  removeClaim: (id) => set((state) => ({ claims: state.claims.filter((c) => c.id !== id) })),
  markSynced: (id) => set((state) => ({
    claims: state.claims.map((c) => (c.id === id ? { ...c, synced: true } : c)),
  })),
  getUnsyncedClaims: () => get().claims.filter((c) => !c.synced),
}));

