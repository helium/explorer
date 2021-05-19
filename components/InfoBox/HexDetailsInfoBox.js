import { useEffect, useMemo } from 'react'
import { useParams } from 'react-router'
import classNames from 'classnames'
import InfoBox from './InfoBox'
import TabNavbar, { TabPane } from '../Nav/TabNavbar'
import { useAsync } from 'react-async-hook'
import { fetchHexHotspots } from '../../data/hotspots'
import HotspotsList from '../Lists/HotspotsList'

const HexDetailsInfoBox = () => {
  const { index } = useParams()

  const { result: hotspots, loading } = useAsync(fetchHexHotspots, [index])

  return (
    <InfoBox title={`#${index}`}>
      <TabNavbar>
        <TabPane title="Selected Hotspots" key="hotspots">
          <div
            className={classNames(
              'grid grid-flow-row grid-cols-1 no-scrollbar',
              {
                'overflow-y-scroll': !loading,
                'overflow-y-hidden': loading,
              },
            )}
          >
            <HotspotsList
              hotspots={hotspots || []}
              isLoading={loading}
              hasMore={false}
            />
          </div>
        </TabPane>
      </TabNavbar>
    </InfoBox>
  )
}

export default HexDetailsInfoBox
