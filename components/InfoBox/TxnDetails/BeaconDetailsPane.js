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
import InfoBoxPaneContainer from '../Common/InfoBoxPaneContainer'
import useSelectedHotspot from '../../../hooks/useSelectedHotspot'

const BeaconDetailsPane = ({ txn }) => {
  const [challenger, setChallenger] = useState()
  const [target, setTarget] = useState()

  useAsync(async () => {
    const [fetchedChallenger, fetchedTarget] = await Promise.all([
      fetchHotspot(txn.challenger),
      fetchHotspot(txn.path[0].challengee),
    ])
    setChallenger(fetchedChallenger)
    setTarget(fetchedTarget)
  }, [])

  return (
    <InfoBoxPaneContainer>
      <HotspotWidget title="Challenger" hotspot={challenger} />
      <HotspotWidget title="Target" hotspot={target} />
      <WitnessesWidget path={txn.path[0]} />
    </InfoBoxPaneContainer>
  )
}

const WitnessesWidget = ({
  path: { witnesses = [], challengeeLon, challengeeLat },
}) => {
  const { selectHotspot } = useSelectedHotspot()
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
                  onClick={() => selectHotspot(w.gateway)}
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
