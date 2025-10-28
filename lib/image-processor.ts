/**
 * Image Processing Utilities
 * Handles perceptual hashing, duplicate detection, and EXIF validation
 */

import crypto from 'crypto';

/**
 * Calculate perceptual hash (pHash) for image
 * pHash is a robust image fingerprint that can detect near-duplicates
 */
export async function calculatePHash(imageBuffer: Buffer): Promise<string> {
  // This is a simplified implementation
  // In production, use a proper library like 'blockhash' or 'sharp' with pHash plugin
  const hash = crypto.createHash('sha256');
  hash.update(imageBuffer);
  return hash.digest('hex');
}

/**
 * Calculate Hamming distance between two pHashes
 * Lower distance = more similar images
 */
export function calculateHammingDistance(hash1: string, hash2: string): number {
  let distance = 0;
  const maxLength = Math.max(hash1.length, hash2.length);

  for (let i = 0; i < maxLength; i++) {
    if (hash1[i] !== hash2[i]) {
      distance++;
    }
  }

  return distance;
}

/**
 * Check if images are similar (duplicate)
 * Returns true if hamming distance is below threshold
 */
export function isDuplicate(hash1: string, hash2: string, threshold: number = 5): boolean {
  const distance = calculateHammingDistance(hash1, hash2);
  return distance <= threshold;
}

/**
 * Extract EXIF data from image
 */
export async function extractEXIFData(imageBuffer: Buffer): Promise<any> {
  // In production, use 'exifr' or 'piexifjs' library
  return {
    // Placeholder EXIF data
    // Real implementation would parse the image buffer
    timestamp: new Date(),
    camera: 'Unknown',
    gpsLat: null,
    gpsLng: null,
  };
}

/**
 * Validate EXIF timestamp consistency
 * Checks if image timestamp matches claim timestamp
 */
export function validateEXIFTimestamp(
  imageTimestamp: Date,
  claimTimestamp: Date,
  toleranceMinutes: number = 30
): boolean {
  const diffMs = Math.abs(claimTimestamp.getTime() - imageTimestamp.getTime());
  const diffMinutes = diffMs / (1000 * 60);
  return diffMinutes <= toleranceMinutes;
}

/**
 * Check for GPS data in EXIF
 */
export function validateEXIFGPS(exifData: any): {
  isValid: boolean;
  latitude?: number;
  longitude?: number;
} {
  if (!exifData.gpsLat || !exifData.gpsLng) {
    return { isValid: false };
  }

  return {
    isValid: true,
    latitude: exifData.gpsLat,
    longitude: exifData.gpsLng,
  };
}

/**
 * Calculate fraud score based on multiple factors
 */
export interface FraudFactors {
  hasDuplicate: boolean;
  exifTimestampValid: boolean;
  gpsValid: boolean;
  ocrConfidence: number;
  zoneCompliant: boolean;
  odometerConsistent: boolean;
}

export function calculateFraudScore(factors: FraudFactors): number {
  let score = 0;

  // Duplicate detection (high risk)
  if (factors.hasDuplicate) score += 40;

  // EXIF timestamp mismatch (medium risk)
  if (!factors.exifTimestampValid) score += 20;

  // GPS invalid (medium risk)
  if (!factors.gpsValid) score += 15;

  // Low OCR confidence (medium risk)
  if (factors.ocrConfidence < 0.7) score += 15;

  // Zone violation (high risk)
  if (!factors.zoneCompliant) score += 30;

  // Odometer inconsistency (low risk)
  if (!factors.odometerConsistent) score += 10;

  // Clamp between 0-100
  return Math.min(100, score);
}

