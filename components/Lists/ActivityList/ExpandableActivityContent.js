import { getPocReceiptRole } from '../../../utils/txns'
import animalHash from 'angry-purple-tiger'
import classNames from 'classnames'
import Pill from '../../Common/Pill'

const ExpandableActivityContent = ({ txn, address, context }) => {
  const role =
    txn.type === 'poc_receipts_v1' ? getPocReceiptRole(txn, address) : ''

  const rewardTypeText = {
    poc_witnesses: 'Witness',
    poc_challengers: 'Challenger',
    poc_challengees: 'Beacon',
    data_credits: 'Data',
    consensus: 'Consensus',
  }

  const rewardTypeColor = {
    poc_witnesses: '#FFC769',
    poc_challengers: '#BE73FF',
    poc_challengees: '#595A9A',
    data_credits: 'teal',
    consensus: '#FF6666',
  }

  const expandableContent =
    txn.type === 'rewards_v1' || txn.type === 'rewards_v2' ? (
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
                styleColor={rewardTypeColor[r.type]}
              />
            </span>
          )
        })}
      </div>
    ) : (
      <div className="bg-gray-300 w-full rounded-md px-2 py-2">
        <div className="flex-col items-center justify-start">
          <span className="flex items-center font-sans text-xs font-thin text-darkgray-800">
            Challenger
          </span>
          <span className="flex items-center font-medium">
            <img src="/images/challenger-icon.svg" className="h-3 w-auto" />
            <span
              className={classNames(
                'ml-1.5 flex items-center text-sm font-sans font-medium',
                {
                  'bg-purple-500 text-white opacity-75 px-2 py-0.5 rounded-md':
                    role === 'poc_challengers',
                  'text-black': role !== 'poc_challengers',
                },
              )}
            >
              {animalHash(txn.challenger)}
            </span>
          </span>
        </div>
        <div className="flex-col items-center justify-start mt-2">
          <span className="font-sans font-thin text-xs text-darkgray-800">
            Beaconer
          </span>
          <span className="flex items-center font-medium">
            <img src="/images/poc_receipt_icon.svg" className="h-3 w-auto" />
            <span
              className={classNames(
                'ml-1.5 whitespace-nowrap text-sm font-sans font-medium',
                {
                  'bg-blue-500 text-white opacity-75 px-2 py-0.5 rounded-md':
                    role === 'poc_challengees',
                  'text-black': role !== 'poc_challengees',
                },
              )}
            >
              {animalHash(txn.path[0].challengee)}
            </span>
          </span>
        </div>
        <div className="flex flex-col items-start justify-start mt-2">
          <span className="font-sans font-thin text-xs text-darkgray-800">
            Witnesses
          </span>
          <span className="flex flex-col">
            {!(
              role === 'poc_witnesses_valid' || role === 'poc_witnesses_invalid'
            ) ? (
              <span className="flex flex-row items-center justify-start">
                <img
                  src="/images/witness-yellow-mini.svg"
                  className="h-3 w-auto mr-1.5"
                />
                <span className="whitespace-nowrap text-sm font-sans font-medium text-black">
                  {`${txn.path[0].witnesses.length} hotspots`}
                </span>
              </span>
            ) : (
              <>
                <span className="flex flex-row items-center justify-start">
                  <img
                    src="/images/witness-yellow-mini.svg"
                    className="h-3 w-auto mr-1.5"
                  />
                  <span
                    className={classNames(
                      'whitespace-nowrap text-sm font-sans font-medium opacity-75 px-2 py-0.5 rounded-md',
                      {
                        'bg-yellow-500 text-black':
                          role === 'poc_witnesses_valid',
                        'bg-gray-800 text-white':
                          role === 'poc_witnesses_invalid',
                      },
                    )}
                  >
                    {`${animalHash(address)}`}
                  </span>
                </span>
                {role === 'poc_witnesses_invalid' && (
                  <span className="text-xs font-sans font-thin text-darkgray-800 mt-1.5">
                    (Invalid:{' '}
                    {
                      txn.path[0].witnesses.find((w) => w.gateway === address)
                        .invalidReason
                    }
                    )
                  </span>
                )}
                <span className="whitespace-nowrap text-sm font-sans font-thin text-gray-800 mt-1">{`... and ${
                  txn.path[0].witnesses.length - 1
                } other hotspots`}</span>
              </>
            )}
          </span>
        </div>
      </div>
    )

  return expandableContent
}

export default ExpandableActivityContent
