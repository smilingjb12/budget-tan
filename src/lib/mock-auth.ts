/**
 * Local mock mode: with `VITE_MOCK_AUTH=true` the dev server skips Clerk
 * entirely and treats every request as a fixed local user, so the app can be
 * run against a seeded local database (`npm run seed:mock`) without real
 * credentials. Only honoured by the dev server; production builds ignore it.
 */
export const isMockAuth =
  import.meta.env.DEV && import.meta.env.VITE_MOCK_AUTH === "true";

export const MOCK_USER_ID = "mock-user";
