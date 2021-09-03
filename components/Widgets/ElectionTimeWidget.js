import TrendWidget from './TrendWidget'
import { round } from 'lodash'
import { useState, useEffect } from 'react'
import useApi from '../../hooks/useApi'

const ElectionTimeWidget = () => {
  let { data: blocks } = useApi('/metrics/blocks')

  const [isLoading, setIsLoading] = useState(true)
  const [electionTimes, setElectionTimes] = useState()

  useEffect(() => {
    if (!!blocks) {
      setIsLoading(true)
      const electionTimesArray = blocks?.electionTimeDay
      setElectionTimes(
        electionTimesArray?.map((et) => ({
          ...et,
          value: round(et.value / 60, 1),
        })),
      )
      setIsLoading(false)
    }
  }, [blocks])

  return (
    <TrendWidget
      title="Election Time (24hr)"
      series={electionTimes}
      valueSuffix=" min"
      changeInitial="second_last"
      changeSuffix=" min"
      isLoading={isLoading}
      periodLabel={`${blocks?.electionTimeDay?.length} days`}
    />
  )
}

export default ElectionTimeWidget
