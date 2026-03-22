---
description: how to bootstrap a new project with the 4-layer skills architecture
---

# Setup New Project

// turbo-all

This workflow sets up any new project with the 4-layer skills architecture for efficient AI agent operation.

## Step 1: Initialize Project Agent Directory

Create the `.agent/workflows/` directory in the project root:

```bash
mkdir -p .agent/workflows
```

## Step 2: Copy Agent Rules

Copy the AGENT.md to the new project:

```bash
cp /Volumes/home/Documents/App/AuTest/.agent/AGENT.md .agent/AGENT.md
```

## Step 3: Copy Workflows

Copy all workflow files to the new project:

```bash
cp /Volumes/home/Documents/App/AuTest/.agent/workflows/*.md .agent/workflows/
```

## Step 4: Verify Superpowers is Installed Globally

Check that Superpowers is installed:

```bash
gemini extensions list 2>/dev/null | grep -i superpowers || echo "⚠️ Superpowers not installed. Run: gemini extensions install https://github.com/obra/superpowers"
```

## Step 5: Initialize UI UX Pro Max (Frontend Projects Only)

If this is a frontend project, install the design skill:

```bash
uipro init --ai antigravity
```

Skip this step for backend-only or infrastructure projects.

## Step 6: Verify Awesome Skills Archive Exists

Confirm the skills archive is available:

```bash
ls ~/.gemini/antigravity/skills-archive/scripts/activate-skills.sh 2>/dev/null && echo "✅ Archive ready" || echo "⚠️ Not found. Run: git clone https://github.com/sickn33/antigravity-awesome-skills.git ~/.gemini/antigravity/skills-archive"
```

## Step 7: Create NotebookLM Project Notebook

Use the NotebookLM MCP to create a project notebook. Ask the agent:

```
Create a NotebookLM notebook titled "[Project Name] — Knowledge Base"
```

Then tag it for easy retrieval:

```
Tag the notebook with: project, [project-type], active
```

## Step 8: Verify Setup

Confirm everything is in place:

```bash
echo "=== Agent Config ===" && ls -la .agent/AGENT.md && echo "=== Workflows ===" && ls .agent/workflows/ && echo "=== Setup Complete ✅ ==="
```
