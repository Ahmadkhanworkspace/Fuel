import { supabase } from './supabase';

// API functions for syncing offline claims to Supabase

export async function uploadPhoto(localUri: string): Promise<string> {
  // Convert local URI to blob
  const response = await fetch(localUri);
  const blob = await response.blob();
  
  // Generate filename
  const filename = `${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
  
  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('fuel-receipts')
    .upload(filename, blob, {
      contentType: 'image/jpeg',
      upsert: false,
    });
  
  if (error) {
    throw new Error(`Failed to upload photo: ${error.message}`);
  }
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('fuel-receipts')
    .getPublicUrl(filename);
  
  return publicUrl;
}

export async function syncClaimToBackend(claim: any) {
  try {
    // Upload photos if they exist
    let receiptUrl = null;
    let odometerUrl = null;
    
    if (claim.photos?.receipt) {
      try {
        receiptUrl = await uploadPhoto(claim.photos.receipt);
      } catch (error) {
        console.error('Failed to upload receipt:', error);
      }
    }
    
    if (claim.photos?.odometer) {
      try {
        odometerUrl = await uploadPhoto(claim.photos.odometer);
      } catch (error) {
        console.error('Failed to upload odometer photo:', error);
      }
    }
    
    // Insert claim into database
    const { data, error } = await supabase
      .from('claims')
      .insert({
        employee_id: claim.employee_id,
        vehicle_id: claim.vehicle_id,
        liters_claimed: claim.liters,
        price: claim.price,
        odometer_reading: claim.odometer_reading,
        gps_lat: claim.gps_lat,
        gps_lng: claim.gps_lng,
        location_address: claim.location_address,
        photos: {
          receipt: receiptUrl,
          odometer: odometerUrl
        },
        ocr_text: claim.ocr_results,
        ocr_confidence: claim.ocr_results?.confidence || 0,
        status: 'submitted',
        created_at: claim.timestamp,
      })
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to sync claim: ${error.message}`);
    }
    
    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sync claim');
  }
}

export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('employees')
      .select('count')
      .limit(1);
    
    return !error;
  } catch (error) {
    return false;
  }
}


