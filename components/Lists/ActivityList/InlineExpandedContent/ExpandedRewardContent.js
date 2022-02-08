import animalHash from 'angry-purple-tiger'
import Pill from '../../../Common/Pill'

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

const ExpandedRewardContent = ({ txn, role }) => {
  return (
    <div className="flex flex-col items-start w-full space-y-1 my-0.5 border border-solid border-gray-300 rounded-md">
      {txn.rewards.map((r, i, { length }) => (
        <>
          <span
            key={i}
            className="mr-1 w-full px-2 pt-2 pb-1 flex rounded-md justify-between items-center"
          >
            <div className="flex items-start justify-start flex-col">
              <span className="text-black font-sans text-sm">
                {`+${r.amount.toString(5)}`}
              </span>
              {role !== 'reward_gateway' && (
                <span className="text-black font-sans text-sm font-thin">
                  {r?.gateway && animalHash(r.gateway)}
                </span>
              )}
            </div>
            <Pill
              key={r.type}
              title={rewardTypeText[r.type] || r.type}
              tooltip={r.type}
              color={rewardTypeColor[r.type]}
            />
          </span>
          {i !== length - 1 && <div className="h-px bg-gray-300 w-full" />}
        </>
      ))}
      <div className="bg-gray-200 flex flex-row items-center justify-between w-full border-t border-solid border-gray-500 px-1 py-2 rounded-b-md">
        <span className="text-black font-sans text-sm px-1 font-bold">
          {`+${txn.totalAmount.toString(5)}`}
        </span>
        <span className="text-xs text-gray-800 px-4">Total</span>
      </div>
    </div>
  )
}

export default ExpandedRewardContent
