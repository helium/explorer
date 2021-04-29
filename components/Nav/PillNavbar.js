import classNames from 'classnames'
import { useCallback } from 'react'

const NavItem = ({ title, active = false, onClick }) => {
  const handleClick = useCallback(() => {
    onClick(title)
  }, [onClick, title])

  return (
    <span
      onClick={handleClick}
      className={classNames(
        'py-1 px-2.5 flex font-medium text-base cursor-pointer',
        {
          'text-gray-700': !active,
          'text-white bg-orange-400 rounded-full': active,
        },
      )}
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
          key={item}
          title={item}
          active={item === activeItem}
          onClick={onClick}
        />
      ))}
      <span className="pr-4" />
    </div>
  )
}

export default PillNavbar
