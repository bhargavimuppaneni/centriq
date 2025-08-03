import { createLazyFileRoute } from '@tanstack/react-router'
// import { CampaignsDashboard } from '../features/campaigns/components/CampaignsDashboard'

 import { CampaignOverview } from '../features/campaigns/components/CampaignOverview'

export const Route = createLazyFileRoute('/campaign')({
  component: Dashboard,
})

function Dashboard() {
  return <CampaignOverview />
}