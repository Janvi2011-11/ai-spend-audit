# Pricing Data — SpendSmart AI

Reference document for all AI tool pricing used in the audit engine (`lib/pricingData.ts`).

Last updated: May 2025

---

## Cursor

| Plan | Price/seat/month | Key Features |
|------|-----------------|--------------|
| Free | $0 | 2,000 completions/month, 50 slow premium requests |
| Pro | $20 | Unlimited completions, 500 fast premium requests, 10 Claude Opus uses |
| Business | $40 | Everything in Pro + team admin, SSO, centralised billing |

**Audit logic:** Business plan is flagged for teams ≤ 2 seats — Pro gives identical features without admin overhead.

---

## GitHub Copilot

| Plan | Price/seat/month | Key Features |
|------|-----------------|--------------|
| Individual | $10 | Code completions, chat in IDE, CLI assistance |
| Business | $19 | Everything in Individual + team management, policy controls |
| Enterprise | $39 | Everything in Business + personalisation, audit logs, SAML SSO |

**Audit logic:** Enterprise flagged for teams ≤ 10 (designed for 50+ orgs). Business flagged for solo devs (Individual is identical).

---

## Claude (Anthropic)

| Plan | Price/seat/month | Key Features |
|------|-----------------|--------------|
| Free | $0 | Limited messages, Claude 3.5 Haiku |
| Pro | $20 | 5× more usage, Sonnet + Opus, Projects, priority access |
| Team | $30 | Everything in Pro + admin console (min 5 seats billed) |
| Max | $100 | 20× Pro usage, extended thinking, max context |

**Audit logic:** Team plan flagged for ≤ 2 seats (min 5 billed anyway). Max flagged for coding use case — Cursor Pro is better suited.

---

## ChatGPT (OpenAI)

| Plan | Price/seat/month | Key Features |
|------|-----------------|--------------|
| Free | $0 | GPT-4o mini, limited GPT-4o |
| Plus | $20 | GPT-4o, DALL-E 3, advanced data analysis, custom GPTs |
| Team | $30 | Everything in Plus + admin workspace (min 2 seats) |
| Enterprise | $60 | Unlimited GPT-4o, SSO, audit logs, custom data retention |

**Audit logic:** Team plan flagged for ≤ 2 seats — Plus at $20/seat is cheaper with same features.

---

## Gemini (Google)

| Plan | Price/seat/month | Key Features |
|------|-----------------|--------------|
| Free | $0 | Gemini 1.5 Flash, basic image understanding |
| Pro (Advanced) | $20 | Gemini 1.5 Pro, 1M token context, Google Workspace integration |

**Audit logic:** Pro flagged for coding use case — Cursor Pro has better IDE integration.

---

## Windsurf

| Plan | Price/seat/month | Key Features |
|------|-----------------|--------------|
| Free | $0 | 5 prompt credits/day, basic completions |
| Pro | $15 | Unlimited completions, 500 premium credits/month, Cascade access |
| Team | $35 | Everything in Pro + team admin, centralised billing, priority support |

**Audit logic:** Team flagged for ≤ 2 seats — Pro at $15/seat covers all coding features.

---

## Overspend Detection Thresholds

If a user's reported `monthlySpend` exceeds 1.5× the expected plan cost by more than $50, the tool is flagged as `review` with a billing anomaly warning.

| Tool | Plan | Expected cost (1 seat) |
|------|------|----------------------|
| cursor | free | $0 |
| cursor | pro | $20 |
| cursor | business | $40 |
| github_copilot | individual | $10 |
| github_copilot | business | $19 |
| github_copilot | enterprise | $39 |
| claude | free | $0 |
| claude | pro | $20 |
| claude | team | $30 |
| claude | max | $100 |
| chatgpt | free | $0 |
| chatgpt | plus | $20 |
| chatgpt | team | $30 |
| chatgpt | enterprise | $60 |
| gemini | free | $0 |
| gemini | pro | $20 |
| windsurf | free | $0 |
| windsurf | pro | $15 |
| windsurf | team | $35 |