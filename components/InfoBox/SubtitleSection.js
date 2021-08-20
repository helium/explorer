import { Link } from 'react-router-i18n'
import { memo } from 'react'
import classNames from 'classnames'
import CopyableText from '../Common/CopyableText'
import Skeleton from '../Common/Skeleton'
import { Tooltip } from 'antd'

const Subtitle = ({ subtitle }) => (
  <Tooltip title={subtitle.tooltip} placement={'bottom'}>
    <span className="pointer-events-auto inline-flex items-center justify-start">
      {subtitle.iconPath && (
        <img
          alt=""
          src={subtitle.iconPath}
          className="h-2.5 md:h-3.5 w-auto mr-0.5 md:mr-1"
        />
      )}
      {subtitle.icon && (
        <div className={classNames(subtitle?.iconClasses)}>{subtitle.icon}</div>
      )}
      {subtitle.loading ? (
        <SubtitleLoadingIndicator
          seeThrough
          skeletonClasses={subtitle.skeletonClasses}
        />
      ) : (
        <Link
          className={classNames(
            'ml-0.5 text-white font-regular font-sans whitespace-nowrap text-xs sm:text-sm md:text-md',
          )}
          {...(subtitle.path ? { to: subtitle.path } : {})}
        >
          <CopyableText
            className={classNames(
              'text-shadow tracking-tighter text-xs md:text-sm',
              { 'mr-1 md:mr-1.5': subtitle?.textToCopy },
            )}
            iconClasses="h-2.5 md:h-3.5 w-auto"
            textToCopy={subtitle.textToCopy}
          >
            {subtitle.title}
          </CopyableText>
        </Link>
      )}
    </span>
  </Tooltip>
)

const SubtitleLoadingIndicator = ({ seeThrough, skeletonClasses }) => (
  <span
    className={classNames('flex items-center justify-start', skeletonClasses, {
      'opacity-25': seeThrough,
      'w-20': !skeletonClasses,
    })}
  >
    <Skeleton className="my-0 w-full h-4 md:h-5" defaultSize={false} />
  </span>
)

const SubtitleSection = ({ subtitles }) => {
  if (!subtitles) return null

  return (
    subtitles.length > 0 && (
      <div className="pt-1.5 space-y-1 inline-block">
        {subtitles.map((row) => (
          <div className="w-full flex flex-row items-center justify-start space-x-2 md:space-x-3">
            {row.map((s) => (
              <Subtitle subtitle={s} />
            ))}
          </div>
        ))}
      </div>
    )
  )
}

export default memo(SubtitleSection)
