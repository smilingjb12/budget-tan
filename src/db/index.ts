import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema/schema";
import { getPgConnectionConfig } from "./connection";

// Initialize PostgreSQL connection pool
const pool = new Pool(getPgConnectionConfig());

// Initialize Drizzle ORM
export const db = drizzle(pool, { schema });

// Export schema for use in other files
export * from "./schema/schema";
