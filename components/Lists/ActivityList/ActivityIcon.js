import { getTxnIconPath } from '../../../utils/txns'

const ActivityIcon = ({ highlightColor, txn }) => {
  const imagePath = getTxnIconPath(txn)
  return (
    <div>
      {imagePath ? (
        <img src={imagePath} className="w-9 h-9" alt="" />
      ) : (
        <div
          className="w-9 h-9 rounded-full"
          style={{ backgroundColor: highlightColor }}
        />
      )}
    </div>
  )
}

export default ActivityIcon
