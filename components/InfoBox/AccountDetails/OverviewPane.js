import { useParams } from 'react-router'
import { useAccount } from '../../../data/accounts'
import { TAKE_MAX } from '../../../data/client'
import { useHotspots } from '../../../data/hotspots'
import { useAccountValidators } from '../../../data/validators'
import QrWidget from '../../Widgets/QrWidget'
import PeriodizedRewardsWidget from '../../Widgets/PeriodizedRewardsWidget'
import Widget from '../../Widgets/Widget'
import InfoBoxPaneContainer from '../Common/InfoBoxPaneContainer'
import AccountBalanceWidget from '../../Widgets/AccountBalanceWidget'

const OverviewPane = () => {
  const { address } = useParams()
  const { account } = useAccount(address)
  const { hotspots, isLoadingInitial: loadingHotspots } = useHotspots(
    'account',
    address,
    TAKE_MAX,
  )
  const { validators, isLoading: isLoadingValidators } =
    useAccountValidators(address)

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
        isLoading={loadingHotspots}
        value={maybeShowNone(hotspots.length)}
        linkTo={`/accounts/${address}/hotspots`}
      />
      <Widget
        title="Validators"
        isLoading={isLoadingValidators}
        value={maybeShowNone(validators?.length)}
        linkTo={`/accounts/${address}/validators`}
      />
    </InfoBoxPaneContainer>
  )
}

const maybeShowNone = (value) => {
  if (value === '0') return <NoneValue />
  return value
}

const NoneValue = () => {
  return <span className="text-3xl text-gray-500">None</span>
}

export default OverviewPane
