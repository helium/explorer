import Widget from '../../Widgets/Widget'
import InfoBoxPaneContainer from '../Common/InfoBoxPaneContainer'
import { round } from 'lodash'
import { useStats } from '../../../data/stats'
import ElectionTimeWidget from '../../Widgets/ElectionTimeWidget'
import { useElections } from '../../../data/consensus'
import { format, formatDistanceToNow } from 'date-fns'
import { useBlockHeight } from '../../../data/blocks'
import Skeleton from '../../Common/Skeleton'

const ElectionsPane = () => {
  const { stats } = useStats()
  const { consensusGroups } = useElections()
  const { height } = useBlockHeight()

  return (
    <InfoBoxPaneContainer>
      <Widget
        title="Time since last election"
        value={
          consensusGroups?.recentElections?.[0]?.time ? (
            formatDistanceToNow(
              new Date(consensusGroups.recentElections[0].time * 1000),
            )
          ) : (
            <Skeleton />
          )
        }
        subtitle={`${
          consensusGroups?.recentElections?.[0]?.time ? (
            format(
              new Date(consensusGroups.recentElections[0].time * 1000),
              'h:mm aaaa MMM d',
            )
          ) : (
            <Skeleton />
          )
        }`}
        isLoading={!consensusGroups?.recentElections?.[0]?.time}
      />
      <Widget
        title="Blocks since last election"
        value={height - consensusGroups?.recentElections?.[0]?.height}
        subtitle={`Current height: ${height?.toLocaleString()}`}
        isLoading={!consensusGroups || !height}
      />
      <ElectionTimeWidget />
      <Widget
        title="Election Time (1h)"
        value={round(stats?.electionTimes?.lastHour?.avg / 60, 1)}
        valueSuffix=" min"
        subtitle={`${round(
          stats?.electionTimes?.lastHour?.stddev / 60,
        )} min std dev`}
        isLoading={!stats}
      />
      <Widget
        title="Election Time (24h)"
        value={round(stats?.electionTimes?.lastDay?.avg / 60, 1)}
        valueSuffix=" min"
        subtitle={`${round(
          stats?.electionTimes?.lastDay?.stddev / 60,
        )} min std dev`}
        isLoading={!stats}
      />
      <Widget
        title="Election Time (7d)"
        value={round(stats?.electionTimes?.lastWeek?.avg / 60, 1)}
        valueSuffix=" min"
        subtitle={`${round(
          stats?.electionTimes?.lastWeek?.stddev / 60,
        )} min std dev`}
        isLoading={!stats}
      />
      <Widget
        title="Election Time (30d)"
        value={round(stats?.electionTimes?.lastMonth?.avg / 60, 1)}
        valueSuffix=" min"
        subtitle={`${round(
          stats?.electionTimes?.lastMonth?.stddev / 60,
        )} min std dev`}
        isLoading={!stats}
      />
    </InfoBoxPaneContainer>
  )
}

export default ElectionsPane
