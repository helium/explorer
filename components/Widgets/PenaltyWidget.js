import { Tooltip } from 'antd'
import { capitalize, round, sum } from 'lodash'
import PenaltyDescription from '../Validators/PenaltyDescription'
import Widget from './Widget'

const PenaltyWidget = ({ validator }) => {
  return (
    <Widget
      span={2}
      title="Penalty Score"
      value={round(validator?.penalty, 3)}
      subtitle={<PenaltyGraph validator={validator} />}
      isLoading={!validator}
      linkTo={`/validators/${validator?.address}/penalties`}
      tooltip={<PenaltyDescription />}
    />
  )
}

const PenaltyGraph = ({ validator }) => {
  const penaltyCounts = {}

  if (validator?.penalties) {
    validator.penalties.forEach(({ type, amount }) => {
      if (!penaltyCounts[type]) {
        penaltyCounts[type] = amount
        return
      }

      penaltyCounts[type] += amount
    })
  }

  const totalCount = sum(Object.values(penaltyCounts))

  const makePercent = (type) => {
    return round((penaltyCounts[type] / totalCount) * 100) + '%'
  }

  const penaltyColor = (type) => {
    switch (type) {
      case 'performance':
        return '#474DFF'

      case 'tenure':
        return '#29D391'

      default:
        return '#CCC'
    }
  }

  return (
    <div className="h-6 w-full my-3 rounded-lg flex overflow-hidden">
      {!validator ? (
        <div className="animate-pulse bg-gray-400 w-full" />
      ) : (
        Object.keys(penaltyCounts).map((type, i) => (
          <Tooltip
            title={`${capitalize(type)} (${round(penaltyCounts[type], 3)})`}
          >
            <div
              key={type}
              style={{
                background: penaltyColor(type),
                width: makePercent(type),
                marginRight: 1,
              }}
            />
          </Tooltip>
        ))
      )}
    </div>
  )
}

export default PenaltyWidget
