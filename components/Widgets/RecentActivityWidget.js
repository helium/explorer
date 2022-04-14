import Image from 'next/image'
import { Link } from 'react-router-i18n'
import { memo, useState } from 'react'
import { useAsync } from 'react-async-hook'
import client from '../../data/client'
import Skeleton from '../Common/Skeleton'
import {
  getPocReceiptRole,
  getTxnTypeColor,
  getTxnTypeName,
} from '../../utils/txns'
import TimeAgo from '../Common/TimeAgo'

const RecentActivityWidget = ({ context, address }) => {
  const [transactions, setTransactions] = useState([])
  const [transactionsLoading, setTransactionsLoading] = useState(true)

  useAsync(async () => {
    setTransactionsLoading(true)
    setTransactions(await (await client.hotspot(address).roles.list()).take(5))
    setTransactionsLoading(false)
  }, [address])

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
          {transactionsLoading ? (
            <div className="space-y-2 flex flex-col items-center justify-start w-full">
              <Skeleton className="w-full h-3.5" defaultSize={false} />
              <Skeleton className="w-full h-3.5" defaultSize={false} />
              <Skeleton className="w-full h-3.5" defaultSize={false} />
              <Skeleton className="w-full h-3.5" defaultSize={false} />
              <Skeleton className="w-full h-3.5" defaultSize={false} />
            </div>
          ) : (
            transactions.map((t) => (
              <div className="flex items-center justify-between w-full">
                <div
                  className="min-w-[4px] h-[10px] rounded-sm"
                  style={{
                    backgroundColor: t.type.startsWith('poc_receipts')
                      ? getTxnTypeColor(getPocReceiptRole(t.role))
                      : getTxnTypeColor(t.type),
                  }}
                />
                <div className="text-xs md:text-sm text-black tracking-tight w-full break-all ml-1">
                  {t.type.startsWith('poc_receipts')
                    ? getTxnTypeName(getPocReceiptRole(t.role), 'hotspot')
                    : getTxnTypeName(t.type, 'hotspot')}
                </div>

                <div className="text-xs md:text-sm text-gray-600 tracking-tight w-full break-all text-right pr-5">
                  <TimeAgo time={t.time} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="flex">
        <Image src="/images/details-arrow.svg" width={14} height={14} />
      </div>
    </Link>
  )
}

export default memo(RecentActivityWidget)
