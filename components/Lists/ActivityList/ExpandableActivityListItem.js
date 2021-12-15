import classNames from 'classnames'
import useToggle from '../../../utils/useToggle'
import ChevronIcon from '../../Icons/Chevron'
import { Link } from 'react-router-i18n'
import useSelectedTxn from '../../../hooks/useSelectedTxn'
import useSelectedHotspot from '../../../hooks/useSelectedHotspot'
import { useCallback, useState } from 'react'
import ActivityIcon from './ActivityIcon'
import ActivityItemTimestamp from './ActivityItemTimestamp'
import ExpandedRewardContent from './ExpandedRewardContent'
import ExpandedPoCReceiptContent from './ExpandedPoCReceiptContent'
import Skeleton from '../../Common/Skeleton'
import { fetchTxnDetails } from '../../../data/txns'
import ChevronThin from '../../Icons/ChevronThin'

const ExpandedContent = ({ txn, role, address }) => {
  if (!txn) {
    // TODO: add better skeleton
    return <Skeleton />
  }

  if (
    txn.type === 'rewards_v1' ||
    txn.type === 'rewards_v2' ||
    txn.type === 'rewards_v3'
  ) {
    return (
      <div>
        Rewards
        {/* <ExpandedRewardContent txn={txn} role={role} />) */}
      </div>
    )
  }

  if (txn.type === 'poc_receipts_v1') {
    return <ExpandedPoCReceiptContent txn={txn} role={role} address={address} />
  }

  return (
    <div>
      {/* TODO add generic details view */}
      <p>{txn.type}</p>
    </div>
  )
}

const ExpandableListItem = ({
  address,
  context,
  txn,
  title,
  subtitle,
  linkTo,
  highlightColor,
}) => {
  const [expanded, toggleExpanded] = useToggle()

  const { selectTxn, clearSelectedTxn } = useSelectedTxn()
  const { selectHotspot, clearSelectedHotspot } = useSelectedHotspot()

  const [txnDetails, setTxnDetails] = useState()

  const fetchTxn = async (txn) => {
    if (txn?.type.startsWith('rewards')) {
      setTxnDetails(txn)
    } else {
      const details = await fetchTxnDetails(txn.hash)
      setTxnDetails(details)
    }
  }

  const handleItemClick = useCallback(() => {
    if (expanded) {
      clearSelectedTxn()
      if (context === 'hotspot') selectHotspot(address)
    } else {
      selectTxn(txn.hash)
      fetchTxn(txn)
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
    txn,
  ])

  return (
    <>
      <div
        className={classNames(
          'bg-white hover:bg-bluegray-50 focus:bg-bluegray-50 cursor-pointer transition-all duration-75 relative flex border-solid border-bluegray-300 border-t-0',
        )}
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
                <ActivityItemTimestamp txn={txn} expanded={expanded} />
              </div>
              <div className={'flex items-center justify-center'}>
                <ChevronThin
                  className={classNames(
                    'h-auto text-gray-550 transition-all duration-200 w-3.5 transform',
                    { 'rotate-0': expanded, 'rotate-180': !expanded },
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={classNames(
          'w-full flex flex-col justify-between bg-bluegray-50 transition-all duration-200',
          { 'py-0 opacity-0': !expanded, 'py-6 opacity-100': expanded },
        )}
      >
        {expanded && (
          <div className="px-6">
            <div className="bg-white w-full rounded-t-lg px-2 py-2">
              <ExpandedContent
                txn={txnDetails}
                role={txn.role}
                address={address}
              />
            </div>
            {!txnDetails?.type.startsWith('rewards') && (
              <Link
                to={linkTo}
                // clear selected hotspot when navigating to selected transaction, this was causing a Mapbox error on mobile
                onClick={clearSelectedHotspot}
                className={classNames(
                  'w-full bg-white hover:bg-gray-350 transition-all duration-200 cursor-pointer rounded-b-lg mt-px flex items-center justify-center',
                )}
              >
                <p className="text-gray-700 font-sans font-medium text-sm p-2 m-0">
                  View Transaction Details
                </p>
                <ChevronIcon
                  className={
                    'h-auto text-gray-700 transition-all duration-200 w-4 transform rotate-90'
                  }
                />
              </Link>
            )}
          </div>
        )}
      </div>
      <div className="w-full border-solid border-b border-bluegray-300" />
    </>
  )
}
export default ExpandableListItem
