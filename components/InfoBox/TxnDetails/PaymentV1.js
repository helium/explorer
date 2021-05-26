import { Balance, CurrencyType } from '@helium/currency'
import Widget from '../../Widgets/Widget'
import AccountWidget from '../../Widgets/AccountWidget'
import InfoBoxPaneContainer from '../Common/InfoBoxPaneContainer'

const PaymentV1 = ({ txn }) => {
  const txnAmountObject = new Balance(
    txn.amount.integerBalance,
    CurrencyType.networkToken,
  )
  const txnFeeObject = new Balance(
    txn.fee.integerBalance,
    CurrencyType.dataCredit,
  )

  return (
    <InfoBoxPaneContainer>
      <AccountWidget title="Payer" address={txn.payer} />
      <AccountWidget title="Payee" address={txn.payee} />
      <Widget
        title={'Amount of HNT'}
        value={txnAmountObject.toString(2)}
        span={2}
      />
      <Widget title={'Fee'} value={txnFeeObject.toString()} span={2} />
    </InfoBoxPaneContainer>
  )
}

export default PaymentV1
