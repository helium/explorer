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
  const roundedValue = round(value, precision)

  let color = '#ACB3BF'
  if (isAmbivalent) {
    color = '#ACB3BF'
  } else if (upIsBad) {
    if (roundedValue > 0) {
      color = '#FF6666'
    }

    if (roundedValue < 0) {
      color = '#29D344'
    }
  } else {
    if (roundedValue > 0) {
      color = '#29D344'
    }

    if (roundedValue < 0) {
      color = '#FF6666'
    }
  }

  let prefix = ''
  if (!isAmbivalent && value >= 0) {
    prefix = '+'
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
        {[prefix, round(value, precision).toLocaleString(), suffix].join('')}
      </Text>
    </span>
  )
}

export default ChangeBubble
