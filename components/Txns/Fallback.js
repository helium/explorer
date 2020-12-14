import React from 'react'
import { Descriptions } from 'antd'
import animalHash from 'angry-purple-tiger'
import TruncatedField from './TruncatedField'

const TRUNCATABLE_FIELDS = ['proof']

const Fallback = ({ txn }) => (
  <Descriptions bordered>
    {Object.entries(txn).map(([key, value]) => {
      if (key === 'members') {
        return (
          <Descriptions.Item label={key} key={key} span={3}>
            <ul className={key}>
              {value.map((member, index) => {
                return (
                  <li key={`${key}-${index}`}>
                    <a href={`/hotspots/${member}`}>{animalHash(member)}</a>
                  </li>
                )
              })}
            </ul>
          </Descriptions.Item>
        )
      }

      if (typeof value === 'object') {
        return (
          <Descriptions.Item label={key} key={key} span={3}>
            <p className={key} id={key}>
              {JSON.stringify(value)}
            </p>
          </Descriptions.Item>
        )
      }

      if (TRUNCATABLE_FIELDS.includes(key)) {
        return (
          <Descriptions.Item label={key} key={key} span={3}>
            <TruncatedField key={key} value={value} />
          </Descriptions.Item>
        )
      }

      return (
        <Descriptions.Item label={key} key={key} span={3}>
          {value}
        </Descriptions.Item>
      )
    })}
  </Descriptions>
)

export default Fallback
