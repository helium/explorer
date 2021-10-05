import { useParams } from 'react-router'
import classNames from 'classnames'
import InfoBox from './InfoBox'
import TabNavbar, { TabPane } from '../Nav/TabNavbar'
import { useAsync } from 'react-async-hook'
import { fetchHexHotspots } from '../../data/hotspots'
import HexHotspotsList from '../Lists/HexHotspotsList'
import { useCallback } from 'react'
import { formatLocation } from '../Hotspots/utils'
import FlagLocation from '../Common/FlagLocation'

const HexDetailsInfoBox = () => {
  const { index } = useParams()

  const { result: hotspots, loading } = useAsync(fetchHexHotspots, [index])

  const generateSubtitles = useCallback((hotspot) => {
    if (!hotspot)
      return [
        [
          {
            iconPath: '/images/location-blue.svg',
            loading: true,
          },
        ],
      ]
    return [
      [
        {
          icon: (
            <FlagLocation geocode={hotspot.geocode} showLocationName={false} />
          ),
          path: `/hotspots/cities/${hotspot.geocode.cityId}`,
          title: formatLocation(hotspot.geocode),
        },
      ],
    ]
  }, [])

  return (
    <InfoBox
      title={
        <div className="flex items-center justify-center">
          <img
            alt=""
            src="/images/location-hex.svg"
            className="h-7 w-auto mr-0.5 md:mr-2"
          />
          {index}
        </div>
      }
      metaTitle={`Hex ${index}`}
      breadcrumbs={[{ title: 'Hotspots', path: '/hotspots' }]}
      subtitles={generateSubtitles(hotspots?.[0])}
    >
      <TabNavbar>
        <TabPane title="Hotspots" key="hotspots">
          <div
            className={classNames(
              'grid grid-flow-row grid-cols-1 no-scrollbar',
              {
                'overflow-y-scroll': !loading,
                'overflow-y-hidden': loading,
              },
            )}
          >
            <HexHotspotsList
              hotspots={hotspots || []}
              isLoading={loading}
              hasMore={false}
              title={'Hotspots in Hex'}
              showCount
            />
          </div>
        </TabPane>
      </TabNavbar>
    </InfoBox>
  )
}

export default HexDetailsInfoBox
