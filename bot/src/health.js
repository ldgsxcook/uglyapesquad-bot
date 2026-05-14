import { createServer } from "node:http";

export function startHealthServer({ port, projectName }) {
  const startedAt = new Date();
  const server = createServer((request, response) => {
    const body = JSON.stringify({
      ok: true,
      service: "uas-v2-discord-bot",
      project: projectName,
      uptimeSeconds: Math.round(process.uptime()),
      startedAt: startedAt.toISOString()
    });

    if (request.url === "/" || request.url === "/healthz") {
      response.writeHead(200, {
        "content-type": "application/json",
        "cache-control": "no-store"
      });
      response.end(body);
      return;
    }

    response.writeHead(404, { "content-type": "application/json" });
    response.end(JSON.stringify({ ok: false, error: "Not found" }));
  });

  server.listen(port, "0.0.0.0", () => {
    console.log(`UAS v2 bot health check listening on :${port}`);
  });

  return server;
}
