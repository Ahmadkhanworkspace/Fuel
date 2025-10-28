import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Check if user has approval permissions
    await requireRole(['approver', 'admin']);

    const { claimIds, approverId } = await request.json();

    if (!claimIds || !Array.isArray(claimIds) || claimIds.length === 0) {
      return NextResponse.json(
        { error: 'Claim IDs array is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Bulk approve claims
    const { error } = await supabase
      .from('claims')
      .update({
        status: 'approved',
        approver_id: approverId,
        updated_at: new Date().toISOString(),
      })
      .in('id', claimIds);

    if (error) throw error;

    // Log audit trail
    for (const claimId of claimIds) {
      await supabase.from('audit_logs').insert({
        table_name: 'claims',
        record_id: claimId,
        action: 'approved',
        new_data: { status: 'approved', approver_id: approverId },
        performed_by: approverId,
      });
    }

    return NextResponse.json({
      success: true,
      approvedCount: claimIds.length,
      message: `Successfully approved ${claimIds.length} claims`,
    });
  } catch (error: any) {
    console.error('Bulk approve error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to approve claims' },
      { status: 500 }
    );
  }
}

