import { useActivity } from '../../data/activity'
import Image from 'next/image'
import { Link } from 'react-router-i18n'
import { memo } from 'react'

const RecentActivityWidget = ({ context, address }) => {
  const { transactions, hasMore, isLoadingInitial, isLoadingMore } =
    useActivity(context, address, [], 5)

  console.log(transactions)
  console.log('isLoadingInitial', isLoadingInitial)
  console.log('isLoadingMore', isLoadingMore)
  console.log('hasMore', hasMore)

  return (
    <Link
      className="bg-gray-200 hover:bg-gray-300 p-3 rounded-lg col-span-2 flex items-center justify-between w-full"
      to={`/${context}s/${address}/activity`}
    >
      <div className="w-full">
        <div className="text-gray-600 text-sm whitespace-nowrap">
          Recent Activity
        </div>

        <div className="my-1.5 flex items-center justify-start flex-col w-full">
          {transactions.map((t, i) => {
            return (
              <div className="flex items-center justify-between w-full">
                <div className="text-base font-medium text-black tracking-tight w-full break-all">
                  {t.type}
                </div>

                <div className="text-base text-gray-600 tracking-tight w-full break-all">
                  {t.height}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="flex">
        <Image src="/images/details-arrow.svg" width={14} height={14} />
      </div>
    </Link>
  )
}

export default memo(RecentActivityWidget)
