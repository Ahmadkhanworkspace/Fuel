import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// GET - Fetch expenses for a trip
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tripId = searchParams.get('trip_id');

    if (!tripId) {
      return NextResponse.json({ error: 'Trip ID is required' }, { status: 400 });
    }

    const expenses = await prisma.tripExpense.findMany({
      where: { trip_id: tripId },
      orderBy: { timestamp: 'desc' },
    });

    return NextResponse.json(expenses);
  } catch (error: any) {
    console.error('Error fetching trip expenses:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch expenses' },
      { status: 500 }
    );
  }
}

// POST - Add expense to trip
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const {
      trip_id,
      expense_type,
      amount,
      description,
      location,
      latitude,
      longitude,
      photo_url,
      receipt_url,
    } = body;

    if (!trip_id || !expense_type || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields: trip_id, expense_type, amount' },
        { status: 400 }
      );
    }

    const expense = await prisma.tripExpense.create({
      data: {
        trip_id,
        expense_type,
        amount,
        description,
        location,
        latitude,
        longitude,
        photo_url,
        receipt_url,
      },
    });

    // Update trip total cost
    const trip = await prisma.officialTrip.findUnique({
      where: { id: trip_id },
      select: { total_cost: true },
    });

    const newTotalCost = (parseFloat(trip?.total_cost?.toString() || '0') + parseFloat(amount.toString())).toString();

    await prisma.officialTrip.update({
      where: { id: trip_id },
      data: { total_cost: newTotalCost },
    });

    return NextResponse.json(expense);
  } catch (error: any) {
    console.error('Error creating expense:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create expense' },
      { status: 500 }
    );
  }
}

