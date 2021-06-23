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

const ValidatorDetailsInfoBox = () => {
  const { address } = useParams()
  const { validator, isLoading } = useValidator(address)

  const generateSubtitles = useCallback(() => {
    if (isLoading)
      return [
        {
          iconPath: '/images/location-blue.svg',
          loading: true,
        },
        {
          iconPath: '/images/account-green.svg',
          loading: true,
        },
      ]
    return [
      {
        iconPath: '/images/location-blue.svg',
        // path: `/cities/${hotspot.geocode.cityId}`,
        title: <ValidatorFlagLocation geo={validator.geo} />,
      },
      {
        iconPath: '/images/account-green.svg',
        title: <AccountAddress address={validator.owner} truncate={5} />,
        path: `/accounts/${validator.owner}`,
      },
    ]
  }, [isLoading, validator.geo, validator.owner])

  return (
    <InfoBox
      title={animalHash(address)}
      metaTitle={`Validator ${animalHash(address)}`}
      subtitles={generateSubtitles()}
    >
      <TabNavbar>
        <TabPane title="Overview" key="overview">
          <OverviewPane />
        </TabPane>
        <TabPane title="Penalties" key="penalties" path="penalties">
          <PenaltiesPane />
        </TabPane>
      </TabNavbar>
    </InfoBox>
  )
}

export default ValidatorDetailsInfoBox
