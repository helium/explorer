import Image from 'next/image'
import animalHash from 'angry-purple-tiger'
import { times } from 'lodash'
import Skeleton from '../Common/Skeleton'

const SkeletonList = ({ witnesses }) => {
  return (
    <div className="w-full grid grid-cols-1 divide-y divide-gray-400">
      {times(10).map((i) => (
        <div key={i} className="border-solid py-2 px-4 flex">
          <div className="w-full">
            <div className="text-base font-medium">
              <Skeleton />
            </div>
            <div className="flex items-center space-x-4 h-8">
              <Skeleton w="1/5" />
            </div>
          </div>
          <div className="flex">
            <Image src="/images/details-arrow.svg" width={10} height={10} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default SkeletonList
