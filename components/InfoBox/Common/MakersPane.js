import classNames from 'classnames'
import { useCallback } from 'react'
import BaseList from '../../Lists/BaseList'
import HotspotSimpleIcon from '../../Icons/HotspotSimple'
import BurnIcon from '../../Icons/BurnIcon'
import LocationIcon from '../../Icons/Location'
import { Tooltip } from 'antd'
import { useMakers } from '../../../data/makers'

const MakersPane = ({ type = 'lorawan' }) => {
  const { makers } = useMakers({ type })

  const keyExtractor = useCallback((maker) => maker.address, [])

  const linkExtractor = useCallback((maker) => `/accounts/${maker.address}`, [])

  const renderItem = useCallback((maker) => {
    return (
      <div className="flex w-full">
        <div className="w-full">
          <div>
            <span className="text-black text-base font-semibold">
              {maker.name}
            </span>
          </div>
          <div>
            <div className="my-1 flex items-center space-x-2 font-normal text-gray-600 text-sm">
              <span className="flex items-center space-x-1">
                <img alt="" src="/images/dc.svg" className="w-3 h-3" />
                <span className="">{maker.dcBalance.toString(0)}</span>
              </span>
              <span className="text-xs">
                ({maker.assertsRemaining.toLocaleString()} onboards remaining)
              </span>
            </div>
            <div className="flex space-x-3 text-sm text-gray-600">
              <Tooltip title="Hotspots added">
                <div className="flex items-center space-x-1">
                  <HotspotSimpleIcon className="text-green-500 w-3 h-auto" />
                  <span>{maker.txns.addGatewayTxns.toLocaleString()}</span>
                </div>
              </Tooltip>
              <Tooltip title="Locations asserted">
                <div className="flex items-center space-x-1">
                  <LocationIcon className="text-pink-500 w-3 h-auto" />
                  <span>{maker.txns.assertLocationTxns.toLocaleString()}</span>
                </div>
              </Tooltip>
              <Tooltip title="HNT burned">
                <div className="flex items-center space-x-1">
                  <BurnIcon className="text-orange-300 w-3 h-auto" />
                  <span>{maker.burnedHNT.toString(2)}</span>
                </div>
              </Tooltip>
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <img alt="" src="/images/details-arrow.svg" />
        </div>
      </div>
    )
  }, [])

  return (
    <div
      className={classNames('grid grid-flow-row grid-cols-1 no-scrollbar', {
        'overflow-y-scroll': !!makers,
        'overflow-y-hidden': !makers,
      })}
    >
      <BaseList
        items={makers}
        keyExtractor={keyExtractor}
        linkExtractor={linkExtractor}
        isLoading={!makers}
        renderItem={renderItem}
        render
      />
    </div>
  )
}

export default MakersPane
