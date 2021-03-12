import { formatDistanceToNow } from 'date-fns'

const TimeAgo = ({ time, addSuffix = true }) => {
  return (
    <span>{formatDistanceToNow(new Date(time * 1000), { addSuffix })}</span>
  )
}

export default TimeAgo
