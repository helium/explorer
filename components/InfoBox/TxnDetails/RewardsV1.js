import { useState, useEffect } from 'react'
import { Link } from 'react-router-i18n'
import AccountIcon from '../../../components/AccountIcon'
import classNames from 'classnames'
import AccountAddress from '../../../components/AccountAddress'
import { getTxnTypeName } from '../../../utils/txns'
import Widget from '../../Widgets/Widget'

const RewardsV1 = ({ txn }) => {
  const [groupedRewards, setGroupedRewards] = useState([])

  const groupedRewardsArray = []

  useEffect(() => {
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
        val['amount'] = amount.toLocaleString(undefined, {
          maximumFractionDigits: 2,
        })
        groupedRewardsArray.push(val)
      }
    })
    groupedRewardsArray.sort((b, a) =>
      a.amount > b.amount ? 1 : b.amount > a.amount ? -1 : 0,
    )
    setGroupedRewards(groupedRewardsArray)
  }, [])

  new Balance(txn.totalAmount.integerBalance, CurrencyType.networkToken)

  return (
    <div className="grid grid-flow-row grid-cols-2 gap-3 md:gap-4 p-4 md:p-8 overflow-y-scroll no-scrollbar">
      <Widget title={'Total Amount'} value={txn.totalAmount} span={2} />
      <RewardsRecipientsWidget rewardsRecipients={groupedRewards} />
      {/* Spacer */}
      <div className="py-1 md:py-2 px-2" />
    </div>
  )
}

const RewardsRecipientsWidget = ({ rewardsRecipients }) => {
  return (
    <div className={classNames(`bg-gray-200 p-3 rounded-lg col-span-2`)}>
      <div className="text-gray-600 text-sm leading-loose">
        Rewards Recipients ({rewardsRecipients?.length})
      </div>
      <div className="space-y-4">
        {rewardsRecipients.map((rr, i) => {
          return <RewardRecipientRow rewardInfo={rr} />
        })}
      </div>
    </div>
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
            <AccountIcon size={20} address={rewardInfo.account} />
            <span className="pl-1 ">
              <AccountAddress address={rewardInfo.account} truncate={7} mono />
            </span>
          </Link>
          <div className="flex items-center w-full justify-between text-sm leading-tight tracking-tighter text-gray-600 mt-0.5">
            <p className="flex items-center justify-end text-gray-600 font-mono">
              {rewardInfo.amount} HNT
            </p>
            <button
              className="flex items-center justify-start bg-gray-300 hover:bg-gray-350 outline-none rounded-full px-3 py-0.5"
              onClick={() => {
                setExpanded((prevSetting) => !prevSetting)
              }}
            >
              <p className="flex items-center justify-end text-gray-600 hover:text-gray-700 text-sm">
                {rewardInfo?.rewards?.length}{' '}
                {rewardInfo?.rewards?.length === 1 ? 'reward' : 'rewards'}
                <span className="ml-1">{expanded ? '-' : '+'}</span>
              </p>
            </button>
          </div>
        </div>
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
                <p className="text-gray-700 text-sm font-mono">
                  {r.amount.toString(2)}
                </p>
                <p className="text-gray-800 text-sm font-sans">
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

export default RewardsV1
