import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const zones = await prisma.zone.findMany({
      orderBy: { created_at: 'desc' }
    });
    return NextResponse.json(zones);
  } catch (error: any) {
    console.error('Error fetching zones:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, center_lat, center_lng, radius_km, active = true } = body;

    const zone = await prisma.zone.create({
      data: {
        name,
        center_lat,
        center_lng,
        radius_km,
        active,
      }
    });

    return NextResponse.json(zone, { status: 201 });
  } catch (error: any) {
    console.error('Error creating zone:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Zone ID is required' }, { status: 400 });
    }

    await prisma.zone.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting zone:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'Zone ID is required' }, { status: 400 });
    }

    const zone = await prisma.zone.update({
      where: { id },
      data
    });

    return NextResponse.json(zone);
  } catch (error: any) {
    console.error('Error updating zone:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

