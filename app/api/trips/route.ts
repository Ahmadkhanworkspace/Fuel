"use server";

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// GET - Fetch all trips or trips for a specific employee
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employee_id');
    const tripStatus = searchParams.get('trip_status');

    const where: any = {};
    if (employeeId) where.employee_id = employeeId;
    if (tripStatus) where.trip_status = tripStatus;

    const trips = await prisma.officialTrip.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
            employee_code: true,
          },
        },
        vehicle: {
          select: {
            id: true,
            reg_no: true,
            model: true,
          },
        },
        expenses: true,
        receipts: true,
        location_logs: {
          orderBy: { timestamp: 'desc' },
          take: 100, // Limit to last 100 location logs
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json(trips);
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

    const trip = await prisma.officialTrip.create({
      data: {
        employee_id,
        vehicle_id,
        trip_type,
        destination,
        start_location: start_location || 'Unknown',
        start_lat,
        start_lng,
        purpose,
        trip_status: 'active',
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        vehicle: {
          select: {
            id: true,
            reg_no: true,
            model: true,
          },
        },
      },
    });

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
    const { id, trip_status, end_lat, end_lng, end_time, total_distance_km, total_cost } = body;

    if (!id) {
      return NextResponse.json({ error: 'Trip ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (trip_status) updateData.trip_status = trip_status;
    if (end_lat !== undefined) updateData.end_lat = end_lat;
    if (end_lng !== undefined) updateData.end_lng = end_lng;
    if (end_time) updateData.end_time = new Date(end_time);
    if (total_distance_km) updateData.total_distance_km = total_distance_km;
    if (total_cost) updateData.total_cost = total_cost;

    const trip = await prisma.officialTrip.update({
      where: { id },
      data: updateData,
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        vehicle: {
          select: {
            id: true,
            reg_no: true,
            model: true,
          },
        },
      },
    });

    return NextResponse.json(trip);
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

    await prisma.officialTrip.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting trip:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete trip' },
      { status: 500 }
    );
  }
}

