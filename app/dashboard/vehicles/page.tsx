import VehiclesTable from "@/components/dashboard/vehicles-table";

export default function VehiclesPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
          Vehicles
        </h1>
        <p style={{ color: '#4b5563', fontSize: '14px' }}>
          Manage fleet and assignments
        </p>
      </div>
      <VehiclesTable />
    </div>
  );
}
