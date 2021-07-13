import { useEffect, useMemo } from 'react'
import animalHash from 'angry-purple-tiger'
import { useAsync } from 'react-async-hooks'
import { useParams } from 'react-router'
import InfoBox from './InfoBox'
import TabNavbar, { TabPane } from '../Nav/TabNavbar'
import StatisticsPane from './HotspotDetails/StatisticsPane'
import ActivityPane from './Common/ActivityPane'
import WitnessesPane from './HotspotDetails/WitnessesPane'
import NearbyHotspotsPane from './HotspotDetails/NearbyHotspotsPane'
import useSelectedHotspot from '../../hooks/useSelectedHotspot'
import CopyableText from '../Common/CopyableText'
import AccountAddress from '../AccountAddress'
import SkeletonList from '../Lists/SkeletonList'
import FlagLocation from '../Common/FlagLocation'
import { isDataOnly } from '../Hotspots/utils'

const HotspotDetailsRoute = () => {
  const { address } = useParams()

  const { selectedHotspot: hotspot, selectHotspot } = useSelectedHotspot()

  useAsync(async () => {
    if (!hotspot) {
      selectHotspot(address)
    }
  }, [hotspot, address])

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

  // TODO: remove once helium-js hotspot object includes .mode
  if (hotspot !== null) hotspot.mode = 'dataonly'

  const IS_DATA_ONLY = useMemo(() => isDataOnly(hotspot), [hotspot])

  const title = useMemo(
    () => (
      <CopyableText textToCopy={address} tooltip="Copy address">
        {address && animalHash(address)}
      </CopyableText>
    ),
    [address],
  )

  useEffect(() => {
    return () => {
      clearSelectedHotspot()
    }
  }, [clearSelectedHotspot])

  const generateSubtitles = (hotspot) => {
    if (!hotspot)
      return [
        {
          iconPath: '/images/location-blue.svg',
          loading: true,
        },
        {
          iconPath: '/images/account-green.svg',
          loading: true,
        },
      ]
    return [
      {
        iconPath: '/images/location-blue.svg',
        path: `/cities/${hotspot.geocode.cityId}`,
        title: <FlagLocation geocode={hotspot.geocode} condensedView />,
      },
      {
        iconPath: '/images/account-green.svg',
        title: <AccountAddress address={hotspot.owner} truncate={5} />,
        path: `/accounts/${hotspot.owner}`,
      },
    ]
  }

  const generateBreadcrumbs = (hotspot) => {
    if (!hotspot) return [{ title: 'Hotspots', path: '/hotspots' }]
    return [
      { title: 'Hotspots', path: '/hotspots/latest' },
      ...(hotspot.location
        ? // if the hotspot has a hex, show a breadcrumb for it
          [
            {
              title: (
                <div className="flex items-center justify-center">
                  <img
                    src="/images/location-hex.svg"
                    className="h-3.5 w-auto mr-0.5 md:mr-1"
                  />
                  {hotspot.location}
                </div>
              ),
              path: `/hotspots/hex/${hotspot.location}`,
            },
          ]
        : []),
    ]
  }

  return (
    <InfoBox
      title={title}
      metaTitle={`Hotspot ${animalHash(address)}`}
      subtitles={generateSubtitles(hotspot)}
      breadcrumbs={generateBreadcrumbs(hotspot)}
    >
      <TabNavbar>
        <TabPane title="Statistics" key="statistics">
          {isLoading ? (
            <SkeletonList />
          ) : (
            <StatisticsPane hotspot={hotspot} isDataOnly={IS_DATA_ONLY} />
          )}
        </TabPane>
        <TabPane title="Activity" path="activity" key="activity">
          {isLoading ? (
            <SkeletonList />
          ) : (
            <ActivityPane context="hotspot" address={hotspot?.address} />
          )}
        </TabPane>
        <TabPane
          title="Witnesses"
          path="witnesses"
          key="witnesses"
          hidden={IS_DATA_ONLY}
        >
          <WitnessesPane hotspot={hotspot} />
        </TabPane>
        <TabPane
          title="Nearby"
          path="nearby"
          key="nearby"
          hidden={IS_DATA_ONLY}
        >
          <NearbyHotspotsPane hotspot={hotspot} />
        </TabPane>
      </TabNavbar>
    </InfoBox>
  )
}

export default HotspotDetailsRoute
