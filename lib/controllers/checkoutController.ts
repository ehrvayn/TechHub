import { NextResponse } from "next/server";
import { checkout } from "@/lib/services/checkoutService";

import { auth0 } from "@/lib/auth0";
import pool from "@/lib/database/db";

async function getCurrentUserId(): Promise<number | null> {
  const session = await auth0.getSession();
  if (!session) return null;

  const result = await pool.query("SELECT id FROM users WHERE auth0_id = $1", [
    session.user.sub,
  ]);
  return result.rows[0]?.id ?? null;
}

export async function handleCheckout(request: Request) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ message: "Not logged in." }, { status: 401 });
  }

  try {
    const input = await request.json();
    const result = await checkout({ ...input, userId });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error occurred while processing checkout:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong!" },
      { status: 500 },
    );
  }
}
