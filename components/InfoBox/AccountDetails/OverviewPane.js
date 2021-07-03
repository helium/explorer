import { useParams } from 'react-router'
import { useAccount } from '../../../data/accounts'
import { TAKE_MAX } from '../../../data/client'
import { useHotspots } from '../../../data/hotspots'
import { useAccountValidators } from '../../../data/validators'
import QrWidget from '../../Widgets/QrWidget'
import Widget from '../../Widgets/Widget'
import InfoBoxPaneContainer from '../Common/InfoBoxPaneContainer'

const OverviewPane = () => {
  const { address } = useParams()
  const { account, isLoading } = useAccount(address)
  const { hotspots, isLoadingInitial: loadingHotspots } = useHotspots(
    'account',
    address,
    TAKE_MAX,
  )
  const { validators, isLoading: isLoadingValidators } = useAccountValidators(
    address,
  )

  return (
    <InfoBoxPaneContainer>
      <QrWidget address={address} />
      <Widget
        title="Total HNT Balance"
        isLoading={isLoading}
        span={2}
        value={maybeShowNone(
          account?.balance
            ?.plus(account?.stakedBalance)
            ?.toString(2, { showTicker: false }),
        )}
      />
      <Widget
        title="DC"
        titleIcon={<img alt="" src="/images/dc.svg" />}
        isLoading={isLoading}
        value={maybeShowNone(
          account?.dcBalance?.toString(0, { showTicker: false }),
        )}
      />
      <Widget
        title="HST"
        titleIcon={<img alt="" src="/images/hst.svg" />}
        isLoading={isLoading}
        value={maybeShowNone(
          account?.secBalance?.toString(2, { showTicker: false }),
        )}
      />
      <Widget
        title="Staked HNT"
        titleIcon={<img alt="" src="/images/validator.svg" />}
        isLoading={isLoading}
        value={maybeShowNone(
          account?.stakedBalance?.toString(2, { showTicker: false }),
        )}
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
