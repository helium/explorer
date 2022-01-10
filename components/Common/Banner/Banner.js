import { useCallback } from 'react'
import { useContext } from 'react'
import useMapLayer from '../../../hooks/useMapLayer'
import BannerContext from './BannerContext'

const Banner = () => {
  const { hideBanner } = useContext(BannerContext)
  const { setMapLayer } = useMapLayer()

  const updateMapLayer = useCallback(
    (layer) => () => {
      setMapLayer(layer)
      hideBanner()
    },
    [hideBanner, setMapLayer],
  )

  return (
    <div className="fixed top-0 mx-auto w-full z-50">
      <div className="relative w-full">
        <a
          className="bg-navy-400 w-full hover:shadow-lg hover:bg-navy-500 flex items-center pr-8 justify-center transition-all px-0.5 md:px-5 duration-250 text-white text-xs md:text-sm py-1 font-sans font-normal md:h-8 h-8 leading-tight"
          onClick={updateMapLayer('earnings')}
          rel="noopener noreferrer"
        >
          <p className="m-0 mr-1">
            Check out the new Earnings Map layer. Click the icon in the bottom
            right corner
          </p>

          <svg
            width="20"
            height="18"
            viewBox="0 0 27 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              opacity="0.6"
              d="M9.85264 9.68533C11.8494 8.53263 15.0867 8.53262 17.0834 9.68533L24.6781 14.0697C26.6748 15.2224 26.6748 17.0913 24.6781 18.244L17.0834 22.6284C15.0867 23.7811 11.8494 23.7811 9.85265 22.6284L2.25797 18.244C0.261262 17.0913 0.261256 15.2224 2.25797 14.0697L9.85264 9.68533Z"
              fill="white"
              fill-opacity="0.61"
            />
            <path
              opacity="0.8"
              d="M9.85264 1.37185C11.8494 0.21915 15.0867 0.219147 17.0834 1.37185L24.6781 5.75625C26.6748 6.90895 26.6748 8.77786 24.6781 9.93056L17.0834 14.315C15.0867 15.4677 11.8494 15.4677 9.85265 14.315L2.25797 9.93056C0.261262 8.77786 0.261256 6.90896 2.25797 5.75626L9.85264 1.37185Z"
              fill="white"
            />
          </svg>

          <p className="m-0 mr-2 ml-1">and select Earnings.</p>
        </a>
        <button
          className="border border-solid absolute right-0 top-0 border-transparent hover:bg-navy-600 w-8 md:w-10 h-full z-40 cursor-pointer bg-navy-500 focus:outline-none focus:border-navy-400 flex items-center justify-center"
          onClick={hideBanner}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Banner
