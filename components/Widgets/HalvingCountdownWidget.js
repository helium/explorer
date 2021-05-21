import React from 'react'
import Widget from './Widget'
import Countdown from 'react-countdown'

const HalveningCountdownWidget = () => {
  // return (
  //   <Widget
  //     subtitle="August 1st, 2021"
  //     tooltip="HIP 20 reduces HNT rewards every two years on the Network’s genesis anniversary"
  //     footer="View Blog Post on HIP 20"
  //     href="https://blog.helium.com/hip-20-on-hnt-max-supply-approved-by-the-community-fca15a161a80"
  //   />
  // )
  return (
    <Widget
      title="Countdown to Rewards Halving"
      value={
        <Countdown
          date={new Date('2021-08-01')}
          renderer={({ days, hours, minutes, seconds }) =>
            `${days}d ${hours}h ${minutes}m ${seconds}s`
          }
        />
      }
      subtitle="August 1st, 2021"
      span={2}
      // onClick={() => selectHotspot(hotspot.address)}
      // isLoading={!hotspot}
    />
  )
}

export default HalveningCountdownWidget
