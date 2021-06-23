import InfoBox from './InfoBox'
import TabNavbar, { TabPane } from '../Nav/TabNavbar'
import Widget from '../Widgets/Widget'
import { useMemo } from 'react'
import { sumBy } from 'lodash'
import { formatLargeNumber, formatPercent } from '../../utils/format'
import VersionsWidget from '../Widgets/VersionsWidget'
import { useElections } from '../../data/consensus'
import ValidatorsList from '../Lists/ValidatorsList'
import useApi from '../../hooks/useApi'
import InfoBoxPaneContainer from './Common/InfoBoxPaneContainer'
import WarningWidget from '../Widgets/WarningWidget'
import SkeletonList from '../Lists/SkeletonList'

const TICKER = 'HNT'

const ValidatorsInfoBox = () => {
  const { data: validators } = useApi('/validators')
  const { consensusGroups } = useElections()
  const isLoading = useMemo(() => validators === undefined, [validators])
  const recentGroups = useMemo(() => consensusGroups?.recentElections || [], [
    consensusGroups,
  ])

  const activeValidators = useMemo(
    () => validators?.filter((v) => v?.status?.online === 'online')?.length,
    [validators],
  )

  const totalStaked = useMemo(() => sumBy(validators, 'stake') / 100000000, [
    validators,
  ])

  const consensusGroup = useMemo(() => validators?.filter((v) => v.elected), [
    validators,
  ])

  return (
    <InfoBox title="Validators" metaTitle="Validators">
      <TabNavbar basePath="validators">
        <TabPane title="Statistics" key="statistics">
          <InfoBoxPaneContainer>
            <WarningWidget
              warningText="Note: Validators are not currently active."
              subtitle="When activated, Validators will take over block production from Hotspots"
            />
            <Widget
              title="Total Validators"
              value={validators?.length?.toLocaleString()}
              isLoading={isLoading}
              linkTo="/validators/all"
            />
            <Widget
              title="Consensus Size"
              value={validators
                ?.filter((v) => v.elected)
                ?.length?.toLocaleString()}
              isLoading={isLoading}
              linkTo="/validators/consensus"
            />
            <Widget
              title="% Online"
              value={formatPercent(
                validators?.length > 0
                  ? activeValidators / validators.length
                  : 0,
              )}
              isLoading={isLoading}
            />
            <Widget
              title={`Total Staked (${TICKER})`}
              value={formatLargeNumber(totalStaked)}
              isLoading={isLoading}
            />
            <VersionsWidget validators={validators} isLoading={isLoading} />
          </InfoBoxPaneContainer>
        </TabPane>
        <TabPane title="Consensus Group" key="consensus" path="consensus">
          <InfoBoxPaneContainer span={1} padding={false}>
            {isLoading ? (
              <SkeletonList />
            ) : (
              <ValidatorsList
                validators={consensusGroup}
                recentGroups={recentGroups}
              />
            )}
          </InfoBoxPaneContainer>
        </TabPane>
        <TabPane title="All Validators" key="all" path="all">
          <InfoBoxPaneContainer span={1} padding={false}>
            {isLoading ? (
              <SkeletonList />
            ) : (
              <ValidatorsList
                validators={validators}
                recentGroups={recentGroups}
              />
            )}
          </InfoBoxPaneContainer>
        </TabPane>
      </TabNavbar>
    </InfoBox>
  )
}

export default ValidatorsInfoBox
