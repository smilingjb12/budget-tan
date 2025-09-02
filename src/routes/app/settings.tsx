import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <p>This page will contain settings and regular payments management.</p>
    </div>
  )
}