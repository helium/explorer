import InfoBox from '../InfoBox'
import InfoBoxPaneContainer from '../Common/InfoBoxPaneContainer'
import InfoBoxPaneTitleSection from '../Common/InfoBoxPaneTitleSection'
import CommunityToolWidget from '../../Widgets/CommunityToolWidget'

import { communityToolsList, types } from '../../../data/communitytools'
import { useMemo } from 'react'
import PillNavbar from '../../Nav/PillNavbar'
import { useCallback } from 'react'
import { useState } from 'react'
import InfoBoxToolsSection from '../Common/InfoBoxToolsSection'
import classNames from 'classnames'
import { useEffect } from 'react'

// const filters = {
//   All: ['All'],
//   iOS: ['iOS'],
//   Monitoring: ['Monitoring'],
//   'Data Export': ['Data Export'],
//   Planning: ['Planning'],
// }

const CommunityToolsInfoBox = () => {
  const sortedTools = useMemo(
    () =>
      communityToolsList.sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
      ),
    [],
  )

  const [shownToolsList, setShownToolsList] = useState(sortedTools)

  const [filterType, setFilterType] = useState(null)
  const [filterSearchTerm, setFilterSearchTerm] = useState('')

  const handleUpdateSearchFilter = (e) => {
    e.preventDefault()
    setFilterSearchTerm(e.target.value)
  }

  useEffect(() => {
    if (filterSearchTerm === '') {
      setShownToolsList(sortedTools)
    }

    const query = filterSearchTerm.toLowerCase()

    const listFilteredByQuery = sortedTools.filter((t) => {
      const name = t.name.toLowerCase()
      const url = t.url.toLowerCase()
      const description = t.description.toLowerCase()
      const tags = t?.tags

      return (
        name?.includes(query) ||
        description?.includes(query) ||
        url?.includes(query) ||
        tags?.some((t) => t?.toLowerCase()?.includes(query))
      )
    })
    setShownToolsList(listFilteredByQuery)
  }, [filterSearchTerm, sortedTools])

  useEffect(() => {
    const listFilteredBySelectedType = sortedTools.filter((t) => {
      const tags = t?.tags

      return tags?.some((t) => t === filterType)
    })
    setShownToolsList(listFilteredBySelectedType)
  }, [filterType, sortedTools])

  return (
    <InfoBox title="Community Tools" metaTitle="Community Tools">
      <InfoBoxPaneTitleSection
        title="Community Tools"
        description={
          <div className="flex flex-col space-y-2">
            <div>
              A set of tools that have been built by the Helium community. The
              tools listed are not endorsed by Helium Inc. or its core
              developers. Please use community tools at your own discretion.
            </div>
            <div>
              If there's a tool that isn't listed here that you think should be,
              you can{' '}
              <a
                className="text-navy-400 hover:text-navy-300"
                href="https://github.com/helium/explorer/edit/v2/data/communitytools.js"
                rel="noopener noreferrer"
                target="_blank"
              >
                edit this file
              </a>
              , then create a new branch and start a pull request against{' '}
              <a
                className="text-navy-400 hover:text-navy-300"
                href="https://github.com/helium/explorer"
                rel="noopener noreferrer"
                target="_blank"
              >
                the v2 branch of the Helium Explorer GitHub repository
              </a>{' '}
              to add it.
            </div>
          </div>
        }
      />
      <InfoBoxToolsSection>
        <div className="flex flex-col w-full">
          <div className="flex flex-row items-center justify-start">
            {Object.entries(types).map(([key, value]) => {
              return (
                <div
                  className={classNames(
                    'px-1 rounded-md bg-gray-400 text-sm text-white font-sans font-light mr-1 cursor-pointer',
                    { 'bg-navy-900': value === filterType },
                  )}
                  onClick={() => setFilterType(value)}
                >
                  {value}
                </div>
              )
            })}
          </div>
          <input
            type="search"
            id="filter-search"
            value={filterSearchTerm}
            onChange={handleUpdateSearchFilter}
            className="w-full border-gray-300 bg-white border-none outline-none text-base font-sans"
            placeholder="Search for a tool..."
          />
        </div>
      </InfoBoxToolsSection>
      <InfoBoxPaneContainer>
        {shownToolsList.map((t) => {
          return (
            <CommunityToolWidget
              tags={t.tags}
              title={t.name}
              description={t.description}
              url={t.url}
            />
          )
        })}
        {shownToolsList.length === 0 && (
          <span className="text-gray-525 w-full text-center col-span-2">
            No results
          </span>
        )}
      </InfoBoxPaneContainer>
    </InfoBox>
  )
}

export default CommunityToolsInfoBox
