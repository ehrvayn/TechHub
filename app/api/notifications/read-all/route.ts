import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth/auth0";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { markAllAsRead } from "@/lib/controllers/notificationController";

export async function PATCH() {
  const session = await auth0.getSession();
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json(
      { success: false, message: "User not found" },
      { status: 404 },
    );
  }

  return markAllAsRead(currentUser.id);
}
