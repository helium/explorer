import React from 'react'
import { Typography } from 'antd'
import round from 'lodash/round'
const { Text } = Typography

const ChangeBubble = ({
  value,
  suffix = '',
  precision = 0,
  upIsBad = false,
  isAmbivalent = false,
}) => {
  let color = '#ACB3BF'
  let prefix = ''
  let displayValue = value

  if (typeof value === 'number') {
    displayValue = round(value, precision)

    if (isAmbivalent) {
      color = '#ACB3BF'
    } else if (upIsBad) {
      if (displayValue > 0) {
        color = '#FF6666'
      }

      if (displayValue < 0) {
        color = '#29D344'
      }
    } else {
      if (displayValue > 0) {
        color = '#29D344'
      }

      if (displayValue < 0) {
        color = '#FF6666'
      }
    }

    if (!isAmbivalent && value >= 0) {
      prefix = '+'
    }

    displayValue = displayValue.toLocaleString()
  }

  return (
    <span
      style={{
        backgroundColor: color,
        padding: '3px 7px',
        borderRadius: 6,
        marginLeft: 10,
        minWidth: 100,
      }}
    >
      <Text style={{ color: 'white', fontWeight: 600 }}>
        {[prefix, displayValue, suffix].join('')}
      </Text>
    </span>
  )
}

export default ChangeBubble
