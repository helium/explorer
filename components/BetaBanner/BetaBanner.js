import { useContext } from 'react'
import BetaBannerContext from './BannerContext'

const BetaBanner = () => {
  const { toggleBetaBanner } = useContext(BetaBannerContext)
  return (
    <div className="fixed top-0 mx-auto w-full z-50">
      <div className="relative w-full">
        <a
          className="bg-navy-400 w-full hover:shadow-lg hover:bg-navy-500 flex items-center pr-12 justify-center transition-all px-5 duration-250 text-white text-xs md:text-base py-1 font-sans font-normal h-14 leading-tight"
          href="https://explorer-beta.helium.com/"
          rel="noopener noreferrer"
          target="_blank"
        >
          <p className="m-0">
            Psst! We've been working on a new Explorer and we'd love for you to
            try it out and let us know what you think. Check it out {'->'}
          </p>
        </a>
        <button
          className="border border-solid absolute right-0 top-0 border-navy-800 hover:bg-navy-600 w-10 h-full z-40 cursor-pointer bg-navy-500 focus:border-navy-400 flex items-center justify-center"
          onClick={toggleBetaBanner}
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

export default BetaBanner
