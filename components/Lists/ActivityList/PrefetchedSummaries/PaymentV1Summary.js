import AccountAddress from '../../../../components/AccountAddress'
import AccountIcon from '../../../../components/AccountIcon'

const PaymentV1Summary = ({ txn, role, address }) => {
  const amount = txn.amount.toString(2)

  const isSender = role === 'payer'
  const sender = isSender ? txn.payee : txn.payer

  return (
    <span className="flex items-center">
      <img alt="" src="/images/hnt.svg" className="w-4 mr-1" />
      <span className="text-xs font-sans font-light tracking-tight flex items-center justify-start">
        {amount} {isSender ? 'to' : 'from'}
        <div className="ml-1">
          <span className="flex flex-row items-center justify-start space-x-0.5 ml-1">
            <AccountIcon address={sender} size={12} />
            <AccountAddress
              showSecondHalf={false}
              mono
              address={sender}
              truncate={4}
            />
          </span>
        </div>
      </span>
    </span>
  )
}

export default PaymentV1Summary
