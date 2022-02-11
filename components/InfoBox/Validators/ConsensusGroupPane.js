import { useMemo } from 'react'
import { useConsensusGroup, useElections } from '../../../data/consensus'
import ValidatorsList from '../../Lists/ValidatorsList'
import InfoBoxPaneContainer from '../Common/InfoBoxPaneContainer'

const ConsensusGroupPane = () => {
  const { consensusGroups } = useElections()
  const { consensusGroup } = useConsensusGroup()

  const recentGroups = useMemo(
    () => consensusGroups?.recentElections || [],
    [consensusGroups],
  )

  const isLoading = useMemo(
    () => !consensusGroups || !consensusGroup,
    [consensusGroups, consensusGroup],
  )

  return (
    <InfoBoxPaneContainer span={1} padding={false}>
      <ValidatorsList
        validators={consensusGroup || []}
        recentGroups={recentGroups || []}
        title={`Currently Elected Validators (${consensusGroup?.length})`}
        isLoading={isLoading}
      />
    </InfoBoxPaneContainer>
  )
}

export default ConsensusGroupPane
