import classNames from 'classnames'
import { useCallback } from 'react'
import { getTxnTypeColor } from '../../utils/txns'

const NavItem = ({ title, active = false, onClick, type }) => {
  const handleClick = useCallback(() => {
    onClick(title)
  }, [onClick, title])

  return (
    <span
      onClick={handleClick}
      className={classNames(
        'py-1 px-2.5 flex font-medium text-base cursor-pointer whitespace-nowrap transition-all transform duration-200',
        {
          'text-gray-700': !active,
          'text-white rounded-full': active,
        },
      )}
      style={active ? { backgroundColor: getTxnTypeColor(type) } : {}}
    >
      {title}
    </span>
  )
}

const PillNavbar = ({ navItems, activeItem, onClick }) => {
  return (
    <div className="flex px-2 py-3 bg-white overflow-x-scroll no-scrollbar border-b border-gray-400 border-solid">
      {navItems.map((item) => (
        <NavItem
          key={item.key}
          title={item.key}
          type={item.value[0]}
          active={item.key === activeItem}
          onClick={onClick}
        />
      ))}
      <span className="pr-4" />
    </div>
  )
}

export default PillNavbar
