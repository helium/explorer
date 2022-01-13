import {
  BeaconDetailsPane,
  PaymentV1,
  PaymentV2,
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
  StakeValidatorV1,
  TransferValidatorStakeV1,
  ValidatorHeartbeatV1,
} from './index'

const TxnDetailsSwitch = ({ txn, isLoading, inline = false }) => {
  if (isLoading) return null

  switch (txn.type) {
    case 'poc_receipts_v1':
      return <BeaconDetailsPane txn={txn} />
    case 'payment_v1':
      return <PaymentV1 txn={txn} inline={inline} />
    case 'payment_v2':
      return <PaymentV2 txn={txn} inline={inline} />
    case 'poc_request_v1':
      return <PocRequestV1 txn={txn} inline={inline} />
    case 'rewards_v1':
    case 'rewards_v2':
    case 'rewards_v3':
      return <Rewards txn={txn} />
    case 'consensus_group_v1':
      return <ConsensusGroupV1 txn={txn} inline={inline} />
    case 'state_channel_close_v1':
      return <StateChannelCloseV1 txn={txn} />
    case 'state_channel_open_v1':
      return <StateChannelOpenV1 txn={txn} inline={inline} />
    case 'transfer_hotspot_v1':
      return <TransferHotspotV1 txn={txn} inline={inline} />
    case 'add_gateway_v1':
      return <AddGatewayV1 txn={txn} inline={inline} />
    case 'assert_location_v1':
      return <AssertLocationV1 txn={txn} inline={inline} />
    case 'assert_location_v2':
      return <AssertLocationV2 txn={txn} inline={inline} />
    case 'token_burn_v1':
      return <TokenBurnV1 txn={txn} inline={inline} />
    case 'stake_validator_v1':
      return <StakeValidatorV1 txn={txn} inline={inline} />
    case 'transfer_validator_stake_v1':
      return <TransferValidatorStakeV1 txn={txn} inline={inline} />
    case 'validator_heartbeat_v1':
      return <ValidatorHeartbeatV1 txn={txn} inline={inline} />
    default:
      return <Fallback txn={txn} inline={inline} />
  }
}
export default TxnDetailsSwitch
