import { useCallback, useMemo } from 'react'
import { useParams } from 'react-router'
import InfoBox from './InfoBox'
import TabNavbar, { TabPane } from '../Nav/TabNavbar'
import AccountAddress from '../AccountAddress'
import OverviewPane from './AccountDetails/OverviewPane'
import ActivityPane from './Common/ActivityPane'
import HotspotsPane from './AccountDetails/HotspotsPane'
import ValidatorsPane from './AccountDetails/ValidatorsPane'
import AccountIcon from '../AccountIcon'
import CopyableText from '../Common/CopyableText'
import MakerOverviewPane from './AccountDetails/MakerOverviewPane'
import { useMaker } from '../../data/makers'
import SkeletonWidgets from './Common/SkeletonWidgets'

const AccountDetailsInfoBox = () => {
  const { address } = useParams()
  const { maker, isLoading } = useMaker(address)

  const subtitles = useMemo(() => {
    if (maker)
      return [
        [
          {
            title: maker?.name,
            tooltip: 'This is a Maker Account',
            iconPath: '/images/maker.svg',
          },
        ],
      ]
    return [[]]
  }, [maker])

  const renderOverviewPane = useCallback(() => {
    if (isLoading) {
      return <SkeletonWidgets />
    }
    if (maker) {
      return <MakerOverviewPane />
    }
    return <OverviewPane />
  }, [isLoading, maker])

  return (
    <InfoBox
      title={
        <span className="flex items-center justify-start">
          <AccountIcon address={address} size={28} className="mr-2 mt-0.5" />
          <CopyableText textToCopy={address} tooltip="Copy address">
            <AccountAddress address={address} truncate={5} />
          </CopyableText>
        </span>
      }
      metaTitle={`Account ${address}`}
      subtitles={subtitles}
      breadcrumbs={
        maker
          ? [{ title: 'Makers', path: '/hotspots/makers' }]
          : [{ title: 'Overview', path: '/' }]
      }
    >
      <TabNavbar>
        <TabPane title="Overview" key="overview">
          {renderOverviewPane()}
        </TabPane>

        <TabPane title="Activity" key="activity" path="activity">
          <ActivityPane context="account" address={address} />
        </TabPane>

        <TabPane title="Hotspots" key="hotspots" path="hotspots">
          <HotspotsPane address={address} />
        </TabPane>

        <TabPane title="Validators" key="validators" path="validators">
          <ValidatorsPane address={address} />
        </TabPane>
      </TabNavbar>
    </InfoBox>
  )
}

export default AccountDetailsInfoBox
