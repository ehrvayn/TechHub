import { Auth0Client } from "@auth0/nextjs-auth0/server";
import { NextResponse } from "next/server";
import pool from "@/lib/database/db";
import { syncUser } from "@/lib/services/userService";

export const auth0 = new Auth0Client({
  async onCallback(error, context, session) {
    if (error) {
      return NextResponse.redirect(
        new URL(`/error?message=${error.message}`, process.env.APP_BASE_URL),
      );
    }

    if (session?.user) {
      await syncUser(session.user);

      const result = await pool.query(
        "SELECT role FROM users WHERE auth0_id = $1",
        [session.user.sub],
      );
      const role = result.rows[0]?.role;

      if (role === "admin") {
        return NextResponse.redirect(
          new URL("/admin", process.env.APP_BASE_URL),
        );
      }
    }

    return NextResponse.redirect(
      new URL(context.returnTo || "/", process.env.APP_BASE_URL),
    );
  },
});
