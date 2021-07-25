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
import { Tooltip } from 'antd'

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
  path: { witnesses = [], challengeeLocationHex },
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
          const [witnessLat, witnessLng] = h3ToGeo(w.locationHex)
          const [challengeeLat, challengeeLng] = h3ToGeo(challengeeLocationHex)
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
                  <div className="grid grid-cols-2 gap-y-1 gap-x-2">
                    <span>Distance</span>
                    <Tooltip
                      title={
                        "This value is an approximation of the distance between the hotspot that witnessed the challenge and the one that participated in it. Helium uses hexagons from the H3 library, so this distance is a rough approximation based on how many resolution 12 H3 cells the two hotspots are apart. E.g. if it says the distance is 0, it's because they are in the same cell."
                      }
                      placement={'right'}
                    >
                      <span className="text-gray-800 font-medium">
                        {challengeeLocationHex &&
                          formatDistance(
                            calculateDistance(
                              //[challengeeLon, challengeeLat],
                              [challengeeLng, challengeeLat],
                              [witnessLng, witnessLat],
                            ),
                          )}
                      </span>
                    </Tooltip>

                    <span>Datarate</span>
                    <Tooltip
                      title={'The data rate at which the signal was received.'}
                      placement={'right'}
                    >
                      <span className="text-gray-800 font-medium">
                        {w.datarate}
                      </span>
                    </Tooltip>

                    <span>RSSI</span>
                    <Tooltip
                      title={
                        'RSSI stands for Received Signal Strength Indicator, and it represents the strength of the signal.'
                      }
                      placement={'right'}
                    >
                      <span className="text-gray-800 font-medium">
                        {w.signal?.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                        dBm
                      </span>
                    </Tooltip>

                    <span>SNR</span>
                    <Tooltip
                      title={
                        'SNR stands for Signal-to-Noise Ratio, and it represents the quality of the signal.'
                      }
                      placement={'right'}
                    >
                      <span className="text-gray-800 font-medium">
                        {w.snr?.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                        dB
                      </span>
                    </Tooltip>
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
