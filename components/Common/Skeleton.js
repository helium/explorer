import classNames from 'classnames'

const Skeleton = ({ overrideDefaultClasses = false, className }) => (
  <div
    className={classNames('animate-pulse', className, {
      'h-4 rounded bg-gray-400': !overrideDefaultClasses,
    })}
  />
)

export default Skeleton
