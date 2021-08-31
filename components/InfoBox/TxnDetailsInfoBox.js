import InfoBox from './InfoBox'
import { useParams } from 'react-router'
import useSelectedTxn from '../../hooks/useSelectedTxn'
import { useEffect } from 'react'
import {
  formattedTxnHash,
  getTxnTypeColor,
  getTxnTypeName,
} from '../../utils/txns'
import classNames from 'classnames'
import TxnDetailsSwitch from './TxnDetails/TxnDetailsSwitch'
import BlockTimestamp from '../Common/BlockTimestamp'

const TxnDetailsInfoBox = () => {
  const { hash } = useParams()
  const { selectedTxn, selectTxn, clearSelectedTxn } = useSelectedTxn()

  useEffect(() => {
    if (!selectedTxn) {
      selectTxn(hash)
    }
  }, [hash, selectTxn, selectedTxn])

  useEffect(() => {
    return () => {
      clearSelectedTxn()
    }
  }, [clearSelectedTxn])

  const generateTitle = (txn) => {
    if (!txn) return 'Loading transaction...'
    return (
      <span className="flex items-start justify-start">
        <span
          className="h-5 md:h-7 w-1 -ml-4 mt-1.5 opacity-75"
          style={{ backgroundColor: getTxnTypeColor(selectedTxn.type) }}
        />
        <span className="ml-3">
          {getTxnTypeName(selectedTxn.type)} transaction
        </span>
      </span>
    )
  }

  const generateBreadcrumbs = (txn) => {
    if (!txn)
      return [
        {
          title: 'Blocks',
          path: '/blocks/latest',
        },
        { title: '...' },
      ]
    return [
      {
        title: 'Blocks',
        path: '/blocks/latest',
      },
      {
        title: `${selectedTxn.height.toLocaleString()}`,
        path: `/blocks/${selectedTxn.height}`,
      },
    ]
  }

  const generateSubtitles = (txn) => {
    if (!txn)
      return [
        [
          {
            iconPath: '/images/clock.svg',
            loading: true,
          },
          {
            iconPath: '/images/address.svg',
            loading: true,
          },
        ],
      ]
    return [
      [
        {
          title: (
            <BlockTimestamp blockHeight={txn.height} blockTime={txn.time} />
          ),
          iconPath: '/images/clock.svg',
        },
        {
          title: formattedTxnHash(txn.hash),
          textToCopy: txn.hash,
          iconPath: '/images/address.svg',
        },
      ],
    ]
  }

  return (
    <InfoBox
      title={generateTitle(selectedTxn)}
      metaTitle={`Transaction ${hash}`}
      breadcrumbs={generateBreadcrumbs(selectedTxn)}
      subtitles={generateSubtitles(selectedTxn)}
    >
      <div
        className={classNames('grid grid-flow-row grid-cols-1 no-scrollbar', {
          'overflow-y-scroll': selectedTxn,
          'overflow-y-hidden': !selectedTxn,
        })}
      >
        <TxnDetailsSwitch txn={selectedTxn} isLoading={!selectedTxn} />
      </div>
    </InfoBox>
  )
}

export default TxnDetailsInfoBox
