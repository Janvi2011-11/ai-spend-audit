# Test Documentation — SpendSmart AI

## Test Suite

File: `__tests__/auditEngine.test.ts`  
Runner: Jest + ts-jest  
Status: ✅ 5/5 passing

---

## Test Cases

### 1. Cursor Business → Pro downgrade (small team)
**Input:** Cursor, business plan, 2 seats, $80/month  
**Expected:** `recommendedAction: "downgrade"`, `recommendedPlan: "pro"`, savings > 0  
**Why:** Business plan is overkill for teams ≤ 2 — Pro gives identical completions.

### 2. GitHub Copilot Enterprise → Business downgrade
**Input:** GitHub Copilot, enterprise plan, 5 seats, team size 8  
**Expected:** `recommendedAction: "downgrade"`, savings = 5 × (39 - 19) = $100  
**Why:** Enterprise is designed for 50+ person orgs with compliance needs.

### 3. Claude Max → Cursor switch (coding use case)
**Input:** Claude, max plan, 1 seat, use case "coding"  
**Expected:** `recommendedAction: "switch"`, `recommendedPlan: "cursor_pro"`  
**Why:** Claude Max is optimised for writing/research, not IDE-integrated coding.

### 4. Already optimal detection
**Input:** Cursor, pro plan, 1 seat, $20/month, use case "coding"  
**Expected:** `isAlreadyOptimal: true`, `totalMonthlySavings: 0`  
**Why:** Pro plan at correct price for a solo developer is the optimal state.

### 5. Annual savings calculation
**Input:** Any audit with $50/month identified savings  
**Expected:** `totalAnnualSavings: 600`  
**Why:** Annual = monthly × 12. Verify the multiplication is applied correctly.

---

## Running Tests

```bash
npm test
```

Expected output: