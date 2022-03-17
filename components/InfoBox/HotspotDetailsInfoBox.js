import { useEffect, useMemo, useState } from 'react'
import animalHash from 'angry-purple-tiger'
import { useParams } from 'react-router'
import InfoBox from './InfoBox'
import TabNavbar, { TabPane } from '../Nav/TabNavbar'
import StatisticsPane from './HotspotDetails/StatisticsPane'
import ActivityPane from './Common/ActivityPane'
import WitnessedPane from './HotspotDetails/WitnessedPane'
import NearbyHotspotsPane from './HotspotDetails/NearbyHotspotsPane'
import useSelectedHotspot from '../../hooks/useSelectedHotspot'
import AccountAddress from '../AccountAddress'
import SkeletonList from '../Lists/SkeletonList'
import FlagLocation from '../Common/FlagLocation'
import Gain from '../Hotspots/Gain'
import Elevation from '../Hotspots/Elevation'
import { isDataOnly } from '../Hotspots/utils'
import SkeletonWidgets from './Common/SkeletonWidgets'
import HexIndex from '../Common/HexIndex'
import { useMaker } from '../../data/makers'
import Skeleton from '../Common/Skeleton'
import { useCallback } from 'react'
import AccountIcon from '../AccountIcon'
import SkeletonActivityList from '../Lists/ActivityList/SkeletonActivityList'
import { getHotspotDenylistResults } from '../../data/hotspots'
import DenylistIcon from '../Icons/DenylistIcon'
import { Tooltip } from 'antd'
import useChallengeIssuer from '../../hooks/useChallengeIssuer'

const HotspotDetailsRoute = () => {
  const { address } = useParams()

  const {
    selectedHotspot: hotspot,
    selectHotspot,
    clearSelectedHotspot,
  } = useSelectedHotspot()

  useEffect(() => {
    if (!hotspot) {
      selectHotspot(address)
    }
  }, [hotspot, address, selectHotspot])

  useEffect(() => {
    return () => {
      clearSelectedHotspot()
    }
  }, [clearSelectedHotspot])

  return (
    <HotspotDetailsInfoBox
      address={address}
      isLoading={!hotspot}
      hotspot={hotspot}
    />
  )
}

