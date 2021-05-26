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
import CopyableText from '../Common/CopyableText'
import AccountIcon from '../AccountIcon'
import AccountAddress from '../AccountAddress'

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

  const title = useMemo(
    () => (
      <CopyableText textToCopy={address} tooltip="Copy address">
        {animalHash(address)}
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
          iconPath: '/images/location-hex.svg',
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
        title: formatLocation(hotspot.geocode),
      },
      {
        iconPath: '/images/location-hex.svg',
        ...(hotspot.location
          ? {
              path: `/hotspots/hex/${hotspot.location}`,
              title: hotspot.location,
            }
          : { title: 'Not set' }),
      },
      {
        icon: (
          <AccountIcon address={hotspot.owner} size={14} className="mr-1" />
        ),
        title: <AccountAddress address={hotspot.owner} truncate={7} mono />,
        path: `/accounts/${hotspot.owner}`,
      },
    ]
  }

  return (
    <InfoBox title={title} subtitles={generateSubtitles(hotspot)}>
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
