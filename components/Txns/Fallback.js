import React, { useState } from 'react'
import { Descriptions, Button } from 'antd'
import animalHash from 'angry-purple-tiger'

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

const TruncatedField = ({ key, value }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <p
        className={key}
        id={key}
        style={
          open
            ? {}
            : {
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '60ch',
              }
        }
      >
        {value}
      </p>
      <Button size="small" onClick={() => setOpen(!open)}>
        {open ? 'Show less' : 'Show more'}
      </Button>
    </>
  )
}

export default Fallback
