import type { Config } from "drizzle-kit";

export default {
  schema: "./db/schema.ts", // Adjust this path to match your schema location
  out: "./drizzle",
  driver: "pg", // or 'mysql2' or 'better-sqlite3'
  dbCredentials: {
    connectionString:
      process.env.DATABASE_URL ||
      "postgresql://user:password@localhost:5432/db_name",
  },
} satisfies Config;
