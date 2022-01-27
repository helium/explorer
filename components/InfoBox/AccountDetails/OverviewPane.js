import { useParams } from 'react-router'
import { useAccount } from '../../../data/accounts'
import QrWidget from '../../Widgets/QrWidget'
import PeriodizedRewardsWidget from '../../Widgets/PeriodizedRewardsWidget'
import Widget from '../../Widgets/Widget'
import InfoBoxPaneContainer from '../Common/InfoBoxPaneContainer'
import AccountBalanceWidget from '../../Widgets/AccountBalanceWidget'

const OverviewPane = () => {
  const { address } = useParams()
  const { account } = useAccount(address)

  return (
    <InfoBoxPaneContainer>
      <AccountBalanceWidget account={account} />
      <QrWidget address={address} />
      <PeriodizedRewardsWidget
        address={account?.address}
        type="account"
        title="Earnings (UTC)"
      />
      <Widget
        title="Hotspots"
        isLoading={!account}
        value={maybeShowNone(account?.hotspotCount)}
        linkTo={`/accounts/${address}/hotspots`}
      />
      <Widget
        title="Validators"
        isLoading={!account}
        value={maybeShowNone(account?.validatorCount)}
        linkTo={`/accounts/${address}/validators`}
      />
    </InfoBoxPaneContainer>
  )
}

const maybeShowNone = (value) => {
  if (value === 0) return <NoneValue />
  return value
}

const NoneValue = () => {
  return <span className="text-3xl text-gray-500">None</span>
}

export default OverviewPane
