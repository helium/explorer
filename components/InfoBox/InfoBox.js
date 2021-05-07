import Image from 'next/image'
import { Link } from 'react-router-i18n'
import useInfoBox from '../../hooks/useInfoBox'
import { useRouteMatch } from 'react-router-dom'
import { startCase } from 'lodash'
import classNames from 'classnames'

const InfoBox = ({ title, children }) => {
  const { showInfoBox, toggleInfoBox } = useInfoBox()

  const { url } = useRouteMatch()
  const breadcrumbs = url.split('/')

  return (
    <div
      className={classNames(
        'fixed left-0 md:left-10 z-20 bottom-0 md:top-0 md:m-auto w-full md:w-120 flex flex-col items-center justify-end md:justify-start transform-gpu transition-all duration-200 ease-in-out',
        // TODO: revisit Tailwind JIT mode. this is doable and much more flexible with Tailwind JIT and the [] syntax for arbitrary values, but for some reason it was breaking all Tailwind styles with Hot Module Reloading. for now we can extend the themes to use more manual values
        {
          'translate-y-120p md:-translate-x-full md:translate-y-0 opacity-25': !showInfoBox,
          'translate-y-0': showInfoBox,
        },
      )}
      style={{
        // the max height of the infobox, plus the height of the title + breadcrumbs
        height: 650 + 94,
      }}
    >
      <div className="w-full flex flex-col items-end justify-end md:justify-start">
        <div className="flex justify-between w-full p-4 md:px-0">
          <div className="flex flex-col items-start justify-start">
            {breadcrumbs &&
              breadcrumbs.map((b, i, { length }) => {
                if (b && i < length - 1)
                  return (
                    <span className="flex flex-row items-center justify-start pb-1">
                      <Link
                        className="text-gray-600 font-sans font-semibold"
                        to={`/${b}`}
                      >
                        {startCase(b)}
                      </Link>
                      <p className="text-gray-700 mx-2 my-0 font-black text-md font-sans">
                        /
                      </p>
                    </span>
                  )
              })}
            <span className="text-white text-3xl font-semibold font-sans tracking-tight">
              {title}
            </span>
          </div>
          <div onClick={toggleInfoBox}>
            <Image
              src="/images/circle-arrow.svg"
              className={classNames(
                'md:transform md:rotate-90 cursor-pointer',
                { 'md:-rotate-90': !showInfoBox },
              )}
              width={35}
              height={35}
            />
          </div>
        </div>
        <div className="bg-white rounded-t-xl md:rounded-xl w-full flex flex-col overflow-mask-fix h-auto max-h-650px infoboxshadow">
          {children}
        </div>
      </div>
    </div>
  )
}

export default InfoBox
