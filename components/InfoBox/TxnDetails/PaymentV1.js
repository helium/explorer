import { Balance, CurrencyType } from '@helium/currency'
import Widget from '../../Widgets/Widget'
import AccountWidget from '../../Widgets/AccountWidget'

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
    <>
      <div className="grid grid-flow-row grid-cols-2 gap-3 md:gap-4 p-4 md:p-8 overflow-y-scroll no-scrollbar">
        <AccountWidget title="Payer" address={txn.payer} />
        <AccountWidget title="Payee" address={txn.payee} />
        <Widget
          title={'Amount of HNT'}
          value={txnAmountObject.toString(2)}
          span={'col-span-2'}
        />
        <Widget
          title={'Fee'}
          value={txnFeeObject.toString()}
          span={'col-span-2'}
        />
      </div>
      {/* Spacer */}
      <div className="py-2 px-2" />
    </>
  )
}

export default PaymentV1
