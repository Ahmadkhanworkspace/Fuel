import { createClient } from "@/lib/supabase/server";
import ClaimDetail from "@/components/dashboard/claim-detail";

export default async function ClaimDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const { data: claim, error } = await supabase
    .from("claims")
    .select(`
      *,
      employee:employees(id, name, employee_code, email, phone),
      vehicle:vehicles(id, reg_no, model),
      approver:employees!approver_id(id, name, employee_code)
    `)
    .eq("id", params.id)
    .single();

  if (error) {
    console.error("Error fetching claim:", error);
  }

  return <ClaimDetail claim={claim} />;
}

