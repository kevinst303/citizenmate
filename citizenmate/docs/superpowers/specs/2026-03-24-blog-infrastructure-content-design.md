# CitizenMate Blog Infrastructure & SEO Content Design

## 1. Overview
We are building a fully integrated, SEO-optimized blog inside the CitizenMate Next.js application using MDX (`next-mdx-remote` or standard `@next/mdx`). The goal is to drive organic search traffic by answering common Applicant questions, addressing their pain points (like high failure rates and frustration with inaccurate "trick" practice tests), and natively embedding CitizenMate conversion elements (like a practice question widget) directly into the reading experience.

## 2. Infrastructure Architecture (Option 2: MDX)

### Technologies
- **Next.js App Router** (`src/app/blog` and `src/app/blog/[slug]`).
- **MDX parsing** (`next-mdx-remote/rsc` or robust server-side MDX parsing strategy) to allow React components inside markdown.
- **Gray-Matter**: For parsing frontmatter (title, description, date, author, image, slug).
- **Custom MDX Components**:
  - `<QuizPreview />` or `<CallToAction />`: An interactive component injected mid-post to convert readers into users.
  - Custom `h1`, `h2`, `p`, `a`, `img` styling wrapping Tailwind Typography or custom classes.

### Content Storage
- Posts will be stored locally in `src/content/blog/` as `.mdx` files.

### Image Generation (Kie.ai)
- We will build a one-off developer script `scripts/generate-blog-images.ts` that iterates through the 20 blog topics, uses the existing `generate-image` API logic targeting `nano-banana-2`, and downloads the resulting images into `public/images/blog/`.
- The images will be referenced in the MDX frontmatter and rendered using Next.js `<Image />` for automatic optimization and LCP scores.

## 3. SEO Strategy & Content Topics
Recent research indicates a staggering one-third of applicants are failing the test in recent data rollouts. Furthermore, applicants are frustrated by unofficial free tests that use "literature teacher" trick wordplay, whereas the real test is clear and direct. CitizenMate's value proposition is providing *realistic, direct simulators* that mirror the real exam, saving users from anxiety and wasted application fees.

### The 20 SEO-Optimized Prompts

**Focus: Understanding the Stakes & Difficulty**
1. **Why One-Third of Applicants are Failing the Australian Citizenship Test in 2024/2025**
2. **How Hard is the Australian Citizenship Test Really? We Break Down the Data**
3. **The 5 Most Common Reasons People Fail the Australian Citizenship Test**
4. **What Happens if You Fail the Citizenship Test? Your Options and Next Steps Explained**

**Focus: Beating the System & Avoiding Traps**
5. **The Truth About Unofficial Citizenship Practice Tests: Are You Studying the Wrong Questions?**
6. **Are Citizenship Test Questions Trying to Trick You? Real Test vs Fake Practice Sites**
7. **Why Reading 'Our Common Bond' Isn't Enough: The Hidden Traps of the Citizenship Exam**
8. **English Not Your First Language? Decoding the Citizenship Test Without Tricky Wordplay**

**Focus: Key Test Categories**
9. **Australian Values Questions: How to Guarantee a 100% Score (And Why You Must)**
10. **Democracy and Law: The Most Confusing Concepts on the Australian Citizenship Test**
11. **The Top 10 'Australia and its People' Questions You Must Know for Your Test**
12. **Is the Australian Citizenship Test Changing in 2026? Here's What We know**

**Focus: Study Strategies & Time Management**
13. **The Ultimate 2-Week Study Plan for the Australian Citizenship Test**
14. **How to Balance Full-Time Work and Australian Citizenship Test Preparation**
15. **Don't Waste Your Application Fee: A Pre-Test Checklist for Australian Citizenship**
16. **How CitizenMate's AI Helps You Identify and Fix Your Weakest Study Areas Fast**

**Focus: Why CitizenMate? (Bottom of Funnel)**
17. **Free Online Tests vs. CitizenMate: Why Realistic Simulation Maximizes Your Pass Rate**
18. **Conquering Test Day Anxiety: How Our Simulation Features Prepare You For the Real Exam Environment**
19. **Behind the Scenes of the Australian Citizenship Exam: Format, Myths, and Realities**
20. **From Permanent Resident to Citizen: A Complete Guide to the Final Step**

## 4. Verification Plan
- Build the Next.js routes and confirm they render MDX files correctly.
- Ensure the custom `<QuizPreview>` or `<CTA>` component renders dynamically inside an `.mdx` file.
- Generate and verify the 20 `.mdx` files are accessible and have word counts > 500 words.
- Run the `generate-blog-images` script and verify images are downloaded and display correctly in local instances.
- Verify meta tags (`<title>`, `<meta name="description">`, `og:image`) correctly populate in the DOM.
