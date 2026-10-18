#!/usr/bin/env bash
# damaskin.dev on ru-bridge switches itself on once DNS points here (like /etc/lunaclean-bridge/auto.sh).
# Cron every 15 minutes: /etc/cron.d/damaskin-bridge → /etc/damaskin-bridge/auto.sh
#
#   0. No site in sites-enabled — installs the part of full.conf before :443 (only :80, ACME forwarded to Hetzner).
#   1. DNS: both names — A = this server, no AAAA.
#   2. The bridge's own Let's Encrypt certificate (webroot /var/www/certbot — :80 already serves it).
#   3. Waits for the real certificate on Hetzner (deploy/scripts/certs.sh there): the bridge verifies the origin
#      (proxy_ssl_verify on), with the temporary self-signed one it would answer 502.
#   4. The full config with :443; nginx -t fails — rolled back.
# Done (the site has :443) — silent. Renewal: the shared certbot.timer + deploy hook reload-nginx.sh.
set -euo pipefail

SELF_IP=132.243.16.97
DIR=/etc/damaskin-bridge
FULL="$DIR/full.conf"
DST=/etc/nginx/sites-enabled/zz-damaskin-bridge.conf
TLS="$DIR/tls"
NAMES=(damaskin.dev www.damaskin.dev)
MAIN="${NAMES[0]}"
FAIL_MARK="$DIR/.cert-failed"

log() { echo "$(date -u +%FT%TZ) $*"; }

# DNS through the system resolver via python: dig on this server trips over /etc/resolv.conf (empty nameserver
# lines; the file is shared — left alone). The resolver's negative cache may delay this by up to half an hour.
dns_of() {
  python3 - "$1" <<'PY'
import socket, sys
d = sys.argv[1]
def q(family):
    try:
        return sorted({a[4][0] for a in socket.getaddrinfo(d, None, family)})
    except socket.gaierror:
        return []
print(" ".join(q(socket.AF_INET)) + "|" + " ".join(q(socket.AF_INET6)))
PY
}

install_conf() { # $1 — config, $2 — path in sites-enabled; rolled back when nginx -t fails
  local prev=""
  [ -f "$2" ] && prev="$(mktemp)" && cp "$2" "$prev"
  cp "$1" "$2"
  if nginx -t >/dev/null 2>&1; then
    systemctl reload nginx
    rm -f "$prev"
  else
    if [ -n "$prev" ]; then cp "$prev" "$2" && rm -f "$prev"; else rm -f "$2"; fi
    return 1
  fi
}

grep -q 'listen 443' "$DST" 2>/dev/null && exit 0
[ -f "$FULL" ] || { log "no $FULL"; exit 1; }

# 0. Only :80 — everything before the second server block (the first :443).
if [ ! -f "$DST" ]; then
  mkdir -p /var/log/nginx/damaskin /var/cache/nginx/damaskin
  awk '/^server \{/{n++} n<2' "$FULL" > "$DIR/.http-only.conf"
  if ! install_conf "$DIR/.http-only.conf" "$DST"; then
    log "nginx -t failed for the :80 part — not enabled"
    exit 1
  fi
  log ":80 for ${NAMES[*]} enabled (ACME forwarded to Hetzner)"
fi

# 1. DNS.
for h in "${NAMES[@]}"; do
  dns="$(dns_of "$h")"
  a="${dns%%|*}"
  aaaa="${dns#*|}"
  [ "$a" = "$SELF_IP" ] || { log "waiting for DNS: $h A -> ${a:-none}"; exit 0; }
  [ -z "$aaaa" ] || { log "waiting for DNS: $h has AAAA ($aaaa) — remove it"; exit 0; }
done

# 2. The bridge's own certificate. After a failure — an hour's pause: Let's Encrypt allows 5 failed
#    validations per name per hour.
if [ ! -e "/etc/letsencrypt/live/$MAIN/fullchain.pem" ]; then
  if [ -e "$FAIL_MARK" ] && [ -n "$(find "$FAIL_MARK" -mmin -60)" ]; then exit 0; fi
  log "DNS is ready — issuing the bridge certificate: ${NAMES[*]}"
  domains=()
  for h in "${NAMES[@]}"; do domains+=(-d "$h"); done
  if ! certbot certonly --webroot -w /var/www/certbot --cert-name "$MAIN" "${domains[@]}" \
    --register-unsafely-without-email --agree-tos --non-interactive --quiet; then
    touch "$FAIL_MARK"
    log "issuing $MAIN failed — next try in an hour"
    exit 1
  fi
  rm -f "$FAIL_MARK"
fi
mkdir -p "$TLS"
ln -sfn "/etc/letsencrypt/live/$MAIN/fullchain.pem" "$TLS/fullchain.pem"
ln -sfn "/etc/letsencrypt/live/$MAIN/privkey.pem" "$TLS/privkey.pem"

# 3. The origin through the FitHorse tunnels: its certificate must pass verification.
origin_ok=0
for port in 9443 9444; do
  if echo | openssl s_client -connect "127.0.0.1:$port" -servername "$MAIN" -verify_return_error \
    -verify_hostname "$MAIN" >/dev/null 2>&1; then
    origin_ok=1
    break
  fi
done
if [ "$origin_ok" = 0 ]; then
  log "waiting for the real $MAIN certificate on Hetzner (certs.sh there, every 15 min)"
  exit 0
fi

# 4. The full config.
if install_conf "$FULL" "$DST"; then
  code="$(curl -s -o /dev/null -w '%{http_code}' --resolve "$MAIN:443:127.0.0.1" "https://$MAIN/health" || true)"
  log "$MAIN on :443 enabled, /health -> $code"
else
  log "nginx -t failed — $MAIN stays on :80"
  exit 1
fi
