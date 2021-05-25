import classNames from 'classnames'
import { Link } from 'react-router-dom'
import Image from 'next/image'
import Skeleton from '../Common/Skeleton'

const Widget = ({
  title,
  value,
  change,
  changeSuffix,
  subtitle,
  onClick,
  icon,
  span = 1,
  isLoading = false,
  linkTo,
  titleIcon,
}) => {
  const inner = (
    <div
      className={classNames(
        `bg-gray-200 p-3 rounded-lg col-span-${span} flex transition-all`,
        {
          'cursor-pointer hover:bg-gray-300': !!onClick,
        },
      )}
      onClick={onClick}
    >
      <div className="w-full">
        <div className="flex items-center space-x-1">
          {titleIcon}
          <div className="text-gray-600 text-sm">{title}</div>
        </div>
        <div className="flex items-center">
          {icon && <div className="mr-1.5 flex items-center">{icon}</div>}
          <div className="text-3xl font-medium text-black my-1.5 tracking-tight w-full">
            {isLoading ? <Skeleton /> : value}
          </div>
        </div>
        {change &&
          (isLoading ? (
            <Skeleton w="1/4" />
          ) : (
            <div
              className={classNames('text-sm font-medium', {
                'text-green-500': change > 0,
                'text-navy-400': change < 0,
              })}
            >
              {change > 0 ? '+' : ''}
              {change}
              {changeSuffix}
            </div>
          ))}
        {subtitle}
      </div>

      {(onClick || linkTo) && (
        <div className="flex">
          <Image src="/images/details-arrow.svg" width={14} height={14} />
        </div>
      )}
    </div>
  )

  if (linkTo) return <Link to={linkTo}>{inner}</Link>

  return inner
}

export default Widget
