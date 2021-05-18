import { useState } from 'react'
import classNames from 'classnames'
import { getMakerData } from '../../../data/makers'
import { useAsync } from 'react-async-hook'
import SkeletonList from '../../Lists/SkeletonList'
import MakersList from '../../Lists/MakersList'

const MakersTabPane = () => {
  const [makers, setMakers] = useState([])
  const [makersLoading, setMakersLoading] = useState(true)

  useAsync(async () => {
    setMakersLoading(true)
    const { makerData } = await getMakerData()
    setMakers(makerData)
    setMakersLoading(false)
  }, [])

  return (
    <div
      className={classNames('grid grid-flow-row grid-cols-1 no-scrollbar', {
        'overflow-y-scroll': !makersLoading,
        'overflow-y-hidden': makersLoading,
      })}
    >
      {makersLoading ? <SkeletonList /> : <MakersList makers={makers} />}
    </div>
  )
}

export default MakersTabPane
