import React from 'react'
import { Typography, Radio, Checkbox } from 'antd'
import { DatePicker } from '../../components/Antd'
import {
  startOfDay,
  startOfMonth,
  startOfYear,
  endOfMonth,
  endOfYear,
  subMonths,
  subYears,
} from 'date-fns'

const { RangePicker } = DatePicker
const { Text } = Typography

const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
}

const InputGroup = ({ children }) => (
  <div style={{ margin: '0 0 12px 0' }}>{children}</div>
)

const ExportForm = ({ onDateChange, onTxnChange, onFeeChange, type }) => {
  let options

  switch (type) {
    case 'hotspot':
      options = [{ label: 'Rewards', value: 'reward' }]
      break
    default:
    case 'account':
      options = [
        { label: 'Payments', value: 'payment' },
        { label: 'Rewards', value: 'reward' },
        { label: 'Hotspot Transfers', value: 'transfer' },
        { label: 'Add Hotspots', value: 'add' },
        { label: 'Location Asserts', value: 'assert' },
      ]
      break
  }

  const now = new Date()

  return (
    <div>
      <InputGroup>
        <div style={{ marginBottom: '4px' }}>
          <Text strong>Date Range to Export:</Text>
        </div>
        <div>
          <RangePicker
            ranges={{
              Today: [startOfDay(now), now],
              'This Month': [startOfMonth(now), now],
              'Last Month': [
                startOfMonth(subMonths(now, 1)),
                endOfMonth(subMonths(now, 1)),
              ],
              'This Year': [startOfYear(now), now],
              'Last Year': [
                startOfYear(subYears(now, 1)),
                endOfYear(subYears(now, 1)),
              ],
            }}
            onChange={onDateChange}
          />
        </div>
      </InputGroup>

      <InputGroup>
        <Text strong>Transactions to Export:</Text>
        <div>
          <Checkbox.Group
            options={options}
            defaultValue={['payment', 'reward']}
            onChange={onTxnChange}
          />
        </div>
      </InputGroup>

      {type !== 'hotspot' && (
        <InputGroup>
          <Text strong>Display Fees in:</Text>
          <div>
            <Radio.Group onChange={onFeeChange} defaultValue="dc">
              <Radio style={radioStyle} value="dc">
                Data Credits (DC)
              </Radio>
              <Radio style={radioStyle} value="hnt">
                HNT (experimental)
              </Radio>
            </Radio.Group>
          </div>
        </InputGroup>
      )}
    </div>
  )
}

export default ExportForm
