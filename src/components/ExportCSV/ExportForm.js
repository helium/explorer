import React from 'react'
import { DatePicker, Typography, Radio, Checkbox } from 'antd'
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

const ExportForm = ({ onDateChange, onTxnChange, onFeeChange }) => {
  return (
    <div>
      <InputGroup>
        <div style={{ marginBottom: '4px' }}>
          <Text strong>Date Range to Export:</Text>
        </div>
        <div>
          <RangePicker
            ranges={{
              Today: [moment().startOf('day'), moment()],
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
        <Text strong>Transactions to Export:</Text>
        <div>
          <Checkbox.Group
            options={[
              { label: 'Payments', value: 'payment' },
              { label: 'Rewards', value: 'reward' },
            ]}
            defaultValue={['payment', 'reward']}
            onChange={onTxnChange}
          />
        </div>
      </InputGroup>

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
    </div>
  )
}

export default ExportForm
