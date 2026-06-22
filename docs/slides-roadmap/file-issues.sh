#!/usr/bin/env bash
# Generate per-issue markdown + INDEX.md from manifest.json, and optionally file
# everything to GitHub (labels, milestones, issues).
#
# Usage:
#   ./file-issues.sh --local-only     # only (re)generate markdown files in issues/
#   ./file-issues.sh --dry-run        # print what would be created on GitHub
#   ./file-issues.sh --create REPO    # create labels, milestones, issues on REPO
#                                     #   (enables Issues on the repo first)
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MANIFEST="$DIR/issues/manifest.json"
ISSUES_DIR="$DIR/issues"

gen_markdown() {
  echo "Generating markdown from $MANIFEST ..."
  {
    echo "# Slides Fidelity — Issue Index"
    echo
    echo "Generated from \`manifest.json\`. See \`../README.md\` for the phase plan."
    echo
    echo "| # | Issue | Pillars | Phase |"
    echo "|---|-------|---------|-------|"
    jq -r '.issues[] | "| \(.slug) | \(.title) | \([.labels[]|select(startswith("fidelity:"))|sub("fidelity:";"")]|join(", ")) | \([.labels[]|select(startswith("phase:"))]|join(""))|" ' "$MANIFEST"
  } > "$ISSUES_DIR/INDEX.md"

  jq -c '.issues[]' "$MANIFEST" | while read -r issue; do
    slug=$(echo "$issue" | jq -r '.slug')
    title=$(echo "$issue" | jq -r '.title')
    labels=$(echo "$issue" | jq -r '.labels|join(", ")')
    milestone=$(echo "$issue" | jq -r '.milestone')
    body=$(echo "$issue" | jq -r '.body')
    {
      echo "# $title"
      echo
      echo "> **Labels:** $labels  "
      echo "> **Milestone:** $milestone"
      echo
      echo "$body"
    } > "$ISSUES_DIR/$slug.md"
  done
  echo "Wrote $(jq '.issues|length' "$MANIFEST") issue files + INDEX.md to $ISSUES_DIR"
}

create_on_github() {
  local repo="$1"
  echo "Enabling Issues on $repo ..."
  gh api -X PATCH "repos/$repo" -F has_issues=true >/dev/null

  echo "Creating labels ..."
  jq -c '.labels[]' "$MANIFEST" | while read -r l; do
    name=$(echo "$l" | jq -r '.name'); color=$(echo "$l" | jq -r '.color'); desc=$(echo "$l" | jq -r '.description')
    gh label create "$name" --repo "$repo" --color "$color" --description "$desc" --force >/dev/null 2>&1 || true
  done

  echo "Creating milestones ..."
  jq -c '.milestones[]' "$MANIFEST" | while read -r m; do
    title=$(echo "$m" | jq -r '.title'); desc=$(echo "$m" | jq -r '.description')
    # gh has no milestone command; use the API. Ignore "already_exists".
    gh api "repos/$repo/milestones" -f title="$title" -f description="$desc" >/dev/null 2>&1 || true
  done

  echo "Creating issues ..."
  jq -c '.issues[]' "$MANIFEST" | while read -r issue; do
    title=$(echo "$issue" | jq -r '.title')
    milestone=$(echo "$issue" | jq -r '.milestone')
    body=$(echo "$issue" | jq -r '.body')
    label_args=()
    while read -r lab; do label_args+=(--label "$lab"); done < <(echo "$issue" | jq -r '.labels[]')
    url=$(gh issue create --repo "$repo" --title "$title" --body "$body" --milestone "$milestone" "${label_args[@]}")
    echo "  created: $url"
  done
}

case "${1:-}" in
  --local-only) gen_markdown ;;
  --dry-run)
    gen_markdown
    echo; echo "DRY RUN — would create on GitHub:"
    echo "  labels:     $(jq '.labels|length' "$MANIFEST")"
    echo "  milestones: $(jq '.milestones|length' "$MANIFEST")"
    echo "  issues:     $(jq '.issues|length' "$MANIFEST")"
    ;;
  --create)
    [ -n "${2:-}" ] || { echo "usage: $0 --create <owner/repo>"; exit 1; }
    gen_markdown
    create_on_github "$2"
    ;;
  *) echo "usage: $0 [--local-only | --dry-run | --create <owner/repo>]"; exit 1 ;;
esac
