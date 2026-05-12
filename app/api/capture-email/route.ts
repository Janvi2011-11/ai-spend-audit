import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { auditId, email, company, role } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    // Save lead to Supabase
    const { error: dbError } = await supabaseAdmin
      .from("leads")
      .insert({ audit_id: auditId, email, company, role });

    if (dbError) {
      console.error("DB error:", dbError);
    }

    // Send confirmation email via Resend
    await resend.emails.send({
      from: "SpendSmart AI <onboarding@resend.dev>",
      to: email,
      subject: "Your AI Spend Audit Report",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #34d399;">Your SpendSmart AI Audit Report</h1>
          <p>Hi there!</p>
          <p>Thanks for using SpendSmart AI. Your audit has been saved and you can view it anytime at:</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/audit/${auditId}" 
             style="display: inline-block; background: #34d399; color: #000; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
            View My Audit Report
          </a>
          <p style="color: #666; margin-top: 32px;">
            If you have significant savings opportunities, the Credex team will reach out to help you capture them with discounted AI credits.
          </p>
          <p style="color: #666;">— The SpendSmart AI Team</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Capture email error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}