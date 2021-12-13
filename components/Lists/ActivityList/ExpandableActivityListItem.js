import classNames from 'classnames'
import useToggle from '../../../utils/useToggle'
import ChevronIcon from '../../Icons/Chevron'
import { Link } from 'react-router-i18n'
import useSelectedTxn from '../../../hooks/useSelectedTxn'
import useSelectedHotspot from '../../../hooks/useSelectedHotspot'
import { useCallback } from 'react'
import ActivityIcon from './ActivityIcon'
import ExpandIcon from '../../Icons/ExpandIcon'
import TimeAgo from 'react-time-ago'
import Timestamp from 'react-timestamp'

const TransactionTimestamp = ({ txn, expanded }) => (
  <span className="flex items-center space-x-1">
    <img alt="" src="/images/clock.svg" className="w-3.5 h-3.5" />
    {expanded ? (
      <span className="tracking-tighter">
        <Timestamp date={txn.time} />
      </span>
    ) : (
      <span className="text-xs text-gray-600 font-sans font-extralight ml-1 mt-px md:mt-0.5">
        <TimeAgo date={txn.time * 1000} timeStyle="mini" /> ago
      </span>
    )}
  </span>
)

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
      className="bg-white hover:bg-bluegray-50 focus:bg-bluegray-50 cursor-pointer transition-all duration-75 relative flex border-solid border-bluegray-300 border-b border-t-0"
      onClick={handleItemClick}
    >
      <div className="w-full flex items-stretch justify-center">
        <div className="w-full flex px-4 py-2 space-x-2 items-center">
          <ActivityIcon txn={txn} highlightColor={highlightColor} />
          <div className="w-full flex flex-row">
            <div className="w-full flex justify-between">
              <div className="text-sm md:text-base font-medium text-darkgray-800 font-sans">
                {title}
              </div>
              <TransactionTimestamp txn={txn} expanded={expanded} />
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
              {!txn.type.startsWith('rewards') && (
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
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default ExpandableListItem
