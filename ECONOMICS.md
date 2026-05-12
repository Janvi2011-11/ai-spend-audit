# Unit Economics — SpendSmart AI

## Cost to Run

| Cost | Amount | Notes |
|------|--------|-------|
| Vercel (Hobby) | $0 | Free tier, sufficient for early traffic |
| Supabase (Free) | $0 | 500MB DB, 2GB bandwidth |
| Anthropic API | ~$0.0004/audit | claude-haiku-4-5, ~200 tokens/call |
| Resend | $0 | Free tier: 3,000 emails/month |
| **Total per audit** | **~$0.0004** | Effectively free at early scale |

At 10,000 audits/month: ~$4/month in API costs.

---

## Revenue Model

### Primary: Credex consultation upsell
- Every audit shows a "Book a free Credex consultation" CTA
- Credex earns revenue from AI procurement / managed AI spend services
- Conversion assumption: 3% of audits → consultation booking

### Secondary: Aggregated benchmark data
- After 1,000+ audits, SpendSmart has unique data on how teams spend on AI
- This data has value as a market research product or as content marketing

---

## LTV / CAC Estimate

| Metric | Estimate |
|--------|---------|
| Cost per audit (infra) | $0.0004 |
| Email capture rate | 15% |
| Consultation booking rate | 3% |
| Audits needed per booking | ~33 |
| Cost to generate one lead | ~$0.01 |
| Cost to generate one consultation | ~$0.33 |

If a Credex consultation converts to a paid engagement worth $500+, CAC < $1 makes this exceptionally efficient.

---

## Scaling Considerations

- **Database:** Supabase free tier handles ~10,000 audits. Upgrade to Pro ($25/month) when approaching limit.
- **AI costs:** Haiku is cheap enough that even 100,000 audits/month costs ~$40 in API fees.
- **The real cost is distribution**, not infrastructure.