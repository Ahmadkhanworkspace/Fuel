import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { latitude, longitude, employeeId } = body;

    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get employee's assigned zone
    const { data: employee } = await supabase
      .from('employees')
      .select('zone_id, zones(*)')
      .eq('id', employeeId)
      .single();

    if (!employee || !employee.zone_id) {
      return NextResponse.json({
        isWithinZone: false,
        message: 'Employee has no assigned zone',
      });
    }

    // Check if point is within zone geometry
    const { data: zone } = await supabase
      .from('zones')
      .select('*')
      .eq('id', employee.zone_id)
      .eq('active', true)
      .single();

    if (!zone) {
      return NextResponse.json({
        isWithinZone: false,
        message: 'Zone not found or inactive',
      });
    }

    // Basic circular zone check (can be enhanced for polygon)
    const isWithinZone = checkPointInZone(latitude, longitude, zone.geojson);

    // Log the location check
    await supabase.from('location_logs').insert({
      employee_id: employeeId,
      latitude,
      longitude,
      is_within_zone: isWithinZone,
      zone_id: zone.id,
    });

    return NextResponse.json({
      isWithinZone,
      zoneName: zone.name,
      message: isWithinZone
        ? 'Location is within allowed zone'
        : 'Location is outside allowed zone',
    });
  } catch (error) {
    console.error('Zone validation error:', error);
    return NextResponse.json(
      { error: 'Failed to validate zone' },
      { status: 500 }
    );
  }
}

function checkPointInZone(lat: number, lng: number, geojson: any): boolean {
  if (!geojson) return false;

  // Simple circular zone check
  if (geojson.type === 'circle') {
    const { center, radius } = geojson;
    const distance = calculateDistance(
      lat,
      lng,
      center[0],
      center[1]
    );
    return distance <= radius;
  }

  // Polygon check (simplified)
  if (geojson.type === 'Polygon') {
    return isPointInPolygon([lng, lat], geojson.coordinates[0]);
  }

  return false;
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function isPointInPolygon(point: [number, number], polygon: [number, number][]): boolean {
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    const intersect = ((yi > y) !== (yj > y)) &&
      (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

