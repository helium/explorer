import classNames from 'classnames'

const Skeleton = ({ w = 'w-3/4', my = 'my-2' }) => (
  <div className={classNames('animate-pulse h-4 bg-gray-400 rounded', my, w)} />
)

export default Skeleton
