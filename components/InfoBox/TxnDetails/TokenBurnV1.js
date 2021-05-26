import { useState } from 'react'
import { useAsync } from 'react-async-hook'
import client from '../../../data/client'
import InfoBoxPaneContainer from '../Common/InfoBoxPaneContainer'
import AccountWidget from '../../Widgets/AccountWidget'
import Widget from '../../Widgets/Widget'

const TokenBurnV1 = ({ txn }) => {
  const [oraclePrice, setOraclePrice] = useState()
  useAsync(async () => {
    const { price } = await client.oracle.getPriceAtBlock(txn.height)
    setOraclePrice(price)
  }, [])

  return (
    <InfoBoxPaneContainer>
      <AccountWidget title="Payer" address={txn.payer} />
      <AccountWidget title="Payee" address={txn.payee} />
      <Widget title="Amount" span={2} value={txn.amount.toString(2)} />
      <Widget
        title="Oracle Price"
        isLoading={!oraclePrice}
        value={oraclePrice?.toString(2)}
      />
      <Widget
        title="Value"
        isLoading={!oraclePrice}
        value={
          oraclePrice ? txn.amount.toUsd(oraclePrice).toString(2) : 'Loading...'
        }
      />
      <Widget title="Nonce" value={txn.nonce} />
      <Widget title="Memo" value={txn.memo} />
    </InfoBoxPaneContainer>
  )
}

export default TokenBurnV1
