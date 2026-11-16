import { createServerFn } from '@tanstack/react-start'
import { auth } from '@clerk/tanstack-react-start/server'
import { redirect } from '@tanstack/react-router'
import { MOCK_USER_ID, isMockAuth } from '~/lib/mock-auth'

export const requireAuth = createServerFn({ method: 'GET' }).handler(async () => {
  const { userId } = isMockAuth ? { userId: MOCK_USER_ID } : await auth()

  if (!userId) {
    throw redirect({
      to: '/sign-in',
    })
  }

  return { userId }
})
