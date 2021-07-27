import { Link } from 'react-router-i18n'
import { memo } from 'react'
import classNames from 'classnames'
import CopyableText from '../Common/CopyableText'
import Skeleton from '../Common/Skeleton'
import { Tooltip } from 'antd'

const SubtitleSection = ({ subtitles }) => {
  const SubtitleLoadingIndicator = ({ seeThrough, skeletonClasses }) => (
    <span
      className={classNames(
        'flex items-center justify-start',
        skeletonClasses,
        {
          'opacity-25': seeThrough,
          'w-20': !skeletonClasses,
        },
      )}
    >
      <Skeleton className="my-0 w-full h-4 md:h-5" defaultSize={false} />
    </span>
  )
  return (
    <>
      {subtitles && subtitles.length > 0 && (
        <div className="pt-1.5 inline-block">
          {subtitles.map((s, i) => (
            <Tooltip title={s.tooltip} placement={'bottom'}>
              <span
                className={classNames(
                  'pointer-events-auto mb-1 inline-flex items-center justify-start',
                  {
                    'ml-2': !s.newRow && i !== 0,
                    // a better longterm solution is probably to allow the "subtitles" object to define multiple rows, since it'll be obvious with a few test values how the rows of icons and properties should be arranged
                    'w-1/2': s.newRow,
                  },
                )}
              >
                {s.iconPath && (
                  <img
                    alt=""
                    src={s.iconPath}
                    className="h-2.5 md:h-3.5 w-auto mr-0.5 md:mr-1"
                  />
                )}
                {s.icon && s.icon}
                {s.loading ? (
                  <SubtitleLoadingIndicator
                    seeThrough
                    skeletonClasses={s.skeletonClasses}
                  />
                ) : (
                  <Link
                    className={classNames(
                      'ml-0.5 text-white font-regular font-sans whitespace-nowrap text-xs sm:text-sm md:text-md',
                    )}
                    {...(s.path ? { to: s.path } : {})}
                  >
                    <CopyableText
                      className="text-shadow tracking-tighter text-xs md:text-sm"
                      textToCopy={s.textToCopy}
                    >
                      {s.title}
                    </CopyableText>
                  </Link>
                )}
              </span>
            </Tooltip>
          ))}
        </div>
      )}
    </>
  )
}

export default memo(SubtitleSection)
