import { useCallback, useMemo } from 'react'
import { useParams } from 'react-router'
import InfoBox from './InfoBox'
import TabNavbar, { TabPane } from '../Nav/TabNavbar'
import AccountAddress from '../AccountAddress'
import AccountAddressSolana from '../AccountAddressSolana'
import OverviewPane from './AccountDetails/OverviewPane'
import ActivityPane from './Common/ActivityPane'
import HotspotsPane from './AccountDetails/HotspotsPane'
import ValidatorsPane from './AccountDetails/ValidatorsPane'
import AccountIcon from '../AccountIcon'
import CopyableText from '../Common/CopyableText'
import MakerOverviewPane from './AccountDetails/MakerOverviewPane'
import { useMaker } from '../../data/makers'
import SkeletonWidgets from './Common/SkeletonWidgets'
import SkeletonActivityList from '../Lists/ActivityList/SkeletonActivityList'
import SolanaIcon from '../Icons/Solana'
import Address from '@helium/address'
import { PublicKey } from '@solana/web3.js'

const AccountDetailsInfoBox = () => {
  const { address } = useParams()
  const { maker, isLoading } = useMaker(address)
  const solanaAddress = new PublicKey(
    Address.fromB58(address).publicKey,
  ).toBase58()

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
        maker ? (
          <span className="flex items-center justify-start">
            <AccountIcon address={address} size={28} className="mr-2 mt-0.5" />
            <CopyableText textToCopy={address} tooltip="Copy address">
              <AccountAddress address={address} truncate={5} />
            </CopyableText>
          </span>
        ) : (
          <>
            <span className="flex items-center justify-start">
              <AccountIcon
                address={address}
                size={28}
                className="mr-2 mt-0.5"
              />
              <CopyableText textToCopy={address} tooltip="Copy address">
                <AccountAddress address={address} truncate={5} />
              </CopyableText>
            </span>
            <a
              className="mt-2 ml-9 flex items-center justify-start text-sm font-normal leading-none text-white hover:text-gray-100"
              href={`https://explorer.solana.com/address/${solanaAddress}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              <AccountAddressSolana address={address} truncate={11} />
              <SolanaIcon className="ml-2 h-auto w-3 text-green-500" />
            </a>
          </>
        )
      }
      metaTitle={`Account ${address}`}
      subtitles={subtitles}
      breadcrumbs={
        maker
          ? [{ title: 'Makers', path: '/iot/makers' }]
          : [{ title: 'Overview', path: '/' }]
      }
    >
      <TabNavbar htmlTitleRoot={`Account ${address.slice(0, 4)}...`}>
        <TabPane title="Overview" key="overview">
          {renderOverviewPane()}
        </TabPane>

        <TabPane title="Activity" key="activity" path="activity">
          {isLoading ? (
            <SkeletonActivityList />
          ) : (
            <ActivityPane context="account" address={address} />
          )}
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
