const HexIndex = ({
  index,
  truncateAmount = 5,
  truncate = true,
  showSecondHalf,
}) => {
  return (
    <span>
      {truncate
        ? `${index.slice(0, truncateAmount)}...${
            showSecondHalf ? index.slice(-truncateAmount) : ''
          }`
        : index}
    </span>
  )
}

export default HexIndex
