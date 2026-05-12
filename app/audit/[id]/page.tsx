import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import AuditResults from "@/components/AuditResults";

export default async function AuditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data, error } = await supabaseAdmin
    .from("audits")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    notFound();
  }

  return <AuditResults result={data} auditId={id} />;
}
