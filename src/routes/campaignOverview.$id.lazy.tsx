import { createLazyFileRoute } from '@tanstack/react-router'
import { CampaignOverview } from '../features/campaigns/components/CampaignOverview'

export const Route = createLazyFileRoute('/campaignOverview/$id')({
  component: CampaignOverviewPage,
})

function CampaignOverviewPage() {
  const { id } = Route.useParams()
  return <CampaignOverview campaignId={id} />
}