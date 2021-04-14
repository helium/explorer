import Image from 'next/image'

const InfoBox = ({ title, visible = true, toggleVisible, children }) => {
  return (
    <div
      className="fixed left-0 z-20 md:left-10 md:top-0 bottom-0 md:m-auto w-full md:w-120 h-3/5 transform-gpu transition-transform duration-200 ease-in-out"
      style={{ transform: `translateY(${visible ? 0 : 120}%)` }}
    >
      <div className="absolute flex justify-between w-full -top-16 p-4 md:px-0">
        <span className="text-white text-3xl font-semibold">{title}</span>
        <div className="md:hidden" onClick={toggleVisible}>
          <Image src="/images/circle-arrow.svg" width={35} height={35} />
        </div>
      </div>
      <div className="bg-white rounded-t-xl md:rounded-xl shadow-lg w-full h-full flex flex-col">
        {children}
      </div>
    </div>
  )
}

export default InfoBox
