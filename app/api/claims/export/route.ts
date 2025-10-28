import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { formatCurrency } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const format = searchParams.get('format') || 'csv';

    const supabase = await createClient();

    let query = supabase
      .from('claims')
      .select(`
        *,
        employee:employees(name, employee_code, email),
        vehicle:vehicles(reg_no, model)
      `)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data: claims, error } = await query;

    if (error) throw error;

    if (format === 'csv') {
      return exportToCSV(claims || []);
    } else if (format === 'json') {
      return exportToJSON(claims || []);
    }

    return exportToCSV(claims || []);
  } catch (error: any) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to export claims' },
      { status: 500 }
    );
  }
}

function exportToCSV(claims: any[]) {
  const headers = [
    'Claim ID',
    'Employee Code',
    'Employee Name',
    'Vehicle',
    'Liters',
    'Price',
    'Odometer',
    'GPS Location',
    'Fraud Score',
    'Status',
    'Created At',
  ];

  const rows = claims.map((claim) => [
    claim.id,
    claim.employee?.employee_code || '',
    claim.employee?.name || '',
    claim.vehicle?.reg_no || '',
    claim.liters_claimed,
    claim.price,
    claim.odometer_reading || '',
    `${claim.gps_lat}, ${claim.gps_lng}`,
    claim.fraud_score || 0,
    claim.status,
    claim.created_at,
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="claims-export-${Date.now()}.csv"`,
    },
  });
}

function exportToJSON(claims: any[]) {
  const jsonData = claims.map((claim) => ({
    id: claim.id,
    employee: {
      code: claim.employee?.employee_code,
      name: claim.employee?.name,
      email: claim.employee?.email,
    },
    vehicle: {
      regNo: claim.vehicle?.reg_no,
      model: claim.vehicle?.model,
    },
    fuel: {
      liters: claim.liters_claimed,
      price: claim.price,
    },
    odometer: claim.odometer_reading,
    location: {
      latitude: claim.gps_lat,
      longitude: claim.gps_lng,
    },
    fraudScore: claim.fraud_score,
    status: claim.status,
    createdAt: claim.created_at,
    updatedAt: claim.updated_at,
  }));

  return NextResponse.json(jsonData, {
    headers: {
      'Content-Disposition': `attachment; filename="claims-export-${Date.now()}.json"`,
    },
  });
}

