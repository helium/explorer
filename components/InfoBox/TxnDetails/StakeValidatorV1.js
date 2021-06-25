import Widget from '../../Widgets/Widget'
import AccountWidget from '../../Widgets/AccountWidget'
import InfoBoxPaneContainer from '../Common/InfoBoxPaneContainer'
import ValidatorWidget from '../../Widgets/ValidatorWidget'

const StakeValidatorV1 = ({ txn }) => {
  return (
    <InfoBoxPaneContainer>
      <AccountWidget title="Owner" address={txn.owner} />
      <Widget title={'Stake'} value={txn.stake.toString(2)} />
      <Widget title={'Fee'} value={txn.fee.toString()} />
      <ValidatorWidget title="Validator" address={txn.address} />
      <Widget
        title={'Owner Signature'}
        value={txn.ownerSignature}
        copyableValue={txn.ownerSignature}
        span={2}
      />
    </InfoBoxPaneContainer>
  )
}

export default StakeValidatorV1
