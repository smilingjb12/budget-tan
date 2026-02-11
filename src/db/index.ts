import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema/schema";

// Initialize PostgreSQL connection pool
// Use DATABASE_URL connection string if available (works with Railway public proxy)
// Falls back to individual connection parameters for local development
const pool = process.env.DATABASE_URL
  ? new Pool({
          connectionString: process.env.DATABASE_URL,
          ssl:
                    process.env.NODE_ENV === "production"
              ? { rejectUnauthorized: false }
                      : undefined,
  })
    : new Pool({
            host: process.env.POSTGRES_HOST,
            port: parseInt(process.env.POSTGRES_PORT!),
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DATABASE,
    });

// Initialize Drizzle ORM
export const db = drizzle(pool, { schema });

// Export schema for use in other files
export * from "./schema/schema";
