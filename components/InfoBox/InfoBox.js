import Image from 'next/image'
import useInfoBox from '../../hooks/useInfoBox'

const InfoBox = ({ title, children }) => {
  const { showInfoBox, toggleInfoBox } = useInfoBox()
  return (
    <div
      className="fixed left-0 z-20 md:left-10 md:top-0 bottom-0 md:m-auto w-full md:w-120 md:top-96  transform-gpu transition-transform duration-200 ease-in-out "
      style={{ transform: `translateY(${showInfoBox ? 0 : 120}%)` }}
    >
      <div className="absolute flex justify-between w-full -top-16 p-4 md:px-0">
        <span className="text-white text-3xl font-semibold font-sans tracking-tight">
          {title}
        </span>
        <div className="md:hidden" onClick={toggleInfoBox}>
          <Image src="/images/circle-arrow.svg" width={35} height={35} />
        </div>
      </div>
      <div className="bg-white rounded-t-xl md:rounded-xl  w-full flex flex-col overflow-mask-fix h-auto max-h-650 infoboxshadow">
        {children}
      </div>
    </div>
  )
}

export default InfoBox
