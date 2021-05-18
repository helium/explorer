import { Link } from 'react-router-i18n'
import { memo } from 'react'
import classNames from 'classnames'
import CopyableText from '../Common/CopyableText'

const SubtitleSection = ({ subtitles }) => {
  return (
    <>
      {subtitles && subtitles.length > 0 && (
        <div className="py-2 inline-block">
          {subtitles.map((s, i, { length }) => {
            return (
              <>
                <span
                  className={classNames(
                    'pointer-events-auto mb-1 inline-block',
                    {
                      'ml-5': i < 2 && i !== 0,
                      'w-full': i > 1,
                    },
                  )}
                >
                  {s.iconPath && (
                    <img src={s.iconPath} className="h-2.5 w-auto mr-1.5" />
                  )}
                  <Link
                    className={classNames(
                      'ml-0.5 text-white font-regular font-sans',
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
