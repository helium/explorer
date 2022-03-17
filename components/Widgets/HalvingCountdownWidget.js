import React from 'react'
import Widget from './Widget'
import Countdown from 'react-countdown'
import { useState } from 'react'

const HalveningCountdownWidget = () => {
  const [countdownCompleted, setCountdownCompleted] = useState(false)

  if (countdownCompleted) return null

  return (
    <Widget
      title="Countdown to Rewards Halving"
      value={
        <Countdown
          // TODO: replace with block deadline logic
          date={new Date('2021-08-01')}
          renderer={({ days, hours, minutes, seconds, completed }) => {
            if (completed) setCountdownCompleted(true)
            return `${days}d ${hours}h ${minutes}m ${seconds}s`
          }}
        />
      }
      subtitle={<span className="text-gray-600">August 1st, 2021 </span>}
      span={2}
      linkTo="https://blog.helium.com/hip-20-on-hnt-max-supply-approved-by-the-community-fca15a161a80"
    />
  )
}

export default HalveningCountdownWidget
