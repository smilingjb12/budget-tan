import { db } from "~/db";

export async function checkDatabaseHealth(): Promise<{ healthy: boolean; error?: string }> {
  try {
    // Simple query to check if database is accessible
    await db.execute('SELECT 1');
    return { healthy: true };
  } catch (error) {
    console.error('Database health check failed:', error);
    return { 
      healthy: false, 
      error: error instanceof Error ? error.message : 'Unknown database error'
    };
  }
}