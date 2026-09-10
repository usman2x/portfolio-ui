import { timingSafeEqual } from "node:crypto"
import { spawn } from "node:child_process"
import { createServer } from "node:http"

const host = process.env.UI_DEPLOY_HOST || "127.0.0.1"
const port = Number(process.env.UI_DEPLOY_PORT || 9010)
const debounceMs = Number(process.env.UI_DEPLOY_DEBOUNCE_MS || 5000)
const expectedToken = (process.env.UI_DEPLOY_WEBHOOK_TOKEN || "").trim()

if (!expectedToken) {
  throw new Error("UI_DEPLOY_WEBHOOK_TOKEN is required")
}

let debounceTimer = null
let buildProcess = null
let rebuildRequested = false

const tokenMatches = authorization => {
  const suppliedToken = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length).trim()
    : ""
  const expected = Buffer.from(expectedToken)
  const supplied = Buffer.from(suppliedToken)
  return expected.length === supplied.length && timingSafeEqual(expected, supplied)
}

const pipeBuildOutput = (stream, target) => {
  stream.on("data", chunk => target.write(`[ui-deploy] ${chunk}`))
}

const runBuild = () => {
  if (buildProcess) {
    rebuildRequested = true
    return
  }

  console.info("[ui-deploy] Starting static UI rebuild")
  buildProcess = spawn(
    "/bin/bash",
    ["-lc", "source /home/ubuntu/.nvm/nvm.sh && nvm use 22 >/dev/null && npm run build"],
    {
      cwd: "/srv/portfolio/portfolio-ui",
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
    }
  )

  pipeBuildOutput(buildProcess.stdout, process.stdout)
  pipeBuildOutput(buildProcess.stderr, process.stderr)

  buildProcess.on("error", error => {
    console.error(`[ui-deploy] Failed to start build: ${error.message}`)
  })

  buildProcess.on("close", code => {
    console.info(`[ui-deploy] Build finished with exit code ${code ?? 1}`)
    buildProcess = null
    if (rebuildRequested) {
      rebuildRequested = false
      scheduleBuild()
    }
  })
}

const scheduleBuild = () => {
  if (buildProcess) {
    rebuildRequested = true
    return
  }
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    debounceTimer = null
    runBuild()
  }, debounceMs)
}

const server = createServer((request, response) => {
  if (request.method === "GET" && request.url === "/health") {
    response.writeHead(200, { "content-type": "application/json" })
    response.end(JSON.stringify({ building: Boolean(buildProcess), pending: Boolean(debounceTimer) }))
    return
  }

  if (request.method !== "POST" || request.url !== "/deploy") {
    response.writeHead(404).end()
    return
  }

  if (!tokenMatches(request.headers.authorization)) {
    response.writeHead(401).end()
    return
  }

  request.resume()
  scheduleBuild()
  response.writeHead(202, { "content-type": "application/json" })
  response.end(JSON.stringify({ accepted: true }))
})

server.listen(port, host, () => {
  console.info(`[ui-deploy] Listening on http://${host}:${port}`)
})

const shutdown = () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  server.close(() => process.exit(0))
}

process.on("SIGINT", shutdown)
process.on("SIGTERM", shutdown)
