import React from 'react'
import { Descriptions } from 'antd'
import Link from 'next/link'
import animalHash from 'angry-purple-tiger'
import AccountIcon from '../../../components/AccountIcon'

const PocRequestV1 = ({ txn }) => {
  return (
    <div>
      <Descriptions bordered>
        <Descriptions.Item label="Hotspot" span={3}>
          <Link href={'/hotspots/' + txn.challenger}>
            <a>{animalHash(txn.challenger)}</a>
          </Link>
        </Descriptions.Item>
        <Descriptions.Item label="Owner" span={3}>
          <div style={{ display: 'flex' }}>
            <AccountIcon
              address={txn.challengerOwner}
              style={{ marginRight: 4, width: 24, height: 24 }}
            />
            <Link href={'/accounts/' + txn.challengerOwner}>
              <a>{txn.challengerOwner}</a>
            </Link>
          </div>
        </Descriptions.Item>
        <Descriptions.Item label="Block Height" span={3}>
          <Link href={'/blocks/' + txn.height}>
            <a>{txn.height}</a>
          </Link>
        </Descriptions.Item>
        {Object.entries(txn).map(([key, value]) => {
          return (
            <Descriptions.Item label={key} key={key} span={3}>
              {value}
            </Descriptions.Item>
          )
        })}
      </Descriptions>
    </div>
  )
}

export default PocRequestV1
