import pg from "pg";

const { Pool } = pg;

declare global {
  var _pgPool: pg.Pool | undefined;
}

const pool = global._pgPool ?? new Pool({
  connectionString: process.env.DATABASE_URL,
});

if (process.env.NODE_ENV !== "production") {
  global._pgPool = pool;
}

(async () => {
  try {
    await pool.query("SELECT NOW()");
    console.log("✅ DB Connected to TechHub!");
  } catch (err) {
    console.error("❌ DB Error:", err);
  }
})();

export const query = (text: string, params: unknown[] = []) => {
  return pool.query(text, params);
};

export default pool;