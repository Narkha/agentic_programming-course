mkdir -p .cursor/rules && {
  echo '---'
  echo 'description: Global agents rules'
  echo 'globs: "**/*"'
  echo '---'
  cat agents.md
} > .cursor/rules/agents.mdc
