import { createLazyFileRoute } from '@tanstack/react-router'
import { AccountManagementOverview } from '@/features/user-management'

export const Route = createLazyFileRoute('/account')({
  component: Account,
})

function Account() {
  return <AccountManagementOverview />
}