import { useState } from 'react'
import { Balance, CurrencyType } from '@helium/currency'
import { useAsync } from 'react-async-hook'
import { fetchHotspot } from '../../../data/hotspots'
import AccountWidget from '../../Widgets/AccountWidget'
import HotspotWidget from '../../Widgets/HotspotWidget'
import Widget from '../../Widgets/Widget'
import { getMakerName } from '../../Makers/utils'

const AddGatewayV1 = ({ txn }) => {
  const [addedHotspot, setAddedHotspot] = useState()
  const [makerName, setMakerName] = useState()
  const [isLoadingInitial, setIsLoadingInitial] = useState(false)

  useAsync(async () => {
    setIsLoadingInitial(true)
    const addedHotspotFetched = await fetchHotspot(txn.gateway)
    let makerNameInfo = ''
    if (txn.stakingFeePayer === txn.owner || txn.payer === null) {
      makerNameInfo = 'Hotspot Owner'
    } else {
      const makerNameFetched = await getMakerName(txn.payer)
      makerNameInfo = makerNameFetched
    }
    setMakerName(makerNameInfo)
    setAddedHotspot(addedHotspotFetched)
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
        hotspot={addedHotspot}
        title="Added Hotspot"
        isLoading={isLoadingInitial}
      />
      <AccountWidget
        address={txn.owner}
        title="Added Hotspot Owner"
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
      <Widget
        title={'Fee'}
        value={feeObject.toString()}
        isLoading={isLoadingInitial}
        span={2}
      />
      {/* Spacer */}
      <div className="py-1 md:py-2 px-2" />
    </div>
  )
}

export default AddGatewayV1
