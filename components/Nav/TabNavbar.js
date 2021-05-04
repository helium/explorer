import { useCallback, useMemo } from 'react'
import { matchPath } from 'react-router'
import {
  Switch,
  Route,
  useRouteMatch,
  Link,
  useLocation,
} from 'react-router-dom'
import classNames from 'classnames'
import { castArray } from 'lodash'

const NavItem = ({
  title,
  classes,
  activeClasses,
  activeStyles,
  active = false,
  href,
}) => {
  const customStyles = classes || activeClasses || activeStyles
  return (
    <Link
      to={href}
      className={classNames(
        classes,
        active ? activeClasses : '',
        'mx-2 py-3 inline-block font-medium text-base cursor-pointer',
        {
          'text-gray-600 hover:text-navy-400': !active && !customStyles,
          'text-navy-400 border-navy-400 border-b-3 border-solid':
            active && !customStyles,
        },
      )}
      style={active ? activeStyles : {}}
    >
      {title}
    </Link>
  )
}

const TabNavbar = ({
  centered = true,
  customStyles = false,
  classes,
  children,
}) => {
  const { path, url } = useRouteMatch()
  const location = useLocation()

  const navItems = useMemo(() => {
    return castArray(children).map((c) => {
      if (c)
        return {
          key: c.key,
          title: c.props.title,
          path: c.props.path,
          classes: c.props.classes,
          activeClasses: c.props.activeClasses,
          activeStyles: c.props.activeStyles,
        }
    })
  }, [children])

  const navPanes = useMemo(() => {
    return castArray(children)
  }, [children])

  const navMatch = useCallback(
    (itemPath) => {
      const match = matchPath(location.pathname, {
        path: itemPath ? `${path}/${itemPath}` : path,
        exact: true,
      })
      return match?.isExact || false
    },
    [location.pathname, path],
  )

  return (
    <>
      <div className="w-full bg-white z-10 rounded-t-xl">
        <div
          className={classNames(classes, {
            'w-full border-b border-gray-400 border-solid mt-2 px-2 md:px-8 flex overflow-x-scroll no-scrollbar': !customStyles,
            'justify-center': centered,
            'justify-start': !centered,
          })}
        >
          {navItems.map((item) => {
            return (
              <NavItem
                key={item.key}
                title={item.title}
                classes={item.classes}
                activeClasses={item.activeClasses}
                activeStyles={item.activeStyles}
                active={navMatch(item.path)}
                href={item.path ? `${url}/${item.path}` : url}
              />
            )
          })}
        </div>
      </div>

      <Switch>
        {navPanes.map((pane) => (
          <Route
            key={pane.key}
            exact
            path={pane.props.path ? `${path}/${pane.props.path}` : path}
          >
            {pane}
          </Route>
        ))}
      </Switch>
    </>
  )
}

export const TabPane = ({ children }) => {
  return children
}

export default TabNavbar
