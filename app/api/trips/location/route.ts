"use server";

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// POST - Log location for a trip
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const {
      trip_id,
      latitude,
      longitude,
      address,
    } = body;

    if (!trip_id || !latitude || !longitude) {
      return NextResponse.json(
        { error: 'Missing required fields: trip_id, latitude, longitude' },
        { status: 400 }
      );
    }

    const locationLog = await prisma.tripLocationLog.create({
      data: {
        trip_id,
        latitude,
        longitude,
        address,
      },
    });

    return NextResponse.json(locationLog);
  } catch (error: any) {
    console.error('Error logging location:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to log location' },
      { status: 500 }
    );
  }
}

// GET - Fetch location logs for a trip
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tripId = searchParams.get('trip_id');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 100;

    if (!tripId) {
      return NextResponse.json({ error: 'Trip ID is required' }, { status: 400 });
    }

    const logs = await prisma.tripLocationLog.findMany({
      where: { trip_id: tripId },
      orderBy: { timestamp: 'desc' },
      take: limit,
    });

    return NextResponse.json(logs);
  } catch (error: any) {
    console.error('Error fetching location logs:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch location logs' },
      { status: 500 }
    );
  }
}

