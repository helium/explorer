import classNames from 'classnames'
import { useState } from 'react'
import { useAsync } from 'react-async-hook'
import animalHash from 'angry-purple-tiger'
import { fetchHotspot } from '../../../data/hotspots'
import HotspotWidget from '../../Widgets/HotspotWidget'
import Pill from '../../Common/Pill'
import { h3ToGeo } from 'h3-js'
import { formatDistance, calculateDistance } from '../../../utils/distance'
import { Link } from 'react-router-i18n'

const BeaconDetailsPane = ({ txn }) => {
  const [challenger, setChallenger] = useState()
  const [target, setTarget] = useState()
  const [isLoadingInitial, setIsLoadingInitial] = useState(false)

  useAsync(async () => {
    setIsLoadingInitial(true)
    const [fetchedChallenger, fetchedTarget] = await Promise.all([
      fetchHotspot(txn.challenger),
      fetchHotspot(txn.path[0].challengee),
    ])
    setChallenger(fetchedChallenger)
    setTarget(fetchedTarget)
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
        <HotspotWidget title="Challenger" hotspot={challenger} />
        <HotspotWidget title="Target" hotspot={target} />
        <WitnessesWidget path={txn.path[0]} />
        {/* Spacer */}
        <div className="py-1 md:py-2 px-2" />
      </div>
    </div>
  )
}

const WitnessesWidget = ({
  path: { witnesses = [], challengeeLon, challengeeLat },
}) => {
  return (
    <div className={classNames(`bg-gray-200 p-3 rounded-lg col-span-2`)}>
      <div className="text-gray-600 text-sm leading-loose">
        {witnesses.length} Witnesses
      </div>
      <div className="space-y-2">
        {witnesses.map((w) => {
          const [witnessLat, witnessLng] = h3ToGeo(w.location)
          return (
            <div key={w.gateway} className="flex justify-between items-center">
              <div>
                <Link
                  to={`/hotspots/${w.gateway}`}
                  className="text-base leading-tight tracking-tight text-navy-1000 hover:text-navy-400 transition-all duration-150"
                >
                  {animalHash(w.gateway)}
                </Link>
                <div className="text-sm leading-tight tracking-tighter text-gray-600">
                  {challengeeLon &&
                    formatDistance(
                      calculateDistance(
                        [challengeeLon, challengeeLat],
                        [witnessLng, witnessLat],
                      ),
                    )}
                </div>
              </div>
              <Pill
                title={w.isValid ? 'VALID' : 'INVALID'}
                color={w.isValid ? 'green' : 'gray'}
                tooltip={w.invalidReason}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default BeaconDetailsPane
