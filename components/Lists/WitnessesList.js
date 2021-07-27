import { useCallback } from 'react'
import { h3ToGeo } from 'h3-js'
import animalHash from 'angry-purple-tiger'
import StatusCircle from '../Hotspots/StatusCircle'
import FlagLocation from '../Common/FlagLocation'
import Hex from '../Hex'
import { generateRewardScaleColor } from '../Hotspots/utils'
import useSelectedHotspot from '../../hooks/useSelectedHotspot'
import BaseList from './BaseList'
import { formatDistance } from '../../utils/distance'
import { haversineDistance } from '../../utils/location'
import I18n from '../../copy/I18n'
import { Tooltip } from 'antd'

const WitnessesList = ({
  hotspot,
  witnesses,
  isLoading = true,
  title,
  description,
  showCount,
}) => {
  const { selectHotspot } = useSelectedHotspot()

  const handleSelectHotspot = useCallback(
    (hotspot) => {
      selectHotspot(hotspot.address)
    },
    [selectHotspot],
  )

  const keyExtractor = useCallback((w) => w.address, [])

  const linkExtractor = useCallback((w) => `/hotspots/${w.address}`, [])

  const renderTitle = useCallback((w) => {
    return (
      <>
        <StatusCircle status={w.status} />
        {animalHash(w.address)}
      </>
    )
  }, [])

  const renderSubtitle = useCallback((w) => {
    return (
      <>
        <FlagLocation geocode={w.geocode} shortenedLocationName />
        <span className="flex items-center">
          <Hex
            width={10}
            height={12}
            fillColor={generateRewardScaleColor(w?.rewardScale)}
          />
          <span className="ml-1">{w?.rewardScale?.toFixed(2)}</span>
        </span>
      </>
    )
  }, [])

  const renderDetails = useCallback(
    (w) => {
      return (
        <span className="whitespace-nowrap">
          <Tooltip title={<I18n t="tooltips.distance" />} placement="left">
            {formatDistance(
              haversineDistance(
                h3ToGeo(w.locationHex)[1],
                h3ToGeo(w.locationHex)[0],
                h3ToGeo(hotspot.locationHex)[1],
                h3ToGeo(hotspot.locationHex)[0],
              ) * 1000,
            )}
          </Tooltip>
        </span>
      )
    },
    [hotspot.locationHex],
  )

  return (
    <BaseList
      items={witnesses}
      listHeaderTitle={title}
      listHeaderDescription={description}
      listHeaderShowCount={showCount}
      keyExtractor={keyExtractor}
      linkExtractor={linkExtractor}
      onSelectItem={handleSelectHotspot}
      isLoading={isLoading}
      renderTitle={renderTitle}
      renderSubtitle={renderSubtitle}
      renderDetails={renderDetails}
      blankTitle="No witnesses"
    />
  )
}

export default WitnessesList
