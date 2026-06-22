# Hello MannAI

A tiny **Hello World** style ChatGPT app/MCP server.

This repo is intentionally small. It gives you a baseline for experimenting with:

- an MCP server
- a ChatGPT-callable tool
- a simple embedded UI widget
- a future MannAI-style meeting or standup assistant

## What it does

The server exposes two starter tools:

| Tool | Purpose |
| --- | --- |
| `hello_mannai` | Returns a greeting and renders a tiny embedded widget. |
| `get_standup_snapshot` | Returns mock standup metrics: closed tickets, opened tickets, and blockers. |

## Local setup

```bash
npm install
npm run dev
```

By default the MCP endpoint runs at:

```text
http://localhost:3000/mcp
```

Health check:

```text
http://localhost:3000/health
```

## ChatGPT developer-mode connection

In ChatGPT, use developer mode for apps/connectors and point the MCP connector at your deployed `/mcp` endpoint.

For local development, expose the local server with a tunnel such as ngrok or Cloudflare Tunnel, then use the public HTTPS URL ending in `/mcp`.

Example:

```text
https://your-tunnel-url.example/mcp
```

## Deploying

This should be deployable to any Node-friendly host, including Vercel, Render, Fly.io, or Railway.

For Vercel, you may want to adapt the Express server to Vercel serverless route handlers later. For the first pass, this repo keeps the server plain and easy to understand.

## Next experiments

Good next steps:

1. Replace the mock standup data with real Jira/GitHub data.
2. Add a richer widget that displays closed/opened/blocker cards.
3. Add auth before connecting real company tools.
4. Add a small eval script that checks whether the tool response includes decisions, risks, blockers, and next actions.
