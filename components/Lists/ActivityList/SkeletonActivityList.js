import Image from 'next/image'
import { times } from 'lodash'
import Skeleton from '../../Common/Skeleton'
import classNames from 'classnames'

const SkeletonActivityList = ({ padding }) => {
  return (
    <div className={classNames('w-full grid grid-cols-1', { 'p-3': padding })}>
      {times(20).map((_i, i, { length }) => (
        <div
          key={i}
          className={classNames(
            'py-2 px-4 flex border-solid border-gray-500 border-b',
          )}
        >
          <div className="w-full flex flex-row items-center justify-start space-x-2">
            <div className="h-8 w-8 rounded-full">
              <Skeleton
                defaultSize={false}
                defaultRounding={false}
                className="h-8 w-8 rounded-full"
              />
            </div>
            <Skeleton className="w-1/3" />
          </div>
          <div className="flex">
            <Image src="/images/details-arrow.svg" width={10} height={10} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default SkeletonActivityList
