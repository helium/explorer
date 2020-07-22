import React from 'react'
import { DatePicker, Typography, Radio, Input } from 'antd'
import moment from 'moment'
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

const ExportForm = ({ onDateChange, onFeeChange }) => {
  return (
    <div>
      <InputGroup>
        <div style={{ marginBottom: '4px' }}>
          <Text strong>Date Range to Export</Text>
        </div>
        <div>
          <RangePicker
            ranges={{
              Today: [moment(), moment()],
              'This Month': [moment().startOf('month'), moment()],
              'Last Month': [
                moment().subtract(1, 'months').startOf('month'),
                moment().subtract(1, 'months').endOf('month'),
              ],
              'This Year': [moment().startOf('year'), moment()],
              'Last Year': [
                moment().subtract(1, 'years').startOf('year'),
                moment().subtract(1, 'years').endOf('year'),
              ],
            }}
            onChange={onDateChange}
          />
        </div>
      </InputGroup>

      <InputGroup>
        <Text strong>Display Fees in:</Text>
        <div>
          <Radio.Group onChange={onFeeChange} value={1}>
            <Radio style={radioStyle} value={1}>
              Data Credits (DC)
            </Radio>
            <Radio style={radioStyle} value={2}>
              HNT (experimental)
            </Radio>
          </Radio.Group>
        </div>
      </InputGroup>

      <InputGroup>
        <Text strong>Display Hotspots</Text>
        <div>
          <Radio.Group onChange={onFeeChange} value={1}>
            <Radio style={radioStyle} value={1}>
              Single Entry per Epoch
            </Radio>
            <Radio style={radioStyle} value={2}>
              Separate Entries per Hotspot
            </Radio>
          </Radio.Group>
        </div>
      </InputGroup>

      <InputGroup>
        <Text strong>Group Reward Transactions:</Text>
        <div>
          <Radio.Group onChange={onFeeChange} value={1}>
            <Radio style={radioStyle} value={1}>
              By Epoch
            </Radio>
            <Radio style={radioStyle} value={2}>
              By Day
            </Radio>
            <Radio style={radioStyle} value={2}>
              By Week
            </Radio>
            <Radio style={radioStyle} value={2}>
              By Month
            </Radio>
          </Radio.Group>
        </div>
      </InputGroup>
    </div>
  )
}

export default ExportForm
