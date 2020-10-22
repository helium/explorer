import { Component } from 'react'
import { Stage, Layer, Circle, Text, Line, Image } from 'react-konva'
import Konva from 'konva'
import useImage from 'use-image'
import { humanizeAddress } from '../util'
import { colors } from '../theme'
import moment from 'moment'
import { fraction } from '../util'

const HorizontalLine = ({ width, color }) => {
  const start = (376 - width) / 2
  return (
    <Stage width={376} height={5}>
      <Layer>
        <Line
          x={start}
          y={5}
          points={[0, 0, width, 0]}
          stroke={color}
          strokeWidth={1}
        />
      </Layer>
    </Stage>
  )
}

const TargetIcon = ({ status, i }) => {
  let imageUrl
  if (status === 'success') imageUrl = '/static/img/target-success.png'
  else if (status === 'failure') imageUrl = '/static/img/target-failure.png'
  else imageUrl = '/static/img/target-untested.png'

  const [image] = useImage(imageUrl)

  return (
    <Image
      image={image}
      x={1.75}
      y={45 * i + 15}
      height={30.75}
      width={26.25}
    />
  )
}

const TargetConnector = ({ status, i, nextTarget }) => {
  if (nextTarget === undefined) return null

  var color = null
  if (status === 'success') color = colors.green
  else if (status === 'failure') color = colors.red
  else if (status === 'untested') color = colors.gray
  else return null

  return (
    <Line
      x={15}
      y={45 * i + 40}
      points={[0, 0, 0, 30]}
      stroke={color}
      strokeWidth={2}
      dash={[4, 1, 4, 1]}
    />
  )
}

const Diagram = ({ path }) => {
  return (
    <Stage width={30} height={path.targets.length * 45}>
      <Layer>
        <Line
          x={15}
          y={5}
          points={[0, 0, 0, 15]}
          lineCap={'round'}
          stroke={colors.purple}
          strokeWidth={3}
          dash={[0.001, 6, 0.001, 6]}
        />
        {path.targets.map((target, i, targets) => (
          <React.Fragment key={`diagram-${target.address}`}>
            <TargetIcon status={target.status} i={i} />
            <TargetConnector
              status={target.status}
              i={i}
              nextTarget={targets[i + 1]}
            />
          </React.Fragment>
        ))}
      </Layer>
    </Stage>
  )
}

const shortenHash = (hash) => {
  if (hash.length < 40) {
    return hash
  } else {
    const shortenedHash =
      hash.substring(0, 20) +
      '...' +
      hash.substring(hash.length - 20, hash.length)
    return shortenedHash
  }
}

const time = (path) => {
  return moment(path.targets[0].time).format('h:mm A M/D/YYYY')
}

const transaction = (witness) => {
  if (witness.after) {
    return (
      <div>
        <div className="transaction">
          {humanizeAddress(witness.before)} &rarr;{' '}
          {humanizeAddress(witness.after)}
        </div>
        <HorizontalLine width={346} color={colors.gray} />
        <style jsx>{`
          .transaction {
            margin: 0px 15px 7px 15px;
          }
        `}</style>
      </div>
    )
  } else {
    return (
      <div>
        <div className="transaction">{humanizeAddress(witness.before)}</div>
        <HorizontalLine width={346} color={colors.gray} />
        <style jsx>{`
          .transaction {
            margin: 0px 15px 7px 15px;
          }
        `}</style>
      </div>
    )
  }
}

export default ({ path, witnesses }) => {
  return (
    <div className="pathDetails">
      <div className="diagram">
        <Diagram path={path} />
        <div className="diagram-names">
          {path.targets.map((target, i) => (
            <React.Fragment key={`diagram-target-${target.address}`}>
              <span className={`name target ${target.status} mono`}>
                {humanizeAddress(target.address)}
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="text">
        <div id="details">
          <HorizontalLine width={376} color={colors.lightGray} />
          <div className="details-header">Challenge Details</div>
          <div className="challenge-details mono">
            <img className="icon" src="/static/img/hash.svg" />{' '}
            {shortenHash(path.hash)}
          </div>
          <div className="challenge-details mono">
            <img className="icon" src="/static/img/checkmark.svg" />{' '}
            {fraction(path).complete}/{fraction(path).total} Verified
          </div>
          <div className="challenge-details mono">
            <img className="icon" src="/static/img/time.svg" /> {time(path)}
          </div>

          <div className="challenge-details mono">
            <img className="icon" src="/static/img/block-2d.svg" /> Block{' '}
            {path.block}
          </div>
        </div>

        <div id="details">
          <HorizontalLine width={376} color={colors.lightGray} />
          <div className="details-header">Local Challenge Witnesses</div>
          {witnesses(path).map((witness, i) => (
            <React.Fragment key={`witness-${witness.address}-${i}`}>
              <div className="witness mono">
                {humanizeAddress(witness.address)}
              </div>
              <div className="witness-details mono">{transaction(witness)}</div>
            </React.Fragment>
          ))}
        </div>
      </div>

      <style jsx>{`
        .pathDetails {
          justify-content: space-between;
          padding: 0px 12px;
          height: 45vh;
          overflow: scroll;
        }

        .diagram {
          display: flex;
        }

        .diagram-names {
          padding-top: 9px;
          margin-left: 10px;
        }

        .name {
          display: block;
          line-height: 45px;
          font-size: 13px;
          font-weight: 500;
        }

        .success {
          color: ${colors.green};
        }

        .failure {
          color: ${colors.red};
        }

        .untested {
          color: ${colors.lightGray};
        }

        .text {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-content: flex-start;
          flex-wrap: wrap;
          padding-right: 8px;
        }

        #details {
          display: block;
          margin-bottom: 5px;
        }

        .details-header {
          color: white;
          text-transform: uppercase;
          font-size: 12px;
          margin: 20px 15px 8px 15px;
        }

        .challenge-details {
          color: #a0b0c2;
          font-size: 11px;
          margin: 10px 15px 8px 15px;
        }

        .icon {
          position: relative;
          top: 1px;
        }

        .witness {
          color: ${colors.yellow};
          font-size: 13px;
          margin: 0px 15px 4px 15px;
          line-height: 20px;
        }

        .witness-details {
          color: #a0b0c2;
          font-size: 9px;
          margin-bottom: 8px;
          text-transform: uppercase;
        }
      `}</style>
    </div>
  )
}
