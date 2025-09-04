import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { requireAuth } from '~/server/auth'

export const Route = createFileRoute('/')({
  beforeLoad: async () => await requireAuth(),
  component: Home,
})

function Home() {
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect to the current month's budget page
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    navigate({ to: `/app/${year}/${month}` })
  }, [navigate])

  return null
}
