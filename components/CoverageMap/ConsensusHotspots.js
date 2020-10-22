import React, { Component } from 'react'
import Konva from 'konva'
import {
  Stage,
  Layer,
  Circle,
  Arc,
  Line,
  FastLayer,
  Image,
  Group,
  Rect,
} from 'react-konva'
import { withSize } from 'react-sizeme'
import range from 'lodash/range'
import { Spring, animated } from 'react-spring/dist/konva'
import useImage from 'use-image'
import moment from 'moment'

const Hotspot = ({
  i,
  radius,
  hotspotRadius,
  present,
  hasKey,
  blocks = [],
  total,
  stage,
}) => (
  <FastLayer rotation={(360 / total) * i} x={radius} y={radius}>
    <Line points={[0, 0, 0, -radius + 10]} stroke="#1D232A" strokeWidth={2} />
    {stage < 2 && (
      <Spring
        native
        from={{ y: -radius / 4, opacity: 0 }}
        to={{
          y: present ? -radius + hotspotRadius : -radius / 4,
          opacity: present ? 1 : 0,
        }}
      >
        {(props) => (
          <animated.Circle
            {...props}
            x={0}
            radius={hotspotRadius}
            fill="#36D293"
          />
        )}
      </Spring>
    )}
    {blocks.map(
      ({ time }) =>
        time >= moment().unix() - 2 && (
          <Spring
            native
            to={{ y: -radius / 4, opacity: 1 }}
            from={{
              y: -radius + hotspotRadius,
              opacity: 1,
            }}
          >
            {(props) => (
              <animated.Rect
                {...props}
                x={0}
                width={hotspotRadius * 0.9}
                height={hotspotRadius * 0.9}
                rotation={45}
                fill="#AF61F3"
              />
            )}
          </Spring>
        ),
    )}
    <Spring
      native
      from={{ y: -radius / 4, opacity: 0 }}
      to={{
        y: hasKey ? -radius + hotspotRadius : -radius / 4,
        opacity: hasKey ? 1 : 0,
      }}
    >
      {(props) => (
        <animated.Circle
          {...props}
          x={0}
          radius={hotspotRadius}
          fill={stage === 1 ? '#38A2FF' : '#AF61F3'}
        />
      )}
    </Spring>
  </FastLayer>
)

const Progress = ({ radius, stage, hotspots, total }) => {
  const colorByStage = {
    0: '#29D391',
    1: '#38A2FF',
    2: '#AF61F3',
  }

  const angleByStage = {
    0: () => 360 * (hotspots.length / total),
    1: () => 360 * (hotspots.filter((h) => h.hasKey).length / total),
    2: () => 360,
  }

  return (
    <Spring
      native
      to={{
        angle: angleByStage[stage](),
      }}
    >
      {(props) => (
        <animated.Arc
          {...props}
          x={radius}
          y={radius}
          innerRadius={radius / 4 - 12}
          outerRadius={radius / 4 - 12}
          strokeWidth={2}
          stroke={colorByStage[stage]}
          rotation={-90}
        />
      )}
    </Spring>
  )
}

const KonvaImage = ({ src, x, y, width, height }) => {
  const [image] = useImage(src)

  return <Image image={image} x={x} y={y} width={width} height={height} />
}

class ConsensusHotspots extends Component {
  state = {
    hotspots: this.props.hotspots,
  }

  static getDerivedStateFromProps(props, state) {
    return {
      hotspots: props.hotspots,
    }
  }

  render() {
    const { width, height } = this.props.size
    // const width = 400
    // const height = 400
    const radius = Math.floor(Math.min(width, height) / 2)
    const hotspotRadius = radius / 28
    const { hotspots } = this.state
    const { total, stage } = this.props

    return (
      <div className="consensusHotspots">
        <Stage width={radius * 2} height={radius * 2}>
          <FastLayer>
            <Circle
              x={radius}
              y={radius}
              radius={radius - hotspotRadius}
              fill="#2F3943"
            />
          </FastLayer>

          {range(total).map((i) => (
            <Hotspot
              key={`hotspot-${i}`}
              i={i}
              radius={radius}
              hotspotRadius={hotspotRadius}
              present={!!hotspots[i]}
              hasKey={hotspots[i] && hotspots[i].hasKey}
              blocks={hotspots[i] && hotspots[i].blocks}
              total={total}
              stage={stage}
            />
          ))}

          <FastLayer>
            <Circle x={radius} y={radius} radius={radius / 4} fill="#1D232A" />
            <Circle
              x={radius}
              y={radius}
              radius={radius / 4 - 12}
              stroke="#29D391"
              strokeWidth={2}
              opacity={0.22}
            />
            <Progress
              radius={radius}
              stage={stage}
              hotspots={hotspots}
              total={total}
            />
            {stage === 0 && (
              <KonvaImage
                src="/static/img/searching.svg"
                x={radius - radius / 8}
                y={radius - radius / 8}
                width={radius / 4}
                height={radius / 4}
              />
            )}
            {stage === 1 && (
              <KonvaImage
                src="/static/img/keys.svg"
                x={radius - radius / 8}
                y={radius - radius / 8}
                width={radius / 4}
                height={radius / 4}
              />
            )}
            {stage === 2 && (
              <KonvaImage
                src="/static/img/mining.svg"
                x={radius - radius / 8}
                y={radius - radius / 8}
                width={radius / 4}
                height={radius / 4}
              />
            )}
          </FastLayer>
        </Stage>

        <style jsx>{`
          .consensusHotspots {
          }

          .consensusHotspots :global(.konvajs-content) {
            margin: auto;
          }
        `}</style>
      </div>
    )
  }
}

export default withSize({ monitorWidth: true, monitorHeight: true })(
  ConsensusHotspots,
)
// export default ConsensusHotspots
