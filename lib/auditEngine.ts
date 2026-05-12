import { AuditFormData, AuditResult, ToolRecommendation } from "../types";
import { PRICING_DATA } from "./pricingData";

const EXPECTED_COST_MAP: Record<string, Record<string, number>> = {
  cursor:         { free: 0, pro: 20, business: 40 },
  github_copilot: { individual: 10, business: 19, enterprise: 39 },
  claude:         { free: 0, pro: 20, team: 30, max: 100 },
  chatgpt:        { free: 0, plus: 20, team: 30, enterprise: 60 },
  gemini:         { free: 0, pro: 20 },
  windsurf:       { free: 0, pro: 15, team: 35 },
};

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
        recommendation = { ...recommendation, recommendedAction: "downgrade", recommendedPlan: "pro", estimatedSavings: savings > 0 ? savings : 0, reason: `Business plan is overkill for ${seats} users. Pro at $20/seat gives the same completions without admin overhead.` };
      } else if (plan === "pro" && formData.useCase === "writing") {
        recommendation = { ...recommendation, recommendedAction: "switch", recommendedPlan: "claude_pro", estimatedSavings: monthlySpend - 20, reason: `For writing use cases, Claude Pro at $20/month outperforms Cursor which is optimised for coding.` };
      }
    }

    // ── GITHUB COPILOT ───────────────────────────────────────
    if (tool === "github_copilot") {
      if (plan === "enterprise" && formData.teamSize <= 10) {
        recommendation = { ...recommendation, recommendedAction: "downgrade", recommendedPlan: "business", estimatedSavings: seats * (39 - 19), reason: `Enterprise is designed for 50+ person orgs. Business at $19/seat covers everything a ${formData.teamSize}-person team needs.` };
      } else if (plan === "business" && seats === 1) {
        recommendation = { ...recommendation, recommendedAction: "downgrade", recommendedPlan: "individual", estimatedSavings: seats * (19 - 10), reason: `Individual plan at $10/month is identical in features for solo developers.` };
      }
    }

    // ── CLAUDE ───────────────────────────────────────────────
    if (tool === "claude") {
      if (plan === "team" && seats <= 2) {
        const savings = monthlySpend - seats * 20;
        recommendation = { ...recommendation, recommendedAction: "downgrade", recommendedPlan: "pro", estimatedSavings: savings > 0 ? savings : 0, reason: `Team plan requires minimum 5 seats billed. For ${seats} users, individual Pro plans at $20/seat saves money.` };
      } else if (plan === "max" && formData.useCase === "coding") {
        recommendation = { ...recommendation, recommendedAction: "switch", recommendedPlan: "cursor_pro", estimatedSavings: monthlySpend - 20, reason: `Claude Max is optimised for writing/research. For coding, Cursor Pro at $20/month gives better IDE integration.` };
      }
    }

    // ── CHATGPT ──────────────────────────────────────────────
    if (tool === "chatgpt") {
      if (plan === "team" && seats <= 2) {
        const savings = monthlySpend - seats * 20;
        recommendation = { ...recommendation, recommendedAction: "downgrade", recommendedPlan: "plus", estimatedSavings: savings > 0 ? savings : 0, reason: `For ${seats} users doing ${formData.useCase}, individual Plus plans at $20/seat is more cost effective than Team.` };
      }
    }

    // ── GEMINI ───────────────────────────────────────────────
    if (tool === "gemini") {
      if (plan === "pro" && formData.useCase === "coding") {
        recommendation = { ...recommendation, recommendedAction: "switch", recommendedPlan: "cursor_pro", estimatedSavings: monthlySpend - 20, reason: `Gemini Advanced is not optimised for coding. Cursor Pro at $20/month offers superior code completion for your use case.` };
      }
    }

    // ── WINDSURF ─────────────────────────────────────────────
    if (tool === "windsurf") {
      if (plan === "team" && seats <= 2) {
        const savings = monthlySpend - seats * 15;
        recommendation = { ...recommendation, recommendedAction: "downgrade", recommendedPlan: "pro", estimatedSavings: savings > 0 ? savings : 0, reason: `Windsurf Team adds admin features unnecessary for ${seats} users. Pro at $15/seat covers all coding features.` };
      }
    }

    // ── OVERSPEND DETECTION ──────────────────────────────────
    if (recommendation.recommendedAction === "keep") {
      const expectedPerSeat = EXPECTED_COST_MAP[tool]?.[plan];
      if (expectedPerSeat !== undefined) {
        const expectedTotal = expectedPerSeat * Math.max(seats, 1);
        const overspend = monthlySpend - expectedTotal;
        if (overspend > 50 && monthlySpend / (expectedTotal || 1) > 1.5) {
          recommendation = {
            ...recommendation,
            recommendedAction: "review",
            estimatedSavings: overspend,
            reason: `You're reporting $${monthlySpend}/month but ${plan} for ${seats} seat(s) should cost ~$${expectedTotal}/month. You likely have duplicate subscriptions, unused seats, or a billing error worth auditing immediately.`,
          };
        }
      } else if (monthlySpend > 500) {
        // Unknown plan — flag any high spend regardless
        recommendation = {
          ...recommendation,
          recommendedAction: "review",
          estimatedSavings: 0,
          reason: `You're reporting $${monthlySpend}/month for ${tool} (${plan} plan) — this is unusually high. Please verify your billing and check for unused seats or duplicate charges.`,
        };
      }
    }

    recommendations.push(recommendation);
  }

  const totalMonthlySavings = recommendations.reduce((sum, r) => sum + r.estimatedSavings, 0);
  const totalAnnualSavings = totalMonthlySavings * 12;
  const totalCurrentSpend = formData.tools.reduce((sum, t) => sum + t.monthlySpend, 0);
  const isAlreadyOptimal = totalMonthlySavings === 0 && totalCurrentSpend < 500;

  return { formData, recommendations, totalMonthlySavings, totalAnnualSavings, isAlreadyOptimal };
}

export function getToolDisplayName(tool: string): string {
  const names: Record<string, string> = {
    cursor: "Cursor", github_copilot: "GitHub Copilot", claude: "Claude",
    chatgpt: "ChatGPT", anthropic_api: "Anthropic API", openai_api: "OpenAI API",
    gemini: "Gemini", windsurf: "Windsurf",
  };
  return names[tool] || tool;
}
