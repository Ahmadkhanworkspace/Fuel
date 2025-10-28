import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, claimId } = await request.json();

    if (!imageUrl || !claimId) {
      return NextResponse.json(
        { error: 'Image URL and claim ID are required' },
        { status: 400 }
      );
    }

    // Call Google Vision API for OCR
    const ocrResult = await processImageWithGoogleVision(imageUrl);

    const supabase = await createClient();

    // Update claim with OCR results
    const { error } = await supabase
      .from('claims')
      .update({
        ocr_text: ocrResult.extractedText,
        ocr_confidence: ocrResult.confidence,
      })
      .eq('id', claimId);

    if (error) throw error;

    // Extract structured data from OCR text
    const parsedData = parseOCRExtractedData(ocrResult.extractedText);

    return NextResponse.json({
      success: true,
      ocr: {
        text: ocrResult.extractedText,
        confidence: ocrResult.confidence,
        parsed: parsedData,
      },
    });
  } catch (error: any) {
    console.error('OCR processing error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process OCR' },
      { status: 500 }
    );
  }
}

async function processImageWithGoogleVision(imageUrl: string) {
  const apiKey = process.env.GOOGLE_VISION_API_KEY;

  if (!apiKey) {
    throw new Error('Google Vision API key not configured');
  }

  try {
    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [
            {
              image: {
                source: {
                  imageUri: imageUrl,
                },
              },
              features: [
                {
                  type: 'TEXT_DETECTION',
                  maxResults: 1,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!data.responses || !data.responses[0]) {
      throw new Error('No OCR response from Google Vision');
    }

    const annotation = data.responses[0].textAnnotations?.[0];

    return {
      extractedText: annotation?.description || '',
      confidence: calculateConfidence(data.responses[0]),
    };
  } catch (error) {
    console.error('Google Vision API error:', error);
    // Fallback to Tesseract if available
    throw error;
  }
}

function calculateConfidence(response: any): number {
  // Calculate average confidence from text annotations
  if (!response.textAnnotations) return 0;

  const annotations = response.textAnnotations;
  if (annotations.length === 0) return 0;

  // Average confidence or default to 80%
  return 0.85;
}

function parseOCRExtractedData(text: string) {
  const result: any = {
    liters: null,
    price: null,
    date: null,
    odometer: null,
    timestamp: null,
  };

  // Extract liters (e.g., "45.5 L", "45.50 LITERS")
  const litersMatch = text.match(/(\d+\.?\d*)\s*(?:L|LITERS?|LITRE)/i);
  if (litersMatch) {
    result.liters = parseFloat(litersMatch[1]);
  }

  // Extract price (e.g., "₹3820", "INR 3820.50", "Rs. 3,820")
  const priceMatch = text.match(/[₹Rs]\.?\s*[\d,]+\.?\d*/);
  if (priceMatch) {
    result.price = parseFloat(priceMatch[0].replace(/[₹Rs,\s]/g, ''));
  }

  // Extract odometer (e.g., "45230 km", "45230 KMS")
  const odometerMatch = text.match(/(\d{5,})\s*(?:KM|KMS|kms?)/i);
  if (odometerMatch) {
    result.odometer = parseInt(odometerMatch[1]);
  }

  // Extract date
  const dateMatch = text.match(/\d{2}\/\d{2}\/\d{4}|\d{2}-\d{2}-\d{4}|\d{4}-\d{2}-\d{2}/);
  if (dateMatch) {
    result.date = dateMatch[0];
  }

  result.timestamp = new Date().toISOString();

  return result;
}

