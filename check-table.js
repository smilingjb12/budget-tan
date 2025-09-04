import * as dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

dotenv.config({ path: ".env.local" });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

try {
  // Check table structure
  const result = await db.execute(`
    SELECT column_name, data_type, is_nullable, column_default
    FROM information_schema.columns 
    WHERE table_name = 'regularPayments'
    ORDER BY ordinal_position;
  `);
  
  console.log('Current regularPayments table structure:');
  result.rows.forEach(row => {
    console.log(`- ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable}) ${row.column_default ? `default: ${row.column_default}` : ''}`);
  });

  // Check migration status - try different possible table names
  let migrations;
  try {
    migrations = await db.execute(`SELECT * FROM "__drizzle_migrations" ORDER BY created_at;`);
  } catch (e1) {
    try {
      migrations = await db.execute(`SELECT * FROM "drizzledrizzle_migrations" ORDER BY created_at;`);
    } catch (e2) {
      console.log('\nCould not find migration table, trying to list all tables:');
      const tables = await db.execute(`
        SELECT tablename FROM pg_tables WHERE schemaname = 'public';
      `);
      console.log('Available tables:', tables.rows.map(r => r.tablename));
      await pool.end();
      process.exit(0);
    }
  }
  
  console.log('\nMigration history:');
  migrations.rows.forEach((row, index) => {
    console.log(`${index + 1}. Hash: ${row.hash.substring(0, 20)}... Created: ${new Date(parseInt(row.created_at)).toISOString()}`);
  });
  
} catch (error) {
  console.error('Error:', error);
} finally {
  await pool.end();
}