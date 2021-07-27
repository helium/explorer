import classNames from 'classnames'

const ActivityColorSlice = ({ highlightColor }) => {
  return (
    <div
      className={classNames('h-full w-3')}
      style={{ backgroundColor: highlightColor }}
    />
  )
}

export default ActivityColorSlice
