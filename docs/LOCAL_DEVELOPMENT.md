# Local Development

This guide starts the complete portfolio stack from a fresh checkout. The stack has two sibling repositories:

```text
workspace/
├── portfolio-cms/  # Payload CMS and PostgreSQL, port 3001
└── portfolio-ui/   # statically generated Next.js site, port 3000
```

The UI requires the CMS while developing and building. Start the CMS first.

## Prerequisites

- Node.js `20.9.0` or newer; Node 20 LTS is recommended
- npm `9` or newer
- PostgreSQL with an existing database that the local user can create schemas and tables in
- Both repositories checked out next to each other

Both repositories include an `.nvmrc`. If Node Version Manager is installed, run `nvm use` in each repository. Otherwise, verify `node --version` reports a supported version and continue with the installed Node.js runtime.

## 1. Configure and start the CMS

From `portfolio-cms`:

```bash
npm ci
cp .env.example .env
```

Open `.env` and replace at least these development values:

- `DATABASE_URL`: a PostgreSQL URL for an existing local database
- `PAYLOAD_SECRET`: a long, private random string
- `SEED_ADMIN_EMAIL`: the local administrator email
- `SEED_ADMIN_PASSWORD`: a strong local-only password

The supplied URL assumes PostgreSQL is listening on `localhost:5432`, the `postgres` role uses the password `postgres`, and the default `postgres` database exists. Adjust it to match the local installation. Never commit `.env`.

Apply migrations before the first start:

```bash
npm run migrate
npm run db:check
npm run dev
```

The CMS is now available at:

- Admin: `http://localhost:3001/admin`
- REST API: `http://localhost:3001/api`

Keep this terminal running.

## 2. Seed local content

In a second terminal, from `portfolio-cms`:

```bash
npm run seed:dev
```

`seed:dev` creates the first local administrator when none exists, then idempotently loads permanent portfolio content and development writings. Use the credentials from `.env` to sign in. The first run uploads and processes project media, so it can take a minute or more.

Use `npm run seed:core` instead when test writings are not wanted. Never point a local seed command at production. The script rejects non-local targets unless a deliberate override is supplied.

## 3. Configure and start the UI

In another terminal, from `portfolio-ui`:

```bash
npm ci
cp .env.example .env.local
npm run develop
```

The website is available at `http://localhost:3000`. The example environment already points it at the local CMS on port `3001`.

## Daily startup

After initial setup:

1. Start PostgreSQL.
2. Run `npm run dev` in `portfolio-cms`.
3. Run `npm run develop` in `portfolio-ui`.

Run migrations after pulling CMS schema changes:

```bash
cd ../portfolio-cms
npm run migrate
```

If Payload warns that development-mode schema pushes have diverged from migrations or that data loss is possible, answer **no**. Back up the database and reconcile its migration state, or use a fresh local database. Do not approve a destructive schema push as routine startup.

Run the relevant seed again when baseline content or fixtures change. Seeds are idempotent.

## Verification

CMS checks:

```bash
npm run db:check
npm run build
```

UI check, while the CMS is running and seeded:

```bash
npm run build
```

The UI uses static export. A successful production-style build writes the site to `portfolio-ui/out/`.

## Troubleshooting

### The UI says `PAYLOAD_API_URL` is required

Confirm `portfolio-ui/.env.local` exists and contains:

```bash
PAYLOAD_API_URL=http://localhost:3001
```

Restart the UI after changing environment variables.

### The UI cannot load content

Open `http://localhost:3001/api/posts` and confirm the CMS is running. If the response is empty, run `npm run seed:dev` from `portfolio-cms`.

### The database connection fails

Confirm PostgreSQL is running, the database in `DATABASE_URL` exists, and the credentials are correct. Run `npm run migrate` before `npm run db:check`; a reachable database without the configured schema intentionally fails the check.

### Payload warns about possible data loss

Answer **no** unless the database is disposable and the proposed changes have been reviewed. This usually means the database was previously changed through Payload's development-mode schema push and no longer matches the committed migration history. Back it up and reconcile the schema, or point `DATABASE_URL` at a new local database and run `npm run migrate` again.

### A CMS build fails while an internal worker binds a port

Some restricted containers and AI execution sandboxes block Turbopack's CSS worker from opening a local port. Confirm the environment restriction with:

```bash
npx next build --webpack
```

The normal project and deployment command remains `npm run build`. Report the default build failure rather than silently treating the fallback as equivalent production validation.

### Port 3000 or 3001 is already in use

Stop the process already using the required port. The checked-in URLs and cross-origin settings assume the UI uses `3000` and the CMS uses `3001`.

### Seed authentication fails

If an administrator already exists, `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` must match it. Otherwise use the initial administrator created by `seed:dev` or manage the account through `/admin`.

## AI assistant entry points

- Read `AGENTS.md` before making changes.
- Use `.agents/skills/build-portfolio-ui/SKILL.md` for UI, UX, frontend, and Next.js work.
- For CMS contract changes, also use `../portfolio-cms/.agents/skills/develop-portfolio-cms/SKILL.md`.
- Treat the planning documents listed in `AGENTS.md` as implementation constraints.
