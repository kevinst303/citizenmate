#!/usr/bin/env python3
"""Add missing i18n keys to en.json for hardcoded English strings found in components."""
import json

with open('src/i18n/dictionaries/en.json', 'r') as f:
    en = json.load(f)

# --- NEW TOP-LEVEL SECTIONS ---

en['auth'] = {
    "title_sign_in": "Welcome back, mate!",
    "title_sign_up": "Join CitizenMate",
    "subtitle_sign_in": "Sign in to sync your progress across devices",
    "subtitle_sign_up": "Create an account to save your progress",
    "continue_google": "Continue with Google",
    "divider_label": "or continue with email",
    "email_label": "Email address",
    "email_placeholder": "Email address",
    "password_label": "Password",
    "password_placeholder": "Password",
    "sign_in_button": "Sign In",
    "create_account_button": "Create Account",
    "no_account": "Don't have an account?",
    "have_account": "Already have an account?",
    "sign_up_link": "Sign up",
    "sign_in_link": "Sign in",
    "sign_in_failed": "Sign-in failed",
    "sign_in_failed_desc": "Something went wrong. Please try again.",
    "welcome_back_toast": "Welcome back, mate! 🇦🇺",
    "progress_synced": "Your progress is synced.",
    "sign_up_failed": "Sign-up failed",
    "check_email": "Check your email to confirm your account, mate! 📧",
    "check_email_toast": "Check your email! 📧",
    "confirm_account": "Confirm your account to get started.",
    "something_wrong": "Something went wrong. Please try again.",
    "google_sign_in_failed": "Google sign-in failed. Please try again.",
}

en['chat'] = {
    "suggestion_1": "What are Australian values?",
    "suggestion_2": "Explain the three levels of government",
    "suggestion_3": "Tell me about Indigenous heritage",
    "suggestion_4": "What freedoms do Australians have?",
    "follow_up_tell_more": "Tell me more",
    "follow_up_quiz_me": "Quiz me on this",
    "follow_up_why_important": "Why is this important?",
    "thinking_reading": "Reading your question…",
    "thinking_searching": "Searching my notes…",
    "thinking_composing": "Composing answer…",
    "daily_limit_title": "Daily AI questions reached",
    "daily_limit_desc": "Unlock unlimited questions with CitizenMate Pro",
    "last_question_title": "Last question for today",
    "last_question_desc": "Make it a good one, mate!",
    "open_tutor": "Open study tutor",
    "tutor_name": "CitizenMate Tutor",
    "tutor_subtitle": "Your study buddy",
    "close_chat": "Close chat",
    "greeting": "G'day! 🇦🇺 I'm your CitizenMate Tutor. Ask me anything about the Australian citizenship test.",
    "source_label": "Source: Our Aussie Citizenship Guide",
    "daily_limit_banner": "Daily limit reached",
    "daily_limit_banner_desc": "You've reached your free 3 questions for today.",
    "unlock_unlimited": "Unlock Unlimited Tutor Access",
    "placeholder_limit": "Daily limit reached...",
    "placeholder_default": "Ask about the citizenship test...",
    "send_message": "Send message",
    "questions_remaining": "question(s) remaining today",
    "questions_remaining_singular": "question remaining today",
}

en['cookie_consent'] = {
    "title": "We respect your privacy",
    "description": "We use essential cookies to make CitizenMate work. With your consent, we also use analytics cookies to understand how you use our service.",
    "learn_more": "Learn more",
    "accept_all": "Accept all",
    "essential_only": "Essential only",
    "close_banner": "Close cookie banner",
}

en['install'] = {
    "installed_toast": "CitizenMate installed! 🇦🇺",
    "installed_desc": "Launch from your home screen for quick access.",
    "title": "Install CitizenMate",
    "subtitle": "Add to your home screen",
    "dismiss": "Dismiss install prompt",
    "desc_1": "Get the full app experience — study offline, quick launch.",
    "desc_2": "Access all 15 mock tests and bilingual study mode.",
    "step_1": "Tap the Share button in Safari",
    "step_2": "Add to Home Screen",
    "got_it": "Got it",
    "install_button": "Install",
    "not_now": "Not now",
}

