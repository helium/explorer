import { useCallback } from 'react'
import animalHash from 'angry-purple-tiger'
import { round } from 'lodash'
import { Tooltip } from 'antd'
import ConsensusIndicator from '../Validators/ConsensusIndicator'
import ValidatorFlagLocation from '../Validators/ValidatorFlagLocation'
import ValidatorStatusDot from '../Validators/ValidatorStatusDot'
import BaseList from './BaseList'
import Rewards from '../Validators/Rewards'

const ValidatorsList = ({
  validators,
  recentGroups,
  title,
  description,
  fetchMore,
  hasMore,
  isLoading,
  isLoadingMore,
}) => {
  const keyExtractor = useCallback((v) => v.address, [])

  const linkExtractor = useCallback((v) => `/validators/${v.address}`, [])

  const renderTitle = useCallback((v) => {
    return (
      <div className="flex items-center space-x-1">
        <ValidatorStatusDot status={v.status} />
        <span>{`${animalHash(v.address)}`}</span>
      </div>
    )
  }, [])

  const renderSubtitle = useCallback((v) => {
    return (
      <>
        {/* <ValidatorFlagLocation geo={v.geo} /> */}
        <Rewards validator={v} />
        <Tooltip title="Penalty Score">
          <div className="flex items-center space-x-1">
            <img src="/images/penalty.svg" className="w-3" />{' '}
            <span>{round(v.penalty, 2)}</span>
          </div>
        </Tooltip>
      </>
    )
  }, [])

  const renderDetails = useCallback(
    (v) => {
      return (
        <ConsensusIndicator address={v.address} recentGroups={recentGroups} />
      )
    },
    [recentGroups],
  )

  return (
    <BaseList
      items={validators}
      fetchMore={fetchMore}
      isLoading={isLoading}
      hasMore={hasMore}
      isLoadingMore={isLoadingMore}
      listHeaderTitle={title}
      listHeaderDescription={description}
      keyExtractor={keyExtractor}
      linkExtractor={linkExtractor}
      renderTitle={renderTitle}
      renderSubtitle={renderSubtitle}
      renderDetails={renderDetails}
      blankTitle="No validators"
    />
  )
}

export default ValidatorsList
