import { useCallback, useMemo, useState } from 'react'
import classNames from 'classnames'
import { castArray, keyBy } from 'lodash'

const NavItem = ({ title, active = false, onClick }) => (
  <span
    onClick={onClick}
    className={classNames(
      'mx-2 py-3 inline-block font-medium text-base cursor-pointer',
      {
        'text-gray-600': !active,
        'text-navy-400 border-navy-400 border-b-3 border-solid': active,
      },
    )}
  >
    {title}
  </span>
)

const TabNavbar = ({ children }) => {
  const navItems = useMemo(() => {
    return castArray(children).map((c) => ({
      key: c.key,
      title: c.props.title,
    }))
  }, [children])

  const navPanes = useMemo(() => {
    return keyBy(castArray(children), 'key')
  }, [children])

  const [activeNavItem, setActiveNavItem] = useState(navItems[0])

  const handleNavItemClick = useCallback(
    (item) => () => {
      setActiveNavItem(item)
    },
    [],
  )

  return (
    <>
      <div className="w-full bg-white z-10 rounded-t-xl">
        <div className="border-b border-gray-400 border-solid mt-2 px-2 md:px-8 flex overflow-x-scroll">
          {navItems.map((item) => (
            <NavItem
              title={item.title}
              active={item.key === activeNavItem.key}
              onClick={handleNavItemClick(item)}
            />
          ))}
        </div>
      </div>

      {navPanes[activeNavItem.key]}
    </>
  )
}

export const TabPane = ({ title, key, children }) => {
  return children
}

export default TabNavbar