en['test_date'] = {
    "today": "Today!",
    "tomorrow": "Tomorrow!",
    "days_label": "days",
    "set_prompt": "Set your test date to get a personalised countdown",
    "countdown_suffix": " until your test",
    "please_select_date": "Please select a date.",
    "future_date_only": "Please choose a future date.",
    "saved_toast": "Test date saved! 📅",
    "one_day_to_go": "1 day to go — you've got this, mate!",
    "days_to_go": "days to go — let's make them count!",
    "cleared_toast": "Test date cleared",
    "set_new_anytime": "You can set a new one anytime.",
    "really_soon": "That's really soon — let's make every study session count! 💪",
    "two_weeks": "Two weeks is a solid study window. You've got this, mate!",
    "one_month": "Great timing — one month is perfect for focused preparation.",
    "plenty_of_time": "Plenty of time to prepare thoroughly. Let's build your confidence!",
    "modal_title": "Set Your Test Date",
    "modal_subtitle": "We'll build your study plan around it",
    "date_label": "When is your citizenship test?",
    "save_date": "Save Date",
    "remove_date": "Remove",
    "not_booked": "I haven't booked my test yet",
    "calendar_alt": "A marked calendar",
}

en['settings'] = {
    "hero_title": "Profile Settings",
    "hero_breadcrumb_home": "Home",
    "hero_breadcrumb_settings": "Settings",
    "hero_desc": "Manage your account, subscription, and study preferences.",
    "hero_badge": "Account",
    "personal_info": "Personal Information",
    "full_name": "Full Name",
    "email_address": "Email Address",
    "auth_google": "Authenticated via Google",
    "auth_google_desc": "Your profile information is synced securely from your Google account.",
    "test_schedule": "Test Schedule",
    "manage_test_date": "Manage your citizenship test date",
    "change_date": "Change Date",
    "current_test_date": "Current Test Date",
    "not_set": "Not set yet",
    "subscription": "Subscription",
    "manage_plan": "Manage your plan and billing",
    "upgrade_to_premium": "Upgrade to Premium",
    "current_plan": "Current Plan",
    "plan_active": "Active",
    "plan_sprint_pass_free": "Sprint Pass (Free)",
    "plan_premium_access": "You have full access to all premium features.",
    "plan_expires_on": "Your access expires on",
    "plan_free_tier": "You are currently on the free Sprint Pass. Upgrade to unlock all premium features.",
    "danger_zone": "Danger Zone",
    "sign_out_title": "Sign Out of CitizenMate",
    "sign_out_desc": "End your current session on this device. You will need to sign in again to access your account.",
    "sign_out_button": "Sign Out",
}

en['blog'] = {
    "hero_title": "Blog",
    "hero_desc": "Everything you need to know to pass the Australian Citizenship Test in 2026.",
    "breadcrumb_home": "Home",
    "breadcrumb_blog": "Blog",
    "no_posts": "No posts available right now.",
}

en['question_review'] = {
    "values_badge": "Values",
    "your_answer": "your answer",
    "explanation": "Explanation",
    "reference": "Reference:",
    "unanswered": "You didn't answer this question",
}

# --- EXTEND EXISTING SECTIONS ---

