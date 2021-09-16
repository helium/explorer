import classNames from 'classnames'
import { useCallback } from 'react'
import { getTxnTypeColor } from '../../utils/txns'
import { useScrollIndicators } from '../../hooks/useScrollIndicators'
import ScrollIndicator from '../../hooks/useScrollIndicators'
import { useRef } from 'react'

const NavItem = ({ title, active = false, onClick, type, disabled }) => {
  const handleClick = useCallback(() => {
    onClick(title)
  }, [onClick, title])

  return (
    <span
      // don't allow clicking to another filter until the current one has finished loading
      {...(!disabled ? { onClick: handleClick } : {})}
      className={classNames(
        'py-1 px-2.5 mr-0 md:mr-1 flex font-medium text-sm md:text-base cursor-pointer whitespace-nowrap transition-all transform duration-200',
        {
          'text-gray-700': !active,
          'text-white rounded-full': active,
          'cursor-wait ': disabled,
        },
      )}
      style={active ? { backgroundColor: getTxnTypeColor(type) } : {}}
    >
      {title}
    </span>
  )
}

const PillNavbar = ({ navItems, activeItem, onClick, disabled }) => {
  const scrollContainer = useRef(null)

  const {
    autoScroll,
    isScrollable,
    isScrolledToStart,
    isScrolledToEnd,
    updateScrollIndicators,
  } = useScrollIndicators(scrollContainer)
  return (
    <>
      <div
        className="flex px-2 md:px-4 py-2 md:py-3 bg-white overflow-x-scroll no-scrollbar border-b border-gray-400 border-solid"
        ref={scrollContainer}
        onScroll={updateScrollIndicators}
      >
        {navItems.map((item) => (
          <NavItem
            key={item.key}
            title={item.key}
            type={item.value[0]}
            active={item.key === activeItem}
            onClick={onClick}
            disabled={disabled}
          />
        ))}
        <span className="pr-4" />
      </div>
      <ScrollIndicator
        direction="right"
        wrapperClasses="pb-1"
        onClick={autoScroll}
        shown={isScrollable && !isScrolledToEnd}
      />
      <ScrollIndicator
        direction="left"
        wrapperClasses="pb-1"
        onClick={() => autoScroll({ direction: 'left' })}
        shown={isScrollable && !isScrolledToStart}
      />
    </>
  )
}

export default PillNavbar
