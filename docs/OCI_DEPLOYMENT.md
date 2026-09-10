# OCI VM deployment

This runbook deploys the statically exported Next.js UI directly on Ubuntu 22.04 using Node.js 22 through NVM and Caddy.

## Production layout

- Repository: `/srv/portfolio/portfolio-ui`
- Static output: `/srv/portfolio/portfolio-ui/out`
- Temporary public UI address: `http://<PUBLIC_IP>`
- Build-time CMS: `http://127.0.0.1:3001`
- Browser-visible CMS: `http://<PUBLIC_IP>:8080`

## First deployment

The CMS must be running before the UI build because page content is fetched during static generation.

```bash
cd /srv/portfolio
git clone https://github.com/usman2x/portfolio-ui.git portfolio-ui
cd portfolio-ui
nvm install 22
nvm use 22
nano .env.production
chmod 600 .env.production
npm ci
npm run build
test -f out/index.html && echo "UI BUILD OK" || echo "UI BUILD MISSING"
```

Production environment:

```dotenv
NEXT_PUBLIC_SITE_URL=http://<PUBLIC_IP>
NEXT_PUBLIC_PATH_PREFIX=
PAYLOAD_API_URL=http://127.0.0.1:3001
NEXT_PUBLIC_CMS_URL=http://<PUBLIC_IP>:8080
PAYLOAD_POSTS_ENDPOINT=/api/posts
NEXT_PUBLIC_FORM_LINK=
NEXT_PUBLIC_GA_TRACKING_ID=
```

Do not commit `.env.production`. Values prefixed with `NEXT_PUBLIC_` are compiled into the generated browser files.

## Caddy

Use `/etc/caddy/Caddyfile` to serve this UI and proxy the CMS:

```caddyfile
:80 {
	root * /srv/portfolio/portfolio-ui/out
	encode zstd gzip
	file_server
}

:8080 {
	encode zstd gzip
	reverse_proxy 127.0.0.1:3001
}
```

```bash
sudo caddy fmt --overwrite /etc/caddy/Caddyfile
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl restart caddy
curl -I http://127.0.0.1/
curl -I http://127.0.0.1:8080/admin
```

## OCI networking

Add stateful ingress rules to the NSG attached to the VM, or to the subnet security list:

| Source | Protocol | Destination port | Purpose |
| --- | --- | ---: | --- |
| `0.0.0.0/0` | TCP | `80` | Public UI |
| `0.0.0.0/0` | TCP | `8080` | Temporary public CMS |

Keep port 3001 closed. Port 8080 should be replaced by HTTPS on a CMS subdomain when a domain is available.

If UFW is active:

```bash
sudo ufw status
sudo ufw allow 80/tcp
sudo ufw allow 8080/tcp
```

UFW rules persist automatically. Confirm both activation and startup:

```bash
sudo ufw status numbered
sudo systemctl is-enabled ufw
```

Some OCI Ubuntu images contain a catch-all `REJECT` rule before the UFW chains. Inspect the actual order:

```bash
sudo iptables -L INPUT -n -v --line-numbers
```

If that reject appears before the UFW rules, insert explicit accepts immediately before it. In the deployed VM the reject was originally rule 5, so the applied rules were:

```bash
sudo iptables -I INPUT 5 -p tcp --dport 80 -m conntrack --ctstate NEW -j ACCEPT
sudo iptables -I INPUT 6 -p tcp --dport 8080 -m conntrack --ctstate NEW -j ACCEPT
sudo apt install -y iptables-persistent
sudo netfilter-persistent save
sudo systemctl enable netfilter-persistent
```

Always inspect rule numbers first; never flush the OCI image's ruleset. Keep port `3001` closed publicly.

## External verification

Run these from a machine outside OCI, not from the VM itself. Public-IP hairpin requests made from the same OCI VM are not a reliable test.

```bash
curl -I --connect-timeout 10 http://<PUBLIC_IP>
curl -I --connect-timeout 10 http://<PUBLIC_IP>:8080/admin
```

Expected result: both return an HTTP response from Caddy. Verify the deployed processes and automatic startup:

```bash
sudo systemctl is-enabled caddy portfolio-cms
sudo systemctl is-active caddy portfolio-cms
sudo ss -ltnp | grep -E ':(80|8080|3001)'
```

## Remaining production steps

