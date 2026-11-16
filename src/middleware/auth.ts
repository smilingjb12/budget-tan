import { createMiddleware } from "@tanstack/react-start";
import { auth } from "@clerk/tanstack-react-start/server";
import { MOCK_USER_ID, isMockAuth } from "~/lib/mock-auth";

export const authMiddleware = createMiddleware({
  type: 'function'
}).server(async ({ next }) => {
  const { userId } = isMockAuth ? { userId: MOCK_USER_ID } : await auth();

  if (!userId) {
    throw new Error("Authentication required");
  }

  return next({
    context: {
      userId,
    },
  });
});
