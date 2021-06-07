import Image from 'next/image'
import useInfoBox from '../../hooks/useInfoBox'
import classNames from 'classnames'
import Breadcrumbs from './Breadcrumbs'
import SubtitleSection from './SubtitleSection'

const InfoBox = ({ title, children, breadcrumbs, subtitles }) => {
  const { showInfoBox, toggleInfoBox } = useInfoBox()

  const BUTTON_SIZE = 30

  return (
    <div
      className={classNames(
        'pointer-events-none fixed left-0 md:left-16 z-20 bottom-0 md:top-0 md:m-auto w-full md:w-120 flex flex-col items-center justify-end transform-gpu transition-all duration-200 ease-in-out',
        // so that on a shorter browser window, the infobox won't go above the navbar
        'max-h-vh-minus-nav',
        // TODO: revisit Tailwind JIT mode. this is doable and much more flexible with Tailwind JIT and the [] syntax for arbitrary values, but for some reason it was breaking all Tailwind styles with Hot Module Reloading. for now we can extend the themes to use more manual values:
        {
          'translate-y-120p md:-translate-x-full md:translate-y-0': !showInfoBox,
          'translate-y-0': showInfoBox,
        },
      )}
    >
      <div className="w-full flex flex-col items-end justify-end md:justify-start h-full max-h-90p">
        <div className="flex justify-between w-full p-4 rounded-t-2xl titlebox-blur">
          <div className="flex flex-col items-start justify-start">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <span className="pointer-events-auto text-white text-3xl font-semibold font-sans tracking-tight">
              {title}
            </span>
            <SubtitleSection subtitles={subtitles} />
          </div>
          <div
            style={{ minWidth: BUTTON_SIZE, minHeight: BUTTON_SIZE }}
            onClick={toggleInfoBox}
          >
            <Image
              src="/images/circle-arrow.svg"
              className={classNames(
                'pointer-events-auto md:transform md:rotate-90 cursor-pointer',
                { 'md:-rotate-90': !showInfoBox },
              )}
              width={BUTTON_SIZE}
              height={BUTTON_SIZE}
            />
          </div>
        </div>
        <div
          className={classNames(
            'pointer-events-auto flex w-full h-6/10 md:h-auto max-h-650px md:min-h-325px',
            {
              'md:max-h-5/10': subtitles,
              'md:max-h-6/10': !subtitles,
            },
          )}
        >
          <div
            className={classNames(
              'bg-white md:rounded-b-2xl w-full flex flex-col overflow-mask-fix md:h-auto infoboxshadow md:max-h-650px',
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default InfoBox
