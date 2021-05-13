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
                className={classNames('pointer-events-auto inline-block', {
                  'ml-5': i !== length - 1 && i !== 0,
                })}
              >
                {s.Icon && s.Icon}
                <Link
                  className="ml-0.5 text-white font-sans font-regular"
                  to={s.path}
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