# landing - add faq, stats-hero, social-proof, inline-cta, interactive-demo, image alts
en['landing'].update({
    # FAQ
    "faq_badge": "FAQ",
    "faq_heading": "Frequently asked questions",
    "faq_q1": "Is CitizenMate an official government app?",
    "faq_a1": "No. CitizenMate is an independent study tool and is not affiliated with or endorsed by the Australian Government. We build our content based on the publicly available \"Our Common Bond\" booklet published by the Department of Home Affairs.",
    "faq_q2": "How is the real citizenship test structured?",
    "faq_a2": "The Australian citizenship test consists of 20 multiple-choice questions drawn from the \"Our Common Bond\" booklet. You have 45 minutes to complete it. There are three topic areas: Australia and its people, Australia's democratic beliefs/rights/liberties, and Government and the law. You must answer all 5 Australian values questions correctly AND score at least 75% (15/20) overall.",
    "faq_q3": "What languages does CitizenMate support?",
    "faq_a3": "We currently support English, Spanish, Hindi, Chinese, and Arabic in our UI. Our study mode offers English and Chinese side-by-side with bilingual content.",
    "faq_q4": "How is CitizenMate different from other practice test sites?",
    "faq_a4": "Most citizenship test prep tools are basic quiz apps with outdated questions. CitizenMate uses AI to personalise your study, offers bilingual study modes, provides detailed explanations for every answer, and tracks your readiness with topic-level analytics.",
    "faq_q5": "What's included in the free tier?",
    "faq_a5": "The free tier includes 1 full mock test with results and explanations, access to our bilingual study guide, 3 AI tutor questions per day, and progress tracking.",
    "faq_q6": "What is the Exam Sprint Pass?",
    "faq_a6": "The Exam Sprint Pass ($29.99) gives you full CitizenMate Pro access for 60 days — all 15 mock tests, unlimited AI tutor, bilingual study, analytics, and spaced repetition. One-time payment, no subscription.",
    "faq_contact_title": "Still have questions?",
    "faq_contact_desc": "We're here to help you on your citizenship journey.",
    "faq_contact_button": "Contact Us",
    # Stats Hero
    "stats_hero_badge": "Proven Results",
    "stats_hero_title": "Study with Confidence",
    "stats_hero_desc": "Our AI-powered platform adapts to your learning style, helping you master every topic.",
    "stats_hero_stat_1": "97% first-attempt pass rate",
    "stats_hero_stat_2": "Official test format questions",
    "stats_hero_stat_3": "AI-powered study guidance",
    "stats_hero_students_label": "Students helped since 2024",
    "stats_hero_cta": "Discover More",
    "stats_hero_question_title": "Have a question?",
    "stats_hero_question_desc": "We value your time, so we strive to provide fast and helpful support to all aspiring citizens.",
    "stats_hero_question_cta": "Get in Touch",
    "stats_hero_image_alt": "Students studying together for the Australian citizenship test",
    # Social Proof
    "testimonials_badge": "Testimonials",
    "testimonials_title": "Loved by new Australians",
    "testimonials_subtitle": "Join thousands of people who passed their citizenship test with confidence.",
    "testimonial_1_name": "Priya Sharma",
    "testimonial_1_role": "New citizen from India",
    "testimonial_1_text": "I was so nervous about the values section because English isn't my first language. The bilingual study mode let me learn in Hindi first, then practice in English. I passed on my first attempt!",
    "testimonial_2_name": "Wei Chen",
    "testimonial_2_role": "New citizen from China",
    "testimonial_2_text": "The Smart Practice feature identified exactly which topics I was weak on. Instead of wasting time on stuff I already knew, I focused on my weak areas and passed easily.",
    "testimonial_3_name": "Ahmed Al-Rashid",
    "testimonial_3_role": "New citizen from Lebanon",
    "testimonial_3_text": "The mock tests felt exactly like the real thing. Same number of questions, same time limit. When I sat the actual test, there were zero surprises. Highly recommend!",
    "testimonial_4_name": "Elena Rodriguez",
    "testimonial_4_role": "New citizen from Spain",
    "testimonial_4_text": "The AI tutor was incredibly helpful. Whenever I got a question wrong, I could ask why and get a detailed explanation. It was like having a personal teacher available 24/7.",
    "testimonial_5_name": "Kwame Osei",
    "testimonial_5_role": "New citizen from Ghana",
    "testimonial_5_text": "I had only 3 weeks to prepare and the readiness score gave me confidence. Seeing the percentage go up each day kept me motivated. Passed with 19/20!",
    "testimonial_6_name": "Mateo Silva",
    "testimonial_6_role": "New citizen from Brazil",
    "testimonial_6_text": "The Sprint Pass was worth every cent. Having unlimited mock tests meant I could practice until I was consistently scoring over 90%. Walked into the test centre feeling completely prepared.",
    "testimonial_7_name": "Yuki Tanaka",
    "testimonial_7_role": "New citizen from Japan",
    "testimonial_7_text": "I loved that the questions came with direct references to the Our Common Bond booklet. If I got something wrong, I knew exactly which page to review. Very thorough.",
    "testimonial_8_name": "Samir Patel",
    "testimonial_8_role": "New citizen from India",
    "testimonial_8_text": "The test date countdown was a game-changer. It broke down exactly what I should study each week. By test day, I had covered everything and felt completely ready.",
    "testimonials_rating": "Average rating",
    "testimonials_students": "Students helped",
    "testimonials_pass_rate": "Pass rate",
    "testimonials_cta_practice": "Start Free Practice",
    "testimonials_cta_pricing": "View Pricing",
    # Inline CTA
    "inline_cta_title": "Ready to pass your citizenship test?",
    "inline_cta_desc": "Join thousands of students preparing smarter with CitizenMate.",
    "inline_cta_button": "Start for free",
    # Interactive Demo
    "demo_heading": "Experience CitizenMate",
    "demo_subtitle": "We believe every aspiring citizen is unique, and we pride ourselves on delivering a personalised study experience.",
    "demo_tab_1_label": "Smart Practice Tests",
    "demo_tab_1_badge": "Real Test Format",
    "demo_tab_1_title": "Practice with confidence",
    "demo_tab_1_desc": "20 questions, 45 minutes — just like the real Australian citizenship test. Timed, scored, and instantly graded with detailed explanations.",
    "demo_tab_1_cta": "Start Free Practice",
    "demo_tab_1_feature_badge": "AI-Powered",
    "demo_tab_1_check_1": "Official test format",
    "demo_tab_1_check_2": "Detailed explanations",
    "demo_tab_1_check_3": "Instant results",
    "demo_tab_1_image_alt": "Student taking a practice test on a tablet",
    "demo_tab_2_label": "Bilingual Study Mode",
    "demo_tab_2_badge": "15+ Languages",
    "demo_tab_2_title": "Study in your language",
    "demo_tab_2_desc": "Our Common Bond content available side-by-side in English and your preferred language. Understand concepts deeply before you test in English.",
    "demo_tab_2_cta": "Start Studying",
    "demo_tab_2_feature_badge": "Inclusive Learning",
    "demo_tab_2_check_1": "Side-by-side translations",
    "demo_tab_2_check_2": "15+ languages supported",
    "demo_tab_2_check_3": "Official content",
    "demo_tab_2_image_alt": "Bilingual study interface showing content in two languages",
    "demo_tab_3_label": "Progress Analytics",
    "demo_tab_3_badge": "Know When You're Ready",
    "demo_tab_3_title": "Track your readiness",
    "demo_tab_3_desc": "Track your progress topic by topic. See your strengths, identify gaps, and know exactly when you're at 95%+ readiness to sit the real test.",
    "demo_tab_3_cta": "View Demo",
    "demo_tab_3_feature_badge": "Smart Insights",
    "demo_tab_3_check_1": "Topic-by-topic tracking",
    "demo_tab_3_check_2": "AI readiness score",
    "demo_tab_3_check_3": "Study recommendations",
    "demo_tab_3_image_alt": "Dashboard showing progress tracking and readiness score",
    # Image alts
    "hero_image_alt": "Diverse group of people studying together for the Australian citizenship test",
    "features_smart_image_alt": "Confident woman taking a practice citizenship test on a tablet",
    "features_bilingual_image_alt": "Man studying with bilingual books in multiple languages at an Australian cafe",
    "features_ready_image_alt": "Woman celebrating progress on her dashboard with achievement badges",
    "hiw_image_alt": "CitizenMate study interface",
    "footer_logo_alt": "CitizenMate Logo",
    "footer_social_facebook": "Facebook",
    "footer_social_twitter": "Twitter",
    "footer_social_instagram": "Instagram",
})

