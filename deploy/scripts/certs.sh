#!/usr/bin/env bash
# TLS certificate for damaskin.dev + www.damaskin.dev (Let's Encrypt, HTTP-01 through the shared edge webroot).
#
# nginx reads the certificate from /opt/damaskin-dev/letsencrypt/active — a relative symlink to:
#   bootstrap/        — temporary self-signed, so nginx can start before the real one exists;
#   live/damaskin.dev — the real one from Let's Encrypt.
# The symlink switches only after a successful issue — a certbot failure never leaves nginx without a certificate.
#
#   certs.sh ensure — create the temporary certificate and the symlink if missing (called by deploy.sh)
#   certs.sh auto   — for cron: while the temporary one is active, wait until the domain reaches this server and
#                     issue the real one; renew it when less than 30 days are left. Silent when there is nothing to do.
#   certs.sh issue  — issue now, without the reachability check
set -euo pipefail

DOMAIN=damaskin.dev
WWW=www.damaskin.dev
LE_DIR=/opt/damaskin-dev/letsencrypt
# Host directory that edge serves as /.well-known/acme-challenge/ (/var/www/certbot-rayn inside edge)
WEBROOT_HOST=/opt/rayn-repo/infra/deploy/certbot/www
NGINX=damaskin-nginx

log() { echo "$(date -u +%FT%TZ) $*"; }
reload_nginx() { docker exec "$NGINX" nginx -s reload >/dev/null 2>&1 || true; }
active_is_le() { [ "$(readlink "$LE_DIR/active" 2>/dev/null)" = "live/$DOMAIN" ]; }

certbot() {
  docker run --rm \
    -v "$LE_DIR:/etc/letsencrypt" \
    -v "$WEBROOT_HOST:/var/www/certbot" \
    certbot/certbot:latest "$@"
}

ensure() {
  mkdir -p "$LE_DIR/bootstrap"
  if [ ! -f "$LE_DIR/bootstrap/fullchain.pem" ]; then
    openssl req -x509 -nodes -newkey rsa:2048 -days 3650 \
      -keyout "$LE_DIR/bootstrap/privkey.pem" -out "$LE_DIR/bootstrap/fullchain.pem" \
      -subj "/CN=$DOMAIN" -addext "subjectAltName=DNS:$DOMAIN,DNS:$WWW" >/dev/null 2>&1
    log "created a temporary self-signed certificate"
  fi
  [ -L "$LE_DIR/active" ] || ln -sfn bootstrap "$LE_DIR/active"
}

# The domain is ready when a token dropped into the shared webroot comes back over plain HTTP from both names —
# exactly the request Let's Encrypt makes. This works for a DNS-only A record and behind the Cloudflare proxy alike,
# and catches a stray AAAA record or a wrong IP without parsing DNS.
domain_ready() {
  local dir="$WEBROOT_HOST/.well-known/acme-challenge" token h body
  token="probe-$(date +%s)-$RANDOM"
  mkdir -p "$dir"
  echo "$token" > "$dir/$token"
  for h in "$DOMAIN" "$WWW"; do
    body="$(curl -fsSkL --max-time 15 "http://$h/.well-known/acme-challenge/$token" 2>/dev/null || true)"
    if [ "$body" != "$token" ]; then
      rm -f "$dir/$token"
      log "waiting for DNS: http://$h does not reach this server yet"
      return 1
    fi
  done
  rm -f "$dir/$token"
}

issue() {
  certbot certonly --webroot -w /var/www/certbot \
    --agree-tos --non-interactive --register-unsafely-without-email \
    --cert-name "$DOMAIN" -d "$DOMAIN" -d "$WWW"
  ln -sfn "live/$DOMAIN" "$LE_DIR/active"
  reload_nginx
  log "Let's Encrypt certificate issued, nginx reloaded"
}

renew_if_due() {
  local cert="$LE_DIR/live/$DOMAIN/fullchain.pem"
  openssl x509 -in "$cert" -noout -checkend 2592000 >/dev/null && return 0
  certbot renew --cert-name "$DOMAIN" --webroot -w /var/www/certbot --quiet
  reload_nginx
  log "certificate renewed"
}

case "${1:-auto}" in
  ensure) ensure ;;
  issue) ensure; issue ;;
  auto)
    ensure
    if active_is_le; then renew_if_due
    elif domain_ready; then issue
    fi
    ;;
  *) echo "usage: $0 ensure|auto|issue" >&2; exit 2 ;;
esac
