import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth/auth0";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import {
  getNotifications,
  createNotificationHandler,
} from "@/lib/controllers/notificationController";

export async function GET(req: NextRequest) {
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

  return getNotifications(req, currentUser.id);
}

export async function POST(req: NextRequest) {
  return createNotificationHandler(req);
}
