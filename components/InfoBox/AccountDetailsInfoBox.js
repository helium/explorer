import { useMemo, useState } from 'react'
import { useParams } from 'react-router'
import InfoBox from './InfoBox'
import TabNavbar, { TabPane } from '../Nav/TabNavbar'
import AccountAddress from '../AccountAddress'
import OverviewPane from './AccountDetails/OverviewPane'
import ActivityPane from './Common/ActivityPane'
import HotspotsPane from './AccountDetails/HotspotsPane'
import AccountIcon from '../AccountIcon'
import { getMakerName } from '../Makers/utils'
import MakerIcon from '../Icons/Maker'
import { useAsync } from 'react-async-hook'
import CopyableText from '../Common/CopyableText'

const AccountDetailsInfoBox = () => {
  const { address } = useParams()
  const [makerName, setMakerName] = useState('Unknown Maker')

  useAsync(async () => {
    setMakerName(await getMakerName(address))
  }, [address])

  const subtitles = useMemo(() => {
    if (makerName !== 'Unknown Maker')
      return [
        {
          title: makerName,
          tooltip: 'This is a Maker Account',
          icon: (
            <MakerIcon classes="h-4 w-auto mr-0.5 md:mr-1 text-purple-500" />
          ),
        },
      ]
    return []
  }, [makerName])

  return (
    <InfoBox
      title={
        <span className="flex items-center justify-start">
          <AccountIcon address={address} size={28} className="mr-2 mt-0.5" />
          <CopyableText textToCopy={address} tooltip="Copy address">
            <AccountAddress address={address} truncate={7} mono />
          </CopyableText>
        </span>
      }
      subtitles={subtitles}
      breadcrumbs={[{ title: 'Overview', path: '/' }]}
    >
      <TabNavbar>
        <TabPane title="Overview" key="overview">
          <OverviewPane />
        </TabPane>

        <TabPane title="Activity" key="activity" path="activity">
          <ActivityPane context="account" address={address} />
        </TabPane>

        <TabPane title="Hotspots" key="hotspots" path="hotspots">
          <HotspotsPane address={address} />
        </TabPane>
      </TabNavbar>
    </InfoBox>
  )
}

export default AccountDetailsInfoBox
