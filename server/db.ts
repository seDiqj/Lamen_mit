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

  try {
    const fixResult = await pool.query(`
      UPDATE loans SET status = 'returned' 
      WHERE status = 'pending' 
      AND id IN (
        SELECT fr.loan_id FROM fad_reviews fr
        WHERE fr.status = 'rejected'
        AND fr.created_at = (SELECT MAX(fr2.created_at) FROM fad_reviews fr2 WHERE fr2.loan_id = fr.loan_id)
      )
    `);
    if (fixResult.rowCount && fixResult.rowCount > 0) {
      console.log(`Fixed ${fixResult.rowCount} FAD-rejected loans from 'pending' to 'returned'`);
    }
  } catch (err) {
    console.log("FAD-rejected loan fix:", (err as Error).message);
  }
}
