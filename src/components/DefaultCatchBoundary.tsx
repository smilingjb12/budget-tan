import {
  ErrorComponent,
  Link,
  rootRouteId,
  useMatch,
  useRouter,
} from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const router = useRouter()
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  })

  console.error('DefaultCatchBoundary Error:', error)

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-6 p-6">
      <div className="w-full overflow-x-auto rounded-lg border border-border bg-card p-4 text-sm">
        <ErrorComponent error={error} />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          onClick={() => {
            router.invalidate()
          }}
        >
          Try again
        </Button>
        {isRoot ? (
          <Button variant="outline" size="sm" asChild>
            <Link to="/">Open this month</Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" asChild>
            <Link
              to="/"
              onClick={(e) => {
                e.preventDefault()
                window.history.back()
              }}
            >
              Go back
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}
