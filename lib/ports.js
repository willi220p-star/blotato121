import net from "node:net";

export function getFreePort(preferred = 0) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on("error", reject);
    server.listen(preferred, "0.0.0.0", () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : preferred;
      server.close((error) => {
        if (error) reject(error);
        else resolve(port);
      });
    });
  });
}

export function waitForPort(port, timeoutMs = 20_000) {
  const started = Date.now();
  return new Promise((resolve, reject) => {
    const attempt = () => {
      const socket = net.connect({ host: "127.0.0.1", port }, () => {
        socket.end();
        resolve(port);
      });
      socket.on("error", () => {
        socket.destroy();
        if (Date.now() - started > timeoutMs) {
          reject(new Error(`Timed out waiting for port ${port}`));
          return;
        }
        setTimeout(attempt, 250);
      });
    };
    attempt();
  });
}

export function parsePortFromLogs(text) {
  const patterns = [
    /https?:\/\/(?:localhost|127\.0\.0\.1|0\.0\.0\.0):(\d+)/i,
    /listening (?:on|at).*?(?::|\bport\s+)(\d+)/i,
    /(?:listening on|port)\s+(\d+)/i,
    /Local:\s+https?:\/\/[^:]+:(\d+)/i,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return Number(match[1]);
  }
  return null;
}
