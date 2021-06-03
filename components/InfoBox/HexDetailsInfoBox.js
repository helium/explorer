import { useParams } from 'react-router'
import classNames from 'classnames'
import InfoBox from './InfoBox'
import TabNavbar, { TabPane } from '../Nav/TabNavbar'
import { useAsync } from 'react-async-hook'
import { fetchHexHotspots } from '../../data/hotspots'
import HexHotspotsList from '../Lists/HexHotspotsList'
import { useEffect } from 'react'
import useSelectedHex from '../../hooks/useSelectedHex'

const HexDetailsInfoBox = () => {
  const { index } = useParams()
  const { clearSelectedHex, selectHex, selectedHex } = useSelectedHex()

  const { result: hotspots, loading } = useAsync(fetchHexHotspots, [index])

  useEffect(() => {
    if (!selectedHex) {
      selectHex(index)
    }
  }, [index, selectHex, selectedHex])

  useEffect(() => {
    return () => {
      clearSelectedHex()
    }
  }, [clearSelectedHex])

  return (
    <InfoBox
      title={`#${index}`}
      breadcrumbs={[{ title: 'Hotspots / Hex', path: '/hotspots' }]}
    >
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
            <HexHotspotsList
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
