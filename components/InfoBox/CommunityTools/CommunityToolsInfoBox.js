import InfoBox from '../InfoBox'
import InfoBoxPaneContainer from '../Common/InfoBoxPaneContainer'
import InfoBoxPaneTitleSection from '../Common/InfoBoxPaneTitleSection'
import CommunityToolWidget from '../../Widgets/CommunityToolWidget'

import { communityToolsList } from '../CommunityTools/utils'

const CommunityToolsInfoBox = () => {
  return (
    <InfoBox title="Community Tools" metaTitle="Community Tools">
      <InfoBoxPaneTitleSection
        title="Community Tools"
        description="Tools built by the Helium community"
      />
      <InfoBoxPaneContainer>
        {communityToolsList.map((t, i) => {
          console.log(t)
          return (
            <CommunityToolWidget
              category={t.category}
              title={t.name}
              description={t.description}
            />
          )
        })}
      </InfoBoxPaneContainer>
    </InfoBox>
  )
}

export default CommunityToolsInfoBox
