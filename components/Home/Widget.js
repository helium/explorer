import React from 'react'
import Link from 'next/link'
import { Tooltip, Typography, Row } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import ChangeBubble from './ChangeBubble'

const { Title, Text } = Typography

const Widget = ({
  title,
  value,
  footer,
  href,
  change,
  changeSuffix,
  changePrecision,
  changeUpIsBad,
  changeIsAmbivalent,
  tooltip,
}) => (
  <div
    style={{
      background: '#fff',
      borderRadius: 6,
      width: '100%',
      // cursor: 'pointer',
      boxShadow:
        '0px 2px 2px rgba(0, 0, 0, 0.06), 0px 1px 3px rgba(0, 0, 0, 0.1)',
    }}
  >
    <div style={{ padding: 20 }}>
      <Row justify="space-between">
        <Title
          level={5}
          style={{ color: '#717E98', fontWeight: 500, fontSize: 14 }}
        >
          {title}
        </Title>
        {tooltip && (
          <div>
            <Tooltip title={tooltip}>
              <InfoCircleOutlined />
            </Tooltip>
          </div>
        )}
      </Row>
      <Row align="middle">
        <Text style={{ color: '#171E2D', fontSize: 32, fontWeight: 500 }}>
          {value}
        </Text>
        {change !== undefined && (
          <div style={{ marginTop: 5 }}>
            <ChangeBubble
              value={change}
              suffix={changeSuffix}
              precision={changePrecision}
              upIsBad={changeUpIsBad}
              isAmbivalent={changeIsAmbivalent}
            />
          </div>
        )}
      </Row>
    </div>
    {href && footer && (
      <Link href={href}>
        <a>
          <div
            style={{
              background: '#F9FAFB',
              padding: '10px 20px',
              borderRadius: 6,
            }}
          >
            <Text style={{ color: '#6978ED' }}>{footer}</Text>
          </div>
        </a>
      </Link>
    )}
  </div>
)

export default Widget
