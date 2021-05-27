import { useState, useEffect } from 'react'
import { Link } from 'react-router-i18n'
import AccountIcon from '../../AccountIcon'
import classNames from 'classnames'
import AccountAddress from '../../AccountAddress'
import { getTxnTypeName } from '../../../utils/txns'
import Widget from '../../Widgets/Widget'
import TransactionTypesWidget from '../../Widgets/TransactionTypesWidget'
import Skeleton from '../../Common/Skeleton'
import { Pagination } from 'antd'
import InfoBoxPaneContainer from '../Common/InfoBoxPaneContainer'

const Rewards = ({ txn }) => {
  const [groupedRewards, setGroupedRewards] = useState([])

  const PAGE_SIZE_DEFAULT = 20
  const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT)
  const [currentPage, setCurrentPage] = useState(1)

  const indexOfLast = currentPage * pageSize
  const indexOfFirst = indexOfLast - pageSize

  const currentPageOfRewards = groupedRewards.slice(indexOfFirst, indexOfLast)

  useEffect(() => {
    const groupedRewardsArray = []

    txn.rewards.forEach((r) => {
      const val = { account: r.account }
      val['rewards'] = txn.rewards.filter((obj) => {
        return obj.account === r.account
      })
      if (
        groupedRewardsArray.filter((e) => e.account === val.account).length ===
        0
      ) {
        val['count'] = val.rewards.length
        let amount = 0
        val.rewards.forEach((r) => {
          amount += r.amount.integerBalance / 100000000
        })
        val['amount'] = amount
        groupedRewardsArray.push(val)
      }
    })
    groupedRewardsArray.sort((b, a) =>
      a.amount > b.amount ? 1 : b.amount > a.amount ? -1 : 0,
    )
    setGroupedRewards(groupedRewardsArray)
  }, [])

  const RewardsRecipientsWidget = ({ rewardsRecipients }) => {
    if (!rewardsRecipients.length) return <Skeleton className="w-full" />
    return (
      <>
        <div className={classNames(`bg-gray-200 p-3 rounded-t-lg col-span-2`)}>
          <div className="text-gray-600 text-sm leading-loose pb-2">
            Rewards Recipients (
            {!rewardsRecipients.length ? 'Loading...' : groupedRewards.length})
          </div>
          <div className="space-y-4">
            {rewardsRecipients.map((rr) => {
              return <RewardRecipientRow rewardInfo={rr} />
            })}
          </div>
        </div>
        <div className="bg-gray-300 col-span-2 w-full -mt-3 md:-mt-4 border-t border-navy-500 rounded-b-lg py-2">
          <Pagination
            current={currentPage}
            showSizeChanger
            showLessItems
            size="small"
            total={groupedRewards.length}
            pageSize={pageSize}
            onChange={(page, pageSize) => {
              setCurrentPage(page)
              setPageSize(pageSize)
            }}
          />
        </div>
      </>
    )
  }

  const RewardRecipientRow = ({ rewardInfo }) => {
    const [expanded, setExpanded] = useState(false)

    return (
      <div className="flex flex-col">
        <div
          key={rewardInfo.address}
          className="flex justify-between items-center"
        >
          <div className="w-full">
            <Link
              to={`/accounts/${rewardInfo.account}`}
              className="text-base leading-tight tracking-tight text-navy-1000 hover:text-navy-400 transition-all duration-150 flex items-center justify-start"
            >
              <AccountIcon size={18} address={rewardInfo.account} />
              <span className="pl-1 ">
                <AccountAddress
                  address={rewardInfo.account}
                  truncate={4}
                  mono
                />
              </span>
            </Link>
            <div className="flex items-center w-full justify-between text-sm leading-tight tracking-tighter text-gray-600 mt-0.5">
              <p className="flex items-center justify-end text-gray-600 font-mono mt-1 mb-0">
                {rewardInfo.amount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                HNT
              </p>
            </div>
          </div>
          <button
            className="flex items-center justify-start bg-gray-300 hover:bg-gray-350 transition-all duration-150 outline-none rounded-full border-2 border-gray-350 focus:border-gray-600"
            onClick={() => {
              setExpanded((prevSetting) => !prevSetting)
            }}
          >
            <p className="whitespace-nowrap flex items-center justify-end text-gray-600 hover:text-gray-700 text-md my-0 px-3 py-1">
              {rewardInfo?.rewards?.length}{' '}
              {rewardInfo?.rewards?.length === 1 ? 'reward' : 'rewards'}
              <span className="ml-1 w-3">{expanded ? '-' : '+'}</span>
            </p>
          </button>
        </div>
        {expanded && (
          <div className="my-2 space-y-0.5 divide-y-2 divide-gray-200">
            {rewardInfo.rewards.map((r, i, { length }) => {
              return (
                <div
                  className={classNames(
                    'bg-gray-300 flex px-2 py-0.5 items-center justify-between',
                    {
                      'rounded-t-md': i === 0,
                      'rounded-b-md': i === length - 1,
                    },
                  )}
                >
                  <p className="text-gray-700 text-sm my-0 font-mono">
                    {r.amount.toString(2)}
                  </p>
                  <p className="text-gray-800 text-sm my-0 font-sans">
                    {getTxnTypeName(r.type)}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <div className="px-1 md:px-3 pt-1 md:pt-3">
        <TransactionTypesWidget txns={txn.rewards} />
      </div>
      <InfoBoxPaneContainer>
        <Widget
          title={'Total Amount'}
          value={txn.totalAmount.toString(2)}
          span={2}
        />
        <RewardsRecipientsWidget rewardsRecipients={currentPageOfRewards} />
      </InfoBoxPaneContainer>
    </>
  )
}

export default Rewards
