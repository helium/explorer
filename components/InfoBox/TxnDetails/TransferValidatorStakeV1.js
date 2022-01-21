import Widget from '../../Widgets/Widget'
import AccountWidget from '../../Widgets/AccountWidget'
import InfoBoxPaneContainer from '../Common/InfoBoxPaneContainer'
import ValidatorWidget from '../../Widgets/ValidatorWidget'

const TransferValidatorStakeV1 = ({ txn }) => {
  return (
    <InfoBoxPaneContainer>
      <Widget title={'Stake'} value={txn.stakeAmount.toString(2)} />
      <Widget title={'Fee'} value={txn.fee.toString()} />
      <ValidatorWidget title="Old Address" address={txn.oldAddress} />
      <AccountWidget title="Old Owner" address={txn.oldOwner} />
      <Widget
        title={'Old Owner Signature'}
        value={txn.oldOwnerSignature}
        copyableValue={txn.oldOwnerSignature}
        span={2}
      />
      <ValidatorWidget title="New Address" address={txn.newAddress} />
      <Widget title="New Owner" value={txn.newOwner} span={2} />
      <Widget
        title={'New Owner Signature'}
        value={txn.newOwnerSignature}
        copyableValue={txn.newOwnerSignature}
        span={2}
      />
    </InfoBoxPaneContainer>
  )
}

export default TransferValidatorStakeV1
