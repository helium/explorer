import ActivityColorSlice from './ActivityColorSlice'
import Image from 'next/image'

const ActivityListItem = ({ title, subtitle, highlightColor }) => {
  return (
    <div className="w-full flex items-stretch">
      <ActivityColorSlice highlightColor={highlightColor} />
      <div className="w-full flex justify-between px-4 py-2">
        <div className="w-full flex flex-col">
          <div className="w-full flex justify-between">
            <div className="w-full">
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
