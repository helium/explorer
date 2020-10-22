import { Stage, Layer, Circle, Rect, Line } from 'react-konva'
import Konva from 'konva'
import { colors } from '../theme'

const diagram = (active, showDetails, total, complete) => {
  if (complete === 0) {
    var width = 289
    if (total > 9) width = 282
    return (
      <div className="diagram">
        <img className="icon" src="/static/img/fail-icon.png" />
        <div className="num mono">{total}</div>
        <Stage width={width + 20} height={12}>
          <Layer>
            <Line
              x={10}
              y={7}
              points={[0, 0, width, 0]}
              lineCap={'round'}
              stroke={colors.lightGray}
              strokeWidth={7.5}
            />
          </Layer>
        </Stage>
        <style jsx>{`
          .diagram {
            display: flex;
          }

          .icon {
            height: 14px;
            margin: 0px 5px;
          }

          .num {
            color: ${colors.lightGray};
            font-size: 12px;
            font-weight: bold;
            padding-top: 1px;
          }
        `}</style>
      </div>
    )
  } else if (total === complete) {
    var width = 289
    if (total > 9) width = 282
    return (
      <div className="diagram">
        <Stage width={width + 20} height={12}>
          <Layer>
            <Line
              x={10}
              y={7}
              points={[0, 0, width, 0]}
              lineCap={'round'}
              stroke={colors.green}
              strokeWidth={7.5}
            />
          </Layer>
        </Stage>
        <div className="num mono">{total}</div>
        <img className="icon" src="/static/img/success-icon.png" />

        <style jsx>{`
          .diagram {
            display: flex;
          }

          .icon {
            height: 14px;
            margin: 0px 5px;
          }

          .num {
            color: ${colors.green};
            font-size: 12px;
            font-weight: bold;
            padding-top: 1px;
          }
        `}</style>
      </div>
    )
  } else {
    var left = (complete / total) * 262

    return (
      <div className="diagram">
        <Stage width={left + 20} height={12}>
          <Layer>
            <Line
              x={10}
              y={7}
              points={[0, 0, left, 0]}
              lineCap={'round'}
              stroke={colors.green}
              strokeWidth={7.5}
            />
          </Layer>
        </Stage>

        <div className="num left mono">{complete}</div>
        <img className="icon" src="/static/img/fail-icon.png" />
        <div className="num right mono">{total - complete}</div>

        <Stage width={282 - left} height={12}>
          <Layer>
            <Line
              x={10}
              y={7}
              points={[0, 0, 262 - left, 0]}
              lineCap={'round'}
              stroke={colors.lightNavy}
              strokeWidth={7.5}
            />
          </Layer>
        </Stage>

        <style jsx>{`
          .diagram {
            display: flex;
          }

          .icon {
            height: 14px;
            margin: 0px 5px;
          }

          .num {
            font-size: 12px;
            font-weight: bold;
            padding-top: 1px;
          }

          .left {
            color: ${colors.green};
          }

          .right {
            color: ${colors.lightNavy};
          }
        `}</style>
      </div>
    )
  }
}

export default ({ active, showDetails, total, complete }) => {
  if (!showDetails) {
    return (
      <div className="overview">
        <img className="wave-hex" src="/static/img/wave-hex.png" />
        {diagram(active, showDetails, total, complete)}

        <style jsx>{`
          .wave-hex {
            height: 14px;
          }

          .overview {
            display: flex;
          }
        `}</style>
      </div>
    )
  } else {
    return null
  }
}
