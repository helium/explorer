import InfoBox from './InfoBox'
import TabNavbar, { TabPane } from '../Nav/TabNavbar'
import Widget from '../Widgets/Widget'
import { clamp } from 'lodash'
import { formatLargeNumber, formatPercent } from '../../utils/format'
import VersionsWidget from '../Widgets/VersionsWidget'
import { useElections } from '../../data/consensus'
import useApi from '../../hooks/useApi'
import InfoBoxPaneContainer from './Common/InfoBoxPaneContainer'
import StatWidget from '../Widgets/StatWidget'
import { differenceInDays } from 'date-fns'
import { useValidatorStats } from '../../data/validators'
import Currency from '../Common/Currency'
import { useMarket } from '../../data/market'
import ElectionsPane from './Common/ElectionsPane'
import AllValidatorsPane from './Validators/AllValidatorsPane'
import ConsensusGroupPane from './Validators/ConsensusGroupPane'

const TICKER = 'HNT'

const ValidatorsInfoBox = () => {
  const { data: stats } = useApi('/metrics/validators')
  const { consensusGroups } = useElections()
  const { stats: validatorStats } = useValidatorStats()
  const { market } = useMarket()

  return (
    <InfoBox title="Validators" metaTitle="Validators">
      <TabNavbar basePath="validators">
        <TabPane title="Statistics" key="statistics">
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
              value={formatPercent(
                calculateValidatorAPY(validatorStats?.active),
              )}
              isLoading={!validatorStats}
              tooltip="Annual percent return of validators that are staked and online. Note that unstaking tokens invokes a 250,000 block (~5 mo.) cooldown period where no returns will be earned before the staked tokens become liquid again. Earned rewards are immediately liquid."
            />
            <Widget
              title={`Total Staked (${TICKER})`}
              value={formatLargeNumber(validatorStats?.staked?.amount)}
              change={
                <Currency
                  value={market?.price * validatorStats?.staked?.amount}
                />
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
          </InfoBoxPaneContainer>
        </TabPane>
        <TabPane title="Elections" key="elections" path="elections">
          <ElectionsPane />
        </TabPane>
        <TabPane title="Consensus Group" key="consensus" path="consensus">
          <ConsensusGroupPane />
        </TabPane>
        <TabPane title="All Validators" key="all" path="all">
          <AllValidatorsPane />
        </TabPane>
      </TabNavbar>
    </InfoBox>
  )
}

const calculateValidatorAPY = (numValidators) => {
  if (!numValidators) return 0

  const preHalvingTokensPerDay = 300000 / 30
  const postHalvingTokensPerDay = preHalvingTokensPerDay / 2
  const daysTilHalving = clamp(
    differenceInDays(new Date('2021-08-01'), new Date()),
    0,
    365,
  )
  const daysAfterHalving = 365 - daysTilHalving
  const blendedTokensPerDay =
    preHalvingTokensPerDay * daysTilHalving +
    daysAfterHalving * postHalvingTokensPerDay
  const annualTokensPerValidator = blendedTokensPerDay / numValidators
  const stake = 10000

  return annualTokensPerValidator / stake
}

export default ValidatorsInfoBox
