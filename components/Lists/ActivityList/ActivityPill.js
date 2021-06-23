import classNames from 'classnames'
import ChevronIcon from '../../Icons/Chevron'

const ActivityPill = ({
  className,
  details,
  expandable,
  expanded,
  pillSymbolClasses,
  pillColor,
}) => {
  return (
    <div className="cursor-pointer flex items-center justify-end">
      <div
        className={classNames('whitespace-nowrap hidden md:flex', className)}
        style={{ backgroundColor: pillColor }}
      >
        <span className="m-0 pr-2 pl-1">{details}</span>
      </div>
      <span
        className={classNames(
          'px-2 md:pl-1 md:pr-2 py-0.5 flex items-center justify-center rounded-full md:rounded-l-none md:rounded-r-full w-7 relative',
          pillSymbolClasses,
        )}
        style={{ backgroundColor: pillColor }}
      >
        {expandable ? (
          <>
            <span className="bg-black opacity-20 hidden md:block absolute left-0 top-0 rounded-full md:rounded-l-none md:rounded-r-full w-7 h-full" />
            <span className="text-white z-10 hidden md:block">
              {expanded ? '-' : '+'}
            </span>
            <ChevronIcon
              className={classNames(
                'block md:hidden transition-all duration-200 w-4 transform h-3 text-white',
                { 'rotate-0': expanded, 'rotate-180': !expanded },
              )}
            />
          </>
        ) : (
          <ChevronIcon
            className={classNames(
              'transition-all duration-200 w-4 transform rotate-90 h-3 md:h-5',
            )}
          />
        )}
      </span>
    </div>
  )
}

export default ActivityPill
