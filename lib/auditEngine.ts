import { AuditFormData, AuditResult, ToolRecommendation, AITool } from "../types";
import { PRICING_DATA, ALTERNATIVES } from "./pricingData";

export function runAudit(formData: AuditFormData): AuditResult {
  const recommendations: ToolRecommendation[] = [];

  for (const toolEntry of formData.tools) {
    const { tool, plan, monthlySpend, seats } = toolEntry;
    const toolData = PRICING_DATA[tool as keyof typeof PRICING_DATA];

    if (!toolData) continue;

    let recommendation: ToolRecommendation = {
      tool,
      currentPlan: plan,
      currentSpend: monthlySpend,
      recommendedAction: "keep",
      recommendedPlan: plan,
      estimatedSavings: 0,
      reason: "You are already on the optimal plan for your usage.",
    };

    // ── CURSOR ──────────────────────────────────────────────
    if (tool === "cursor") {
      if (plan === "business" && seats <= 2) {
        const savings = monthlySpend - seats * 20;
        recommendation = {
          ...recommendation,
          recommendedAction: "downgrade",
          recommendedPlan: "pro",
          estimatedSavings: savings > 0 ? savings : 0,
          reason: `Business plan is overkill for ${seats} users. Pro at $20/seat gives the same completions without admin overhead.`,
        };
      } else if (plan === "pro" && formData.useCase === "writing") {
        recommendation = {
          ...recommendation,
          recommendedAction: "switch",
          recommendedPlan: "claude_pro",
          estimatedSavings: monthlySpend - 20,
          reason: `For writing use cases, Claude Pro at $20/month outperforms Cursor which is optimised for coding.`,
        };
      }
    }

    // ── GITHUB COPILOT ───────────────────────────────────────
    if (tool === "github_copilot") {
      if (plan === "enterprise" && formData.teamSize <= 10) {
        const savings = seats * (39 - 19);
        recommendation = {
          ...recommendation,
          recommendedAction: "downgrade",
          recommendedPlan: "business",
          estimatedSavings: savings,
          reason: `Enterprise is designed for 50+ person orgs with compliance needs. Business at $19/seat covers everything a ${formData.teamSize}-person team needs.`,
        };
      } else if (plan === "business" && seats === 1) {
        recommendation = {
          ...recommendation,
          recommendedAction: "downgrade",
          recommendedPlan: "individual",
          estimatedSavings: seats * (19 - 10),
          reason: `Individual plan at $10/month is identical in features for solo developers. Business tier only adds team management you don't need.`,
        };
      }
    }

    // ── CLAUDE ───────────────────────────────────────────────
    if (tool === "claude") {
      if (plan === "team" && seats <= 2) {
        const savings = monthlySpend - seats * 20;
        recommendation = {
          ...recommendation,
          recommendedAction: "downgrade",
          recommendedPlan: "pro",
          estimatedSavings: savings > 0 ? savings : 0,
          reason: `Team plan requires minimum 5 seats billed. For ${seats} users, individual Pro plans at $20/seat saves money with identical usage limits.`,
        };
      } else if (plan === "max" && formData.useCase === "coding") {
        recommendation = {
          ...recommendation,
          recommendedAction: "switch",
          recommendedPlan: "cursor_pro",
          estimatedSavings: monthlySpend - 20,
          reason: `Claude Max at $100/month is optimised for heavy writing/research. For coding, Cursor Pro at $20/month gives better IDE integration and similar intelligence.`,
        };
      }
    }

    // ── CHATGPT ──────────────────────────────────────────────
    if (tool === "chatgpt") {
      if (plan === "team" && seats <= 2) {
        const savings = monthlySpend - seats * 20;
        recommendation = {
          ...recommendation,
          recommendedAction: "downgrade",
          recommendedPlan: "plus",
          estimatedSavings: savings > 0 ? savings : 0,
          reason: `ChatGPT Team requires minimum 2 seats at $30/seat. For ${seats} users doing ${formData.useCase}, individual Plus plans at $20/seat is more cost effective.`,
        };
      }
    }

    // ── GEMINI ───────────────────────────────────────────────
    if (tool === "gemini") {
      if (plan === "pro" && formData.useCase === "coding") {
        recommendation = {
          ...recommendation,
          recommendedAction: "switch",
          recommendedPlan: "cursor_pro",
          estimatedSavings: monthlySpend - 20,
          reason: `Gemini Advanced is not optimised for coding workflows. Cursor Pro at $20/month offers superior code completion and IDE integration for your use case.`,
        };
      }
    }

    // ── WINDSURF ─────────────────────────────────────────────
    if (tool === "windsurf") {
      if (plan === "team" && seats <= 2) {
        const savings = monthlySpend - seats * 15;
        recommendation = {
          ...recommendation,
          recommendedAction: "downgrade",
          recommendedPlan: "pro",
          estimatedSavings: savings > 0 ? savings : 0,
          reason: `Windsurf Team at $35/seat adds admin features unnecessary for ${seats} users. Pro at $15/seat covers all coding features.`,
        };
      }
    }

    recommendations.push(recommendation);
  }

  // Calculate totals
  const totalMonthlySavings = recommendations.reduce(
    (sum, r) => sum + r.estimatedSavings,
    0
  );

  const totalAnnualSavings = totalMonthlySavings * 12;

  const isAlreadyOptimal = totalMonthlySavings === 0;

  return {
    formData,
    recommendations,
    totalMonthlySavings,
    totalAnnualSavings,
    isAlreadyOptimal,
  };
}

// Helper to get tool display name
export function getToolDisplayName(tool: string): string {
  const names: Record<string, string> = {
    cursor: "Cursor",
    github_copilot: "GitHub Copilot",
    claude: "Claude",
    chatgpt: "ChatGPT",
    anthropic_api: "Anthropic API",
    openai_api: "OpenAI API",
    gemini: "Gemini",
    windsurf: "Windsurf",
  };
  return names[tool] || tool;
}