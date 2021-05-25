import classNames from 'classnames'
import { useState } from 'react'
import { useAsync } from 'react-async-hook'
import animalHash from 'angry-purple-tiger'
import { fetchConsensusHotspots } from '../../../data/hotspots'
import { Link } from 'react-router-i18n'
import Widget from '../../Widgets/Widget'
import FlagLocation from '../../Common/FlagLocation'
import AccountAddress from '../../AccountAddress'
import AccountIcon from '../../AccountIcon'
import { truncateHash } from '../../../utils/format'

const ConsensusGroupV1 = ({ txn }) => {
  const [members, setMembers] = useState([])
  const [isLoadingInitial, setIsLoadingInitial] = useState(false)

  useAsync(async () => {
    setIsLoadingInitial(true)
    const membersFetched = await fetchConsensusHotspots(txn.height)
    setMembers(membersFetched)
    setIsLoadingInitial(false)
  }, [])

  return (
    <div
      className={classNames('grid grid-flow-row grid-cols-1 no-scrollbar', {
        'overflow-y-scroll': !isLoadingInitial,
        'overflow-y-hidden': isLoadingInitial,
      })}
    >
      <div className="grid grid-flow-row grid-cols-2 gap-3 md:gap-4 p-4 md:p-8 overflow-y-scroll no-scrollbar">
        <MembersWidget members={members} />
        <Widget
          title={'Delay'}
          value={txn.delay}
          span={2}
          isLoading={isLoadingInitial}
        />
        <Widget
          title={'Proof'}
          value={truncateHash(txn.proof, 10)}
          copyableValue={txn.proof}
          isLoading={isLoadingInitial}
          span={2}
        />
        {/* Spacer */}
        <div className="py-1 md:py-2 px-2" />
      </div>
    </div>
  )
}

const MembersWidget = ({ members }) => {
  return (
    <div className={classNames(`bg-gray-200 p-3 rounded-lg col-span-2`)}>
      <div className="text-gray-600 text-sm leading-loose">
        {members.length} Consensus Group Members
      </div>
      <div className="space-y-3">
        {members.map((m) => {
          return (
            <div key={m.address} className="flex justify-between items-center">
              <div className="w-full">
                <Link
                  to={`/hotspots/${m.address}`}
                  className="text-base leading-tight tracking-tight text-navy-1000 hover:text-navy-400 transition-all duration-150"
                >
                  {animalHash(m.address)}
                </Link>
                <div className="flex items-center w-full justify-between text-sm leading-tight tracking-tighter text-gray-600">
                  <div className="">
                    {m.geocode && <FlagLocation geocode={m.geocode} />}
                  </div>
                  <Link
                    to={`/accounts/${m.owner}`}
                    className="flex items-center justify-end text-gray-600 hover:text-navy-400"
                  >
                    <AccountIcon size={17} address={m.owner} />
                    <span className="pl-1 ">
                      <AccountAddress address={m.owner} truncate={4} mono />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ConsensusGroupV1
