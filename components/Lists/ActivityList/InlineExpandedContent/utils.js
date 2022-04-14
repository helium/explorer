export const isDefaultExpandedStyle = (txn) => {
  return !(
    // any transaction type where we need to use custom padding /
    // spacing / backgrounds to make a nice looking expanded view
    txn?.type.startsWith('poc_receipts')
    // || txn?.type.startsWith('other_type')
  )
}
