import React from 'react'
import { DatePicker, Typography, Radio, Input, Checkbox } from 'antd'
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

const ExportForm = ({
  onDateChange,
  onTxnChange,
  onGroupHotspotsChange,
  onGroupTimeChange,
  onFeeChange,
}) => {
  return (
    <div>
      <InputGroup>
        <div style={{ marginBottom: '4px' }}>
          <Text strong>Date Range to Export:</Text>
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
        <Text strong>Display Hotspot Rewards:</Text>
        <div>
          <Radio.Group onChange={onGroupHotspotsChange} defaultValue={true}>
            <Radio style={radioStyle} value={true}>
              Single Entry per Epoch
            </Radio>
            <Radio style={radioStyle} value={false}>
              Separate Entries per Hotspot
            </Radio>
          </Radio.Group>
        </div>
      </InputGroup>

      <InputGroup>
        <Text strong>Group Reward Transactions:</Text>
        <div>
          <Radio.Group onChange={onGroupTimeChange} defaultValue="epoch">
            <Radio style={radioStyle} value="epoch">
              By Epoch
            </Radio>
            <Radio style={radioStyle} value="day">
              By Day
            </Radio>
            <Radio style={radioStyle} value="week">
              By Week
            </Radio>
            <Radio style={radioStyle} value="month">
              By Month
            </Radio>
          </Radio.Group>
        </div>
      </InputGroup>

      <InputGroup>
        <Text strong>Display Fees in:</Text>
        <div>
          <Radio.Group onChange={onFeeChange} value={1}>
            <Radio style={radioStyle} value={1}>
              Data Credits (DC)
            </Radio>
            <Radio style={radioStyle} value={2} disabled>
              HNT (experimental)
            </Radio>
          </Radio.Group>
        </div>
      </InputGroup>
    </div>
  )
}

export default ExportForm
