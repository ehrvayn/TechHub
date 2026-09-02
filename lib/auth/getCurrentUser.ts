import { auth0 } from "@/lib/auth/auth0";
import pool from "@/lib/database/db";

export async function getCurrentUser(): Promise<{
  id: number;
  role: string;
} | null> {
  const session = await auth0.getSession();
  if (!session) return null;

  const result = await pool.query(
    "SELECT id, role FROM users WHERE auth0_id = $1",
    [session.user.sub],
  );
  return result.rows[0] ?? null;
}
