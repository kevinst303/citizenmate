---
description: Global agent instructions for efficient workflow with layered skills and NotebookLM memory
---

# Agent Operating Rules

## Memory-First Principle
Before researching anything the user has asked about before, **always check NotebookLM first**:
1. Run `mcp_notebooklm_notebook_list` to see existing notebooks
2. Run `mcp_notebooklm_cross_notebook_query` with the user's question
3. Only do fresh research if no relevant notebooks exist

## Context Budget Rules
- **Never load more than 20 active skills** at any time
- Prefer MCP tool calls over pasting long documents into conversation
- When given a long document/URL to analyze, add it as a NotebookLM source and query it via MCP

## Skill Usage Priority
1. **NotebookLM MCP** (Layer 0) — External memory, zero context cost. Use for:
   - Storing research findings between sessions
   - Querying past decisions and architecture notes
   - Generating reports, podcasts, mind maps for stakeholders
2. **Superpowers** (Layer 1) — Always active. Use `brainstorming` before coding, `writing-plans` before implementing, `verification-before-completion` before marking done
3. **UI UX Pro Max** (Layer 2) — Auto-activates for frontend work
4. **Awesome Skills bundles** (Layer 3) — Only activate specific bundles when needed, clear when done

## Research Workflow
When the user asks to research a topic:
1. Create a NotebookLM notebook for the topic
2. Use `research_start` (web/drive) to find sources
3. Poll `research_status` until complete
4. Import relevant sources with `research_import`
5. Query the notebook for answers
6. Save key findings as notes in the notebook for future sessions

## Session End Protocol
Before ending a complex session:
1. Save important decisions/findings to NotebookLM as notes
2. Tag notebooks for easy retrieval: `mcp_notebooklm_tag`
3. Clear any Awesome Skills bundles that were activated

## Project Setup Checklist
For any new project, ensure:
- [ ] NotebookLM project notebook exists
- [ ] UI UX Pro Max initialized (if frontend project)
- [ ] Superpowers installed globally
- [ ] Awesome Skills archive available at `~/.gemini/antigravity/skills-archive`
