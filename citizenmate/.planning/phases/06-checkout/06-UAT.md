---
status: testing
phase: 06-checkout
source: [manual]
started: 2026-05-06T15:49:00+10:00
updated: 2026-05-06T15:49:00+10:00
---

## Current Test
<!-- OVERWRITE each test - shows where we are -->

number: 1
name: Pro Tier Checkout
expected: |
  As an authenticated user, clicking "Upgrade to Pro" should redirect me to a Stripe checkout page. The checkout page should display the correct Pro product and price based on the selected interval (monthly or yearly).
awaiting: user response

## Tests

### 1. Pro Tier Checkout
expected: As an authenticated user, clicking "Upgrade to Pro" should redirect me to a Stripe checkout page. The checkout page should display the correct Pro product and price based on the selected interval (monthly or yearly).
result: [pending]

### 2. Premium Tier Checkout
expected: As an authenticated user, clicking "Upgrade to Premium" should redirect me to a Stripe checkout page. The checkout page should display the correct Premium product and price based on the selected interval (monthly or yearly).
result: [pending]

### 3. Sprint Pass Checkout
expected: As an authenticated user, clicking "Get Sprint Pass" on the pricing preview section should redirect me to a Stripe checkout page for the one-time Sprint Pass product.
result: [pending]

## Summary

total: 3
passed: 0
issues: 0
pending: 3
skipped: 0

## Gaps

