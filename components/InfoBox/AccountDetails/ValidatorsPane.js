import classNames from 'classnames'
import { unionBy } from 'lodash'
import { useMemo } from 'react'
import { useElections } from '../../../data/consensus'
import { useAccountValidators } from '../../../data/validators'
import useApi from '../../../hooks/useApi'
import SkeletonList from '../../Lists/SkeletonList'
import ValidatorsList from '../../Lists/ValidatorsList'

const ValidatorsPane = ({ address }) => {
  const {
    validators: accountValidators,
    isLoading: isLoadingAccountValidators,
  } = useAccountValidators(address)
  const { data: allValidators } = useApi('/validators')
  const { consensusGroups, isLoading: isLoadingElections } = useElections()
  const recentGroups = useMemo(() => consensusGroups?.recentElections || [], [
    consensusGroups,
  ])

  const isLoading = useMemo(
    () => isLoadingAccountValidators || !allValidators || isLoadingElections,
    [isLoadingAccountValidators, isLoadingElections, allValidators],
  )

  const accountValidatorAddresses = useMemo(() => {
    if (!accountValidators) return []
    return accountValidators.map((v) => v.address)
  }, [accountValidators])

  const validators = useMemo(() => {
    if (!allValidators) return []
    return allValidators.filter((v) =>
      accountValidatorAddresses.includes(v.address),
    )
  }, [accountValidatorAddresses, allValidators])

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
