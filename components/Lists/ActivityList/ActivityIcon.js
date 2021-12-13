import classNames from 'classnames'

const ActivityIcon = ({ highlightColor }) => {
  return (
    <div>
      <div
        className={classNames('h-8 w-8 rounded-full')}
        style={{ backgroundColor: highlightColor }}
      />
    </div>
  )
}

export default ActivityIcon
