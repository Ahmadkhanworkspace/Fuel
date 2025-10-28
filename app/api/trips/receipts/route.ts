"use server";

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// GET - Fetch receipts for a trip
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tripId = searchParams.get('trip_id');

    if (!tripId) {
      return NextResponse.json({ error: 'Trip ID is required' }, { status: 400 });
    }

    const receipts = await prisma.tripReceipt.findMany({
      where: { trip_id: tripId },
      orderBy: { timestamp: 'desc' },
    });

    return NextResponse.json(receipts);
  } catch (error: any) {
    console.error('Error fetching trip receipts:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch receipts' },
      { status: 500 }
    );
  }
}

// POST - Add receipt to trip
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const {
      trip_id,
      receipt_type,
      file_url,
      amount,
      location,
      latitude,
      longitude,
      notes,
    } = body;

    if (!trip_id || !receipt_type || !file_url || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields: trip_id, receipt_type, file_url, amount' },
        { status: 400 }
      );
    }

    const receipt = await prisma.tripReceipt.create({
      data: {
        trip_id,
        receipt_type,
        file_url,
        amount,
        location,
        latitude,
        longitude,
        notes,
      },
    });

    return NextResponse.json(receipt);
  } catch (error: any) {
    console.error('Error creating receipt:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create receipt' },
      { status: 500 }
    );
  }
}

