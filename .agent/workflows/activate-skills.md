---
description: how to activate and deactivate Awesome Skills bundles to stay under context budget
---

# Activate Skills Bundles

// turbo-all

Use this workflow to load specific skill bundles from the Awesome Skills archive without overwhelming the agent's context.

## Available Bundles

| Bundle | Use Case |
|--------|----------|
| `Web Wizard` | Frontend, Next.js, CSS, responsive design |
| `Security Engineer` | Auth, OWASP, API security |
| `Integration & APIs` | REST, webhooks, third-party services |
| `OSS Maintainer` | Open source project management |

## Activating a Bundle

### Step 1: Navigate to the Archive

```bash
cd ~/.gemini/antigravity/skills-archive
```

### Step 2: Activate the Bundle You Need

```bash
./scripts/activate-skills.sh "Web Wizard"
```

To activate multiple bundles:

```bash
./scripts/activate-skills.sh "Web Wizard" "Security Engineer"
```

### Step 3: Verify What's Active

```bash
ls ~/.gemini/antigravity/skills/ 2>/dev/null | head -30
```

## Clearing Active Bundles

**Always clear bundles when you're done with a task** to free up context:

```bash
cd ~/.gemini/antigravity/skills-archive && ./scripts/activate-skills.sh --clear
```

## Rules
- **Never activate more than 2 bundles** at the same time
- **Always clear** when switching to a different type of work
- If the agent feels slow or loses context, **clear bundles first**
