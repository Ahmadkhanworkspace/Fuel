"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shield, User, Search } from "lucide-react";
import type { Employee } from "@/lib/supabase/types";

export default function RolesManagement({ initialEmployees }: { initialEmployees: Employee[] }) {
  const [employees] = useState<Employee[]>(initialEmployees);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<{ [key: string]: string }>({});

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employee_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    const styles = {
      admin: "bg-red-100 text-red-800",
      approver: "bg-blue-100 text-blue-800",
      employee: "bg-green-100 text-green-800",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          styles[role as keyof typeof styles] || styles.employee
        }`}
      >
        {role.toUpperCase()}
      </span>
    );
  };

  const handleRoleChange = async (employeeId: string, newRole: string) => {
    // TODO: Implement API call to update role
    console.log(`Updating ${employeeId} to role ${newRole}`);
    setSelectedRole({ ...selectedRole, [employeeId]: newRole });
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-xl border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Shield className="h-6 w-6 text-blue-600" />
                User Roles & Permissions
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {filteredEmployees.length} employees found
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Employee Code</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Current Role</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4 font-mono text-sm">{employee.employee_code}</td>
                    <td className="py-4 px-4">
                      <div className="font-medium">{employee.name}</div>
                    </td>
                    <td className="py-4 px-4">{employee.email}</td>
                    <td className="py-4 px-4">{getRoleBadge(employee.role)}</td>
                    <td className="py-4 px-4">
                      <select
                        value={selectedRole[employee.id] || employee.role}
                        onChange={(e) => handleRoleChange(employee.id, e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        <option value="employee">Employee</option>
                        <option value="approver">Approver</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredEmployees.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No employees found
            </div>
          )}
        </CardContent>
      </Card>

      {/* Permissions Matrix */}
      <Card className="shadow-xl border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
          <CardTitle className="text-xl font-bold text-gray-900">Permission Matrix</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Feature</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Employee</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Approver</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Admin</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4">Submit Claims</td>
                  <td className="text-center py-3 px-4 text-green-600">✓</td>
                  <td className="text-center py-3 px-4 text-green-600">✓</td>
                  <td className="text-center py-3 px-4 text-green-600">✓</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Approve Claims</td>
                  <td className="text-center py-3 px-4 text-red-600">✗</td>
                  <td className="text-center py-3 px-4 text-green-600">✓</td>
                  <td className="text-center py-3 px-4 text-green-600">✓</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">View Location Logs</td>
                  <td className="text-center py-3 px-4 text-red-600">✗</td>
                  <td className="text-center py-3 px-4 text-green-600">✓</td>
                  <td className="text-center py-3 px-4 text-green-600">✓</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Manage Zones</td>
                  <td className="text-center py-3 px-4 text-red-600">✗</td>
                  <td className="text-center py-3 px-4 text-red-600">✗</td>
                  <td className="text-center py-3 px-4 text-green-600">✓</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Manage Users</td>
                  <td className="text-center py-3 px-4 text-red-600">✗</td>
                  <td className="text-center py-3 px-4 text-red-600">✗</td>
                  <td className="text-center py-3 px-4 text-green-600">✓</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">View Analytics</td>
                  <td className="text-center py-3 px-4 text-green-600">✓</td>
                  <td className="text-center py-3 px-4 text-green-600">✓</td>
                  <td className="text-center py-3 px-4 text-green-600">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

