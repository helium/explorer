import classNames from 'classnames'

const Skeleton = () => (
  <div class="animate-pulse h-4 bg-gray-400 my-2 rounded w-3/4" />
)

const Widget = ({
  title,
  value,
  change,
  subtitle,
  onClick,
  icon,
  span = 1,
  isLoading = false,
}) => {
  return (
    <div
      className={classNames(`bg-gray-200 p-3 rounded-lg col-span-${span}`, {
        'cursor-pointer': !!onClick,
      })}
      onClick={onClick}
    >
      <div className="text-gray-600 text-sm">{title}</div>
      <div className="flex items-center">
        {icon && <div className="mr-1.5 flex items-center">{icon}</div>}
        <div className="text-3xl font-medium my-1.5 tracking-tighter w-full">
          {isLoading ? <Skeleton /> : value}
        </div>
      </div>
      {change && (
        <div className="text-green-500 text-sm font-medium">
          {change > 0 ? '+' : ''}
          {change}
        </div>
      )}
      {subtitle}
    </div>
  )
}

export default Widget