# dashboard
en['dashboard'].update({
    "hero_title": "Your Readiness Score",
    "hero_breadcrumb_home": "Home",
    "hero_breadcrumb_dashboard": "Dashboard",
    "hero_badge": "Your Dashboard",
    "unlock_premium": "Unlock Premium Features",
    "unlock_premium_desc": "Get unlimited mock tests, AI tutor access, and advanced analytics.",
    "upgrade_now": "Upgrade Now",
    "dismiss_banner": "Dismiss upgrade banner",
    "ai_insight": "AI Insight",
    "values_not_ready": "Australian Values — Not Yet Ready",
    "values_not_ready_desc": "All 5 values questions must be answered correctly to pass the citizenship test. Study this topic carefully.",
    "study_values_now": "Study Now",
    "topic_mastery": "Topic Mastery",
    "quiz_label": "Quiz",
    "study_label": "Study",
    "analytics_locked": "Detailed Analytics Locked",
    "analytics_locked_desc": "Upgrade to Premium to see your detailed strengths and weaknesses.",
    "unlock_analytics": "Unlock Analytics",
    "quick_actions": "Quick Actions",
    "action_smart_practice": "Smart Practice",
    "action_smart_practice_desc": "AI-powered weak area focus",
    "action_mock_test": "Take a Mock Test",
    "action_mock_test_desc": "20 questions, 45 minutes",
    "action_continue_study": "Continue Studying",
    "action_continue_study_desc": "Pick up where you left off",
    "action_review_values": "Review Values",
    "action_review_values_desc": "Must pass 5/5 to succeed",
    "recommended": "Recommended",
    "stat_tests_taken": "Tests Taken",
    "stat_best_score": "Best Score",
    "stat_study_progress": "Study Progress",
    "stat_readiness": "Readiness",
})

