import classNames from 'classnames'
import { Link } from 'react-router-dom'
import Image from 'next/image'
import Skeleton from '../Common/Skeleton'
import CopyableText from '../Common/CopyableText'

const Widget = ({
  title,
  value,
  copyableValue,
  change,
  subtitle,
  onClick,
  icon,
  span = 1,
  isLoading = false,
  linkTo,
  titleIcon,
}) => {
  const inner = (
    <>
      <div className="w-full">
        <div className="flex items-center space-x-1">
          {titleIcon}
          <div className="text-gray-600 text-sm">{title}</div>
        </div>
        <div className="flex items-center">
          {icon && <div className="mr-1.5 flex items-center">{icon}</div>}
          <div className="text-2xl font-medium text-black my-1.5 tracking-tight w-full break-all">
            {isLoading ? (
              <Skeleton w="w-full" />
            ) : (
              <CopyableText textToCopy={copyableValue}>
                <p
                  className={classNames('flex items-center m-0 p-0', {
                    'cursor-pointer hover:text-gray-800 transition-all duration-150': copyableValue,
                  })}
                >
                  {value}
                </p>
              </CopyableText>
            )}
          </div>
        </div>
        {change &&
          (isLoading ? (
            <Skeleton w="w-1/4" />
          ) : (
            <div className="text-green-500 text-sm font-medium">
              {change > 0 ? '+' : ''}
              {change}
            </div>
          ))}
        {subtitle}
      </div>

      {(onClick || linkTo) && (
        <div className="flex">
          <Image src="/images/details-arrow.svg" width={14} height={14} />
        </div>
      )}
    </>
  )

  if (linkTo) {
    return (
      <Link
        className={classNames(
          'bg-gray-200 p-3 rounded-lg flex transition-all cursor-pointer hover:bg-gray-300',
          {
            'col-span-1': span === 1,
            'col-span-2': span === 2,
          },
        )}
        to={linkTo}
      >
        {inner}
      </Link>
    )
  }

  return (
    <div
      className={classNames('bg-gray-200 p-3 rounded-lg flex transition-all', {
        'col-span-1': span === 1,
        'col-span-2': span === 2,
        'cursor-pointer hover:bg-gray-300': !!onClick,
      })}
      onClick={onClick}
    >
      {inner}
    </div>
  )
}

export default Widget
