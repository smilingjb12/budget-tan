import type { PoolConfig } from "pg";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1"]);

function isLocalHost(host?: string | null) {
  return Boolean(host && LOCAL_HOSTS.has(host));
}

function hasSslDisabledFlag(connectionString?: string) {
  return Boolean(
    connectionString &&
      (connectionString.includes("sslmode=disable") ||
        connectionString.includes("sslmode=prefer"))
  );
}

function shouldEnableSsl(connectionString?: string, host?: string) {
  if (process.env.POSTGRES_DISABLE_SSL === "true") {
    return false;
  }

  if (process.env.PGSSLMODE === "disable") {
    return false;
  }

  if (hasSslDisabledFlag(connectionString)) {
    return false;
  }

  if (isLocalHost(host)) {
    return false;
  }

  if (connectionString) {
    try {
      const url = new URL(connectionString);
      if (isLocalHost(url.hostname)) {
        return false;
      }
    } catch {
      // Ignore URL parsing errors and fall back to enabling SSL.
    }
  }

  return true;
}

export function getPgConnectionConfig(): PoolConfig {
  if (process.env.DATABASE_URL) {
    const connectionString = process.env.DATABASE_URL;
    const enableSsl = shouldEnableSsl(connectionString);

    return {
      connectionString,
      ...(enableSsl && { ssl: { rejectUnauthorized: false } }),
    };
  }

  const host = process.env.POSTGRES_HOST;
  const enableSsl = shouldEnableSsl(undefined, host);

  return {
    host,
    port: Number(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    ...(enableSsl && { ssl: { rejectUnauthorized: false } }),
  };
}
