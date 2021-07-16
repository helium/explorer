import InfoBox from '../InfoBox'
import InfoBoxPaneContainer from '../Common/InfoBoxPaneContainer'
import InfoBoxPaneTitleSection from '../Common/InfoBoxPaneTitleSection'
import CommunityToolWidget from '../../Widgets/CommunityToolWidget'

import { communityToolsList } from '../../../data/communitytools'
import { useMemo } from 'react'

const CommunityToolsInfoBox = () => {
  const sortedTools = useMemo(
    () =>
      communityToolsList.sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
      ),
    [],
  )
  return (
    <InfoBox title="Community Tools" metaTitle="Community Tools">
      <InfoBoxPaneTitleSection
        title="Community Tools"
        description={
          <div className="flex flex-col space-y-2">
            <div>
              A set of tools that have been built by the Helium community. The tools listed are not endorsed be Helium Inc. or its core developers. Please use community tools at your own discretion.
            </div>
            <div>
              If there's a tool that isn't listed here that you think should be,
              you can{' '}
              <a
                className="text-gray-800 font-bold hover:text-darkgray-800"
                href="https://github.com/helium/explorer/edit/beta/data/communitytools.js"
                rel="noopener noreferrer"
                target="_blank"
              >
                edit this file
              </a>
              , then create a new branch and start a pull request against{' '}
              <a
                className="text-gray-800 font-bold hover:text-darkgray-800"
                href="https://github.com/helium/explorer"
                rel="noopener noreferrer"
                target="_blank"
              >
                the Helium Explorer GitHub repository
              </a>{' '}
              to add it.
            </div>
          </div>
        }
      />
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
