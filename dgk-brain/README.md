# DGK skills for Cognee Brain

Cognee Brain does not accept `.skill` (zip) files. These packs were unpacked and saved as Markdown.

## Upload these (easiest)

Upload every `dgk-*.md` file in this folder to Brain / `remember` as dataset `dgk-brain`.

Supported Cognee formats used here: `.md`

## Also included

`files/` keeps the original inner markdown (`SKILL.md` plus references) if you prefer uploading each file separately.

## How to ingest via API

```bash
for f in dgk-*.md; do
  curl -X POST http://127.0.0.1:8000/api/v1/remember \
    -F "data=@${f}" \
    -F "datasetName=dgk-brain" \
    -F "run_in_background=false"
done
```

`remember` needs `LLM_API_KEY` to build the graph.
