import { Link } from 'react-router-i18n'
import { memo } from 'react'
import classNames from 'classnames'

const SubtitleSection = ({ subtitles }) => {
  return (
    <>
      {subtitles && subtitles.length > 0 && (
        <div className="py-2 inline-block">
          {subtitles.map((s, i, { length }) => {
            return (
              <span
                className={classNames('pointer-events-auto mb-1 inline-block', {
                  'ml-5': i < 2 && i !== 0,
                  'w-full': i > 1,
                })}
              >
                {s.iconPath && (
                  <img src={s.iconPath} className="h-2.5 w-auto mr-1.5" />
                )}
                <Link
                  className="ml-0.5 text-white font-sans font-regular"
                  to={s.path ? s.path : ''}
                >
                  {s.title}
                </Link>
              </span>
            )
          })}
        </div>
      )}
    </>
  )
}

export default memo(SubtitleSection)
