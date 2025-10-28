import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, generateRandomPassword, verifyPassword } from '@/lib/auth/password';

export const dynamic = 'force-dynamic';

// GET - List all employees
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');

    const where = role ? { role: role as any } : {};

    const employees = await prisma.employee.findMany({
      where,
      orderBy: { created_at: 'desc' }
    });

    // Don't return password hashes
    const safeEmployees = employees.map((emp: any) => ({
      ...emp,
      password_hash: undefined,
      password_reset_token: undefined
    }));

    return NextResponse.json(safeEmployees);
  } catch (error: any) {
    console.error('Error fetching employees:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Create new employee with auto-generated credentials
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      employee_code, 
      name, 
      email, 
      phone, 
      role, 
      department,
      zone_id, 
      allowed_quota_liters,
      allowed_zones,
      username,
      password
    } = body;

    console.log('Creating employee with data:', { employee_code, name, email });

    // Generate random password if not provided
    const generatedPassword = password || generateRandomPassword(12);
    const passwordHash = await hashPassword(generatedPassword);

    // Generate username if not provided
    const finalUsername = username || email.split('@')[0] + '_' + Math.random().toString(36).substring(7);

    console.log('Generated credentials:', { username: finalUsername, passwordLength: generatedPassword.length });

    const employee = await prisma.employee.create({
      data: {
        employee_code,
        name,
        email,
        username: finalUsername,
        password_hash: passwordHash,
        phone,
        role: role || 'employee',
        department: department || 'Operations',
        zone_id: zone_id || null,
        allowed_quota_liters: allowed_quota_liters || 100,
        allowed_zones: allowed_zones || []
      }
    });

    console.log('Employee created successfully:', employee.id);

    return NextResponse.json({
      ...employee,
      generated_password: generatedPassword,
      message: 'Employee created successfully! Username and password generated.'
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating employee:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json({ 
      error: error.message,
      details: error.code,
      hint: error.hint 
    }, { status: 500 });
  }
}

// PATCH - Update employee
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    // Remove sensitive fields that shouldn't be updated via API
    const { password_hash, password_reset_token, ...safeData } = updateData;

    const employee = await prisma.employee.update({
      where: { id },
      data: safeData
    });

    const { password_hash: _, password_reset_token: __, ...safeEmployee } = employee;

    return NextResponse.json(safeEmployee);
  } catch (error: any) {
    console.error('Error updating employee:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Delete employee
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Employee ID is required' }, { status: 400 });
    }

    await prisma.employee.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting employee:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

