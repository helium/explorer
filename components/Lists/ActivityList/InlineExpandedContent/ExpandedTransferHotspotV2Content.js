import { useState } from 'react'
import { useAsync } from 'react-async-hook'
import { fetchHotspot } from '../../../../data/hotspots'
import AccountWidget from '../../../Widgets/AccountWidget'
import HotspotWidget from '../../../Widgets/HotspotWidget'
import animalHash from 'angry-purple-tiger'
import Widget from '../../../Widgets/Widget'
import AccountIcon from '../../../AccountIcon'
import AccountAddress from '../../../AccountAddress'
import Skeleton from '../../../Common/Skeleton'

const ThisHotspotWidgetContent = ({ address, title }) => {
  return (
    <Widget
      title={title}
      value={
        <div className="flex items-center justify-start">
          <AccountIcon address={address} />
          <span className="pl-1">
            <AccountAddress
              address={address}
              truncate={7}
              showSecondHalf={false}
            />
            <span className="text-gray-600">(this account)</span>
          </span>
        </div>
      }
    />
  )
}

const ExpandedTransferHotspotV1Content = ({ txn, role, address }) => {
  const isSender = txn.owner === address

  const [transferredHotspot, setTransferredHotspot] = useState()

  useAsync(async () => {
    const fetchedHotspot = await fetchHotspot(txn.gateway)
    setTransferredHotspot(fetchedHotspot)
  }, [txn.gateway])

  return (
    <div className="w-full flex flex-col items-stretch justify-center space-y-1 tracking-tight">
      {transferredHotspot ? (
        <HotspotWidget title="Hotspot" hotspot={transferredHotspot} />
      ) : (
        <Widget
          title="Hotspot"
          value={animalHash(txn.gateway)}
          span={2}
          change={<Skeleton className="w-1/3" />}
        />
      )}
      {isSender ? (
        <>
          <ThisHotspotWidgetContent
            address={txn.owner}
            title="Previous Owner"
          />
          <AccountWidget address={txn.newOwner} title="New Owner" />
        </>
      ) : (
        <>
          <AccountWidget address={txn.owner} title="Previous Owner" />
          <ThisHotspotWidgetContent address={txn.newOwner} title="New Owner" />
        </>
      )}
    </div>
  )
}

export default ExpandedTransferHotspotV1Content
