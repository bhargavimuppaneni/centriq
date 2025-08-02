import { createLazyFileRoute } from '@tanstack/react-router'
import { ClientDataSourceDashboard } from '../features/client-management/components/ClientDataSourceDashboard'

export const Route = createLazyFileRoute('/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  return <ClientDataSourceDashboard />
}