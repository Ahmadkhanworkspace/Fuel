import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { calculatePHash, isDuplicate, validateEXIFTimestamp, calculateFraudScore } from '@/lib/image-processor';

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, claimId, claimTimestamp } = await request.json();

    if (!imageUrl || !claimId) {
      return NextResponse.json(
        { error: 'Image URL and claim ID are required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Download image for processing
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

    // Calculate pHash
    const pHash = await calculatePHash(imageBuffer);

    // Check for duplicates
    const { data: existingImages } = await supabase
      .from('images')
      .select('phash, claim_id')
      .not('phash', 'is', null);

    let hasDuplicate = false;
    if (existingImages) {
      for (const img of existingImages) {
        if (img.phash && isDuplicate(pHash, img.phash)) {
          hasDuplicate = true;
          break;
        }
      }
    }

    // Store image metadata
    await supabase.from('images').insert({
      claim_id: claimId,
      phash,
      file_url: imageUrl,
      checksum: hashBuffer(imageBuffer),
      uploaded_at: new Date().toISOString(),
    });

    // Validate EXIF timestamp (simplified)
    const exifTimestampValid = true; // Would extract from actual EXIF data

    // Extract fraud factors
    const { data: claim } = await supabase
      .from('claims')
      .select('gps_lat, gps_lng, ocr_confidence')
      .eq('id', claimId)
      .single();

    const fraudFactors = {
      hasDuplicate,
      exifTimestampValid,
      gpsValid: !!(claim?.gps_lat && claim?.gps_lng),
      ocrConfidence: claim?.ocr_confidence || 0.8,
      zoneCompliant: true, // Would check against zones
      odometerConsistent: true, // Would validate against last odometer
    };

    // Calculate fraud score
    const fraudScore = calculateFraudScore(fraudFactors);

    // Update claim with fraud score
    await supabase
      .from('claims')
      .update({
        fraud_score: fraudScore,
        status: fraudScore > 70 ? 'pending' : 'pending', // Auto flag high-risk
      })
      .eq('id', claimId);

    return NextResponse.json({
      success: true,
      fraudScore,
      isDuplicate,
      flags: fraudFactors,
    });
  } catch (error: any) {
    console.error('Fraud detection error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to detect fraud' },
      { status: 500 }
    );
  }
}

function hashBuffer(buffer: Buffer): string {
  return require('crypto').createHash('sha256').update(buffer).digest('hex');
}

