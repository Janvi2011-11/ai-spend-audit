import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { runAudit } from "@/lib/auditEngine";
import { AuditFormData, AuditResult } from "@/types";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function getAISummary(result: AuditResult): Promise<string> {
  const totalSpend = result.formData.tools.reduce((s, t) => s + t.monthlySpend, 0);
  const toolList = result.formData.tools.map(t => `${t.tool} (${t.plan}, ${t.seats} seats, $${t.monthlySpend}/mo)`).join(", ");

  try {
    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 200,
      messages: [{
        role: "user",
        content: `You are an AI spend auditor. A team of ${result.formData.teamSize} is spending $${totalSpend}/month on AI tools: ${toolList}. Use case: ${result.formData.useCase}. Potential savings identified: $${result.totalMonthlySavings}/month. Write 2 sentences: a direct assessment of whether their spending is healthy or concerning, and what they should do. Be specific about the dollar amounts. Never say spending is fine if total spend exceeds $1000/month with low savings identified — flag it as worth reviewing.`,
      }],
    });
    const block = message.content[0];
    return block.type === "text" ? block.text : fallbackSummary(result, totalSpend);
  } catch {
    return fallbackSummary(result, totalSpend);
  }
}

function fallbackSummary(result: AuditResult, totalSpend: number): string {
  if (result.totalMonthlySavings > 0) {
    return `Your audit found $${result.totalMonthlySavings.toFixed(0)}/month ($${result.totalAnnualSavings.toFixed(0)}/year) in potential savings. Review the recommendations below to see exactly which plans to change.`;
  }
  if (totalSpend > 1000) {
    return `Your team is spending $${totalSpend}/month on AI tools — that's significant. While no plan mismatches were detected, it's worth auditing seat usage and actual utilisation rates to ensure every dollar is justified.`;
  }
  return "Your current AI stack appears well-optimised for your team size and use case. Check back as your team grows.";
}

export async function POST(req: NextRequest) {
  try {
    const formData: AuditFormData = await req.json();
    const auditResult = runAudit(formData);
    const aiSummary = await getAISummary(auditResult);

    const { data, error } = await supabaseAdmin
      .from("audits")
      .insert({
        form_data: formData,
        recommendations: auditResult.recommendations,
        total_monthly_savings: auditResult.totalMonthlySavings,
        total_annual_savings: auditResult.totalAnnualSavings,
        is_already_optimal: auditResult.isAlreadyOptimal,
        ai_summary: aiSummary,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Supabase error:", error);
      throw new Error(error.message);
    }

    return NextResponse.json({ id: data.id });
  } catch (error) {
    console.error("Audit error:", error);
    return NextResponse.json({ error: "Failed to create audit" }, { status: 500 });
  }
}
