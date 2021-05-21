import { useState } from 'react'
import { useAsync } from 'react-async-hook'
import HotspotWidget from '../../Widgets/HotspotWidget'
import { fetchHotspot } from '../../../data/hotspots'
import classNames from 'classnames'
import AccountWidget from '../../Widgets/AccountWidget'
import Widget from '../../Widgets/Widget'

const PocRequestV1 = ({ txn }) => {
  const [challenger, setChallenger] = useState()
  const [isLoadingInitial, setIsLoadingInitial] = useState()

  useAsync(async () => {
    setIsLoadingInitial(true)
    const fetchedChallenger = await fetchHotspot(txn.challenger)
    setChallenger(fetchedChallenger)
    setIsLoadingInitial(false)
  }, [])

  return (
    <div
      className={classNames('grid grid-flow-row grid-cols-1 no-scrollbar', {
        'overflow-y-scroll': !isLoadingInitial,
        'overflow-y-hidden': isLoadingInitial,
      })}
    >
      <div className="grid grid-flow-row grid-cols-2 gap-3 md:gap-4 p-4 md:p-8 overflow-y-scroll no-scrollbar">
        <HotspotWidget title="Challenger Hotspot" hotspot={challenger} />
        <AccountWidget title="Challenger Owner" address={txn.challengerOwner} />
        <Widget title="Version" value={txn.version} />
        <Widget title="Secret Hash" value={txn.secretHash} />
        <Widget title="Onion Key Hash" value={txn.onionKeyHash} />
        <Widget title="Fee" value={txn?.fee} />
        <Widget title="Block Hash" value={txn.blockHash} />
      </div>
    </div>
  )
}

export default PocRequestV1
