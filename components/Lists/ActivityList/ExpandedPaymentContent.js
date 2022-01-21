const ExpandedPaymentContent = ({ txn, role, address }) => {
  const isPayer = role === 'payer'

  // TODO: account for txn.type === 'payment_v1'
  const multiplePayments = txn.payments.length > 1

  if (!multiplePayments) {
    return (
      <div className="">
        {isPayer ? 'Sent' : 'Received'} {txn.payments[0].amount.toString(2)}
        {/* TODO: add payment details */}
      </div>
    )
  }

  return (
    <div className="">
      {txn.payments.map((payment) => payment.amount.toString(2))}
    </div>
  )
}

export default ExpandedPaymentContent
