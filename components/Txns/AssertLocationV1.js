import React from 'react'
import { Descriptions } from 'antd'
import AccountIcon from '../AccountIcon'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import animalHash from 'angry-purple-tiger'

const AssertLocationMapbox = dynamic(() => import('../AssertLocationMapbox'), {
  ssr: false,
  loading: () => <span style={{ height: '600px' }} />,
})

const AssertLocationV1 = ({ txn }) => {
  return (
    <>
      <AssertLocationMapbox txn={txn} />
      <Descriptions bordered>
        <Descriptions.Item label="Hotspot" span={3}>
          <span
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}
          >
            <Link href={`/hotspots/${txn.gateway}`}>
              <a>{animalHash(txn.gateway)}</a>
            </Link>
          </span>
        </Descriptions.Item>
        <Descriptions.Item label="Owner" span={3}>
          <span
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}
          >
            <AccountIcon address={txn.owner} style={{ marginRight: 8 }} />
            <Link href={`/accounts/${txn.owner}`}>
              <a>{txn.owner}</a>
            </Link>
          </span>
        </Descriptions.Item>
        {/* TODO: add existing fields:
        - stakingFee
        - payer
        - nonce
        - location
        - lng 
        - lat 
        - height
        - hash
        - gateway
        - fee
        */}
      </Descriptions>
    </>
  )
}

export default AssertLocationV1
