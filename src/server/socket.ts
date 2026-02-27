import http from "http";

import { Server } from "socket.io";

const port = Number(process.env.SOCKET_PORT || 3001);

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/emit") {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      try {
        const body = JSON.parse(data);
        io.emit(body.event, body.payload);
      } catch {
        // no-op
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true }));
    });
    return;
  }

  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("socket server");
});

const io = new Server(server, {
  cors: { origin: "*" }
});

io.on("connection", (socket) => {
  socket.emit("hello", { connectedAt: new Date().toISOString() });
});

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Socket server on :${port}`);
});
