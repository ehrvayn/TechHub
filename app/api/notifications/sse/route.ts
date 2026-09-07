import { NextRequest } from "next/server";
import { auth0 } from "@/lib/auth/auth0";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { notificationEmitter } from "@/lib/events/notificationEvents";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await auth0.getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return new Response("User not found", { status: 404 });
  }

  const userId = Number(currentUser.id);

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": keepalive\n\n"));
        } catch {
          clearInterval(heartbeat);
        }
      }, 15000);

      const onNotification = (data: { userId: number | string }) => {
        if (Number(data.userId) === userId) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "NEW_NOTIFICATION" })}\n\n`,
            ),
          );
        }
      };

      notificationEmitter.on("notification", onNotification);

      req.signal.addEventListener("abort", () => {
        clearInterval(heartbeat);
        notificationEmitter.off("notification", onNotification);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
