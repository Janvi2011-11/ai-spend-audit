# Metrics — SpendSmart AI

## North Star Metric

**Audits completed per week** — this is the top of funnel for everything downstream (emails, consultations, revenue).

---

## Acquisition Metrics

| Metric | Target (Week 4) | How to Measure |
|--------|----------------|----------------|
| Unique visitors | 1,000 | Vercel Analytics |
| Audits completed | 500 | Supabase `audits` count |
| Audit completion rate | 50% | audits / visitors |

---

## Engagement Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Email capture rate | 15% | leads / audits |
| Share button clicks | 20% | client event tracking |
| Return visits (shared links) | 100/week | Vercel Analytics |

---

## Revenue Metrics

| Metric | Target (Month 1) | Notes |
|--------|-----------------|-------|
| Consultation bookings | 15 | 3% of audits |
| Leads generated (emails) | 75 | 15% of audits |
| Avg identified savings/audit | $200 | from Supabase data |

---

## Product Quality Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Audit with ≥1 recommendation | >60% | recommendations.length > 0 |
| Avg savings identified | >$150/month | avg(total_monthly_savings) |
| API error rate | <1% | monitor Anthropic fallback rate |
| Page load time | <2s | Vercel Speed Insights |

---

## Aggregated Insights (after 1,000 audits)

- Most overpaid tool category
- Most common downgrade recommendation
- Average AI spend per team size bracket
- % of teams with redundant tool overlap

This data becomes a public benchmark report — a content marketing asset.