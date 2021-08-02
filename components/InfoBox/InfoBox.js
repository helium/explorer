import Image from 'next/image'
import { Helmet } from 'react-helmet'
import useInfoBox from '../../hooks/useInfoBox'
import classNames from 'classnames'
import Breadcrumbs from './Breadcrumbs'
import SubtitleSection from './SubtitleSection'

const InfoBox = ({ title, metaTitle, children, breadcrumbs, subtitles }) => {
  const { showInfoBox, toggleInfoBox } = useInfoBox()

  const BUTTON_SIZE = 30

  return (
    <div
      className={classNames(
        'pointer-events-none fixed left-0 z-20 bottom-0 md:top-0 md:m-auto w-full md:w-120 flex flex-col items-center justify-end transform-gpu transition-all duration-200 ease-in-out h-screen',
        // so that on a shorter browser window, the infobox won't go above the navbar
        // 'max-h-vh-minus-nav',
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
        <div className="flex justify-between w-full p-4 rounded-t-2xl md:rounded-none titlebox-blur md:pt-20">
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
          <div
            className="hidden md:flex h-16 bg-gray-800 w-5 opacity-75 pointer-events-auto backdrop-blur-2xl rounded-r-md absolute right-0 -mr-5 items-center justify-center cursor-pointer"
            onClick={toggleInfoBox}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={classNames('h-3 w-3 text-white', {
                'rotate-180': !showInfoBox,
              })}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </div>
        </div>
        <div
          className={classNames(
            'pointer-events-auto flex w-full md:h-auto max-h-650px md:max-h-screen',
            {
              'md:max-h-5/10 h-5/10': subtitles,
              'md:max-h-8/10 h-6/10': !subtitles,
            },
          )}
        >
          <div
            className={classNames(
              'bg-white w-full flex flex-col overflow-mask-fix md:h-screen infoboxshadow',
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
