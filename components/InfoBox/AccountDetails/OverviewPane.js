import { useParams } from 'react-router'
import { useAccount } from '../../../data/accounts'
import { TAKE_MAX } from '../../../data/client'
import { useHotspots } from '../../../data/hotspots'
import QrWidget from '../../Widgets/QrWidget'
import Widget from '../../Widgets/Widget'

const OverviewPane = () => {
  const { address } = useParams()
  const { account, isLoading } = useAccount(address)
  const { hotspots, isLoadingInitial: loadingHotspots } = useHotspots(
    'account',
    address,
    TAKE_MAX,
  )

  return (
    <div className="grid grid-flow-row grid-cols-2 gap-3 md:gap-4 p-4 md:p-8 overflow-y-scroll no-scrollbar">
      <Widget
        title="HNT Balance"
        isLoading={isLoading}
        span={2}
        value={maybeShowNone(
          account?.balance?.toString(2, { showTicker: false }),
        )}
      />
      <Widget
        title="DC"
        titleIcon={<img src="/images/dc.svg" />}
        isLoading={isLoading}
        value={maybeShowNone(
          account?.dcBalance?.toString(0, { showTicker: false }),
        )}
      />
      <Widget
        title="HST"
        titleIcon={<img src="/images/hst.svg" />}
        isLoading={isLoading}
        value={maybeShowNone(
          account?.secBalance?.toString(2, { showTicker: false }),
        )}
      />
      <Widget
        title="Hotspots"
        isLoading={loadingHotspots}
        value={maybeShowNone(hotspots.length)}
        linkTo={`/accounts/${address}/hotspots`}
      />
      <Widget
        title="Staked HNT"
        isLoading={isLoading}
        value={maybeShowNone('0')}
      />
      <QrWidget address={address} />
      <div className="col-span-2 pb-1" />
    </div>
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
