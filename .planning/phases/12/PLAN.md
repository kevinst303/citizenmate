# Phase 12: Adaptive Gamification & Trust-building

## 1. Goal
Increase daily engagement using effort-based gamification (streaks, badges) and build trust with Explainable AI (XAI) for the SRS algorithm.

## 2. Requirements
- UX-03: Adaptive Gamification & XAI

## 3. Context
- The Spaced Repetition System (SRS) is implemented but opaque to the user.
- There are no effort-based engagement mechanics like streaks or mastery badges yet.

## 4. Implementation Steps
- [ ] 01. Add `streaks` and `badges` tracking to the Supabase database schema via a new SQL migration.
- [ ] 02. Implement backend logic to update and calculate streaks on daily active sessions.
- [ ] 03. Build a `GamificationWidget` to display current streak and unlocked mastery badges in the dashboard.
- [ ] 04. Add an Explainable AI (XAI) tooltip to SRS recommendations, explaining *why* a topic is suggested (e.g., "Reviewing this increases retention by 40%").
