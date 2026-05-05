---
status: testing
phase: 06-revenue-engine
source: [06-01-SUMMARY.md, 06-02-SUMMARY.md, 06-03-SUMMARY.md]
started: "2026-05-05T02:51:00.000Z"
updated: "2026-05-05T02:51:00.000Z"
---

## Current Test
<!-- OVERWRITE each test - shows where we are -->

number: 1
name: Onboarding Flow Redirect
expected: |
  When a new user logs in without a set test date, they are automatically redirected to the onboarding flow to set their test date.
awaiting: user response

## Tests

### 1. Onboarding Flow Redirect
expected: When a new user logs in without a set test date, they are automatically redirected to the onboarding flow to set their test date.
result: [pending]

### 2. Global Upgrade Modal
expected: Clicking an upgrade button or encountering a paywall opens the global Upgrade Modal displaying Pro and Premium subscription options.
result: [pending]

### 3. Smart Practice Free Limit
expected: For free users, the Smart Practice page displays a remaining session count. Starting more than 1 session in a single day is blocked, triggering the Upgrade Modal instead.
result: [pending]

### 4. Stripe Subscription Checkout
expected: Selecting a Pro or Premium plan (monthly or yearly) successfully opens a Stripe checkout session in 'subscription' mode for the correct price tier.
result: [pending]

## Summary

total: 4
passed: 0
issues: 0
pending: 4
skipped: 0

## Gaps

