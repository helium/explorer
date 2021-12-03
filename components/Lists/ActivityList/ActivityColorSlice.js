import classNames from 'classnames'

const ActivityColorSlice = ({ highlightColor, opacity = 1 }) => {
  return (
    <div
      className={classNames('h-full w-3')}
      style={{ backgroundColor: highlightColor, opacity }}
    />
  )
}

export default ActivityColorSlice
