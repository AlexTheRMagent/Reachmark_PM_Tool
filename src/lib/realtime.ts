export async function emitRealtime(event: string, payload: unknown) {
  const port = process.env.SOCKET_PORT || "3001";
  try {
    await fetch(`http://localhost:${port}/emit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, payload })
    });
  } catch {
    // Socket server is optional in dev startup order.
  }
}
