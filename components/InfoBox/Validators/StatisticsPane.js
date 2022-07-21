import InfoBoxPaneContainer from '../Common/InfoBoxPaneContainer'
import Widget from '../../Widgets/Widget'
import VersionsWidget from '../../Widgets/VersionsWidget'
import StatWidget from '../../Widgets/StatWidget'
import { formatLargeNumber, formatPercent } from '../../../utils/format'
import { calculateValidatorAPY } from '../../../utils/validators'
import Currency from '../../Common/Currency'
import { useValidatorStats } from '../../../data/validators'
import { useMarket } from '../../../data/market'
import { useElections } from '../../../data/consensus'
import useApi from '../../../hooks/useApi'
import TrendWidget from '../../Widgets/TrendWidget'
import { useEffect, useState } from 'react'
import { round } from 'lodash'

const TICKER = 'HNT'

const StatisticsPane = () => {
  const { data: stats } = useApi('/metrics/validators')
  const { data: blocks } = useApi('/metrics/blocks')
  const { consensusGroups } = useElections()
  const { stats: validatorStats } = useValidatorStats()
  const { market } = useMarket()

  const [processingData, setProcessingData] = useState(true)
  const [blockTimeDay, setBlockTimeDay] = useState()

  useEffect(() => {
    if (!!blocks) {
      setProcessingData(true)
      const blockTimeDayArray = blocks?.blockTimeDay?.map((bt) => {
        bt.value = round(bt.value, 2)
        return bt
      })
      setBlockTimeDay(blockTimeDayArray)
      setProcessingData(false)
    }
  }, [blocks])

  return (
    <InfoBoxPaneContainer>
      <Widget
        title="Staked Validators"
        value={validatorStats?.staked?.count?.toLocaleString()}
        isLoading={!validatorStats}
        linkTo="/validators/all"
      />
      <Widget
        title="Consensus Size"
        value={consensusGroups?.currentElection?.length}
        isLoading={!consensusGroups}
        linkTo="/validators/consensus"
      />
      <Widget
        title="% Online"
        value={formatPercent(
          validatorStats?.active / validatorStats?.staked?.count,
        )}
        tooltip={
          <div>
            <div>Active: {validatorStats?.active}</div>
            <div>Staked: {validatorStats?.staked?.count}</div>
          </div>
        }
        isLoading={!validatorStats}
      />
      <Widget
        title="Estimated APR"
        value={formatPercent(calculateValidatorAPY(validatorStats?.active))}
        isLoading={!validatorStats}
        tooltip="Annual percent return of validators that are staked and online. Note that unstaking tokens invokes a 250,000 block (~5 mo.) cooldown period where no returns will be earned before the staked tokens become liquid again. Earned rewards are immediately liquid."
      />
      <Widget
        title={`Total Staked (${TICKER})`}
        value={formatLargeNumber(validatorStats?.staked?.amount)}
        change={
          <Currency value={market?.price * validatorStats?.staked?.amount} />
        }
        isLoading={!market || !validatorStats}
      />
      <StatWidget
        title="% Supply Staked"
        series={stats?.stakedPct}
        isLoading={!stats}
        valueType="percent"
        changeType="percent"
      />
      <VersionsWidget />
      <TrendWidget
        title="Transaction Rate (24hr)"
        series={blocks?.txnRate}
        isLoading={!blocks}
      />
      <StatWidget
        title="Block Height"
        series={blocks?.height}
        linkTo={'/blocks'}
        isLoading={!blocks}
      />
      <StatWidget
        title="Block Time (24hr)"
        series={blockTimeDay}
        valueSuffix={' sec'}
        changeInitial="second_last"
        changeSuffix={' sec'}
        isLoading={processingData}
      />
    </InfoBoxPaneContainer>
  )
}

export default StatisticsPane
