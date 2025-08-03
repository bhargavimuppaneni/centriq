import { createLazyFileRoute } from '@tanstack/react-router'
 import { CampaignsDashboard } from '../features/campaigns/components/CampaignsDashboard'

export const Route = createLazyFileRoute('/campaign')({
  component: Dashboard,
})

function Dashboard() {
  return <CampaignsDashboard />
}