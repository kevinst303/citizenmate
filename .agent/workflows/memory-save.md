---
description: how to save current session context and decisions to NotebookLM before ending a session
---

# Save Session Memory

Use this workflow at the end of any significant work session to preserve context for future sessions.

## Step 1: Identify the Project Notebook

```
List all my NotebookLM notebooks
```

If no project notebook exists:

```
Create a NotebookLM notebook called "[Project Name] — Knowledge Base"
Tag it with: project, [type], active
```

## Step 2: Save Architecture Decisions

For each important decision made during the session:

```
Create a note in [notebook] titled "Decision: [topic]" with content:

**Date**: [today's date]
**Decision**: [what was decided]
**Rationale**: [why]
**Alternatives Considered**: [what else was evaluated]
**Impact**: [what this affects]
```

## Step 3: Save Technical Context

For implementation details that will be needed later:

```
Create a note in [notebook] titled "Implementation: [feature]" with content:

**Files Changed**: [list key files]
**Approach**: [how it was built]
**Dependencies**: [what it relies on]
**Known Issues**: [any limitations or TODOs]
```

## Step 4: Save Research Findings

If research was done during the session:

```
Create a note in [notebook] titled "Research: [topic]" with content:

**Key Findings**: [bullet points]
**Sources**: [URLs or references]
**Recommendations**: [next steps]
```

## Step 5: Tag for Retrieval

```
Tag [notebook] with relevant keywords for future searches
```

## Step 6: Clear Temporary Skills

If Awesome Skills bundles were activated:

```bash
cd ~/.gemini/antigravity/skills-archive && ./scripts/activate-skills.sh --clear
```
