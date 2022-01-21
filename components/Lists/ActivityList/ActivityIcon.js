import { getTxnIconPath } from '../../../utils/txns'

const ActivityIcon = ({ highlightColor, txn }) => {
  const imagePath = getTxnIconPath(txn)
  return (
    <div>
      {imagePath ? (
        <img src={imagePath} className="w-8 h-8" alt="" />
      ) : (
        <div
          className="w-8 h-8 rounded-full"
          style={{ backgroundColor: highlightColor }}
        />
      )}
    </div>
  )
}

export default ActivityIcon
