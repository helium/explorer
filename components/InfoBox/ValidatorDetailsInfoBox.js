import { useParams } from 'react-router'
import animalHash from 'angry-purple-tiger'
import InfoBox from './InfoBox'
import TabNavbar, { TabPane } from '../Nav/TabNavbar'
import OverviewPane from './ValidatorDetails/OverviewPane'
import PenaltiesPane from './ValidatorDetails/PenaltiesPane'
import AccountAddress from '../AccountAddress'
import { useValidator } from '../../data/validators'
import { useCallback } from 'react'
import ValidatorFlagLocation from '../Validators/ValidatorFlagLocation'
import SkeletonList from '../Lists/SkeletonList'
import AccountIcon from '../AccountIcon'

const ValidatorDetailsInfoBox = () => {
  const { address } = useParams()
  const { validator, isLoading } = useValidator(address)

  const generateSubtitles = useCallback(() => {
    if (isLoading)
      return [
        // [
        //   {
        //     iconPath: '/images/location-blue.svg',
        //     loading: true,
        //   },
        // ],
        [
          [
            {
              iconPath: '/images/address-symbol.svg',
              loading: true,
              skeletonClasses: 'w-20',
            },
            {
              iconPath: '/images/account-green.svg',
              loading: true,
              skeletonClasses: 'w-20',
            },
          ],
        ],
      ]
    return [
      // [
      //   {
      //     iconPath: '/images/location-blue.svg',
      //     // path: `/cities/${hotspot.geocode.cityId}`,
      //     title: <ValidatorFlagLocation geo={validator.geo} />,
      //   },
      // ],
      [
        {
          iconPath: '/images/address-symbol.svg',
          title: <AccountAddress address={validator.address} truncate={7} />,
          textToCopy: address,
        },
        {
          iconPath: '/images/account-green.svg',
          title: (
            <span className="flex items-center justify-start">
              <AccountAddress address={validator.owner} truncate={7} />
              <AccountIcon
                address={validator.owner}
                className="h-2.5 md:h-3.5 w-auto ml-0.5"
              />
            </span>
          ),
          path: `/accounts/${validator.owner}`,
        },
      ],
    ]
  }, [address, isLoading, validator])

  return (
    <InfoBox
      title={animalHash(address)}
      metaTitle={`Validator ${animalHash(address)}`}
      subtitles={generateSubtitles()}
      breadcrumbs={[{ title: 'Validators', path: '/validators/all' }]}
    >
      <TabNavbar>
        <TabPane title="Overview" key="overview">
          <OverviewPane />
        </TabPane>
        <TabPane title="Penalties" key="penalties" path="penalties">
          {isLoading ? <SkeletonList /> : <PenaltiesPane />}
        </TabPane>
      </TabNavbar>
    </InfoBox>
  )
}

export default ValidatorDetailsInfoBox
