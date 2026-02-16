import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

export async function runMigrations() {
  try {
    const result = await pool.query(`SELECT 1 FROM pg_enum WHERE enumlabel = 'returned' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'loan_status')`);
    if (result.rows.length === 0) {
      await pool.query(`ALTER TYPE loan_status ADD VALUE IF NOT EXISTS 'returned' AFTER 'pending'`);
      console.log("Added 'returned' enum value to loan_status");
    }
  } catch (err) {
    console.log("loan_status enum migration check:", (err as Error).message);
  }
}
