import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Check if user has approval permissions
    await requireRole(['approver', 'admin']);

    const { claimIds, approverId, reason } = await request.json();

    if (!claimIds || !Array.isArray(claimIds) || claimIds.length === 0) {
      return NextResponse.json(
        { error: 'Claim IDs array is required' },
        { status: 400 }
      );
    }

    if (!reason) {
      return NextResponse.json(
        { error: 'Rejection reason is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Bulk reject claims
    const { error } = await supabase
      .from('claims')
      .update({
        status: 'rejected',
        approver_id: approverId,
        rejection_reason: reason,
        updated_at: new Date().toISOString(),
      })
      .in('id', claimIds);

    if (error) throw error;

    // Log audit trail
    for (const claimId of claimIds) {
      await supabase.from('audit_logs').insert({
        table_name: 'claims',
        record_id: claimId,
        action: 'rejected',
        new_data: { 
          status: 'rejected', 
          approver_id: approverId,
          rejection_reason: reason,
        },
        performed_by: approverId,
      });
    }

    return NextResponse.json({
      success: true,
      rejectedCount: claimIds.length,
      message: `Successfully rejected ${claimIds.length} claims`,
    });
  } catch (error: any) {
    console.error('Bulk reject error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to reject claims' },
      { status: 500 }
    );
  }
}

