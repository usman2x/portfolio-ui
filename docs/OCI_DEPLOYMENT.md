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
- Old content after editing Payload: rebuild the UI because it is statically generated.
- Permission denied from Caddy: ensure directories are traversable and files under `out` are readable by the `caddy` user.
