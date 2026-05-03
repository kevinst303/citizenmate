---
title: "Advanced Gamification (Streaks)"
trigger_condition: "When prioritizing features to increase daily active users (DAU) and retention"
planted_date: "2026-05-03"
---

# Advanced Gamification (Streaks)

To increase user retention and daily active users, implement a Duolingo-style daily streak tracker. 
Users must complete at least one quiz or study session a day to maintain their streak.

This involves tracking `last_activity_date` and `current_streak` in the Supabase user profile, and displaying a streak flame icon in the global navigation bar.
