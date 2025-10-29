import { sub } from "@/app/server/redis";

export const runtime = "nodejs";

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const send = (event: string, data: any) => {
        try {
          controller.enqueue(encoder.encode(`event: ${event}\n`));
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        } catch (err) {
          console.warn("Controller closed, skipping enqueue");
        }
      };

      const handler = (channel: string, message: string) => {
        send(channel, JSON.parse(message));
      };

      sub.subscribe("partner:gps", "booking:confirmed", (err) => {
        if (err) console.error(err);
      });
      sub.on("message", handler);

      // Heartbeat every 15s to keep connection alive
      const hb = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(":\n\n"));
        } catch {
          clearInterval(hb);
        }
      }, 15000);

      // cleanup if stream closes
      controller.error = (e) => console.error("Controller error:", e);

      // Return cleanup logic
      return () => {
        clearInterval(hb);
        sub.removeListener("message", handler);
        sub.unsubscribe("partner:gps", "booking:confirmed");
        console.log("🔻 Stream closed and cleaned up");
      };
    },
    cancel() {
      console.log("Client disconnected, closing stream...");
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
    },
  });
}
