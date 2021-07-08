import { capitalize, round } from 'lodash'
import { useCallback } from 'react'
import { useParams } from 'react-router'
import { useValidator } from '../../../data/validators'
import BaseList from '../../Lists/BaseList'
import PenaltyDescription from '../../Validators/PenaltyDescription'
import InfoBoxPaneContainer from '../Common/InfoBoxPaneContainer'

const PenaltiesPane = () => {
  const { address } = useParams()
  const { validator, isLoading } = useValidator(address)

  const keyExtractor = useCallback(
    (penalty) => [penalty.type, penalty.height].join('-'),
    [],
  )

  const renderTitle = useCallback((penalty) => {
    return (
      <div className="flex items-center space-x-1">
        {capitalize(penalty.type)}
      </div>
    )
  }, [])

  const renderSubtitle = useCallback((penalty) => {
    return <span>Accrued in block {penalty.height}</span>
  }, [])

  const renderDetails = useCallback((penalty) => {
    return <span>{round(penalty.amount, 3)}</span>
  }, [])
  return (
    <InfoBoxPaneContainer span={1} padding={false}>
      <BaseList
        items={validator?.penalties}
        keyExtractor={keyExtractor}
        listHeaderShowCount
        listHeaderTitle="Validator penalties"
        listHeaderDescription={<PenaltyDescription />}
        isLoading={isLoading}
        renderTitle={renderTitle}
        renderSubtitle={renderSubtitle}
        renderDetails={renderDetails}
        blankTitle="No penalties"
      />
    </InfoBoxPaneContainer>
  )
}

export default PenaltiesPane
