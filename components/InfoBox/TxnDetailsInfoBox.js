import InfoBox from './InfoBox'
import { useParams } from 'react-router'
import useSelectedTxn from '../../hooks/useSelectedTxn'
import { useEffect } from 'react'
import { formattedTxnHash, getTxnTypeName } from '../../utils/txns'
import classNames from 'classnames'
import Timestamp from 'react-timestamp'
import TxnDetailsSwitch from './TxnDetails/TxnDetailsSwitch'

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
    return `${getTxnTypeName(selectedTxn.type)} transaction`
  }

  const generateBreadcrumbs = (txn) => {
    if (!txn)
      return [
        {
          title: 'Blocks',
          path: '/blocks',
        },
        { title: '...' },
      ]
    return [
      {
        title: 'Blocks',
        path: '/blocks',
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
        {
          iconPath: '/images/clock.svg',
          loading: true,
        },
        {
          iconPath: '/images/address.svg',
          loading: true,
        },
      ]
    return [
      {
        title: <Timestamp date={txn.time} />,
        iconPath: '/images/clock.svg',
      },
      {
        title: formattedTxnHash(txn.hash),
        textToCopy: txn.hash,
        iconPath: '/images/address.svg',
      },
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
