import { useCallback, useMemo, useState } from 'react'
import animalHash from 'angry-purple-tiger'
import { round } from 'lodash'
import { Tooltip } from 'antd'
import ConsensusIndicator from '../Validators/ConsensusIndicator'
import ValidatorFlagLocation from '../Validators/ValidatorFlagLocation'
import ValidatorStatusDot from '../Validators/ValidatorStatusDot'
import BaseList from './BaseList'

const ValidatorsList = ({ validators, recentGroups, title, description }) => {
  const [index, setIndex] = useState(20)

  const fetchMore = useCallback(() => {
    setIndex((prevIndex) => prevIndex + 20)
  }, [])

  const validatorsToDisplay = useMemo(() => validators.slice(0, index), [
    index,
    validators,
  ])

  const keyExtractor = useCallback((v) => v.address, [])

  const linkExtractor = useCallback((v) => `/validators/${v.address}`, [])

  const renderTitle = useCallback((v) => {
    return (
      <div className="flex items-center space-x-1">
        <ValidatorStatusDot status={v.status} />
        <span>{`${animalHash(v.address)} (#${v.number})`}</span>
      </div>
    )
  }, [])

  const renderSubtitle = useCallback((v) => {
    return (
      <>
        <ValidatorFlagLocation geo={v.geo} />
        <Tooltip title="HNT earned (30 days)">
          <div className="flex items-center space-x-1">
            <img alt="" src="/images/hnt.svg" className="w-3" />{' '}
            <span>{round(v.rewards.month.total, 2)} HNT</span>
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
      items={validatorsToDisplay}
      fetchMore={fetchMore}
      hasMore={index < validators.length - 1}
      listHeaderTitle={title}
      listHeaderDescription={description}
      keyExtractor={keyExtractor}
      linkExtractor={linkExtractor}
      isLoading={false}
      renderTitle={renderTitle}
      renderSubtitle={renderSubtitle}
      renderDetails={renderDetails}
      blankTitle="No validators"
    />
  )
}

export default ValidatorsList
