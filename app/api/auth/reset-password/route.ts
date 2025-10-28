import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, generateRandomPassword } from '@/lib/auth/password';

export const dynamic = 'force-dynamic';

// POST - Reset employee password
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { employee_id, new_password } = body;

    if (!employee_id) {
      return NextResponse.json({ error: 'Employee ID is required' }, { status: 400 });
    }

    // Generate random password if not provided
    const finalPassword = new_password || generateRandomPassword(12);
    const passwordHash = await hashPassword(finalPassword);

    const employee = await prisma.employee.update({
      where: { id: employee_id },
      data: {
        password_hash: passwordHash,
        password_reset_token: null,
        password_reset_expires: null
      }
    });

    // Don't return password hash
    const { password_hash, password_reset_token, ...safeEmployee } = employee;

    return NextResponse.json({
      ...safeEmployee,
      new_password: finalPassword,
      message: 'Password reset successfully!'
    });
  } catch (error: any) {
    console.error('Error resetting password:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