# practice
en['practice'].update({
    "hero_breadcrumb": "Home / Practice",
    "tip_1_full": "All 5 values questions must be answered correctly to pass. Study this topic thoroughly before your test.",
    "tip_2_full": "at least 15 out of 20",
    "tip_3_full": "45 minutes — that's about 2 minutes per question. Pace yourself and review your flagged questions at the end.",
    "tip_4_full": "Flag questions you're unsure about and come back to them. Don't let one tricky question consume your time.",
    "smart_premium_title": "Smart Practice",
    "smart_premium_badge": "Premium",
    "smart_premium_desc": "Upgrade to Sprint Pass to unlock AI-powered spaced repetition practice.",
})

# quiz
en['quiz'].update({
    "submit_test_button": "Submit Test",
})

# study
en['study'].update({
    "key_facts": "Key Facts",
    "key_facts_zh": "关键事实",
    "mark_complete": "Mark as complete",
    "mark_incomplete": "Mark as incomplete",
    "english_label": "English",
    "chinese_label": "中文",
    "related_question": "related practice question",
    "related_questions": "related practice questions",
    "available_suffix": "available",
})

# referral
en['referral'].update({
    "share_title": "CitizenMate — Ace your Australian Citizenship Test",
    "code_label": "Your Promo Code",
    "code_hint": "Friends use this code at checkout for 20% off",
    "generating": "Generating code...",
    "generate": "Generate Your Promo Code",
    "link_label": "Referral Link",
    "share_whatsapp": "WhatsApp",
    "share_button": "Share",
    "max_reached": "Max reached 🎉",
    "max_reached_desc": "Almost there! 1 more mate and you've maxed out your rewards!",
    "days_earned": "days earned",
    "referral_help_title": "Help a Mate",
    "referral_help_desc": "Share your code with a friend. They get 20% off their Sprint Pass, you get 7 days added to yours. Win-win, mate!",
    # referral-cta
    "cta_smashed_headline": "Smashed it! Know someone else preparing?",
    "cta_smashed_subtext": "Share your code and they'll get 20% off. You'll earn 7 extra days of premium access.",
    "cta_smashed_button": "Share with a mate",
    "cta_climbing_headline": "Your readiness is climbing! Help a mate start theirs.",
    "cta_climbing_subtext": "Refer a friend — they get 20% off, you get 7 extra premium days. Everyone wins.",
    "cta_climbing_button": "Invite a mate",
    "cta_first_quiz_headline": "First quiz done — nice one!",
    "cta_first_quiz_subtext": "Know someone else preparing for the citizenship test? Share your referral code.",
    "cta_first_quiz_button": "Share your code",
    "cta_progress_headline": "Great progress! Studying with a mate helps.",
    "cta_progress_subtext": "Invite a friend to CitizenMate — they save 20%, you earn 7 extra days.",
    "cta_progress_button": "Help a mate",
    "cta_dismiss": "Dismiss",
    "cta_maybe_later": "Maybe later",
    "cta_share_template": "I'm using CitizenMate to study for the Australian citizenship test. Use my code {code} for 20% off your Sprint Pass: {url}",
    "cta_share_title": "CitizenMate",
})

# premium
en['premium'].update({
    "unlock_with_sprint_pass": "Unlock with Sprint Pass",
    "unlock_heading": "Unlock {feature}",
    "gate_desc": "Get the Exam Sprint Pass for 60 days of full access — one payment, no subscription.",
    "gate_cta_full": "Get Sprint Pass — A$29.99",
    "gate_fineprint": "One-time payment · 60 days access · No subscription",
    "gate_title": "Premium Feature",
    "gate_title_desc": "Upgrade to access {feature} and pass your citizenship test with confidence.",
    "premium_badge": "Premium",
})

# common
en['common'].update({
    "loading_ellipsis": "Loading…",
})

# dashboard sub-components  
en['life_in_australia'] = {
    "title": "Life in Australia",
    "subtitle": "Live data to help you settle into your new home",
}

with open('src/i18n/dictionaries/en.json', 'w') as f:
    json.dump(en, f, indent=2, ensure_ascii=False)
    f.write('\n')

print("en.json updated successfully")
