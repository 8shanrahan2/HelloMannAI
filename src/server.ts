import express from "express";
import { randomUUID } from "node:crypto";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

const PORT = Number(process.env.PORT ?? 3000);
const HOST = process.env.HOST ?? "0.0.0.0";

function createServer(): McpServer {
  const server = new McpServer({
    name: "hello-mannai",
    version: "0.1.0",
  });

  server.registerResource(
    "hello_mannai_widget",
    "ui://widget/hello-mannai.html",
    {},
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "text/html",
          text: `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Hello MannAI</title>
    <style>
      body {
        color: #111827;
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        margin: 0;
        padding: 16px;
      }

      .card {
        border: 1px solid #d1d5db;
        border-radius: 16px;
        padding: 16px;
      }

      h1 {
        font-size: 20px;
        margin: 0 0 8px;
      }

      p {
        line-height: 1.5;
        margin: 0 0 12px;
      }

      button {
        border: 1px solid #111827;
        border-radius: 999px;
        background: white;
        cursor: pointer;
        font-weight: 600;
        padding: 8px 14px;
      }

      .metric {
        font-size: 14px;
        margin-top: 12px;
      }
    </style>
  </head>
  <body>
    <main class="card">
      <h1>Hello MannAI</h1>
      <p>This is a tiny embedded UI for a ChatGPT app experiment.</p>
      <button id="button">Click me</button>
      <div class="metric">Clicks: <span id="count">0</span></div>
    </main>

    <script>
      let count = 0;
      const button = document.getElementById("button");
      const countDisplay = document.getElementById("count");

      button.addEventListener("click", () => {
        count += 1;
        countDisplay.textContent = String(count);
      });
    </script>
  </body>
</html>`,
          _meta: {
            "openai/widgetDescription": "A tiny Hello MannAI widget with a click counter.",
            "openai/widgetPrefersBorder": true,
          },
        },
      ],
    }),
  );

  server.registerTool(
    "hello_mannai",
    {
      title: "Hello MannAI",
      description: "Return a tiny Hello MannAI greeting and render the starter widget.",
      inputSchema: {},
      _meta: {
        "openai/outputTemplate": "ui://widget/hello-mannai.html",
        "openai/toolInvocation/invoking": "Waking up MannAI...",
        "openai/toolInvocation/invoked": "MannAI says hello.",
      },
    },
    async () => ({
      content: [
        {
          type: "text",
          text: "Hello from MannAI. This is your first ChatGPT app/MCP tool response.",
        },
      ],
      structuredContent: {
        message: "Hello from MannAI",
        status: "ok",
      },
    }),
  );

  server.registerTool(
    "get_standup_snapshot",
    {
      title: "Get Standup Snapshot",
      description: "Return mock standup metrics for the Hello MannAI dashboard idea.",
      inputSchema: {},
    },
    async () => ({
      content: [
        {
          type: "text",
          text: "Mock standup snapshot: 3 tickets closed, 2 opened, 1 blocker.",
        },
      ],
      structuredContent: {
        ticketsClosed: 3,
        ticketsOpened: 2,
        blockers: 1,
      },
    }),
  );

  return server;
}

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", app: "hello-mannai" });
});

app.post("/mcp", async (req, res) => {
  const server = createServer();
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: () => randomUUID(),
  });

  res.on("close", () => {
    void transport.close();
    void server.close();
  });

  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

app.listen(PORT, HOST, () => {
  console.log(`Hello MannAI MCP server listening on http://${HOST}:${PORT}/mcp`);
});
