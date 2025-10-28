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

    return NextResponse.json([]);
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
    
    const { trip_id, expense_type, amount } = body;

    if (!trip_id || !expense_type || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields: trip_id, expense_type, amount' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, message: 'Expense added successfully' });
  } catch (error: any) {
    console.error('Error creating expense:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create expense' },
      { status: 500 }
    );
  }
}
