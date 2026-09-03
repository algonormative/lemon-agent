#!/usr/bin/env bash
# UA matrix over the deployed machine-readable surfaces. Free discovery paths
# only — no billed calls. Run after the owner deploys worker/ ; every cell
# should be 200.  Usage: scripts/probe-ua.sh [host]
set -uo pipefail
HOST="${1:-https://lemon-agent.dev}"
PATHS=(/llms.txt /catalog.json /robots.txt /sitemap-index.xml /sitemap-0.xml)
UAS=("Python-urllib/3.14" "python-requests/2.32" "curl/8" "node" "")

printf '%-24s' "$HOST"
for ua in "${UAS[@]}"; do printf '%-22s' "${ua:-<empty>}"; done
echo
for p in "${PATHS[@]}"; do
  printf '%-24s' "$p"
  for ua in "${UAS[@]}"; do
    code=$(curl -sS -o /dev/null -w '%{http_code}' -A "$ua" "$HOST$p" || echo ERR)
    printf '%-22s' "$code"
  done
  echo
done
