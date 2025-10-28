import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// GET - Fetch all trips or trips for a specific employee
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employee_id');
    const tripStatus = searchParams.get('trip_status');

    // For now, return empty array until Prisma schema is pushed
    return NextResponse.json([]);
  } catch (error: any) {
    console.error('Error fetching trips:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch trips' },
      { status: 500 }
    );
  }
}

// POST - Create a new official trip
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const {
      employee_id,
      vehicle_id,
      trip_type,
      destination,
      start_location,
      start_lat,
      start_lng,
      purpose,
    } = body;

    if (!employee_id || !vehicle_id || !trip_type || !destination) {
      return NextResponse.json(
        { error: 'Missing required fields: employee_id, vehicle_id, trip_type, destination' },
        { status: 400 }
      );
    }

    // For now, just return success with a mock trip
    const trip = {
      id: 'temp-' + Date.now(),
      employee_id,
      vehicle_id,
      trip_type,
      destination,
      start_location: start_location || 'Unknown',
      start_lat,
      start_lng,
      purpose,
      trip_status: 'active',
    };

    return NextResponse.json(trip);
  } catch (error: any) {
    console.error('Error creating trip:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create trip' },
      { status: 500 }
    );
  }
}

// PATCH - Update trip status
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Trip ID is required' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Trip updated successfully' });
  } catch (error: any) {
    console.error('Error updating trip:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update trip' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a trip
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Trip ID is required' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting trip:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete trip' },
      { status: 500 }
    );
  }
}
