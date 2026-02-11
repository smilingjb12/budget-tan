import * as dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { getPgConnectionConfig } from "./connection";

// Load environment variables from .env.local file
dotenv.config({ path: ".env.local" });

async function main() {
  console.log("Migration started...");

  const usingDatabaseUrl = Boolean(process.env.DATABASE_URL);
  console.log(
    usingDatabaseUrl
      ? "Using DATABASE_URL for connection"
      : "Using individual connection parameters"
  );

  const pool = new Pool(getPgConnectionConfig());

  const db = drizzle(pool);

  // Run migrations
  await migrate(db, { migrationsFolder: "src/db/migrations" });

  console.log("Migration completed successfully");

  // Close the pool
  await pool.end();
}

main().catch((err) => {
  console.error("Migration failed");
  console.error(err);
  process.exit(1);
});
