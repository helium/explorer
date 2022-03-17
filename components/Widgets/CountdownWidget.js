import Widget from './Widget'
import Countdown from 'react-countdown'
import { useState } from 'react'
import { addMinutes } from 'date-fns'

const CountdownWidget = ({
  title,
  subtitle,
  blocksRemaining,
  completedText,
  isLoading,
}) => {
  if (isLoading) {
    return <Widget title={title} subtitle={subtitle} span={2} isLoading />
  }

  const now = new Date(Date.now())
  const deadlineDate = addMinutes(now, parseInt(blocksRemaining))

  const [countdownCompleted, setCountdownCompleted] = useState(false)

  if (countdownCompleted) {
    return <Widget span={2} title={title} value={completedText} />
  }

  return (
    <Widget
      title={title}
      key={deadlineDate}
      date={deadlineDate}
      value={
        <Countdown
          date={deadlineDate}
          renderer={({ days, hours, minutes, seconds, completed }) => {
            if (completed) setCountdownCompleted(true)
            return `${days}d ${hours}h ${minutes}m ${seconds}s`
          }}
        />
      }
      subtitle={subtitle}
      span={2}
    />
  )
}

export default CountdownWidget
