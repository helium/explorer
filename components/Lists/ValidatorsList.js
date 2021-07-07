import { useCallback, useState } from 'react'
import animalHash from 'angry-purple-tiger'
import ConsensusIndicator from '../Validators/ConsensusIndicator'
import ValidatorFlagLocation from '../Validators/ValidatorFlagLocation'
import ValidatorStatusDot from '../Validators/ValidatorStatusDot'
import BaseList from './BaseList'

const ValidatorsList = ({ validators, recentGroups, title, description }) => {
  const [index, setIndex] = useState(20)

  const fetchMore = useCallback(() => {
    setIndex(index + 20)
  }, [index])

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
        <div className="flex items-center space-x-1">
          <img src="/images/hnt.svg" className="w-3" /> <span>0 HNT</span>
        </div>
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
      items={validators.slice(0, index)}
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
