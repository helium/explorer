import classNames from 'classnames'
import { useMemo } from 'react'
import { useElections } from '../../../data/consensus'
import { useAccountValidators } from '../../../data/validators'
import SkeletonList from '../../Lists/SkeletonList'
import ValidatorsList from '../../Lists/ValidatorsList'

const ValidatorsPane = ({ address }) => {
  const { validators, isLoading: isLoadingValidators } = useAccountValidators(
    address,
  )
  const { consensusGroups, isLoading: isLoadingElections } = useElections()
  const recentGroups = useMemo(() => consensusGroups?.recentElections || [], [
    consensusGroups,
  ])

  const isLoading = useMemo(() => isLoadingValidators || isLoadingElections, [
    isLoadingValidators,
    isLoadingElections,
  ])

  if (isLoading) {
    return <SkeletonList />
  }

  return (
    <div
      className={classNames('grid grid-flow-row grid-cols-1 no-scrollbar', {
        'overflow-y-scroll': !isLoading,
        'overflow-y-hidden': isLoading,
      })}
    >
      <ValidatorsList
        validators={validators}
        recentGroups={recentGroups}
        isLoading={isLoading}
      />
    </div>
  )
}

export default ValidatorsPane
