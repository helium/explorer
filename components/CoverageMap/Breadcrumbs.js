import classNames from 'classnames'
import { colors } from '../theme'

export default ({ stage = 0 }) => (
  <div className="breadcrumbs mono">
    <span className={classNames('green', { active: stage >= 0 })}>
      Selecting Hotspots
    </span>

    <span className="dash">&mdash;</span>

    <span className={classNames('blue', { active: stage >= 1 })}>
      Sharding Key
    </span>

    <span className="dash">&mdash;</span>

    <span className={classNames('purple', { active: stage >= 2 })}>
      Mine Blocks
    </span>

    <span className="dash">&mdash;</span>

    <span className={classNames({ active: stage >= 3 })}>Reward Hotspots</span>

    <style jsx>{`
      .breadcrumbs {
        position: fixed;
        bottom: 40px;
        left: 47vw;
        font-size: 13px;
        color: white;
      }

      span {
        opacity: 0.5;
      }

      .dash {
        color: white;
        opacity: 0.5;
        margin: 0 10px;
        font-size: 18px;
      }

      .active {
        opacity: 1;
      }

      .green.active {
        color: ${colors.green};
      }

      .blue.active {
        color: ${colors.blue};
      }

      .purple.active {
        color: ${colors.purple};
      }
    `}</style>
  </div>
)
