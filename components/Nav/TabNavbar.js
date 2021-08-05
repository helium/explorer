import { useCallback, useMemo, useEffect } from 'react'
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
import { useState } from 'react'
import ChevronIcon from '../Icons/Chevron'
import { useRef } from 'react'

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
        'mx-2 py-2 lg:py-3 inline-block font-medium text-sm md:text-base cursor-pointer whitespace-nowrap',
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

const TabNavbar = ({ centered = false, className, children }) => {
  const [isScrollable, setIsScrollable] = useState(false)
  const [isScrolledToStart, setIsScrolledToStart] = useState(true)
  const [isScrolledToEnd, setIsScrolledToEnd] = useState(true)

  const [scrollWidth, setScrollWidth] = useState()
  const [viewWidth, setViewWidth] = useState()
  const [scrollPositionX, setScrollPositionX] = useState()

  const targetElement = useRef(null)

  const updateScrollIndicator = useCallback(() => {
    const BUFFER_PIXELS = 20

    setScrollWidth(targetElement?.current?.scrollWidth)
    setViewWidth(targetElement?.current?.clientWidth)
    setScrollPositionX(targetElement?.current?.scrollLeft)

    setIsScrollable(scrollWidth > viewWidth)
    setIsScrolledToEnd(
      scrollPositionX + BUFFER_PIXELS >= scrollWidth - viewWidth,
    )
    setIsScrolledToStart(scrollPositionX < BUFFER_PIXELS)
  }, [scrollPositionX, scrollWidth, viewWidth])

  const autoScroll = (direction = 'right') => {
    targetElement.current.scrollBy({
      left: direction === 'left' ? -(scrollWidth / 4) : scrollWidth / 4,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    updateScrollIndicator()
  }, [updateScrollIndicator])

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
          ref={targetElement}
          id="tab-nav-section"
          onScroll={updateScrollIndicator}
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
        <div
          className="absolute right-0 top-0 pb-1 h-full cursor-pointer"
          onClick={autoScroll}
        >
          <div
            className={classNames(
              'bg-gradient-to-l from-white via-white w-10 h-full flex items-center justify-center transition-all duration-500',
              {
                'opacity-100': isScrollable && !isScrolledToEnd,
                'opacity-0': !isScrollable || isScrolledToEnd,
              },
            )}
          >
            <span className="animate-bounce-right">
              <ChevronIcon className="rotate-90 w-4 h-4 text-navy-400" />
            </span>
          </div>
        </div>
        <div
          className="absolute left-0 top-0 pb-1 h-full cursor-pointer"
          onClick={() => autoScroll('left')}
        >
          <div
            className={classNames(
              'bg-gradient-to-r from-white via-white w-10 h-full flex items-center justify-center transition-all duration-500',
              {
                'opacity-100': isScrollable && !isScrolledToStart,
                'opacity-0': isScrollable && isScrolledToStart,
              },
            )}
          >
            <span className="animate-bounce-left">
              <ChevronIcon className="-rotate-90 w-4 h-4 text-navy-400" />
            </span>
          </div>
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
