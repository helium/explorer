import classNames from 'classnames'
import { Link } from 'react-router-dom'
import Image from 'next/image'
import Skeleton from '../Common/Skeleton'
import CopyableText from '../Common/CopyableText'
import ExternalLinkIcon from '../Icons/ExternalLink'
import InfoTooltip from '../Common/InfoTooltip'

const Widget = ({
  title,
  tooltip,
  tooltipUrl,
  value,
  emptyValue = false,
  copyableValue,
  change,
  changeSuffix,
  valueSuffix,
  valueIsText = false,
  subtitle,
  longSubtitle = false,
  onClick,
  icon,
  span = 1,
  isLoading = false,
  subtitleLoading = false,
  linkTo,
  className,
  titleIcon,
  transparent = false,
  hidden,
}) => {
  const externalLink = linkTo && /^https?:\/\//.test(linkTo)

  const inner = (
    <>
      <div className="w-full text-gray-800">
        <div className="flex items-center space-x-1">
          {titleIcon}
          {isLoading && !title && <Skeleton className="w-1/5" />}
          {title && <div className="text-sm text-gray-600">{title}</div>}
          {(tooltip || tooltipUrl) && (
            <InfoTooltip text={tooltip} href={tooltipUrl} />
          )}
        </div>
        <div className="flex items-center">
          {icon && <div className="mr-1.5 flex items-center">{icon}</div>}
          <div className="text-l my-1.5 w-full break-all font-medium tracking-tight text-black md:text-2xl">
            {isLoading ? (
              <Skeleton className="w-full" />
            ) : (
              <CopyableText textToCopy={copyableValue}>
                <p
                  className={classNames('m-0 flex items-center p-0', {
                    'cursor-pointer transition-all duration-150 hover:text-gray-800':
                      copyableValue,
                    'text-md font-light text-gray-400': emptyValue,
                  })}
                >
                  <span className={valueIsText ? 'break-normal' : 'break-all'}>
                    {value}
                    {valueSuffix && valueSuffix}
                  </span>
                </p>
              </CopyableText>
            )}
          </div>
        </div>
        {change &&
          (isLoading ? (
            <Skeleton className="w-1/4" />
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
        {(subtitle && isLoading) || subtitleLoading ? (
          <Skeleton className="w-1/3" />
        ) : (
          <span
            className={classNames({
              'text-sm leading-tight': longSubtitle,
            })}
          >
            {subtitle}
          </span>
        )}
      </div>

      {(onClick || linkTo) && (
        <div className="flex items-center justify-center">
          {externalLink ? (
            <ExternalLinkIcon className="h-4 w-4 text-gray-525" />
          ) : (
            <Image src="/images/details-arrow.svg" width={14} height={14} />
          )}
        </div>
      )}
    </>
  )

  if (hidden) return null

  if (externalLink) {
    return (
      <a
        href={linkTo}
        target="_blank"
        rel="noopener noreferrer"
        className={classNames(
          'flex cursor-pointer rounded-lg p-3 transition-all',
          {
            'bg-gray-200': !transparent,
            'hover:bg-gray-300': !transparent,
            'col-span-1': span === 1,
            'col-span-2': span === 2,
          },
          className,
        )}
      >
        {inner}
      </a>
    )
  }

  if (linkTo) {
    return (
      <Link
        className={classNames(
          'flex cursor-pointer rounded-lg p-3 transition-all',
          {
            'bg-gray-200': !transparent,
            'hover:bg-gray-300': !transparent,
            'col-span-1': span === 1,
            'col-span-2': span === 2,
          },
          className,
        )}
        to={linkTo}
        onClick={onClick}
      >
        {inner}
      </Link>
    )
  }

  return (
    <div
      className={classNames(
        'flex rounded-lg p-3 transition-all',
        {
          'bg-gray-200': !transparent,
          'col-span-1': span === 1,
          'col-span-2': span === 2,
          'cursor-pointer hover:bg-gray-300': !!onClick,
        },
        className,
      )}
      onClick={onClick}
    >
      {inner}
    </div>
  )
}

export default Widget
