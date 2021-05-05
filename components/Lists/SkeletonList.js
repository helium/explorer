import Image from 'next/image'
import { times } from 'lodash'
import Skeleton from '../Common/Skeleton'
import classNames from 'classnames'

const SkeletonList = ({ padding }) => {
  return (
    <div className={classNames('w-full grid grid-cols-1', { 'p-3': padding })}>
      {times(10).map((_i, i, { length }) => (
        <div
          key={i}
          className={classNames(
            'py-2 px-4 flex border-solid border-gray-500 border-t border-l border-r',
            {
              'rounded-t-lg': i === 0,
              'rounded-b-lg border-b': i === length - 1,
              'border-b-0': i !== 0 && i !== length - 1,
            },
          )}
        >
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
