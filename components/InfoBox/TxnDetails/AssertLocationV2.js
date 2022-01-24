import { useState } from 'react'
import { useAsync } from 'react-async-hook'
import { fetchHotspot } from '../../../data/hotspots'
import AccountWidget from '../../Widgets/AccountWidget'
import HotspotWidget from '../../Widgets/HotspotWidget'
import Widget from '../../Widgets/Widget'
import { getMakerName } from '../../Makers/utils'
import { formatGain, formatElevation } from '../../Hotspots/utils'
import InfoBoxPaneContainer from '../Common/InfoBoxPaneContainer'

const AssertLocationV2 = ({ txn, inline }) => {
  const [assertedHotspot, setAssertedHotspot] = useState()
  const [makerName, setMakerName] = useState()
  const [isLoadingInitial, setIsLoadingInitial] = useState(false)

  useAsync(async () => {
    setIsLoadingInitial(true)
    const assertedHotspotFetched = await fetchHotspot(txn.gateway)
    if (txn.payer === txn.owner || txn.payer === null) {
      setMakerName('Hotspot Owner')
    } else {
      setMakerName(await getMakerName(txn.payer))
    }
    setAssertedHotspot(assertedHotspotFetched)
    setIsLoadingInitial(false)
  }, [])

  const stakingFeePayer =
    txn.payer === txn.owner || txn.payer === null ? txn.owner : txn.payer

  return (
    <InfoBoxPaneContainer padding={!inline}>
      <HotspotWidget
        hotspot={assertedHotspot}
        title="Asserted Hotspot"
        isLoading={isLoadingInitial}
      />
      <AccountWidget
        address={txn.owner}
        title="Asserted Hotspot Owner"
        isLoading={isLoadingInitial}
      />
      <Widget
        title={'Staking Fee'}
        value={txn.stakingFee.toString()}
        span={2}
        isLoading={isLoadingInitial}
      />
      <AccountWidget
        title={'Staking Fee Payer'}
        subtitle={<span className="text-gray-700">{makerName}</span>}
        address={stakingFeePayer}
        isLoading={isLoadingInitial}
      />
      {txn.lat && txn.lng && (
        <>
          <Widget
            title={'Asserted Latitude'}
            value={txn.lat}
            isLoading={isLoadingInitial}
          />
          <Widget
            title={'Asserted Longitude'}
            value={txn.lng}
            isLoading={isLoadingInitial}
          />
        </>
      )}
      <Widget
        title={'Elevation'}
        value={formatElevation(txn.elevation)}
        isLoading={isLoadingInitial}
      />
      <Widget
        title={'Gain'}
        value={formatGain(txn.gain)}
        isLoading={isLoadingInitial}
      />
      <Widget title={'Nonce'} value={txn.nonce} isLoading={isLoadingInitial} />
      <Widget
        title={'Fee'}
        value={txn.fee.toString()}
        isLoading={isLoadingInitial}
      />
    </InfoBoxPaneContainer>
  )
}

export default AssertLocationV2
