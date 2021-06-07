import classNames from 'classnames'

const Skeleton = ({ className }) => (
  <div
    className={classNames(className, 'animate-pulse h-4 rounded bg-gray-200')}
  />
)

export default Skeleton
