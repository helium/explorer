import classNames from 'classnames'

const Skeleton = ({ className, customSizeClasses }) => (
  <div
    className={classNames(
      className,
      customSizeClasses,
      'animate-pulse rounded bg-gray-400',
      { 'h-4': !customSizeClasses },
    )}
  />
)

export default Skeleton
