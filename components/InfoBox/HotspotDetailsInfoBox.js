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
import { formatLocation } from '../Hotspots/utils'
import { formattedAccountAddress } from '../../utils/accounts'
import {
  h3Distance,
  h3GetResolution,
  h3ToGeo,
  h3ToChildren,
  h3ToParent,
} from 'h3-js'

const HotspotDetailsRoute = () => {
  const { address } = useParams()

  const { selectedHotspot: hotspot, selectHotspot } = useSelectedHotspot()

  useAsync(async () => {
    if (!hotspot) {
      selectHotspot(address)
    }
  }, [hotspot, address])

  if (!hotspot) return null

  return <HotspotDetailsInfoBox address={address} />
}

const HotspotDetailsInfoBox = ({ address }) => {
  const {
    selectedHotspot: hotspot,
    clearSelectedHotspot,
  } = useSelectedHotspot()

  const title = useMemo(() => animalHash(address), [address])

  useEffect(() => {
    return () => {
      clearSelectedHotspot()
    }
  }, [clearSelectedHotspot])

  const generateSubtitles = (hotspot) => {
    let subtitles = [
      {
        iconPath: '/images/location-blue.svg',
        path: `/cities/${hotspot.geocode.cityId}`,
        title: formatLocation(hotspot.geocode),
      },
      {
        iconPath: '/images/location-hex.svg',
        path: `/hexes/${hotspot.location}`,
        title: hotspot.location,
      },
      {
        iconPath: '/images/account-green.svg',
        title: formattedAccountAddress(hotspot.owner),
        path: `/accounts/${hotspot.owner}`,
      },
    ]
    return subtitles
  }

  return (
    <InfoBox
      title={title}
      subtitles={hotspot ? generateSubtitles(hotspot) : []}
    >
      <TabNavbar>
        <TabPane title="Statistics" key="statistics">
          <StatisticsPane hotspot={hotspot} />
        </TabPane>

        <TabPane title="Activity" path="activity" key="activity">
          <ActivityPane context="hotspot" address={hotspot?.address} />
        </TabPane>

        <TabPane title="Witnesses" path="witnesses" key="witnesses">
          <WitnessesPane hotspot={hotspot} />
        </TabPane>

        <TabPane title="Nearby" path="nearby" key="nearby">
          <NearbyHotspotsPane hotspot={hotspot} />
        </TabPane>
      </TabNavbar>
    </InfoBox>
  )
}

export default HotspotDetailsRoute
