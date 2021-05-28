import Widget from '../../Widgets/Widget'
import AccountWidget from '../../Widgets/AccountWidget'
import InfoBoxPaneContainer from '../Common/InfoBoxPaneContainer'

const PaymentV1 = ({ txn }) => {
  return (
    <InfoBoxPaneContainer>
      <AccountWidget title="Payer" address={txn.payer} />
      <AccountWidget title="Payee" address={txn.payee} />
      <Widget title={'Amount of HNT'} value={txn.amount.toString(2)} span={2} />
      <Widget title={'Fee'} value={txn.fee.toString()} span={2} />
    </InfoBoxPaneContainer>
  )
}

export default PaymentV1