1. Complete external checks for the UI on `80` and CMS on `8080`.
2. Leave content seeding paused until explicitly approved.
3. Populate required Payload globals before treating the generated UI as final content.
4. Rebuild the UI after any CMS content initialization or publication.
5. Acquire/configure a domain and switch Caddy to HTTPS.
6. Move the CMS to a dedicated HTTPS hostname, or validate a same-origin routing design that accounts for both applications' `/_next/*` assets.
7. Remove temporary port `8080` from Caddy, UFW, persistent iptables, and OCI ingress only after its replacement is verified.

The current supported layout remains port `80` for UI and port `8080` for CMS. A previous static-admin deployment could safely use `/admin`; Payload Admin is dynamic Next.js and shares `/_next/*` with this UI, so path consolidation requires additional routing tests.

## Updates

```bash
cd /srv/portfolio/portfolio-ui
git pull --ff-only origin main
nvm use 22
npm ci
npm run build
test -f out/index.html && echo "UI BUILD OK" || echo "UI BUILD MISSING"
```

Caddy serves `out` directly, so it does not need restarting after a successful UI rebuild.

## Automatic rebuild after CMS changes

The CMS publish hooks can notify a loopback-only rebuild listener. The listener validates a bearer token, debounces bursts of edits, runs one build at a time, and queues one follow-up build when content changes during an active build.

Add the same random token to `/srv/portfolio/portfolio-cms/.env`:

```dotenv
UI_DEPLOY_WEBHOOK_URL=http://127.0.0.1:9010/deploy
UI_DEPLOY_WEBHOOK_TOKEN=<openssl-rand-hex-32-output>
```

Create `/etc/systemd/system/portfolio-ui-deploy-webhook.service`:

```ini
[Unit]
Description=Portfolio UI deployment webhook
After=network-online.target portfolio-cms.service
Wants=network-online.target

[Service]
Type=simple
User=ubuntu
Group=ubuntu
WorkingDirectory=/srv/portfolio/portfolio-ui
Environment=NODE_ENV=production
Environment=NVM_DIR=/home/ubuntu/.nvm
EnvironmentFile=/srv/portfolio/portfolio-cms/.env
ExecStart=/bin/bash -lc 'source /home/ubuntu/.nvm/nvm.sh && exec npm run deploy:webhook'
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Enable it and restart the CMS so both processes load the token:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now portfolio-ui-deploy-webhook
sudo systemctl restart portfolio-cms
curl http://127.0.0.1:9010/health
```

The listener binds only to `127.0.0.1`; do not add port `9010` to OCI, UFW, iptables, or Caddy. Logs are available with `sudo journalctl -u portfolio-ui-deploy-webhook -f`.

## FAQ

**Why does the CMS need to run during the build?** `getStaticProps` fetches Payload content while generating HTML.

**Why is there no UI systemd service?** The UI output is static files; Caddy serves them directly.

**Why use `.env.production`?** It clearly scopes values to production builds. `.env.local` has higher precedence and can accidentally override them.

**Why is the site HTTP-only?** Publicly trusted HTTPS needs a domain in the normal deployment. Caddy can automate certificates after DNS is configured.

## Troubleshooting

- Caddy logs: `sudo journalctl -u caddy -n 100 --no-pager`
- Validate config: `sudo caddy validate --config /etc/caddy/Caddyfile`
- List listeners: `sudo ss -ltnp | grep -E ':(80|8080|3001)'`
- Local UI check: `curl -I http://127.0.0.1/`
- Local CMS proxy check: `curl -I http://127.0.0.1:8080/admin`
- `UI BUILD MISSING`: inspect the preceding `npm run build` error; never deploy a partial `out` directory.
- CMS fetch failure: confirm `PAYLOAD_API_URL=http://127.0.0.1:3001` and verify the CMS service.
- `undefined cannot be serialized`: normalize optional values to `null` or omit them before returning `getStaticProps`.
- Public timeout with successful local curls: check both OCI ingress rules and the VM firewall.
- If an iptables rule's packet counter remains zero during an external request, OCI is blocking traffic before it reaches the VM.
- If port `80` works but `8080` does not, verify `8080` is entered as the OCI destination port, not the source port, and that the NSG is attached to the primary VNIC.
- Old content after editing Payload: rebuild the UI because it is statically generated.
- Permission denied from Caddy: ensure directories are traversable and files under `out` are readable by the `caddy` user.
