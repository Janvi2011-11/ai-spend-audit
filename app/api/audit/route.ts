import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { runAudit } from "@/lib/auditEngine";
import { AuditFormData } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const formData: AuditFormData = await req.json();

    // Run the audit engine
    const auditResult = runAudit(formData);

    // Save to Supabase
    const { data, error } = await supabase
      .from("audits")
      .insert({
        form_data: formData,
        recommendations: auditResult.recommendations,
        total_monthly_savings: auditResult.totalMonthlySavings,
        total_annual_savings: auditResult.totalAnnualSavings,
        is_already_optimal: auditResult.isAlreadyOptimal,
      })
      .select("id")
      .single();

    if (error) throw error;

    return NextResponse.json({ id: data.id });
  } catch (error) {
    console.error("Audit error:", error);
    return NextResponse.json(
      { error: "Failed to create audit" },
      { status: 500 }
    );
  }
}
