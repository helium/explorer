import { useCallback, useMemo, useEffect, useRef } from 'react'
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
import { useScrollIndicators } from '../../hooks/useScrollIndicators'
import ScrollIndicator from '../../hooks/useScrollIndicators'

const NavItem = ({
  title,
  classes,
  activeClasses,
  activeStyles,
  active = false,
  href,
}) => {
  const customStyles = classes || activeClasses || activeStyles
  const ref = useRef(null)

  useEffect(() => {
    if (active)
      ref.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest',
      })
  }, [active, ref])

  const styles = {
    // scroll-margin tells the browser to leave a margin around it when using it as a scroll target
    scrollMargin: 32 + 20,
    // 32px is the width of the bouncing scroll indicator, and 20px is the padding at the end of the list
    // 32 + 20 so that:
    // 1. if it's jumping to the last item, it won't leave a scroll indicator that jumps to nothing
    // 2. if it's not the last item, the ones behind it will peek out slightly and won't be fully obscured by the scroll indicator)
  }

  return (
    <Link
      to={href}
      // jump to the active element (setting a ref triggers the useEffect above)
      {...(active ? { ref: ref } : {})}
      className={classNames(
        classes,
        active ? activeClasses : '',
        'mx-2 py-2 lg:py-3 inline-block font-medium text-sm md:text-base cursor-pointer whitespace-nowrap',
        {
          'text-gray-600 hover:text-navy-400': !active && !customStyles,
          'text-navy-400 border-navy-400 border-b-3 border-solid':
            active && !customStyles,
        },
      )}
      style={active ? { ...activeStyles, ...styles } : styles}
    >
      {title}
    </Link>
  )
}

const TabNavbar = ({ centered = false, className, children }) => {
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
          key: c.key,
          title: c.props.title,
          path: c.props.path,
          classes: c.props.classes,
          activeClasses: c.props.activeClasses,
          activeStyles: c.props.activeStyles,
          hidden: c.props.hidden,
        }
      return null
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
      <div className="w-full relative bg-white z-10">
        <div
          ref={scrollContainer}
          onScroll={updateScrollIndicators}
          className={classNames(className, {
            'w-full border-b border-gray-400 border-solid mt-1 lg:mt-2 px-2 md:px-3 flex overflow-x-scroll no-scrollbar':
              !className,
            'justify-center': centered,
            'justify-start': !centered,
          })}
        >
          {navItems.map((item, i, { length }) => {
            if (item.hidden) return null
            return (
              <>
                <NavItem
                  key={item.key}
                  title={item.title}
                  classes={item.classes}
                  activeClasses={item.activeClasses}
                  activeStyles={item.activeStyles}
                  active={navMatch(item.path)}
                  href={item.path ? `${url}/${item.path}` : url}
                />
                {i === length - 1 && (
                  // add a spacer after the last item so the right side of the container has padding
                  <div className="px-2 py-2 md:px-4" />
                )}
              </>
            )
          })}
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
