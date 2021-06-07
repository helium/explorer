import classNames from 'classnames'

const Skeleton = ({
  className,
  defaultSizing = true,
  defaultBackground = true,
}) => (
  <div
    className={classNames(className, 'animate-pulse rounded', {
      'h-4': defaultSizing,
      'bg-gray-200': defaultBackground,
    })}
  />
)

export default Skeleton
