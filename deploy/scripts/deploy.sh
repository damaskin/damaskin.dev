#!/usr/bin/env bash
# damaskin.dev — server infrastructure (nginx container, certificate, CI entry point, cron). Idempotent.
# Run by scripts/deploy-infra.mjs after it uploads deploy/ to /opt/damaskin-dev/deploy; by hand — the same:
#   bash /opt/damaskin-dev/deploy/scripts/deploy.sh
# Site content is not touched here: releases arrive from CI through bin/ci-deploy.
set -euo pipefail

ROOT=/opt/damaskin-dev
DEPLOY="$ROOT/deploy"
EDGE=edge-nginx
compose() { docker compose -f "$DEPLOY/docker-compose.prod.yml" "$@"; }

echo "==> [1/5] directories, CI entry point"
mkdir -p "$ROOT/site/releases" "$ROOT/bin"
install -m 755 -o root -g root "$DEPLOY/bin/ci-deploy" "$ROOT/bin/ci-deploy"

echo "==> [2/5] certificate"
bash "$DEPLOY/scripts/certs.sh" ensure

echo "==> [3/5] damaskin-nginx"
compose up -d --remove-orphans
docker exec damaskin-nginx nginx -t
docker exec damaskin-nginx nginx -s reload

echo "==> [4/5] edge"
# After a recreate the container may get a new IP in edge-public — edge re-resolves its upstreams on reload.
if docker exec "$EDGE" nginx -t >/dev/null 2>&1; then
  docker exec "$EDGE" nginx -s reload && echo "edge reloaded"
else
  echo "WARN: edge nginx -t failed — edge left untouched" >&2
fi

echo "==> [5/5] certificate cron"
install -m 644 "$DEPLOY/cron/damaskin-cert" /etc/cron.d/damaskin-cert
bash "$DEPLOY/scripts/certs.sh" auto || true

compose ps