const HotspotDetailsInfoBox = ({ address, isLoading, hotspot }) => {
  const { clearSelectedHotspot } = useSelectedHotspot()
  const { maker, isLoading: makerLoading } = useMaker(hotspot?.payer)

  const IS_DATA_ONLY = useMemo(() => isDataOnly(hotspot), [hotspot])

  useEffect(() => {
    return () => {
      clearSelectedHotspot()
    }
  }, [clearSelectedHotspot])

  const [isOnDenylist, setIsOnDenylist] = useState(false)

  useEffect(() => {
    const fetchCount = async () => {
      const denylistResults = await getHotspotDenylistResults(address)
      if (denylistResults?.length > 0) {
        setIsOnDenylist(true)
      } else {
        setIsOnDenylist(false)
      }
    }
    fetchCount()
  }, [address])

  const generateSubtitles = useCallback(
    (hotspot) => {
      if (!hotspot)
        return [
          [
            {
              iconPath: '/images/maker.svg',
              loading: true,
              skeletonClasses: 'w-8',
            },
            {
              iconPath: '/images/gain.svg',
              loading: true,
              skeletonClasses: 'w-10',
            },
            {
              iconPath: '/images/elevation.svg',
              loading: true,
              skeletonClasses: 'w-10',
            },
          ],
          [
            {
              iconPath: '/images/address-symbol.svg',
              loading: true,
              skeletonClasses: 'w-20',
            },
            {
              iconPath: '/images/account-green.svg',
              loading: true,
              skeletonClasses: 'w-20',
            },
          ],
        ]
      return [
        [
          ...(!isDataOnly(hotspot)
            ? [
                {
                  iconPath: '/images/maker.svg',
                  title: makerLoading ? (
                    <Skeleton />
                  ) : (
                    <span>{maker?.name}</span>
                  ),
                  path: `/accounts/${maker?.address}`,
                },
              ]
            : []),
          {
            iconPath: '/images/gain.svg',
            title: <Gain hotspot={hotspot} icon={false} />,
          },
          {
            iconPath: '/images/elevation.svg',
            title: <Elevation hotspot={hotspot} icon={false} />,
          },
        ],
        [
          {
            iconPath: '/images/address-symbol.svg',
            title: <AccountAddress address={address} truncate={7} />,
            textToCopy: address,
          },
          {
            iconPath: '/images/account-green.svg',
            title: (
              <span className="flex items-center justify-start">
                <AccountAddress
                  address={hotspot.owner}
                  truncate={7}
                  showSecondHalf={false}
                />
                <AccountIcon
                  address={hotspot.owner}
                  className="h-2.5 md:h-3.5 w-auto ml-0.5"
                />
              </span>
            ),
            path: `/accounts/${hotspot.owner}`,
          },
        ],
      ]
    },
    [address, maker?.address, maker?.name, makerLoading],
  )

  const generateBreadcrumbs = (hotspot) => {
    if (!hotspot) return [{ title: 'Hotspots', path: '/hotspots' }]
    return [
      { title: 'Hotspots', path: '/hotspots/latest' },
      ...(hotspot.location
        ? // if the hotspot has a location, show breadcrumbs for it
          [
            {
              title: <FlagLocation geocode={hotspot.geocode} condensedView />,
              path: `/hotspots/cities/${hotspot.geocode.cityId}`,
            },
            {
              title: (
                <div className="flex items-center justify-center">
                  <img
                    alt=""
                    src="/images/location-hex.svg"
                    className="h-3.5 w-auto mr-0.5 md:mr-1"
                  />
                  <HexIndex index={hotspot.location} />
                </div>
              ),
              path: `/hotspots/hex/${hotspot.location}`,
            },
          ]
        : []),
    ]
  }

  const generateTitle = useCallback(
    (address) => {
      const title = animalHash(address)

      return (
        <div className="flex flex-col items-start justify-start">
          <div className="w-full items-center justify-between relative">
            {title}
          </div>
          {isOnDenylist && (
            <Tooltip
              title="This Hotspot is on the denylist. Click to learn more."
              placement="right"
            >
              <a
                href="https://github.com/helium/denylist"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-sans uppercase text-white font-black bg-red-400 hover:bg-red-500 rounded-md px-2 py-1 mt-1 flex items-center justify-center"
              >
                <DenylistIcon className="text-white h-3 w-3 mr-1" />
                On Denylist
              </a>
            </Tooltip>
          )}
        </div>
      )
    },
    [isOnDenylist],
  )

  const { challengeIssuer } = useChallengeIssuer()
  const liteHotspotsActive = challengeIssuer === 'validator'

  return (
    <InfoBox
      title={generateTitle(address)}
      metaTitle={`Hotspot ${animalHash(address)}`}
      subtitles={generateSubtitles(hotspot)}
      breadcrumbs={generateBreadcrumbs(hotspot)}
    >
      <TabNavbar htmlTitleRoot={`${animalHash(address)}`}>
        <TabPane title="Statistics" key="statistics">
          {isLoading ? (
            <SkeletonWidgets />
          ) : (
            <StatisticsPane
              hotspot={hotspot}
              isDataOnly={IS_DATA_ONLY}
              liteHotspotsActive={liteHotspotsActive}
            />
          )}
        </TabPane>
        <TabPane title="Activity" path="activity" key="activity">
          {isLoading ? (
            <SkeletonActivityList />
          ) : (
            <ActivityPane context="hotspot" address={hotspot?.address} />
          )}
        </TabPane>
        <TabPane
          title="Witnessed"
          path="witnessed"
          key="witnessed"
          hidden={IS_DATA_ONLY}
        >
          {isLoading ? <SkeletonList /> : <WitnessedPane hotspot={hotspot} />}
        </TabPane>
        <TabPane
          title="Nearby"
          path="nearby"
          key="nearby"
          hidden={IS_DATA_ONLY}
        >
          {isLoading ? (
            <SkeletonList />
          ) : (
            <NearbyHotspotsPane hotspot={hotspot} />
          )}
        </TabPane>
      </TabNavbar>
    </InfoBox>
  )
}

export default HotspotDetailsRoute
