import Widget from '../../Widgets/Widget'
import AccountWidget from '../../Widgets/AccountWidget'
import InfoBoxPaneContainer from '../Common/InfoBoxPaneContainer'

const PaymentV2 = ({ txn, inline }) => {
  return (
    <InfoBoxPaneContainer padding={!inline}>
      <AccountWidget title="Payer" address={txn.payer} />
      <Widget
        title={'Total HNT'}
        value={txn.totalAmount.toString(2)}
        span={2}
      />
      <Widget title={'Fee'} value={txn.fee.toString()} span={2} />

      {txn.payments.map((p, idx) => {
        return (
          <>
            <AccountWidget title={`Payee ${idx + 1}`} address={p.payee} />
            <Widget
              title={`HNT sent to Payee ${idx + 1}`}
              value={p.amount.toString(2)}
              span={2}
            />
          </>
        )
      })}
    </InfoBoxPaneContainer>
  )
}

export default PaymentV2
