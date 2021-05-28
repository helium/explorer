import { Link } from 'react-router-i18n'
import { useRouteMatch } from 'react-router-dom'
import { startCase } from 'lodash'
import { memo } from 'react'

const deriveBreadcrumbsFromUrl = () => {
  const { url } = useRouteMatch()
  const urlSections = url.split('/')
  const derivedBreadcrumbs = []

  urlSections.map((b, i, { length }) => {
    // skip first and last (first is empty because it's the root, last is current page)
    if (i !== 0 && i < length - 1)
      derivedBreadcrumbs.push({ title: startCase(b), path: `/${b}` })
  })
  return derivedBreadcrumbs
}

const Breadcrumbs = ({ breadcrumbs }) => {
  const breadcrumbsToDisplay = breadcrumbs
    ? breadcrumbs
    : deriveBreadcrumbsFromUrl()

  return (
    <div className="flex flex-row items-center justify-start">
      {breadcrumbsToDisplay &&
        breadcrumbsToDisplay.length > 0 &&
        breadcrumbsToDisplay.map((b) => {
          return (
            <span className="pointer-events-auto flex flex-row items-center justify-start pb-1">
              <Link
                className="text-gray-600 font-sans font-semibold"
                to={b.path}
              >
                {b.title}
              </Link>
              <p className="text-gray-700 mx-2 my-0 font-black text-md font-sans">
                /
              </p>
            </span>
          )
        })}
    </div>
  )
}

export default memo(Breadcrumbs)
