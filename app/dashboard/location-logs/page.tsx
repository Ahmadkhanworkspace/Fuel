import { createClient } from "@/lib/supabase/server";
import LocationLogsTable from "@/components/dashboard/location-logs-table";

export default async function LocationLogsPage() {
  const supabase = await createClient();

  // Fetch real location logs
  const { data: locationLogs, error } = await supabase
    .from('location_logs')
    .select(`
      *,
      employee:employees(name, employee_code),
      vehicle:vehicles(reg_no, model),
      zone:zones(name)
    `)
    .order('timestamp', { ascending: false })
    .limit(100);

  if (error) {
    console.error('Error fetching location logs:', error);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '30px', fontWeight: 'bold', background: 'linear-gradient(90deg, #2563eb, #1e40af)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' }}>
          Location Logs
        </h1>
        <p style={{ color: '#4b5563', fontSize: '14px' }}>
          Track GPS coordinates and zone compliance
        </p>
      </div>
      <LocationLogsTable initialLogs={locationLogs || []} />
    </div>
  );
}
