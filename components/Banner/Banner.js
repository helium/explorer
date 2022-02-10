const Banner = () => {
  return (
    <div className="fixed top-0 mx-auto w-full z-50">
      <div className="relative w-full">
        <a
          className="bg-navy-400 w-full hover:shadow-lg hover:bg-navy-500 flex items-center pr-12 justify-center transition-all px-5 duration-250 text-white text-xs md:text-base py-1 font-sans font-normal h-14 leading-tight"
          href="https://explorer.helium.com"
          rel="noopener noreferrer"
          target="_blank"
        >
          <p className="m-0">
            Explorer-v1 will no longer be accessible after Feb-18-2022. New
            Explorer can be found at explorer.helium.com
          </p>
        </a>
      </div>
    </div>
  )
}

export default Banner
