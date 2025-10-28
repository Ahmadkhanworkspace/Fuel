export interface Database {
  public: {
    Tables: {
      employees: {
        Row: {
          id: string;
          employee_code: string;
          name: string;
          email: string;
          phone: string | null;
          role: 'employee' | 'approver' | 'admin';
          zone_id: string | null;
          allowed_quota_liters: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<employees.Row, 'created_at' | 'updated_at'>;
        Update: Partial<employees.Insert>;
      };
      vehicles: {
        Row: {
          id: string;
          reg_no: string;
          model: string | null;
          assigned_employee_id: string | null;
          avg_mileage: number | null;
          last_odometer: number | null;
          next_service_km: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<vehicles.Row, 'created_at' | 'updated_at'>;
        Update: Partial<vehicles.Insert>;
      };
      claims: {
        Row: {
          id: string;
          employee_id: string;
          vehicle_id: string;
          pump_id: string | null;
          liters_claimed: number;
          price: number;
          odometer_reading: number | null;
          gps_lat: number | null;
          gps_lng: number | null;
          photos: string[] | null;
          ocr_text: Record<string, any> | null;
          ocr_confidence: number | null;
          fraud_score: number | null;
          status: 'submitted' | 'pending' | 'approved' | 'rejected';
          approver_id: string | null;
          rejection_reason: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<claims.Row, 'created_at' | 'updated_at'>;
        Update: Partial<claims.Insert>;
      };
      zones: {
        Row: {
          id: string;
          name: string;
          geojson: Record<string, any> | null;
          active: boolean;
          created_at: string;
        };
        Insert: Omit<zones.Row, 'created_at'>;
        Update: Partial<zones.Insert>;
      };
      location_logs: {
        Row: {
          id: string;
          claim_id: string | null;
          employee_id: string;
          vehicle_id: string;
          latitude: number;
          longitude: number;
          address: string | null;
          is_within_zone: boolean;
          zone_id: string | null;
          timestamp: string;
        };
      };
    };
  };
}

export type Employee = Database['public']['Tables']['employees']['Row'];
export type Vehicle = Database['public']['Tables']['vehicles']['Row'];
export type Claim = Database['public']['Tables']['claims']['Row'];
export type Zone = Database['public']['Tables']['zones']['Row'];
export type LocationLog = Database['public']['Tables']['location_logs']['Row'];

