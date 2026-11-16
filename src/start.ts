import { clerkMiddleware } from '@clerk/tanstack-react-start/server'
import { createStart } from '@tanstack/react-start'
import { isMockAuth } from './lib/mock-auth'

export const startInstance = createStart(() => {
  return {
    requestMiddleware: isMockAuth ? [] : [clerkMiddleware()],
  }
})
