import InfoBox from './InfoBox'
import TabNavbar, { TabPane } from '../Nav/TabNavbar'
import { useRichestAccounts } from '../../data/accounts'
import AccountsList from '../Lists/AccountsList'
import InfoBoxPaneContainer from './Common/InfoBoxPaneContainer'
import SkeletonList from '../Lists/SkeletonList'
import ErrorPane from './Common/ErrorPane'

const AccountsInfoBox = () => {
  const { accounts, isLoading } = useRichestAccounts()

  return (
    <InfoBox title="Accounts" metaTitle="Accounts">
      <TabNavbar>
        <TabPane title="Overview" key="overview">
          <div />
        </TabPane>
        <TabPane title="Richest" key="richest" path="richest">
          <InfoBoxPaneContainer span={1} padding={false}>
            {isLoading ? (
              <SkeletonList />
            ) : (
              <AccountsList accounts={accounts} />
            )}
          </InfoBoxPaneContainer>
        </TabPane>
        <TabPane fallback>
          <ErrorPane />
        </TabPane>
      </TabNavbar>
    </InfoBox>
  )
}

export default AccountsInfoBox
