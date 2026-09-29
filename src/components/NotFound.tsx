import { Link } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'

export function NotFound({ children }: { children?: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col items-center justify-center gap-6 p-6 text-center">
      <div>
        <div className="figures text-5xl font-semibold tracking-tight text-muted-foreground">
          404
        </div>
        <div className="mt-3 text-sm text-muted-foreground">
          {children || <p>This page does not exist.</p>}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button variant="outline" size="sm" onClick={() => window.history.back()}>
          Go back
        </Button>
        <Button size="sm" asChild>
          <Link to="/">Open this month</Link>
        </Button>
      </div>
    </div>
  )
}
