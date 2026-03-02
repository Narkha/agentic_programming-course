# Rules

- Write all code, comments, docs, commits, and tests in English
- Write self-documenting code — never add explanatory comments
- Use inclusive terms: allowlist/blocklist, primary/replica
- Never use mocks outside test files

# CLI

Use `ast-grep --lang <lang> -p '<pattern>'` for code search (prefer over `rg`/`grep`).
Use `fd` for files, `rg` for text, `tree` for structure, `jq`/`yq` for data, `fzf` for filtering.
