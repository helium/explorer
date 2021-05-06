import { useAsync } from 'react-async-hook'
import { useParams } from 'react-router'
import { fetchAccount } from '../../../data/accounts'
import { TAKE_MAX } from '../../../data/client'
import { useHotspots } from '../../../data/hotspots'
import QrWidget from '../../Widgets/QrWidget'
import Widget from '../../Widgets/Widget'

const OverviewPane = () => {
  const { address } = useParams()
  const { loading, result: account } = useAsync(fetchAccount, [address])
  const { hotspots, isLoadingInitial: loadingHotspots } = useHotspots(
    'account',
    address,
    TAKE_MAX,
  )

  return (
    <div className="grid grid-flow-row grid-cols-2 gap-3 md:gap-4 p-4 md:p-8 overflow-y-scroll no-scrollbar">
      <Widget
        title="HNT Balance"
        isLoading={loading}
        span={2}
        value={maybeShowNone(
          account?.balance?.toString(2, { showTicker: false }),
        )}
      />
      <Widget
        title="DC"
        titleIcon={<img src="/images/dc.svg" />}
        isLoading={loading}
        value={maybeShowNone(
          account?.dcBalance?.toString(0, { showTicker: false }),
        )}
      />
      <Widget
        title="HST"
        titleIcon={<img src="/images/hst.svg" />}
        isLoading={loading}
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
        isLoading={loading}
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
