import Image from 'next/image'
import useInfoBox from '../../hooks/useInfoBox'
import classNames from 'classnames'
import Breadcrumbs from './Breadcrumbs'
import SubtitleSection from './SubtitleSection'

const InfoBox = ({ title, children, breadcrumbs, subtitles }) => {
  const { showInfoBox, toggleInfoBox } = useInfoBox()

  return (
    <div
      className={classNames(
        'pointer-events-none fixed left-0 md:left-10 z-20 bottom-0 md:top-0 md:m-auto w-full md:w-120 flex flex-col items-center justify-end md:justify-start transform-gpu transition-all duration-200 ease-in-out',
        // so that on a shorter browser window, the infobox won't go above the navbar
        'max-h-vh-minus-nav',
        // TODO: revisit Tailwind JIT mode. this is doable and much more flexible with Tailwind JIT and the [] syntax for arbitrary values, but for some reason it was breaking all Tailwind styles with Hot Module Reloading. for now we can extend the themes to use more manual values:
        {
          'translate-y-120p md:-translate-x-full md:translate-y-0 opacity-25': !showInfoBox,
          'translate-y-0': showInfoBox,
        },
      )}
      style={{
        // the max height of the infobox + the height of the title & breadcrumbs
        height: 650 + 170,
      }}
    >
      <div className="w-full flex flex-col items-end justify-end md:justify-start h-full max-h-90p">
        <div className="flex justify-between w-full p-4 md:px-0">
          <div className="flex flex-col items-start justify-start">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <span className="text-white text-3xl font-semibold font-sans tracking-tight">
              {title}
            </span>
            <SubtitleSection subtitles={subtitles} />
          </div>
          <div onClick={toggleInfoBox}>
            <Image
              src="/images/circle-arrow.svg"
              className={classNames(
                'pointer-events-auto md:transform md:rotate-90 cursor-pointer',
                { 'md:-rotate-90': !showInfoBox },
              )}
              width={35}
              height={35}
            />
          </div>
        </div>
        <div className="bg-white pointer-events-auto rounded-t-xl md:rounded-xl w-full flex flex-col overflow-mask-fix h-6/10 md:h-auto max-h-6/10 sm:max-h-90p infoboxshadow">
          {children}
        </div>
      </div>
    </div>
  )
}

export default InfoBox
