# OCI VM deployment

This runbook deploys the statically exported Next.js UI directly on Ubuntu 22.04 using Node.js 22 through NVM and Caddy.

## Production layout

- Repository: `/srv/portfolio/portfolio-ui`
- Static output: `/srv/portfolio/portfolio-ui/out`
- Public UI: `https://www.themuhammadusman.com` (the apex `themuhammadusman.com` redirects to it)
- Public CMS: `https://cms.themuhammadusman.com` (see the CMS repository's runbook)
- Build-time CMS: `http://127.0.0.1:3001`
- TLS: certificates issued and renewed automatically by Caddy (Let's Encrypt)
- Bare IP: `http://<PUBLIC_IP>` redirects to the UI domain; no content is served on the IP

The hostnames are configuration, not code. They appear only in DNS, `/etc/caddy/Caddyfile`, the UI `.env.production`, and the CMS `.env`. To move to another domain, change those four places and rebuild both applications.

### Shared VM

The production VM (`portfolio-prod`, OCI `us-ashburn-1`) also hosts rem-labs (`remlabs-ui` on `127.0.0.1:3100`, `remlabs-cms` on `127.0.0.1:3101`, code in `/srv/rem-labs`). rem-labs is served through the `:8080` block of the same Caddyfile. When changing this deployment:

- edit only the portfolio blocks of `/etc/caddy/Caddyfile`; never replace the whole file;
- keep TCP `8080` open in Caddy, iptables, UFW, and OCI, because rem-labs depends on it;
- verify rem-labs after every Caddy reload (see [External verification](#external-verification)).

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

`/etc/caddy/Caddyfile` serves this UI and proxies the CMS. Caddy obtains and renews certificates for each site address automatically. These are the portfolio parts of the production file; the `:8080` block belongs to rem-labs apart from its final catch-all (see [Shared VM](#shared-vm)).

```caddyfile
# Security headers for the portfolio HTTPS sites. Raise HSTS max-age once stable.
(portfolio_security) {
	header {
		Strict-Transport-Security "max-age=86400"
		X-Content-Type-Options "nosniff"
		X-Frame-Options "DENY"
		Referrer-Policy "strict-origin-when-cross-origin"
		-X-Powered-By
		-Server
	}
}

# Bare-IP HTTP is not served; send visitors to the canonical HTTPS site.
:80 {
	redir https://www.themuhammadusman.com{uri} permanent
}

:8080 {
	# ... rem-labs routes (/remlabs*, /remlabs-admin*) ...

	# Portfolio CMS is served only on https://cms.themuhammadusman.com.
	handle {
		respond 404
	}
}

# Portfolio over HTTPS. Caddy manages certificates for these hostnames.
http://themuhammadusman.com, http://www.themuhammadusman.com, http://cms.themuhammadusman.com {
	redir https://{host}{uri} permanent
}

themuhammadusman.com {
	import portfolio_security
	redir https://www.themuhammadusman.com{uri} permanent
}

www.themuhammadusman.com {
	import portfolio_security
	# Retired routes (the UI is a static export, so redirects live here).
	redir /experience/ /about/#experience permanent
	redir /experience /about/#experience permanent
	root * /srv/portfolio/portfolio-ui/out

	encode zstd gzip
	file_server
}

cms.themuhammadusman.com {
	import portfolio_security
	encode zstd gzip
	reverse_proxy 127.0.0.1:3001
}
```

Notes:

- The explicit `http://` block is required. Without it, the `:80` catch-all would answer plain-HTTP requests for the domain instead of Caddy's automatic HTTPS redirect.
- Caddy still answers ACME HTTP challenges on port `80` before any of these routes.
- `X-Frame-Options: DENY` is safe because nothing frames the UI or the CMS. Revisit it if Payload live preview is enabled.
- A global `{ email <address> }` block can be added for Let's Encrypt expiry notices; renewal is automatic without it.

### Changing the Caddyfile

Back up first, using a descriptive dated suffix, then validate before reloading. A reload is graceful and keeps the previous configuration if the new one fails.

```bash
sudo cp -p /etc/caddy/Caddyfile /etc/caddy/Caddyfile.pre-<change>-<yyyymmdd>
sudo nano /etc/caddy/Caddyfile
sudo caddy fmt --overwrite /etc/caddy/Caddyfile
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
sudo journalctl -u caddy -f   # after adding a hostname, wait for "certificate obtained successfully"
```

### HSTS

HSTS starts at one day (`max-age=86400`) so a mistake can be reverted quickly. After a week of stable HTTPS on every portfolio hostname, raise it to `max-age=31536000` in the `portfolio_security` snippet and reload Caddy. Do not add `includeSubDomains` or `preload` while any `themuhammadusman.com` subdomain might be served over plain HTTP.

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
| `0.0.0.0/0` | TCP      |           `8080` | rem-labs only (not part of the portfolio)  |

Keep port `80` open: Caddy needs it to issue and renew certificates. Keep ports `3001` (CMS) and `9010` (rebuild webhook) closed; both also listen on `127.0.0.1` only.

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

On the production VM the reject rule precedes the UFW chains, so the iptables accepts are what actually admit traffic; the UFW rules are kept for consistency only. The current order is:

| # | Rule |
| -: | ---- |
| 1 | `RELATED,ESTABLISHED` accept |
| 2 | ICMP accept |
| 3 | loopback accept |
| 4 | TCP `22` |
| 5 | TCP `80` |
| 6 | TCP `8080` (rem-labs) |
| 7 | TCP `443` |
| 8 | `REJECT` (everything else) |

The rules are persisted in `/etc/iptables/rules.v4` by `netfilter-persistent`.

## External verification

Run these from a machine outside OCI, not from the VM itself. Public-IP hairpin requests made from the same OCI VM are not a reliable test.

```bash
curl -I --connect-timeout 10 http://themuhammadusman.com        # 308 to https
curl -I --connect-timeout 10 https://themuhammadusman.com       # 301 to https://www.
curl -I --connect-timeout 10 https://www.themuhammadusman.com   # 200
curl -I --connect-timeout 10 https://cms.themuhammadusman.com/admin
curl -s https://www.themuhammadusman.com/robots.txt             # Sitemap uses the domain
curl -sI https://www.themuhammadusman.com | grep -i strict      # HSTS header present
curl -I --connect-timeout 10 http://<PUBLIC_IP>/                # 301 to https://www.
curl -I --connect-timeout 10 http://<PUBLIC_IP>:8080/admin      # 404: portfolio CMS not on the IP
curl -I --connect-timeout 5 http://<PUBLIC_IP>:3001/            # must time out
```

After any Caddy change, confirm rem-labs is unaffected. Its `:8080` paths now redirect to its own
hostnames:

```bash
curl -sIL http://<PUBLIC_IP>:8080/remlabs | grep -iE '^(HTTP|location)'              # 308 to https://tabrem.com/, then 200
curl -sIL http://<PUBLIC_IP>:8080/remlabs-admin/admin | grep -iE '^(HTTP|location)'  # 308 to https://cms.tabrem.com/admin, then 200
```

In a browser, confirm that CMS media loads on the UI and that the contact form submits without CORS errors. Verify the deployed processes and automatic startup:

```bash
sudo systemctl is-enabled caddy portfolio-cms portfolio-ui-deploy-webhook
sudo systemctl is-active caddy portfolio-cms portfolio-ui-deploy-webhook
sudo ss -ltnp | grep -E ':(80|443|3001|9010)'   # 3001 and 9010 on 127.0.0.1 only
```

## Remaining production steps

1. Enter the content added by the 2026-10-05 release in Payload Admin (see the CMS runbook's
   "Remaining production steps"). Do not run `seed:core` against production after manual edits: it
   overwrites globals and matching records.
2. Complete the end-to-end rebuild tests (see the TODO below).
3. Raise HSTS to one year after a week of stable HTTPS (see [HSTS](#hsts)).
4. rem-labs now has its own hostnames (`tabrem.com`, `cms.tabrem.com`) and its `:8080` paths
   redirect there; close `:8080` once nothing depends on those redirects.
5. Add atomic release switching so rebuilds do not briefly empty `out`.
6. Done 2026-10-06: the two `/experience` redirects are live in the `www.themuhammadusman.com`
   block (see [Caddy](#caddy)); `curl -sI https://www.themuhammadusman.com/experience/` returns
   `301` to `/about/#experience` (Caddy's `permanent`), and rem-labs was checked after the reload.

The CMS uses its own hostname rather than a path such as `/admin` on the UI hostname: Payload Admin is a dynamic Next.js application and shares `/_next/*` with this UI, so path consolidation would need additional routing work.

## Backups and rollback

Configuration backups on the production VM, each taken immediately before the change it names:

| Backup | Restores |
| ------ | -------- |
| `/etc/caddy/Caddyfile.pre-portfolio-domain-20260929` | IP-only layout, before the HTTPS site blocks |
| `/etc/caddy/Caddyfile.pre-portfolio-ip-lockdown-20260929` | HTTPS blocks, with UI still on the bare IP and CMS on `:8080` |
| `/etc/caddy/Caddyfile.pre-portfolio-headers-20260929` | Current layout without security headers |
| `/srv/portfolio/portfolio-cms/.env.pre-domain-20260929` | CMS environment with IP URLs |
| `/srv/portfolio/portfolio-ui/.env.production.pre-domain-20260929` | UI environment with IP URLs |
| `/etc/caddy/Caddyfile.pre-experience-redirect-20261006` | Current layout without the `/experience` redirects |

Earlier `Caddyfile.pre-remlabs-*` files belong to the rem-labs deployment.

To roll back a Caddy change, copy the chosen backup over `/etc/caddy/Caddyfile`, validate, and reload. To roll back the environment, restore both env files together, rebuild and restart the CMS, then rebuild the UI (or run `npm run deploy:oci`). Restoring the IP environment also requires a Caddyfile that serves the IP.

## Access and prerequisites

**VM access.** Connect as the `ubuntu` deployment user with an SSH key:

```bash
ssh -i <private-key> ubuntu@<PUBLIC_IP>
```

To authorize another machine, append its public key (`~/.ssh/id_ed25519.pub`) to
`/home/ubuntu/.ssh/authorized_keys` from an existing session. If no session is available, add the key
through the OCI Console (instance **Console connection**, or recreate access from a boot-volume
snapshot). Never share private keys between machines.

**GitHub access.** Both repositories are public, so the VM clones and pulls over HTTPS
(`https://github.com/usman2x/<repo>.git`) without credentials. If a repository is made private, give
the VM one read-only deploy key per repository (GitHub allows a key on only one repository):

```bash
ssh-keygen -t ed25519 -N "" -C "portfolio-prod portfolio-cms" -f ~/.ssh/portfolio-cms-deploy
ssh-keygen -t ed25519 -N "" -C "portfolio-prod portfolio-ui" -f ~/.ssh/portfolio-ui-deploy
cat ~/.ssh/portfolio-cms-deploy.pub ~/.ssh/portfolio-ui-deploy.pub
```

Add each public key under the repository's **Settings → Deploy keys** with write access disabled,
then map each repository to its key in `~/.ssh/config` and switch the remotes:

```sshconfig
Host github-portfolio-cms
  HostName github.com
  User git
  IdentityFile ~/.ssh/portfolio-cms-deploy
  IdentitiesOnly yes

Host github-portfolio-ui
  HostName github.com
  User git
  IdentityFile ~/.ssh/portfolio-ui-deploy
  IdentitiesOnly yes
```

```bash
git -C /srv/portfolio/portfolio-cms remote set-url origin git@github-portfolio-cms:usman2x/portfolio-cms.git
git -C /srv/portfolio/portfolio-ui remote set-url origin git@github-portfolio-ui:usman2x/portfolio-ui.git
git -C /srv/portfolio/portfolio-cms fetch origin && git -C /srv/portfolio/portfolio-ui fetch origin
```

**Fresh VM prerequisites.** The current VM already has these. On a new Ubuntu 22.04 VM:

```bash
sudo apt update && sudo apt install -y git curl ca-certificates gnupg util-linux
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
source ~/.nvm/nvm.sh && nvm install 22
sudo mkdir -p /srv/portfolio && sudo chown ubuntu:ubuntu /srv/portfolio
```

Install Caddy from its official apt repository (<https://caddyserver.com/docs/install#debian-ubuntu-raspbian>),
then follow [First deployment](#first-deployment) here and in the CMS runbook, the CMS systemd unit,
[Caddy](#caddy), [OCI networking](#oci-networking) and the rebuild listener below.

For database backups, install a PostgreSQL client whose major version is at least the server's
from the PGDG repository (<https://www.postgresql.org/download/linux/ubuntu/>). Production runs
PostgreSQL 18 (Neon), and Ubuntu's own client is 14, so the VM has `postgresql-client-18` from PGDG
(installed 2026-10-06).

## Deployment checklist

Run every production release in this order.

1. **Review the release locally.** In both repositories, list what `main` will receive and look for
   migrations, environment changes and content the release needs:

   ```bash
   git fetch origin
   git log --oneline origin/main..origin/develop
   git diff --stat origin/main origin/develop -- src/migrations .env.example
   ```

2. **Release.** Fast-forward `main` to `develop` in both repositories and push (see
   [Release flow](#release-flow)).

3. **Back up on the VM** before deploying. Record the running commits, copy the environment files and
   dump the CMS schema. Keep backups outside the repositories:

   ```bash
   STAMP=$(date +%Y%m%d-%H%M%S)
   BACKUP=/srv/portfolio/backups/$STAMP
   mkdir -p "$BACKUP" && chmod 700 /srv/portfolio/backups "$BACKUP"
   git -C /srv/portfolio/portfolio-cms rev-parse HEAD > "$BACKUP/cms-commit"
   git -C /srv/portfolio/portfolio-ui rev-parse HEAD > "$BACKUP/ui-commit"
   cp -p /srv/portfolio/portfolio-cms/.env "$BACKUP/cms.env"
   cp -p /srv/portfolio/portfolio-ui/.env.production "$BACKUP/ui.env.production"
   cd /srv/portfolio/portfolio-cms
   env_value() { node --no-warnings --env-file=.env -p "process.env.$1 || '$2'"; }
   pg_dump "$(env_value DATABASE_URL)" -Fc --no-owner -n "$(env_value DB_SCHEMA public)" -f "$BACKUP/cms.dump"
   chmod 600 "$BACKUP"/*
   pg_restore --list "$BACKUP/cms.dump" | grep -c " TABLE DATA "
   ls -la "$BACKUP"
   ```

   Read values through `node --env-file` as shown: `source .env` in bash does not load
   `DATABASE_URL` correctly on the VM, and `pg_dump` then falls back to `127.0.0.1:5432`.

   The dump contains all CMS content, users and stored media, so treat it as a secret and delete old
   backups once releases are stable. A Neon branch or point-in-time restore is an additional option,
   not a replacement for the dump.

4. **Deploy:** `cd /srv/portfolio/portfolio-ui && npm run deploy:oci` (see [Updates](#updates)).

5. **Verify** externally (see [External verification](#external-verification)), sign in to Payload
   Admin, and confirm the release's pages and a content-triggered rebuild.

6. **Enter release content** in Payload Admin when the release needs it. Do not seed production.

### Rolling back a release

`deploy:oci` always deploys `origin/main`, so roll back by reverting on `main` (from a development
checkout) and deploying again:

```bash
git revert --no-edit <first-bad-commit>^..<last-bad-commit>
git push origin main
```

To restore the previous build immediately, check out the recorded commits on the VM and rebuild
manually (the next `deploy:oci` returns to `origin/main`):

```bash
cd /srv/portfolio/portfolio-cms && git checkout "$(cat "$BACKUP/cms-commit")" && npm ci \
  && (set -a; source .env; set +a; npm run build) && sudo systemctl restart portfolio-cms
cd /srv/portfolio/portfolio-ui && git checkout "$(cat "$BACKUP/ui-commit")" && npm ci \
  && npm run clean && npm run build
```

Restore the database only when a migration damaged or dropped data, because it discards content
edited since the backup. Stop the CMS first, restore the schema, then start the matching code:

```bash
sudo systemctl stop portfolio-cms
cd /srv/portfolio/portfolio-cms
pg_restore --clean --if-exists --no-owner \
  -d "$(node --no-warnings --env-file=.env -p process.env.DATABASE_URL)" "$BACKUP/cms.dump"
sudo systemctl start portfolio-cms
```

## Release flow

Work happens on `develop` in both repositories; production deploys `main`.

1. Merge or fast-forward `develop` into `main` in both repositories and push. Deploy both together
   whenever a UI change depends on a CMS schema change.
2. On the VM, run `npm run deploy:oci` (below). It applies pending migrations before the new CMS
   starts and never seeds content.
3. Content that a release needs (new fields, new collections) is entered in Payload Admin after the
   deploy. The UI hides sections whose content is empty, so a release can go live before its
   content. Do not run `seed:core` against production once content has been edited there: it
   overwrites every record and global field it defines.
4. Verify externally (see [External verification](#external-verification)).

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
has not been configured. On the current VM the default OCI `ubuntu` user already has passwordless
sudo, so this file has not been created; add it if that broad permission is ever removed.

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

### TODO: automatic build testing

The listener is installed, enabled, and running on the production VM. End-to-end testing is still pending.

- [x] Install and enable `portfolio-ui-deploy-webhook.service` on the VM.
- [x] Configure the shared webhook URL and token, then restart the CMS.
- [x] Verify the loopback health endpoint and confirm port `9010` is not public.
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

**Why does the bare IP redirect instead of serving the site?** An IP cannot carry a publicly trusted certificate, so anything served there is plain HTTP and open to tampering. Redirecting keeps one canonical HTTPS origin and avoids duplicate indexing.

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
- `deploy:oci` stops with "CMS has uncommitted tracked changes": inspect `git -C /srv/portfolio/portfolio-cms status`. Next.js rewrites `next-env.d.ts` on every build, so it is ignored rather than tracked; if a generated file shows as modified, it was committed by mistake and should be untracked in the repository.
- Plain `http://` on a domain serves content instead of redirecting: the explicit `http://` redirect block is missing or placed so the `:80` catch-all wins.
- rem-labs broken after a Caddy reload: restore the latest `Caddyfile.pre-*` backup, reload, and compare the `:8080` block.
- Old content after editing Payload: rebuild the UI because it is statically generated.
- Permission denied from Caddy: ensure directories are traversable and files under `out` are readable by the `caddy` user.
