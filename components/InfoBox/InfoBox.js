import Image from 'next/image'
import { Helmet } from 'react-helmet'
import useInfoBox from '../../hooks/useInfoBox'
import classNames from 'classnames'
import Breadcrumbs from './Breadcrumbs'
import SubtitleSection from './SubtitleSection'
import ChevronIcon from '../Icons/Chevron'

const InfoBox = ({ title, metaTitle, children, breadcrumbs, subtitles }) => {
  const { showInfoBox, toggleInfoBox } = useInfoBox()

  const BUTTON_SIZE = 30

  return (
    <div
      className={classNames(
        'pointer-events-none fixed left-0 z-20 bottom-0 md:top-0 md:m-auto w-full md:w-120 flex flex-col items-center justify-end transform-gpu transition-all duration-200 ease-in-out h-screen',
        // TODO: revisit Tailwind JIT mode. this is doable and much more flexible with Tailwind JIT and the [] syntax for arbitrary values, but for some reason it was breaking all Tailwind styles with Hot Module Reloading. for now we can extend the themes to use more manual values:
        {
          'translate-y-120p md:-translate-x-full md:translate-y-0':
            !showInfoBox,
          'translate-y-0': showInfoBox,
        },
      )}
    >
      <Helmet>
        <title>
          {metaTitle ? `${metaTitle} — Helium Explorer` : 'Helium Explorer'}
        </title>
      </Helmet>
      <div className="w-full md:h-screen h-full flex flex-col items-end justify-end md:justify-start max-h-90p md:max-h-screen">
        <div className="flex justify-between w-full p-4 rounded-t-2xl md:rounded-none titlebox-blur md:pt-28">
          <div className="flex flex-col items-start justify-start">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <span className="pointer-events-auto text-white text-2xl md:text-3xl font-semibold font-sans tracking-tight">
              {title}
            </span>
            <SubtitleSection subtitles={subtitles} />
          </div>
          <div
            className="relative md:hidden"
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
            'pointer-events-auto flex w-full md:h-full md:max-h-full overflow-hidden max-h-[650px]',
            { 'h-[70%]': subtitles, 'h-[78%]': !subtitles },
          )}
        >
          <div
            className={classNames(
              'bg-white w-full flex flex-col overflow-mask-fix md:h-full infoboxshadow relative',
            )}
          >
            {children}
          </div>
        </div>
        <div
          className="fixed hidden md:flex pointer-events-auto cursor-pointer right-0 top-28 button-blur items-center justify-center h-14 w-5 rounded-r-md -mr-5"
          onClick={toggleInfoBox}
        >
          <ChevronIcon
            className={classNames('h-2.5 w-2.5 text-gray-525', {
              'rotate-90': !showInfoBox,
              '-rotate-90': showInfoBox,
            })}
          />
        </div>
      </div>
    </div>
  )
}

export default InfoBox
