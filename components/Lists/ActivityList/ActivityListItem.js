import ActivityColorSlice from './ActivityColorSlice'
import Image from 'next/image'
import ActivityIcon from './ActivityIcon'

const ActivityListItem = ({ title, subtitle, highlightColor }) => {
  return (
    <div className="bg-white hover:bg-bluegray-50 focus:bg-bluegray-50 cursor-pointer transition-all duration-75 relative flex border-solid border-bluegray-300 border-b border-t-0">
      <div className="w-full flex items-stretch justify-center">
        <div className="w-full flex px-4 py-2 space-x-2 items-center">
          <ActivityIcon highlightColor={highlightColor} />
          <div className="w-full flex flex-row">
            <div className="w-full flex justify-between">
              <div className="text-sm md:text-base font-medium text-darkgray-800 font-sans">
                {title}
              </div>
              <div className="flex items-center space-x-1 md:space-x-4 h-6 text-gray-525 text-xs md:text-sm whitespace-nowrap">
                {subtitle}
              </div>
            </div>
          </div>
        </div>
        <div className="flex">
          <Image src="/images/details-arrow.svg" width={14} height={14} />
        </div>
      </div>
    </div>
  )
}
export default ActivityListItem
