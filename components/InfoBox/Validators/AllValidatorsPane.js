import { useMemo } from 'react'
import { useElections } from '../../../data/consensus'
import { useValidators } from '../../../data/validators'
import ValidatorsList from '../../Lists/ValidatorsList'
import InfoBoxPaneContainer from '../Common/InfoBoxPaneContainer'

const AllValidatorsPane = () => {
  const { validators, fetchMore, isLoadingInitial, isLoadingMore, hasMore } =
    useValidators()

  const { consensusGroups } = useElections()

  const recentGroups = useMemo(
    () => consensusGroups?.recentElections || [],
    [consensusGroups],
  )

  return (
    <InfoBoxPaneContainer span={1} padding={false}>
      <ValidatorsList
        validators={validators}
        recentGroups={recentGroups}
        title={'All Validators'}
        fetchMore={fetchMore}
        isLoading={isLoadingInitial}
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}
      />
    </InfoBoxPaneContainer>
  )
}

export default AllValidatorsPane
