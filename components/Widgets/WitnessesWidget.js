import classNames from 'classnames'
import animalHash from 'angry-purple-tiger'
import Pill from '../Common/Pill'
import { h3ToGeo } from 'h3-js'
import { formatHexDistance, calculateDistance } from '../../utils/distance'
import { Link } from 'react-router-i18n'
import useSelectedHotspot from '../../hooks/useSelectedHotspot'
import { Tooltip } from 'antd'
import I18n from '../../copy/I18n'

const WitnessesWidget = ({
  path: { witnesses = [], challengeeLocationHex },
}) => {
  const { selectHotspot } = useSelectedHotspot()
  return (
    <div className="bg-gray-200 p-3 rounded-lg col-span-2">
      <div className="text-gray-600 text-sm leading-loose">
        <span
          className={classNames('flex items-center justify-start', {
            'mb-3': witnesses.length > 0,
          })}
        >
          <img
            alt=""
            src="/images/witness-yellow-mini.svg"
            className="h-4 w-auto mr-1"
          />
          {witnesses.length} Witnesses
        </span>
        {witnesses.length === 0 && (
          <span className="text-2xl font-medium text-black my-1.5 tracking-tight w-full break-all">
            No witnesses
          </span>
        )}
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
                      title={<I18n t="tooltips.distance" />}
                      placement={'right'}
                    >
                      <span className="text-gray-800 font-medium">
                        {challengeeLocationHex &&
                          formatHexDistance(
                            calculateDistance(
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

                    <span>Frequency</span>
                    <Tooltip
                      title={'The frequency at which the signal was received.'}
                      placement={'right'}
                    >
                      <span className="text-gray-800 font-medium">
                        {w.frequency.toLocaleString(undefined, {
                          maximumFractionDigits: 1,
                        })}{' '}
                        MHz
                      </span>
                    </Tooltip>
                  </div>
                </div>
              </div>
              <Pill
                title={w.isValid || w.is_valid ? 'VALID' : 'INVALID'}
                color={w.isValid || w.is_valid ? 'green' : 'gray'}
                tooltip={w.invalidReason}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default WitnessesWidget
