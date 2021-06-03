import Hex from '../Hex'

const rewardScaleColor = (rewardScale) => {
  if (!rewardScale) return '#AAAAAA'

  const factor = 1 / 6

  if (rewardScale >= factor * 5) {
    return '#29D344'
  } else if (rewardScale >= factor * 4) {
    return '#9FE14A'
  } else if (rewardScale >= factor * 3) {
    return '#FCC945'
  } else if (rewardScale >= factor * 2) {
    return '#FEA053'
  } else if (rewardScale >= factor * 1) {
    return '#FC8745'
  } else {
    return '#FF6666'
  }
}

const RewardScaleHex = ({ rewardScale }) => {
  return (
    <span className="flex items-center w-12">
      <Hex width={10} height={12} fillColor={rewardScaleColor(rewardScale)} />
      <span className="ml-1">{rewardScale?.toFixed(2) || 'N/A'}</span>
    </span>
  )
}

export default RewardScaleHex
