import Widget from './Widget'
import { useValidator } from '../../data/validators'
import ValidatorFlagLocation from '../Validators/ValidatorFlagLocation'
import animalHash from 'angry-purple-tiger'
import ValidatorStatusDot from '../Validators/ValidatorStatusDot'

const ValidatorWidget = ({ title, address }) => {
  const { validator } = useValidator(address)

  if (!validator) return <Widget span={2} isLoading />

  return (
    <Widget
      title={title}
      value={
        <div className="flex items-center space-x-1">
          <ValidatorStatusDot status={validator.status} />
          <span>{animalHash(validator.address)}</span>
        </div>
      }
      subtitle={
        <span className="flex items-center space-x-2">
          <ValidatorFlagLocation geo={validator.geo} />
          <span className="text-gray-400">|</span>
          <span>#{validator.number}</span>
        </span>
      }
      span={2}
      linkTo={`/validators/${address}`}
    />
  )
}

export default ValidatorWidget
