---
description: how to install all 4 layers of the skills architecture from scratch (one-time global setup)
---

# First-Time Setup — Install All Tools

Run this workflow once to set up the entire 4-layer skills architecture on your machine.

## Prerequisites
- macOS with Homebrew
- Node.js / npm installed
- Python / pip installed
- Gemini CLI installed

## Layer 0: NotebookLM MCP Server

### Step 1: Install the package

```bash
pip install notebooklm-mcp-cli
```

### Step 2: Authenticate

```bash
nlm login
```

### Step 3: Add to Antigravity

```bash
nlm setup add antigravity
```

### Step 4: Verify

```bash
nlm notebook list
```

---

## Layer 1: Superpowers (Global Workflow Skills)

### Step 5: Install via Gemini extensions

```bash
gemini extensions install https://github.com/obra/superpowers
```

### Step 6: Verify

Start a new Gemini session and ask it to plan a feature. It should automatically use the `brainstorming` and `writing-plans` skills.

---

## Layer 2: UI UX Pro Max (Per-Project Design Intelligence)

### Step 7: Install the CLI globally

```bash
npm install -g uipro-cli
```

### Step 8: Initialize in your current project

```bash
cd /path/to/your/project
uipro init --ai antigravity
```

Repeat step 8 for each frontend project.

---

## Layer 3: Awesome Skills Archive (On-Demand Bundles)

### Step 9: Clone to archive folder

```bash
git clone https://github.com/sickn33/antigravity-awesome-skills.git ~/.gemini/antigravity/skills-archive
```

### Step 10: Test activation

```bash
cd ~/.gemini/antigravity/skills-archive
./scripts/activate-skills.sh "Web Wizard"
```

### Step 11: Clear test activation

```bash
./scripts/activate-skills.sh --clear
```

---

## Final Verification

```bash
echo "=== Layer 0: NotebookLM ===" && nlm --version 2>/dev/null && echo "✅" || echo "❌ Not installed"
echo "=== Layer 1: Superpowers ===" && gemini extensions list 2>/dev/null | grep -i super && echo "✅" || echo "❌ Not installed"  
echo "=== Layer 2: UI UX Pro Max ===" && uipro --version 2>/dev/null && echo "✅" || echo "❌ Not installed"
echo "=== Layer 3: Awesome Skills ===" && ls ~/.gemini/antigravity/skills-archive/scripts/ 2>/dev/null && echo "✅" || echo "❌ Not cloned"
```
