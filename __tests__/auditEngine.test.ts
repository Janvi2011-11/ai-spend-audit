import { runAudit } from "../lib/auditEngine";
import { AuditFormData } from "../types";

test("Cursor Business with 2 seats should recommend downgrade to Pro", () => {
  const formData: AuditFormData = {
    tools: [{ tool: "cursor", plan: "business", monthlySpend: 80, seats: 2 }],
    teamSize: 2,
    useCase: "coding",
  };
  const result = runAudit(formData);
  expect(result.recommendations[0].recommendedAction).toBe("downgrade");
  expect(result.recommendations[0].estimatedSavings).toBeGreaterThan(0);
});

test("Cursor Pro with 1 seat should be already optimal", () => {
  const formData: AuditFormData = {
    tools: [{ tool: "cursor", plan: "pro", monthlySpend: 20, seats: 1 }],
    teamSize: 1,
    useCase: "coding",
  };
  const result = runAudit(formData);
  expect(result.recommendations[0].estimatedSavings).toBe(0);
  expect(result.isAlreadyOptimal).toBe(true);
});

test("GitHub Copilot Enterprise with 5 seats should recommend Business", () => {
  const formData: AuditFormData = {
    tools: [{ tool: "github_copilot", plan: "enterprise", monthlySpend: 195, seats: 5 }],
    teamSize: 5,
    useCase: "coding",
  };
  const result = runAudit(formData);
  expect(result.recommendations[0].recommendedAction).toBe("downgrade");
  expect(result.recommendations[0].recommendedPlan).toBe("business");
});

test("Total monthly savings should be sum of all tool savings", () => {
  const formData: AuditFormData = {
    tools: [
      { tool: "cursor", plan: "business", monthlySpend: 80, seats: 2 },
      { tool: "github_copilot", plan: "enterprise", monthlySpend: 78, seats: 2 },
    ],
    teamSize: 2,
    useCase: "coding",
  };
  const result = runAudit(formData);
  const expectedTotal = result.recommendations.reduce(
    (sum, r) => sum + r.estimatedSavings, 0
  );
  expect(result.totalMonthlySavings).toBe(expectedTotal);
});

test("Annual savings should be exactly 12x monthly savings", () => {
  const formData: AuditFormData = {
    tools: [{ tool: "cursor", plan: "business", monthlySpend: 80, seats: 2 }],
    teamSize: 2,
    useCase: "coding",
  };
  const result = runAudit(formData);
  expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12);
});
