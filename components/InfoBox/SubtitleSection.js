import { Link } from 'react-router-i18n'
import { memo } from 'react'
import classNames from 'classnames'
import CopyableText from '../Common/CopyableText'
import Skeleton from '../Common/Skeleton'

const SubtitleSection = ({ subtitles }) => {
  return (
    <>
      {subtitles && subtitles.length > 0 && (
        <div className="pt-2 inline-block">
          {subtitles.map((s, i, { length }) => {
            const LoadingIndicator = () => (
              <span className="flex items-center justify-start w-32 opacity-25 mb-1">
                <Skeleton my="my-0" w="w-full" />
              </span>
            )

            return (
              <>
                <span
                  className={classNames(
                    'pointer-events-auto mb-1 inline-flex items-center justify-start',
                    {
                      'ml-2.5 sm:ml-5': i < 2 && i !== 0,
                      'w-full': i > 1,
                    },
                  )}
                >
                  {s.iconPath && (
                    <img
                      src={s.iconPath}
                      className="h-2.5 w-auto mr-1 md:mr-1.5"
                    />
                  )}
                  {s.loading ? (
                    <LoadingIndicator />
                  ) : (
                    <Link
                      className={classNames(
                        'ml-0.5 text-white font-regular font-sans whitespace-nowrap text-xs sm:text-sm md:text-md',
                      )}
                      {...(s.path ? { to: s.path } : {})}
                    >
                      {s.textToCopy ? (
                        <CopyableText
                          textToCopy={s.textToCopy ? s.textToCopy : s.title}
                        >
                          {s.title}
                        </CopyableText>
                      ) : (
                        <span>{s.title}</span>
                      )}
                    </Link>
                  )}
                </span>
              </>
            )
          })}
        </div>
      )}
    </>
  )
}

export default memo(SubtitleSection)
