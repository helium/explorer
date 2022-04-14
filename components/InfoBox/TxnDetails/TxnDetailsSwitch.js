import {
  PocReceiptsV1,
  PocReceiptsV2,
  PaymentV1,
  PaymentV2,
  Rewards,
  StateChannelCloseV1,
  StateChannelOpenV1,
  TransferHotspotV1,
  TransferHotspotV2,
  ConsensusGroupV1,
  AddGatewayV1,
  AssertLocationV1,
  AssertLocationV2,
  PocRequestV1,
  Fallback,
  TokenBurnV1,
  StakeValidatorV1,
  UnstakeValidatorV1,
  TransferValidatorStakeV1,
  ValidatorHeartbeatV1,
} from './index'

const getTxnComponent = (txn) => {
  switch (txn.type) {
    case 'poc_receipts_v1':
      return PocReceiptsV1
    case 'poc_receipts_v2':
      return PocReceiptsV2
    case 'payment_v1':
      return PaymentV1
    case 'payment_v2':
      return PaymentV2
    case 'poc_request_v1':
      return PocRequestV1
    case 'rewards_v1':
    case 'rewards_v2':
    case 'rewards_v3':
      return Rewards
    case 'consensus_group_v1':
      return ConsensusGroupV1
    case 'state_channel_close_v1':
      return StateChannelCloseV1
    case 'state_channel_open_v1':
      return StateChannelOpenV1
    case 'transfer_hotspot_v1':
      return TransferHotspotV1
    case 'transfer_hotspot_v2':
      return TransferHotspotV2
    case 'add_gateway_v1':
      return AddGatewayV1
    case 'assert_location_v1':
      return AssertLocationV1
    case 'assert_location_v2':
      return AssertLocationV2
    case 'token_burn_v1':
      return TokenBurnV1
    case 'stake_validator_v1':
      return StakeValidatorV1
    case 'unstake_validator_v1':
      return UnstakeValidatorV1
    case 'transfer_validator_stake_v1':
      return TransferValidatorStakeV1
    case 'validator_heartbeat_v1':
      return ValidatorHeartbeatV1
    default:
      return Fallback
  }
}

const TxnDetailsSwitch = ({ txn, isLoading, inline = false }) => {
  if (isLoading) return null

  const TxnComponent = getTxnComponent(txn)

  return <TxnComponent txn={txn} inline={inline} />
}
export default TxnDetailsSwitch
