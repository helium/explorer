import { useState } from 'react'
import { Balance, CurrencyType } from '@helium/currency'
import { useAsync } from 'react-async-hook'
import { fetchHotspot } from '../../../data/hotspots'
import AccountWidget from '../../Widgets/AccountWidget'
import HotspotWidget from '../../Widgets/HotspotWidget'
import Widget from '../../Widgets/Widget'
import { getMakerName } from '../../Makers/utils'

const AssertLocationV1 = ({ txn }) => {
  const [assertedHotspot, setAssertedHotspot] = useState()
  const [makerName, setMakerName] = useState()
  const [isLoadingInitial, setIsLoadingInitial] = useState(false)

  useAsync(async () => {
    setIsLoadingInitial(true)
    const assertedHotspotFetched = await fetchHotspot(txn.gateway)
    let makerNameInfo = ''
    if (txn.stakingFeePayer === txn.owner || txn.payer === null) {
      makerNameInfo = 'Hotspot Owner'
    } else {
      const makerNameFetched = await getMakerName(txn.payer)
      makerNameInfo = makerNameFetched
    }
    setMakerName(makerNameInfo)
    setAssertedHotspot(assertedHotspotFetched)
    setIsLoadingInitial(false)
  }, [])

  const stakingFeeObject = new Balance(
    txn.stakingFee.integerBalance,
    CurrencyType.dataCredit,
  )
  const stakingFeePayer =
    txn.payer === txn.owner || txn.payer === null ? txn.owner : txn.payer

  const feeObject = new Balance(txn.fee.integerBalance, CurrencyType.dataCredit)

  return (
    <div className="grid grid-flow-row grid-cols-2 gap-3 md:gap-4 p-4 md:p-8 overflow-y-scroll no-scrollbar">
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
        value={stakingFeeObject.toString()}
        span={2}
        isLoading={isLoadingInitial}
      />
      <AccountWidget
        title={'Staking Fee Payer'}
        address={stakingFeePayer}
        isLoading={isLoadingInitial}
      />
      <Widget
        title={'Staking Fee Payer Name'}
        value={makerName}
        span={2}
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
      <Widget title={'Nonce'} value={txn.nonce} isLoading={isLoadingInitial} />
      <Widget
        title={'Fee'}
        value={feeObject.toString()}
        isLoading={isLoadingInitial}
      />
      {/* Spacer */}
      <div className="py-2 px-2" />
    </div>
  )
}

export default AssertLocationV1
