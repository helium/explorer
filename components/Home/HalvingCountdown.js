import React from 'react'
import { Row, Col, Typography } from 'antd'
import Widget from './Widget'
import Countdown from 'react-countdown'
const { Title, Text } = Typography

const HalveningCountdown = () => {
  return (
    <Widget
      title="Countdown to Rewards Halving"
      value={
        <Countdown
          date={new Date('2021-08-01')}
          renderer={({ days, hours, minutes, seconds }) =>
            `${days}D ${hours}H ${minutes}M ${seconds}S`
          }
        />
      }
      subtitle="August 1st, 2021"
      tooltip="HIP 20 reduces HNT rewards every two years on the Network’s genesis anniversary"
      footer="View Blog Post on HIP 20"
      href="https://blog.helium.com/hip-20-on-hnt-max-supply-approved-by-the-community-fca15a161a80"
    />
  )
}

export default HalveningCountdown
