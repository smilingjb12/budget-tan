import { createMiddleware } from "@tanstack/react-start";
import { getAuth } from "@clerk/tanstack-react-start/server";
import { getWebRequest } from "@tanstack/react-start/server";

export const authMiddleware = createMiddleware({
  type: 'function'
}).server(async ({ next }) => {
  const request = getWebRequest();
  if (!request) throw new Error('No request found');
  
  const { userId } = await getAuth(request);
  
  if (!userId) {
    throw new Error("Authentication required");
  }
  
  return next({
    context: {
      userId,
    },
  });
});
