---
description: how to use NotebookLM as external memory for research, storing findings, and querying past knowledge
---

# Smart Research with NotebookLM

Use this workflow whenever you need to research a topic, store findings, or recall past decisions.

## Researching a New Topic

### Step 1: Check Existing Knowledge First

Before researching, check if a relevant notebook already exists:

```
List all my NotebookLM notebooks
```

If a relevant notebook exists, query it first:

```
Query the "[notebook name]" notebook: [your question]
```

### Step 2: Create a Research Notebook (If None Exists)

```
Create a NotebookLM notebook called "[Topic] Research"
```

### Step 3: Start Web Research

For fast results (~30s, ~10 sources):

```
Start fast web research on "[topic]" in the [notebook name] notebook
```

For deep research (~5min, ~40 sources):

```
Start deep web research on "[topic]" in the [notebook name] notebook
```

### Step 4: Review and Import Sources

After research completes:

```
Show research status for [notebook name]
Import the top sources into the notebook
```

### Step 5: Query Your Research

Now ask questions against the imported sources:

```
Query [notebook name]: What are the key findings about [specific question]?
```

### Step 6: Generate Artifacts (Optional)

Create shareable outputs:

```
Generate a briefing doc from [notebook name]
Generate an audio overview of [notebook name]
Create a mind map from [notebook name]
```

---

## Saving Decisions and Context

When you've made important decisions during a session:

```
Create a note in [notebook name] titled "Architecture Decision: [topic]" with content: [decision details and rationale]
```

## Cross-Project Queries

To search across ALL your project notebooks:

```
Query all notebooks: [your question]
```

Or query by tags:

```
Query notebooks tagged "project": [your question]
```
