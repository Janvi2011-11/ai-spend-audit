# Reflection — SpendSmart AI

## What I Built

SpendSmart AI is an AI spend auditing tool that takes a team's current AI subscriptions and returns structured recommendations — which plans to downgrade, switch, or flag for review — along with an AI-generated summary. The goal was to build a real, end-to-end product: form → API → database → shareable URL, not just a prototype.

## What Went Well

**The audit engine architecture.** Keeping the recommendation logic deterministic (rule-based) and using Claude only for the summary was the right call. It means the recommendations are consistent, testable, and fast, while still having a genuinely AI-powered layer. This is actually how most production AI tools work.

**Testing first.** Writing unit tests on Day 3 before building the UI forced me to think clearly about the data shapes and edge cases. When I later added overspend detection, I could verify it without manually testing in the browser every time.

**Git discipline.** Committing daily with meaningful messages made it easy to trace what changed and when. This also helped when debugging — I could see exactly which commit introduced a bug.

## What Was Hard

**The "already optimal" bug.** This was the most important bug I fixed — the app was telling users spending $300,000/month that everything was fine. The fix required changes in three places (the engine, the summary function, and the overspend map), and it taught me to think about edge cases more carefully. Just because savings = 0 doesn't mean spend is healthy.

**Supabase admin vs anon client.** I initially tried using `supabaseAdmin` in a client component, which broke silently. The error only surfaced when I checked the console. The fix was straightforward (move it to an API route) but finding it took time.

**VS Code not saving files reliably.** Early in the project, file saves from VS Code weren't persisting, which caused a lot of confusion. Switching to terminal `cat >` commands resolved this completely.

## What I'd Do Differently

- Add rate limiting to the `/api/audit` route before going to production
- Add a loading state to the form that shows while the Anthropic API call is in progress
- Store the raw `monthlySpend` vs `expectedSpend` delta in the database so I can analyse overspend patterns across users
- Add more granular test cases for the overspend detection logic

## Key Takeaways

Building for a real deadline with real integrations (Supabase, Anthropic, Resend, Vercel) is very different from tutorial projects. Things break in unexpected ways, and debugging across multiple services requires patience and systematic checking. The most important skill I practised was isolating which layer a bug was in before trying to fix it.