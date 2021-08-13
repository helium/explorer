import classNames from 'classnames'
import ChevronIcon from '../Icons/Chevron'

const ScrollIndicator = ({
  className,
  wrapperClasses,
  onClick,
  shown,
  direction = 'right',
}) => {
  return (
    <div
      className={classNames(
        wrapperClasses,
        'absolute cursor-pointer transform-gpu transition-all duration-500',
        {
          'opacity-100 pointer-events-auto': shown,
          'opacity-0 pointer-events-none': !shown,
          'right-0 top-0 h-full': direction === 'right',
          'left-0 top-0 h-full': direction === 'left',
          'left-0 right-0 bottom-0 w-full': direction === 'down',
          'left-0 right-0 top-0 w-full': direction === 'up',
        },
      )}
      onClick={onClick}
    >
      <div
        className={classNames(
          'flex items-center justify-center from-white via-white',
          {
            'w-8 h-full': direction === 'right' || direction === 'left',
            'w-full h-8': direction === 'up' || direction === 'down',
            'bg-gradient-to-l': direction === 'right',
            'bg-gradient-to-r': direction === 'left',
            'bg-gradient-to-t': direction === 'down',
            'bg-gradient-to-b': direction === 'up',
          },
          className,
        )}
      >
        <span
          className={classNames({
            'animate-bounce-right': direction === 'right',
            'animate-bounce-left ': direction === 'left',
            'animate-bounce': direction === 'down' || direction === 'up',
          })}
        >
          <ChevronIcon
            className={classNames('w-4 h-4 text-navy-400 opacity-75', {
              'rotate-90': direction === 'right',
              '-rotate-90': direction === 'left',
              'rotate-180': direction === 'down',
            })}
          />
        </span>
      </div>
    </div>
  )
}

export default ScrollIndicator
