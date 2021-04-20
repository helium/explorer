import useSWR from 'swr'
import InfoBox from './InfoBox'
import TabNavbar, { TabPane } from '../Nav/TabNavbar'
import Widget from '../Widgets/Widget'
import { useMemo } from 'react'
import { sumBy } from 'lodash'
import animalHash from 'angry-purple-tiger'
import { formatLargeNumber, formatPercent } from '../../utils/format'
import VersionsWidget from '../Widgets/VersionsWidget'

const TICKER = 'TNT'

const ValidatorsInfoBox = () => {
  const { data: validators = [] } = useSWR('/api/validators')
  const isLoading = useMemo(() => validators.length === 0, [validators])

  const activeValidators = useMemo(
    () => validators.filter((v) => v?.status?.online === 'online').length,
    [validators],
  )

  const totalStaked = useMemo(() => sumBy(validators, 'stake') / 100000000, [
    validators,
  ])

  const consensusGroup = useMemo(() => validators.filter((v) => v.elected), [
    validators,
  ])

  return (
    <InfoBox title="Validators">
      <TabNavbar basePath="validators">
        <TabPane title="Statistics" key="1">
          <div className="grid grid-flow-row grid-cols-2 gap-3 md:gap-4 p-4 md:p-8 overflow-y-scroll">
            <Widget
              title="Total Validators"
              value={validators.length.toLocaleString()}
              isLoading={isLoading}
            />
            <Widget
              title="Consensus Group Size"
              value={validators
                .filter((v) => v.elected)
                .length.toLocaleString()}
              isLoading={isLoading}
            />
            <Widget
              title="% Online"
              value={formatPercent(activeValidators / validators.length)}
              isLoading={isLoading}
            />
            <Widget
              title={`Total Staked (${TICKER})`}
              value={formatLargeNumber(totalStaked)}
              isLoading={isLoading}
            />
            <VersionsWidget validators={validators} />
            <div className="col-span-2 pb-1" />
          </div>
        </TabPane>
        <TabPane title="Consensus Group" key="2" path="consensus">
          <div className="grid grid-flow-row grid-cols-2 gap-3 md:gap-4 p-4 md:p-8 overflow-y-scroll">
            <ValidatorList validators={consensusGroup} />
            <div className="col-span-2 pb-1" />
          </div>
        </TabPane>
        <TabPane title="All Validators" key="3" path="all">
          <div className="grid grid-flow-row grid-cols-2 gap-3 md:gap-4 p-4 md:p-8 overflow-y-scroll">
            <ValidatorList validators={validators} />
            <div className="col-span-2 pb-1" />
          </div>
        </TabPane>
      </TabNavbar>
    </InfoBox>
  )
}

const ValidatorList = ({ validators }) => {
  return (
    <div>
      {validators.map((v) => (
        <div>{animalHash(v.address)}</div>
      ))}
    </div>
  )
}

export default ValidatorsInfoBox
