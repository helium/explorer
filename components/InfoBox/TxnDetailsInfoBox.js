import InfoBox from './InfoBox'
import { useParams } from 'react-router'
import BeaconDetailsPane from './TxnDetails/BeaconDetailsPane'
import useSelectedTxn from '../../hooks/useSelectedTxn'
import { useEffect } from 'react'

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

  console.log('selected txn', selectedTxn)

  return (
    <InfoBox title={`Transaction ${hash}`}>
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
