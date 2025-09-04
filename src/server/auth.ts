import { createServerFn } from '@tanstack/react-start'
import { getAuth } from '@clerk/tanstack-react-start/server'
import { getWebRequest } from '@tanstack/react-start/server'
import { redirect } from '@tanstack/react-router'

export const getCurrentUserId = createServerFn({
  method: 'GET',
}).handler(async () => {
  const request = getWebRequest()
  if (!request) throw new Error('No request found')
  
  const { userId } = await getAuth(request)
  
  return { userId }
})

export const requireAuth = createServerFn({ method: 'GET' }).handler(async () => {
  const request = getWebRequest()
  if (!request) throw new Error('No request found')
  const { userId } = await getAuth(request)

  if (!userId) {
    throw redirect({
      to: '/sign-in',
    })
  }

  return { userId }
})