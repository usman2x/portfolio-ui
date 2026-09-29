# OCI VM deployment

This runbook deploys the statically exported Next.js UI directly on Ubuntu 22.04 using Node.js 22 through NVM and Caddy.

## Production layout

- Repository: `/srv/portfolio/portfolio-ui`
- Static output: `/srv/portfolio/portfolio-ui/out`
- Public UI: `https://www.themuhammadusman.com` (the apex `themuhammadusman.com` redirects to it)
- Public CMS: `https://cms.themuhammadusman.com` (see the CMS repository's runbook)
- Build-time CMS: `http://127.0.0.1:3001`
- TLS: certificates issued and renewed automatically by Caddy (Let's Encrypt)

The hostnames are configuration, not code. They appear only in DNS, `/etc/caddy/Caddyfile`, the UI `.env.production`, and the CMS `.env`. To move to another domain, change those four places and rebuild both applications.

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
NEXT_PUBLIC_SITE_URL=https://www.themuhammadusman.com
NEXT_PUBLIC_PATH_PREFIX=
PAYLOAD_API_URL=http://127.0.0.1:3001
NEXT_PUBLIC_CMS_URL=https://cms.themuhammadusman.com
PAYLOAD_POSTS_ENDPOINT=/api/posts
NEXT_PUBLIC_FORM_LINK=
NEXT_PUBLIC_GA_TRACKING_ID=
```

Do not commit `.env.production`. Values prefixed with `NEXT_PUBLIC_` are compiled into the generated browser files.

`NEXT_PUBLIC_SITE_URL` is required: it drives canonical URLs, and the `postbuild` step uses it to write `out/sitemap.xml` and `out/robots.txt`. The build fails if it is missing. `PAYLOAD_API_URL` stays on loopback so the build never depends on public DNS or TLS.

## DNS

Create these records at the domain's DNS provider:

| Type | Name  | Value         | Purpose                     |
| ---- | ----- | ------------- | --------------------------- |
| `A`  | `@`   | `<PUBLIC_IP>` | Apex, redirects to `www`    |
| `A`  | `www` | `<PUBLIC_IP>` | Public UI                   |
| `A`  | `cms` | `<PUBLIC_IP>` | Payload CMS and admin       |

- Do not publish `AAAA` records unless the VM has working IPv6; Let's Encrypt prefers IPv6 and a stale record breaks issuance.
- If the zone is on Cloudflare, keep these records **DNS only** so Caddy terminates TLS itself.

Confirm propagation from a machine outside OCI before configuring Caddy:

```bash
dig +short themuhammadusman.com www.themuhammadusman.com cms.themuhammadusman.com
```

All three must return the VM's public IP.

## Caddy

Use `/etc/caddy/Caddyfile` to serve this UI and proxy the CMS. Caddy obtains and renews certificates for each site address automatically and redirects HTTP to HTTPS.

```caddyfile
{
	email <certificate-contact-email>
}

themuhammadusman.com {
	redir https://www.themuhammadusman.com{uri} permanent
}

www.themuhammadusman.com {
	root * /srv/portfolio/portfolio-ui/out
	encode zstd gzip
	file_server
}

cms.themuhammadusman.com {
	encode zstd gzip
	reverse_proxy 127.0.0.1:3001
}
```

The global `email` is optional and is used by Let's Encrypt for expiry notices.

```bash
sudo caddy fmt --overwrite /etc/caddy/Caddyfile
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
sudo journalctl -u caddy -f   # wait for "certificate obtained successfully" per hostname
```

Local checks must send the real hostname, because Caddy routes by host and SNI. `--resolve` pins each name to loopback:

```bash
curl -I --resolve www.themuhammadusman.com:443:127.0.0.1 https://www.themuhammadusman.com/
curl -I --resolve cms.themuhammadusman.com:443:127.0.0.1 https://cms.themuhammadusman.com/admin
```

A plain `curl http://127.0.0.1/` no longer matches a site and is not a valid check.

## OCI networking

Add stateful ingress rules to the NSG attached to the VM, or to the subnet security list:

| Source      | Protocol | Destination port | Purpose                                    |
| ----------- | -------- | ---------------: | ------------------------------------------ |
| `0.0.0.0/0` | TCP      |             `80` | ACME HTTP challenge and redirect to HTTPS  |
| `0.0.0.0/0` | TCP      |            `443` | Public UI and CMS over HTTPS               |

Keep port `80` open: Caddy needs it to issue and renew certificates. Keep ports `3001` (CMS) and `9010` (rebuild webhook) closed.

If UFW is active:

```bash
sudo ufw status
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
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

If that reject appears before the UFW rules, insert explicit accepts immediately before it. Replace `<N>` with the reject's current rule number:

```bash
sudo iptables -I INPUT <N> -p tcp --dport 80 -m conntrack --ctstate NEW -j ACCEPT
sudo iptables -I INPUT <N> -p tcp --dport 443 -m conntrack --ctstate NEW -j ACCEPT
sudo apt install -y iptables-persistent
sudo netfilter-persistent save
sudo systemctl enable netfilter-persistent
```

Always inspect rule numbers first; never flush the OCI image's ruleset.

## External verification

Run these from a machine outside OCI, not from the VM itself. Public-IP hairpin requests made from the same OCI VM are not a reliable test.

```bash
curl -I --connect-timeout 10 http://themuhammadusman.com        # 308 to https
curl -I --connect-timeout 10 https://themuhammadusman.com       # 301 to https://www.
curl -I --connect-timeout 10 https://www.themuhammadusman.com   # 200
curl -I --connect-timeout 10 https://cms.themuhammadusman.com/admin
curl -s https://www.themuhammadusman.com/robots.txt             # Sitemap uses the domain
```

In a browser, confirm that CMS media loads on the UI and that the contact form submits without CORS errors. Verify the deployed processes and automatic startup:

```bash
sudo systemctl is-enabled caddy portfolio-cms
sudo systemctl is-active caddy portfolio-cms
sudo ss -ltnp | grep -E ':(80|443|3001)'
```

## Moving an existing IP deployment to the domain

Use this once on a VM that still serves the UI on `http://<PUBLIC_IP>` and the CMS on `:8080`. Keep the old `:8080` block until step 6 passes.

1. Deploy the current `main` with `npm run deploy:oci` while still on the IP layout.
2. Create the [DNS](#dns) records and wait until `dig` returns the public IP.
3. Open TCP `443` in OCI, UFW, and iptables as described in [OCI networking](#oci-networking).
4. Add the three site blocks from [Caddy](#caddy) above the existing `:8080` block, remove the old `:80` block, validate, and reload Caddy. Confirm certificates were issued.
5. Update the CMS `.env` (see the CMS runbook), then rebuild and restart the CMS. Update the UI `.env.production` as shown in [First deployment](#first-deployment), then run `npm run clean && npm run build`.
6. Complete [External verification](#external-verification), including an admin login on `https://cms.themuhammadusman.com/admin`.
7. Remove the temporary CMS port:
   - delete the `:8080` block from the Caddyfile and reload Caddy;
   - `sudo ufw delete allow 8080/tcp`;
   - find the port `8080` rule with `sudo iptables -L INPUT -n --line-numbers`, delete it with `sudo iptables -D INPUT <num>`, then `sudo netfilter-persistent save`;
   - delete the TCP `8080` ingress rule in OCI;
   - from outside OCI, confirm `curl -I --connect-timeout 5 http://<PUBLIC_IP>:8080` times out.
8. Run `npm run deploy:oci` once more; its post-deployment checks now use the domain URLs.

## Remaining production steps

1. Leave content seeding paused until explicitly approved.
2. Populate required Payload globals before treating the generated UI as final content.
3. Rebuild the UI after any CMS content initialization or publication.
4. Activate and test the automatic rebuild listener (see the deferred TODO below).

The CMS uses its own hostname rather than a path such as `/admin` on the UI hostname: Payload Admin is a dynamic Next.js application and shares `/_next/*` with this UI, so path consolidation would need additional routing work.

## Updates

Use the deployment script to update both the CMS and UI in the required order:

```bash
cd /srv/portfolio/portfolio-ui
npm run deploy:oci
```

The script stops on the first failure and performs these checks automatically:

- refuses to deploy over tracked or staged repository changes;
- fast-forwards both repositories from `origin/main`;
- installs locked dependencies with `npm ci`;
- checks the database, runs migrations, and builds and restarts the CMS;
- waits for the local CMS health check before building the UI;
- removes stale Next.js/static output, builds the UI, and verifies its HTML and CSS output;
- verifies the CMS, UI, and Caddy after deployment by requesting `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_CMS_URL/admin` from the UI `.env.production` through the local Caddy (pinned to `127.0.0.1` with `curl --resolve`, so public DNS is not involved).

It preserves `.env` and `.env.production` and does not seed content. The UI may have a short
maintenance window while its clean static export is being generated. Run the command as the
`ubuntu` deployment user. SSH key authentication and sudo authorization are separate; allow this
user to restart only the CMS service without a password so unattended deployment does not stall.

Create the rule with `sudo visudo -f /etc/sudoers.d/portfolio-deploy`:

```sudoers
ubuntu ALL=(root) NOPASSWD: /usr/bin/systemctl restart portfolio-cms
```

Then validate it:

```bash
sudo chmod 440 /etc/sudoers.d/portfolio-deploy
sudo visudo -cf /etc/sudoers.d/portfolio-deploy
sudo -n systemctl restart portfolio-cms
```

The deployment uses non-interactive sudo and exits with a clear error if this narrow permission
has not been configured.

Optional environment overrides are available for a non-standard installation:

```bash
PORTFOLIO_DEPLOY_ROOT=/srv/portfolio \
PORTFOLIO_DEPLOY_BRANCH=main \
PORTFOLIO_UI_URL=https://www.themuhammadusman.com \
PORTFOLIO_CMS_URL=https://cms.themuhammadusman.com \
npm run deploy:oci
```

The equivalent manual UI-only update is retained below for troubleshooting:

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

### Step-by-step rebuild test

1. Check both services:
   `sudo systemctl is-active portfolio-cms portfolio-ui-deploy-webhook`.
2. Check listener health:
   `curl http://127.0.0.1:9010/health`.
3. In a second terminal, follow rebuild output:
   `sudo journalctl -u portfolio-ui-deploy-webhook -f`.
4. In Payload Admin, edit and save a small **Site Settings** value. All website globals trigger the same rebuild hook as published posts.
5. Wait for the five-second debounce, then confirm the log shows `Starting static UI rebuild` followed by exit code `0`.
6. Refresh the public page and verify the change. Caddy serves the new `out` files immediately; it does not need restarting.
7. Repeat using the **Rebuild UI** button on the Payload dashboard. A successful click means the listener accepted the request; monitor the logs until the build finishes.

If the button reports that the webhook is not configured, set `UI_DEPLOY_WEBHOOK_URL` and `UI_DEPLOY_WEBHOOK_TOKEN` in the CMS environment and restart the CMS. If it reports an HTTP error, compare the token used by both services and inspect the listener logs.

### Deferred TODO: automatic build testing

The implementation is retained, but production activation and end-to-end testing are intentionally deferred.

- [ ] Install and enable `portfolio-ui-deploy-webhook.service` on the VM.
- [ ] Configure the shared webhook URL and token, then restart the CMS.
- [ ] Verify the loopback health endpoint and confirm port `9010` is not public.
- [ ] Publish a CMS global and confirm exactly one successful UI build.
- [ ] Publish several records rapidly and confirm the debounce produces one build.
- [ ] Change content during a build and confirm one follow-up build is queued.
- [ ] Confirm an invalid bearer token returns `401` without starting a build.
- [ ] Confirm updated content is visible through Caddy after a successful build.
- [ ] Confirm both services recover after a VM reboot.
- [ ] Measure CPU, memory, and UI availability during a build.
- [ ] Add atomic release switching before treating rebuilds as zero-downtime.

## FAQ

**Why does the CMS need to run during the build?** `getStaticProps` fetches Payload content while generating HTML.

**Why is there no UI systemd service?** The UI output is static files; Caddy serves them directly.

**Why use `.env.production`?** It clearly scopes values to production builds. `.env.local` has higher precedence and can accidentally override them.

**Who manages TLS certificates?** Caddy obtains them from Let's Encrypt for every hostname in the Caddyfile and renews them automatically. No cron job or certbot is required; port `80` must stay reachable.

**Why is the CMS on a subdomain?** It gives Payload Admin its own origin, avoiding `/_next/*` collisions with the UI, and lets CORS allow exactly the UI origin.

## Troubleshooting

- Caddy logs: `sudo journalctl -u caddy -n 100 --no-pager`
- Validate config: `sudo caddy validate --config /etc/caddy/Caddyfile`
- List listeners: `sudo ss -ltnp | grep -E ':(80|443|3001)'`
- Local UI check: `curl -I --resolve www.themuhammadusman.com:443:127.0.0.1 https://www.themuhammadusman.com/`
- Local CMS proxy check: `curl -I --resolve cms.themuhammadusman.com:443:127.0.0.1 https://cms.themuhammadusman.com/admin`
- `UI BUILD MISSING`: inspect the preceding `npm run build` error; never deploy a partial `out` directory.
- CMS fetch failure: confirm `PAYLOAD_API_URL=http://127.0.0.1:3001` and verify the CMS service.
- `undefined cannot be serialized`: normalize optional values to `null` or omit them before returning `getStaticProps`.
- Public timeout with successful local curls: check both OCI ingress rules and the VM firewall.
- If an iptables rule's packet counter remains zero during an external request, OCI is blocking traffic before it reaches the VM.
- Certificate not issued: check `sudo journalctl -u caddy -n 100 --no-pager`. Usual causes are DNS not yet pointing at the VM, port `80` or `443` blocked in OCI or iptables, a stale `AAAA` record, or a Cloudflare proxy in front of the VM. Fix the cause and wait; repeated failures hit Let's Encrypt rate limits.
- If port `80` works but `443` does not, verify `443` is entered as the OCI destination port, not the source port, and that the NSG is attached to the primary VNIC.
- `robots.txt` or the sitemap shows the wrong host: `NEXT_PUBLIC_SITE_URL` in `.env.production` is wrong; fix it and rebuild.
- Deployment check fails after moving hostnames: `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_CMS_URL` must match site addresses in the Caddyfile.
- Old content after editing Payload: rebuild the UI because it is statically generated.
- Permission denied from Caddy: ensure directories are traversable and files under `out` are readable by the `caddy` user.
