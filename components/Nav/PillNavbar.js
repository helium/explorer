import { useCallback, useMemo, useRef } from 'react'
import classNames from 'classnames'
import { getTxnTypeColor } from '../../utils/txns'
import { useScrollIndicators } from '../../hooks/useScrollIndicators'
import ScrollIndicator from '../../hooks/useScrollIndicators'
import { matchPath } from 'react-router'
import {
  Route,
  Switch,
  useRouteMatch,
  Link,
  useLocation,
} from 'react-router-dom'
import { castArray } from 'lodash'

const NavItem = ({
  id,
  title,
  active = false,
  onClick,
  type,
  disabled,
  href,
}) => {
  const handleClick = useCallback(() => {
    onClick(id)
  }, [onClick, id])

  return (
    <Link
      to={href}
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
    </Link>
  )
}

const PillNavbar = ({
  // navItems,
  activeItem,
  onClick,
  disabled,
  children,
}) => {
  const scrollContainer = useRef(null)

  const {
    autoScroll,
    isScrollable,
    isScrolledToStart,
    isScrolledToEnd,
    updateScrollIndicators,
  } = useScrollIndicators(scrollContainer)

  const { path, url } = useRouteMatch()
  const location = useLocation()

  const navItems = useMemo(() => {
    return castArray(children).map((c) => {
      if (c)
        return {
          key: c.props.path,
          title: c.props.title,
          path: c.props.path,
          // classes: c.props.classes,
          // activeClasses: c.props.activeClasses,
          // activeStyles: c.props.activeStyles,
          // hidden: c.props.hidden,
          // changelogIndicator: c.props.changelogIndicator,
        }

      return null
    })
  }, [children])

  const navPanes = useMemo(() => {
    return castArray(children)
  }, [children])

  const navMatch = useCallback(
    (itemPath) => {
      console.log(itemPath)
      const match = matchPath(location.pathname, {
        path: itemPath ? `${path}/${itemPath}` : path,
        exact: false,
      })
      return match
    },
    [location.pathname, path],
  )

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
            id={item.key}
            title={item.title}
            // type={item.value[0]}
            active={navMatch(item.path)}
            active={item.key === activeItem}
            onClick={onClick}
            disabled={disabled}
            href={item.path ? `${url}/${item.path}` : url}
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
      <Switch>
        {navPanes.map((pane) => {
          console.log(url)
          console.log(path)
          console.log(pane.props.path)
          return (
            <Route
              key={pane.key}
              // exact
              path={pane.props.path ? `${path}/${pane.props.path}` : path}
            >
              {/* <Helmet>
              <title>{`${htmlTitleRoot ? `${htmlTitleRoot} – ` : ''}${
                pane.props.title
              }`}</title>
            </Helmet> */}
              {pane}
            </Route>
          )
        })}
      </Switch>
    </>
  )
}

export const PillPane = ({ children }) => children

export default PillNavbar
