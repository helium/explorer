import InfoBox from './InfoBox'
import { useParams } from 'react-router'
import {
  BeaconDetailsPane,
  PaymentV1,
  PaymentV2,
  PocReceiptsV1,
  Rewards,
  StateChannelCloseV1,
  StateChannelOpenV1,
  TransferHotspotV1,
  ConsensusGroupV1,
  AddGatewayV1,
  AssertLocationV1,
  AssertLocationV2,
  PocRequestV1,
  Fallback,
  TokenBurnV1,
} from './TxnDetails'
import useSelectedTxn from '../../hooks/useSelectedTxn'
import { useEffect } from 'react'
import { formattedTxnHash, getTxnTypeName } from '../../utils/txns'
import classNames from 'classnames'
import Timestamp from 'react-timestamp'

const TxnDetailsInfoBox = () => {
  const { hash } = useParams()
  const { selectedTxn, selectTxn, clearSelectedTxn } = useSelectedTxn()

  useEffect(() => {
    if (!selectedTxn) {
      selectTxn(hash)
    }
  }, [hash, selectTxn, selectedTxn])

  useEffect(() => {
    return () => {
      clearSelectedTxn()
    }
  }, [clearSelectedTxn])

  const generateTitle = (txn) => {
    if (!txn) return 'Loading transaction...'
    return `${getTxnTypeName(selectedTxn.type)} transaction`
  }

  const generateBreadcrumbs = (txn) => {
    if (!txn) return [{ title: 'Block ...' }]
    return [
      {
        title: `Block ${selectedTxn.height.toLocaleString()}`,
        path: `/blocks/${selectedTxn.height}`,
      },
    ]
  }

  const generateSubtitles = (txn) => {
    if (!txn)
      return [
        {
          iconPath: '/images/clock.svg',
          loading: true,
        },
        {
          iconPath: '/images/address.svg',
          loading: true,
        },
      ]
    return [
      {
        title: <Timestamp date={txn.time} />,
        iconPath: '/images/clock.svg',
      },
      {
        title: formattedTxnHash(txn.hash),
        textToCopy: txn.hash,
        iconPath: '/images/address.svg',
      },
    ]
  }

  return (
    <InfoBox
      title={generateTitle(selectedTxn)}
      breadcrumbs={generateBreadcrumbs(selectedTxn)}
      subtitles={generateSubtitles(selectedTxn)}
    >
      <div
        className={classNames('grid grid-flow-row grid-cols-1 no-scrollbar', {
          'overflow-y-scroll': selectedTxn,
          'overflow-y-hidden': !selectedTxn,
        })}
      >
        <TxnDetailsSwitch txn={selectedTxn} isLoading={!selectedTxn} />
      </div>
    </InfoBox>
  )
}

const TxnDetailsSwitch = ({ txn, isLoading }) => {
  if (isLoading) return null

  switch (txn.type) {
    case 'poc_receipts_v1':
      return <BeaconDetailsPane txn={txn} />
    case 'payment_v1':
      return <PaymentV1 txn={txn} />
    case 'payment_v2':
      return <PaymentV2 txn={txn} />
    case 'poc_request_v1':
      return <PocRequestV1 txn={txn} />
    // case 'poc_receipts_v1':
    //   return <PocReceiptsV1 txn={txn} />
    case 'rewards_v1':
      return <Rewards txn={txn} />
    case 'rewards_v2':
      return <Rewards txn={txn} />
    case 'consensus_group_v1':
      return <ConsensusGroupV1 txn={txn} />
    case 'state_channel_close_v1':
      return <StateChannelCloseV1 txn={txn} />
    case 'state_channel_open_v1':
      return <StateChannelOpenV1 txn={txn} />
    case 'transfer_hotspot_v1':
      return <TransferHotspotV1 txn={txn} />
    case 'add_gateway_v1':
      return <AddGatewayV1 txn={txn} />
    case 'assert_location_v1':
      return <AssertLocationV1 txn={txn} />
    case 'assert_location_v2':
      return <AssertLocationV2 txn={txn} />
    case 'token_burn_v1':
      return <TokenBurnV1 txn={txn} />
    default:
      return <Fallback txn={txn} />
  }
}

export default TxnDetailsInfoBox
