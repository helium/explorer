import InfoBox from '../InfoBox'
import InfoBoxPaneContainer from '../Common/InfoBoxPaneContainer'
import InfoBoxPaneTitleSection from '../Common/InfoBoxPaneTitleSection'
import CommunityToolWidget from '../../Widgets/CommunityToolWidget'

import { communityToolsList } from '../../../data/communitytools'
import { useMemo } from 'react'
import PillNavbar from '../../Nav/PillNavbar'
import { useCallback } from 'react'
import { useState } from 'react'
import InfoBoxToolsSection from '../Common/InfoBoxToolsSection'
import classNames from 'classnames'

const filters = {
  All: ['All'],
  iOS: ['iOS'],
  Monitoring: ['Monitoring'],
  'Data Export': ['Data Export'],
  Planning: ['Planning'],
}

const CommunityToolsInfoBox = () => {
  const sortedTools = useMemo(
    () =>
      communityToolsList.sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
      ),
    [],
  )

  const [filter, setFilter] = useState([])

  const handleUpdateFilter = useCallback((filterName) => {
    setFilter(filterName)
    // scrollView.current.scrollTo(0, 0)
  }, [])

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
        <div className="flex flex-row items-center justify-center">
          {Object.entries(filters).map(([key, value]) => {
            return (
              <div
                className={classNames(
                  'px-1 rounded-md bg-gray-400 text-sm text-white font-sans font-light mr-1',
                  { 'bg-navy-900': value === filter[0] },
                )}
                onClick={() => setFilter([value])}
              >
                {key}
              </div>
            )
          })}
        </div>
      </InfoBoxToolsSection>
      <InfoBoxPaneContainer>
        {sortedTools.map((t) => {
          return (
            <CommunityToolWidget
              tags={t.tags}
              title={t.name}
              description={t.description}
              url={t.url}
            />
          )
        })}
      </InfoBoxPaneContainer>
    </InfoBox>
  )
}

export default CommunityToolsInfoBox
