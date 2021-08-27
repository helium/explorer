import InfoBox from '../InfoBox'
import InfoBoxPaneContainer from '../Common/InfoBoxPaneContainer'
import InfoBoxPaneTitleSection from '../Common/InfoBoxPaneTitleSection'
import CommunityToolWidget from '../../Widgets/CommunityToolWidget'

import { communityToolsList, types } from '../../../data/communitytools'
import { useMemo } from 'react'
import { useState } from 'react'
import InfoBoxToolsSection from '../Common/InfoBoxToolsSection'
import { useEffect } from 'react'

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
    // when a query gets typed, clear the category selection
    setFilterType(null)
    setFilterSearchTerm(e.target.value)
  }

  const handleUpdateSearchType = (value) => {
    // when a category gets selected, clear the search query field
    setFilterSearchTerm('')
    if (filterType === value) {
      // if this one was already selected, deselect it
      setFilterType(null)
    } else {
      setFilterType(value)
    }
  }

  useEffect(() => {
    if (filterSearchTerm === '') {
      // if there isn't a search query, show the whole list
      setShownToolsList(sortedTools)
    } else {
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
          tags?.some((t) => t?.label?.toLowerCase()?.includes(query))
        )
      })
      setShownToolsList(listFilteredByQuery)
    }
  }, [filterSearchTerm, sortedTools])

  useEffect(() => {
    if (filterType === null) {
      // if there isn't a category selected, show the whole list
      setShownToolsList(sortedTools)
    } else {
      const listFilteredBySelectedType = sortedTools.filter((t) => {
        const tags = t?.tags

        return tags?.some((t) => t?.label === filterType)
      })
      setShownToolsList(listFilteredBySelectedType)
    }
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
      <InfoBoxToolsSection
        defaultClasses={false}
        className="pt-1 md:pt-2 px-1.5 md:px-4 border-b border-solid border-gray-350 bg-gray-300"
      >
        <div className="flex flex-col w-full">
          <div className="flex flex-row items-center justify-start flex-wrap">
            {Object.entries(types).map(([_key, value]) => (
              <div
                className="px-1 md:px-1.5 py-1 md:py-0.5 rounded-md md:rounded-lg text-xs md:text-sm font-sans mr-1 md:mr-1.5 cursor-pointer whitespace-nowrap mb-1 md:mb-2"
                style={
                  value.label === filterType
                    ? {
                        backgroundColor: value.foregroundColor,
                        color: value.backgroundColor,
                      }
                    : {
                        backgroundColor: value.backgroundColor,
                        color: value.foregroundColor,
                      }
                }
                onClick={() => handleUpdateSearchType(value.label)}
              >
                {value.label}
              </div>
            ))}
            <input
              type="search"
              id="filter-search"
              value={filterSearchTerm}
              onChange={handleUpdateSearchFilter}
              className="border border-solid border-gray-350 bg-white focus:border-gray-525 outline-none text-base font-light flex-grow font-sans w-20 rounded-lg px-1 mb-1 md:mb-2"
              placeholder="or search..."
              autoComplete="off"
            />
          </div>
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
