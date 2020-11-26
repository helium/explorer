import React from 'react'
import { Descriptions } from 'antd'
import Link from 'next/link'
import animalHash from 'angry-purple-tiger'
import ConsensusPlot from './ConsensusPlot'

const ConsensusGroupV1 = ({ txn }) => {
  return (
    <div>
      <span style={{ height: '600px' }}>
        <ConsensusPlot txn={txn} />
      </span>
      <Descriptions bordered>
        <Descriptions.Item label="Block Height" span={3}>
          <Link href={'/blocks/' + txn.height}>
            <a>{txn.height}</a>
          </Link>
        </Descriptions.Item>
        <Descriptions.Item label="Members">
          <ol>
            {txn.members.map((m, index, { length }) => {
              return (
                <li>
                  <Link href={`/hotspots/${m}`}>
                    <a>{animalHash(m)}</a>
                  </Link>
                </li>
              )
            })}
          </ol>
        </Descriptions.Item>
      </Descriptions>
    </div>
  )
}

export default ConsensusGroupV1
