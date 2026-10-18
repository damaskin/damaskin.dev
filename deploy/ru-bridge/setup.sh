#!/usr/bin/env bash
# damaskin.dev on ru-bridge: installs / updates its own files there and runs the automation right away. Idempotent.
# From the work machine: npm run deploy:bridge (uploads this folder to /tmp/damaskin-bridge and runs this script).
#
#   /etc/damaskin-bridge/full.conf    ← damaskin-bridge.conf
#   /etc/damaskin-bridge/auto.sh      — cron every 15 minutes (/etc/cron.d/damaskin-bridge): installs :80, waits
#                                       for DNS, issues the certificate, enables :443 (details — in it)
#   /etc/logrotate.d/damaskin-bridge  ← logrotate
# Once :443 is enabled, sites-enabled/zz-damaskin-bridge.conf is updated from full.conf too (nginx -t, else rollback).
# The server is shared: neighbours (shmidt.conf, zz-fithorse-*, zz-lunaclean-*, zz-smartgoalie-*) are not touched.
set -euo pipefail

SRC="$(cd "$(dirname "$0")" && pwd)"
DIR=/etc/damaskin-bridge
DST=/etc/nginx/sites-enabled/zz-damaskin-bridge.conf

for f in damaskin-bridge.conf auto.sh logrotate; do
  [ -f "$SRC/$f" ] || { echo "no $SRC/$f" >&2; exit 1; }
done
mkdir -p "$DIR" /var/log/nginx/damaskin /var/cache/nginx/damaskin
tar -czf "/root/nginx-before-damaskin-$(date +%Y%m%d-%H%M%S).tgz" -C /etc nginx damaskin-bridge

install -m 644 "$SRC/damaskin-bridge.conf" "$DIR/full.conf"
install -m 755 "$SRC/auto.sh" "$DIR/auto.sh"
install -m 644 "$SRC/logrotate" /etc/logrotate.d/damaskin-bridge
echo "*/15 * * * * root $DIR/auto.sh >> /var/log/damaskin-bridge.log 2>&1" > /etc/cron.d/damaskin-bridge
chmod 644 /etc/cron.d/damaskin-bridge
echo "bridge: $DIR updated, cron /etc/cron.d/damaskin-bridge"

if grep -q 'listen 443' "$DST" 2>/dev/null && ! cmp -s "$DIR/full.conf" "$DST"; then
  cp "$DST" "$DIR/.prev.conf"
  cp "$DIR/full.conf" "$DST"
  if nginx -t; then
    systemctl reload nginx
    echo "bridge: $DST updated, nginx reloaded"
  else
    cp "$DIR/.prev.conf" "$DST"
    echo "bridge: nginx -t failed — $DST rolled back" >&2
    exit 1
  fi
fi

"$DIR/auto.sh" | tee -a /var/log/damaskin-bridge.log
