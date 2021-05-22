import { Balance, CurrencyType } from '@helium/currency'
import Widget from '../../Widgets/Widget'
import AccountWidget from '../../Widgets/AccountWidget'

const PaymentV2 = ({ txn }) => {
  const totalAmountObject = new Balance(
    txn.totalAmount.integerBalance,
    CurrencyType.networkToken,
  )
  const feeObject = new Balance(txn.fee.integerBalance, CurrencyType.dataCredit)
  return (
    <>
      <div className="grid grid-flow-row grid-cols-2 gap-3 md:gap-4 p-4 md:p-8 overflow-y-scroll no-scrollbar">
        <AccountWidget title="Payer" address={txn.payer} />
        <Widget
          title={'Total HNT'}
          value={totalAmountObject.toString(2)}
          span={'col-span-2'}
        />
        <Widget
          title={'Fee'}
          value={feeObject.toString()}
          span={'col-span-2'}
        />

        {txn.payments.map((p, idx) => {
          const paymentAmountObject = new Balance(
            p.amount.integerBalance,
            CurrencyType.networkToken,
          )
          return (
            <>
              <AccountWidget title={`Payee ${idx + 1}`} address={p.payee} />
              <Widget
                title={`HNT sent to Payee ${idx + 1}`}
                value={paymentAmountObject.toString(2)}
                span={'col-span-2'}
              />
            </>
          )
        })}
      </div>
      {/* Spacer */}
      <div className="py-2 px-2" />
    </>
  )
}

export default PaymentV2
