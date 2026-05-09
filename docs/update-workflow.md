# Content Update Workflow

This workflow is mandatory for human and agent updates.

## Source Priority

1. Company filings, annual reports, 10-K/20-F, earnings releases, earnings call transcripts, official investor presentations.
2. Regulator, exchange, or government sources.
3. Market research from reputable firms.
4. News and sell-side commentary as supporting context only.

News or commentary cannot be the only source for a score/status change.

## Company Update Steps

1. Read `content/nodes/<node_id>.md`.
2. Read the model referenced by `model_id`, if present.
3. Read existing archive summaries.
4. Check `updated_at`, `data_as_of`, status, scores, and score reasons.
5. Gather new source material.
6. Decide whether the update is material.
7. If material, archive the old node/model before editing.
8. Update the current node and model.
9. Run `npm run validate`.
10. Run `npm run build-content`.
11. Summarize changed files, sources, changed assumptions, score/status changes, archive path, and unresolved uncertainty.

## Material Change Rules

Create an archive before editing if any of these change:

- status,
- any score value or score reason,
- buy thesis,
- demand model parameters,
- valuation interpretation,
- expectation gap judgment,
- major risks or thesis failure conditions.

Typo fixes and source formatting changes do not require an archive.

## Archive Format

Use:

```text
content/archive/<node_id>/<version_date>/node.md
content/archive/<node_id>/<version_date>/model.json
content/archive/<node_id>/<version_date>/summary.json
```

`model.json` is required only if that version has a model.
