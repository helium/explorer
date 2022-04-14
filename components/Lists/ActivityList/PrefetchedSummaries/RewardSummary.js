const RewardSummary = ({ txn, address, role }) => {
  return (
    <span className="flex items-center">
      <img alt="" src="/images/hnt.svg" className="w-4 mr-1" />
      <span className="text-xs font-sans font-light tracking-tight">
        +{txn.totalAmount.toString(3)}
      </span>
    </span>
  )
}
export default RewardSummary
