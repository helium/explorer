import animalHash from 'angry-purple-tiger'
import classNames from 'classnames'
import Pill from '../../Common/Pill'

const ExpandedRewardContent = ({ txn }) => {
  const rewardTypeText = {
    poc_witnesses: 'Witness',
    poc_challengers: 'Challenger',
    poc_challengees: 'Beacon',
    data_credits: 'Data',
    consensus: 'Consensus',
  }

  const rewardTypeColor = {
    poc_witnesses: 'witness',
    poc_challengers: 'challenger',
    poc_challengees: 'challengee',
    data_credits: 'data',
    consensus: 'consensus',
  }

  return (
    <div className="flex flex-col items-start w-full space-y-1 my-0.5">
      {txn.rewards.map((r, i) => {
        return (
          <span
            className={classNames(
              'mr-1 bg-gray-300 w-full px-2 py-1 flex rounded-md justify-between items-center',
            )}
          >
            <div className="flex items-start justify-start flex-col">
              <span className="text-black font-sans text-sm">
                {`+${r.amount.toString(3)}`}
              </span>
              <span className="text-black font-sans text-sm font-thin">
                {animalHash(r.gateway)}
              </span>
            </div>
            <Pill
              key={r.type}
              title={rewardTypeText[r.type] || r.type}
              tooltip={r.type}
              color={rewardTypeColor[r.type]}
            />
          </span>
        )
      })}
    </div>
  )
}

export default ExpandedRewardContent
