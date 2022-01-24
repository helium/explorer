import classNames from 'classnames'

const Skeleton = ({
  className,
  defaultSize = true,
  defaultRounding = true,
  defaultBackground = true,
}) => (
  <div
    className={classNames(className, 'animate-pulse', {
      rounded: defaultRounding,
      'h-4': defaultSize,
      'bg-gray-400': defaultBackground,
    })}
  />
)

export default Skeleton
