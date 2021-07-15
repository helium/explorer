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
      <HotspotWidget
        title="Challenger"
        titleIconPath="/images/challenger-icon.svg"
        hotspot={challenger}
      />
      <HotspotWidget
        title="Beaconer"
        titleIconPath="/images/poc_receipt_icon.svg"
        hotspot={target}
      />
      <WitnessesWidget path={txn.path[0]} />
    </InfoBoxPaneContainer>
  )
}

const WitnessesWidget = ({
  path: { witnesses = [], challengeeLon, challengeeLat },
}) => {
  const { selectHotspot } = useSelectedHotspot()
  return (
    <div className="bg-gray-200 p-3 rounded-lg col-span-2">
      <div className="text-gray-600 text-sm leading-loose">
        <span className="flex items-center justify-start mb-3">
          <img
            alt=""
            src="/images/witness-yellow-mini.svg"
            className="h-4 w-auto mr-1"
          />
          {witnesses.length} Witnesses
        </span>
      </div>
      <div className="space-y-2">
        {witnesses.map((w) => {
          const [witnessLat, witnessLng] = h3ToGeo(w.location)
          return (
            <div
              key={w.gateway}
              className="flex justify-between items-start pb-4"
            >
              <div>
                <Link
                  to={`/hotspots/${w.gateway}`}
                  onClick={() => selectHotspot(w.gateway)}
                  className="text-base leading-tight tracking-tight text-navy-1000 hover:text-navy-400 transition-all duration-150 flex items-center pb-2"
                >
                  {animalHash(w.gateway)}
                </Link>
                <div className="flex items-center text-sm leading-tight tracking-tighter text-gray-600 space-x-1.5">
                  <div className="grid grid-cols-2 gap-0.5">
                    <span>Distance</span>
                    <span className="text-gray-800 font-medium">
                      {challengeeLon &&
                        formatDistance(
                          calculateDistance(
                            [challengeeLon, challengeeLat],
                            [witnessLng, witnessLat],
                          ),
                        )}
                    </span>
                    <span>Datarate</span>
                    <span className="text-gray-800 font-medium">
                      {w.datarate}
                    </span>
                    <span>RSSI</span>
                    <span className="text-gray-800 font-medium">
                      {w.signal?.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                      dBm
                    </span>
                    <span>SNR</span>
                    <span className="text-gray-800 font-medium">
                      {w.snr?.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                      dB
                    </span>
                  </div>
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
