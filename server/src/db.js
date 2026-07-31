import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const { Pool } = pg;

console.log(
  "Database URL loaded:",
  Boolean(process.env.DATABASE_URL)
);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const query = (text, params = []) => {
  return pool.query(text, params);
};

export default pool;