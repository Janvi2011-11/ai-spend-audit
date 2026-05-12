@AGENTS.md

# SpendSmart AI — Claude Context

## What this project is

SpendSmart AI is an AI spend auditing tool built with Next.js 14 App Router, TypeScript, Tailwind CSS, Supabase, Resend, and the Anthropic SDK. It lets teams input their AI tool subscriptions and receive structured recommendations on how to optimise their spend.

## Project structure

- `app/api/audit/route.ts` — POST: runs audit engine, calls Anthropic for summary, saves to Supabase
- `app/api/capture-email/route.ts` — POST: saves lead email to Supabase leads table
- `app/audit/[id]/page.tsx` — dynamic results page, fetches audit by UUID
- `app/page.tsx` — landing page with SpendForm
- `components/SpendForm.tsx` — multi-tool input form
- `components/AuditResults.tsx` — per-tool recommendation cards
- `components/AISummary.tsx` — displays Claude-generated summary
- `components/EmailCapture.tsx` — email input, POSTs to capture-email
- `components/ShareButton.tsx` — copies audit URL to clipboard
- `lib/auditEngine.ts` — core rule-based audit logic + overspend detection
- `lib/pricingData.ts` — pricing constants for all supported tools
- `lib/supabase.ts` — anon client (browser) and admin client (server only)
- `types/index.ts` — shared TypeScript types

## Key rules when editing this project

1. Never import `supabaseAdmin` in client components — it uses the service role key and must stay server-side only (API routes)
2. All `@/` import aliases are configured and working — prefer them over relative imports
3. The audit engine is deterministic (rule-based), not AI — Claude is only called for the summary text
4. `isAlreadyOptimal` is only true when savings = 0 AND total spend < $500 — do not simplify this condition
5. File writes must use terminal `cat >` commands if VS Code save is unreliable

## Supported tools

cursor, github_copilot, claude, chatgpt, gemini, windsurf

## Environment variables needed

NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, ANTHROPIC_API_KEY

## Test command

npm test — runs 5 Jest tests in __tests__/auditEngine.test.ts