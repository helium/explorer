import InfoBox from './InfoBox'
import { useParams } from 'react-router'
import BeaconDetailsPane from './TxnDetails/BeaconDetailsPane'
import useSelectedTxn from '../../hooks/useSelectedTxn'
import { useEffect } from 'react'
import { formattedTxnHash } from '../../utils/txns'

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

  return (
    <InfoBox
      title={`Transaction ${formattedTxnHash(hash)}`}
      breadcrumbs={[
        selectedTxn
          ? {
              title: `Block ${selectedTxn.height.toLocaleString()}`,
              path: `/blocks/${selectedTxn.height}`,
            }
          : {
              title: `Block ...`,
            },
      ]}
    >
      <TxnDetailsSwitch txn={selectedTxn} isLoading={!selectedTxn} />
    </InfoBox>
  )
}

const TxnDetailsSwitch = ({ txn, isLoading }) => {
  if (isLoading) return null

  switch (txn.type) {
    case 'poc_receipts_v1':
      return <BeaconDetailsPane txn={txn} />

    default:
      return null
  }
}

export default TxnDetailsInfoBox
