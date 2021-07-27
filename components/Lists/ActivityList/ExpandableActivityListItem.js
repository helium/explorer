import classNames from 'classnames'
import useToggle from '../../../utils/useToggle'
import ChevronIcon from '../../Icons/Chevron'
import { Link } from 'react-router-i18n'
import useSelectedTxn from '../../../hooks/useSelectedTxn'
import useSelectedHotspot from '../../../hooks/useSelectedHotspot'
import { useCallback } from 'react'
import ActivityColorSlice from './ActivityColorSlice'
import ExpandIcon from '../../Icons/ExpandIcon'

const ExpandableListItem = ({
  address,
  context,
  txn,
  title,
  subtitle,
  linkTo,
  highlightColor,
  expandedContent,
}) => {
  const [expanded, toggleExpanded] = useToggle()

  const { selectTxn, clearSelectedTxn } = useSelectedTxn()
  const { selectHotspot, clearSelectedHotspot } = useSelectedHotspot()

  const handleItemClick = useCallback(() => {
    if (expanded) {
      clearSelectedTxn()
      if (context === 'hotspot') selectHotspot(address)
    } else {
      selectTxn(txn.hash)
    }
    toggleExpanded()
  }, [
    address,
    clearSelectedTxn,
    context,
    expanded,
    selectHotspot,
    selectTxn,
    toggleExpanded,
    txn.hash,
  ])

  return (
    <div
      className="w-full flex items-stretch cursor-pointer"
      onClick={handleItemClick}
    >
      <ActivityColorSlice highlightColor={highlightColor} />
      <div className="w-full flex px-4 py-2">
        <div className="w-full flex flex-col">
          <div className="w-full flex justify-between">
            <div className="flex flex-col">
              <div className="text-sm md:text-base font-medium text-darkgray-800 font-sans">
                {title}
              </div>
              <div className="flex items-center space-x-2 md:space-x-3 h-6 text-gray-525 text-xs md:text-sm whitespace-nowrap">
                {subtitle}
              </div>
            </div>
            <div className={'flex items-center justify-center'}>
              <ExpandIcon
                expanded={expanded}
                className={
                  'transition-all duration-200 w-6 h-auto transform opacity-75 text-gray-525'
                }
              />
            </div>
          </div>
          {expanded && (
            <div className="w-full py-2 flex flex-col justify-between">
              {expandedContent}
              <Link
                to={linkTo}
                // clear selected hotspot when navigating to selected transaction, this was causing a Mapbox error on mobile
                onClick={clearSelectedHotspot}
                className={classNames(
                  'w-full bg-gray-300 hover:bg-gray-350 transition-all duration-200 cursor-pointer rounded-lg mt-2 flex items-center justify-center',
                )}
              >
                <p className="text-gray-600 font-sans text-sm p-2 m-0">
                  View transaction details
                </p>
                <ChevronIcon
                  className={
                    'h-auto text-gray-600 transition-all duration-200 w-4 transform rotate-90'
                  }
                />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default ExpandableListItem
