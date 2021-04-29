import { useCallback } from 'react'
import animalHash from 'angry-purple-tiger'
import ConsensusIndicator from '../Validators/ConsensusIndicator'
import ValidatorFlagLocation from '../Validators/ValidatorFlagLocation'
import ValidatorStatusPill from '../Validators/ValidatorStatusPill'
import BaseList from './BaseList'

const ValidatorsList = ({ validators, recentGroups }) => {
  const keyExtractor = useCallback((v) => v.address, [])

  const linkExtractor = useCallback((v) => `/validators/${v.address}`, [])

  const renderTitle = useCallback((v) => {
    return `${animalHash(v.address)} (#${v.number})`
  }, [])

  const renderSubtitle = useCallback(
    (v) => {
      return (
        <>
          <ValidatorFlagLocation geo={v.geo} />
          <ConsensusIndicator address={v.address} recentGroups={recentGroups} />
        </>
      )
    },
    [recentGroups],
  )

  const renderDetails = useCallback((v) => {
    return <ValidatorStatusPill status={v.status} />
  }, [])

  return (
    <BaseList
      items={validators}
      keyExtractor={keyExtractor}
      linkExtractor={linkExtractor}
      isLoading={false}
      renderTitle={renderTitle}
      renderSubtitle={renderSubtitle}
      renderDetails={renderDetails}
      blankTitle="No validators"
      noPadding
    />
  )
}

export default ValidatorsList
