import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { image, claim_id, employee_id, vehicle_id, location } = await request.json();

    const fraudFlags = [];
    let fraudScore = 0;

    // 1. Simulate EXIF timestamp check
    // In production, extract from actual EXIF
    const exifTimestamp = new Date(Date.now() - 1000); // Simulate recent photo
    const claimTimestamp = new Date();
    const timeDiff = Math.abs(claimTimestamp.getTime() - exifTimestamp.getTime());
    
    if (timeDiff > 3600000) { // More than 1 hour old
      fraudScore += 30;
      fraudFlags.push({
        type: "timestamp",
        severity: "high",
        message: "Photo timestamp differs from claim time by more than 1 hour",
      });
    }

    // 2. Simulate duplicate image detection
    // In production, compare pHash with database
    const simulatedHash = crypto.randomBytes(16).toString("hex");
    fraudScore += 0; // No duplicates simulated

    // 3. GPS validation
    if (location) {
      const { lat, lng } = location;
      // Check if in allowed zone (simplified check)
      const isInZone = validateZone(lat, lng);
      
      if (!isInZone) {
        fraudScore += 50;
        fraudFlags.push({
          type: "geofence",
          severity: "critical",
          message: "GPS location outside allowed zone",
        });
      }
    }

    // 4. Unusual amounts
    if (location.liters && location.liters > 150) {
      fraudScore += 20;
      fraudFlags.push({
        type: "amount",
        severity: "medium",
        message: "Unusually high fuel amount claimed",
      });
    }

    // 5. Frequency check (would need DB query in production)
    fraudScore += 0; // Not implemented for demo

    return NextResponse.json({
      fraud_score: Math.min(fraudScore, 100),
      flags: fraudFlags,
      recommendations: getRecommendations(fraudScore, fraudFlags),
    });
  } catch (error) {
    console.error("Fraud Detection Error:", error);
    return NextResponse.json(
      { error: "Failed to run fraud detection" },
      { status: 500 }
    );
  }
}

function validateZone(lat: number, lng: number): boolean {
  // Simplified zone validation
  // In production, check against zones table
  return true; // Assume in zone for demo
}

function getRecommendations(score: number, flags: any[]) {
  const recommendations = [];
  
  if (score > 70) {
    recommendations.push("Manual review required - High risk claim");
  } else if (score > 40) {
    recommendations.push("Additional verification recommended");
  } else {
    recommendations.push("Low risk - Standard processing");
  }

  if (flags.some((f) => f.type === "geofence")) {
    recommendations.push("Contact employee to verify location");
  }

  if (flags.some((f) => f.type === "timestamp")) {
    recommendations.push("Request additional photos with timestamp overlay");
  }

  return recommendations;
}

