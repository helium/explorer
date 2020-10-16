import Sidebar, { SidebarHeader, SidebarScrollable } from './Sidebar'
import { humanizeAddress } from '../util'
import range from 'lodash/range'
import round from 'lodash/round'
import { colors } from '../theme'
import orderBy from 'lodash/orderBy'
import classNames from 'classnames'

const titleByStage = {
  0: 'Hotspots Selected',
  1: 'Key Shards Received',
  2: 'Consensus Members',
}

export default ({ hotspots, total, stage }) => (
  <Sidebar>
    <SidebarHeader>
      <div className="header-text">
        <div className="header-left">
          <span
            className={classNames('numerator mono', {
              keys: stage === 1,
              mining: stage === 2,
            })}
          >
            {hotspots.length < total
              ? hotspots.length
              : hotspots.filter((h) => h.hasKey).length}
          </span>
          <span className="denominator mono">/{total}</span>
        </div>
        <div className="header-right">
          <span className="title mono">{titleByStage[stage]}</span>
        </div>
      </div>
    </SidebarHeader>
    <SidebarScrollable>
      <div className="content">
        <table>
          <thead>
            <tr>
              <th>Hotspots in Group</th>
            </tr>
          </thead>
          <tbody>
            {orderBy(hotspots, ['score'], ['desc']).map((hotspot) => (
              <tr key={`hotspot-sidebar-${hotspot.address}`}>
                <td
                  className={classNames('hotspot', {
                    hasKey: hotspot.hasKey,
                    mining: stage === 2,
                  })}
                >
                  {humanizeAddress(hotspot.address)}
                </td>
              </tr>
            ))}
            {range(total - hotspots.length).map((i) => (
              <tr key={`hotspot-sidebar-placeholder-${i}`}>
                <td className="finding">Finding...</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {true}
    </SidebarScrollable>

    <style jsx>{`
      .header-text {
        display: flex;
      }

      .header-right {
        align-self: center;
        text-align: center;
        width: 100%;
      }

      .numerator {
        color: ${colors.green};
        font-size: 60px;
      }

      .numerator.keys {
        color: ${colors.blue};
      }

      .numerator.mining {
        color: ${colors.purple};
      }

      .denominator {
        font-size: 19px;
        color: ${colors.lightGray};
      }

      .title {
        font-size: 20px;
        color: ${colors.lightGray};
      }

      .content {
        padding: 10px;
      }

      table {
        width: 100%;
        padding: 10px;
      }

      th {
        text-transform: uppercase;
        color: white;
        text-align: left;
        padding: 6px 0;
        font-size: 12px;
        letter-spacing: 0;
      }

      th.right,
      td.right {
        text-align: right;
      }

      td {
        padding: 4px 0;
      }

      .hotspot {
        color: ${colors.green};
      }

      .hotspot.hasKey {
        color: ${colors.blue};
      }

      .hotspot.mining {
        color: ${colors.purple};
      }

      .finding {
        color: #8496aa;
      }

      .score {
        color: #a0b0c2;
        font-size: 13px;
      }
    `}</style>
  </Sidebar>
)
