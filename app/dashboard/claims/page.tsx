import ClaimsTable from "@/components/dashboard/claims-table";

export default function ClaimsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
          Claims Queue
        </h1>
        <p style={{ color: '#4b5563', fontSize: '14px' }}>
          Review and manage fuel claims
        </p>
      </div>
      <ClaimsTable />
    </div>
  );
}
