import Widget from './Widget'
import { useValidator } from '../../data/validators'
import animalHash from 'angry-purple-tiger'
import ValidatorStatusDot from '../Validators/ValidatorStatusDot'
import { formatVersion } from '../Validators/utils'

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
        <span className="flex items-center space-x-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 text-txn-heartbeat"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"
            />
          </svg>
          <span>{formatVersion(validator.versionHeartbeat)}</span>
        </span>
      }
      span={2}
      linkTo={`/validators/${address}`}
    />
  )
}

export default ValidatorWidget
