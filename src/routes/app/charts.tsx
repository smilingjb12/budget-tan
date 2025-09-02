import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/charts')({
  component: ChartsPage,
})

function ChartsPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Charts</h1>
      <p>This page will display various budget charts and visualizations.</p>
    </div>
  )
}