import React, { useState } from 'react'
import { Row, Typography, Button, Modal, Space } from 'antd'
import { QrcodeOutlined } from '@ant-design/icons'
import QRCode from 'react-qr-code'
const { Text } = Typography

const AddressModal = ({ address }) => {
  const [open, setOpen] = useState(false)
  const toggleOpen = () => setOpen(!open)

  return (
    <>
      <Button
        onClick={toggleOpen}
        shape="circle"
        icon={<QrcodeOutlined />}
      />
      <Modal
        title="Account Address"
        visible={open}
        onCancel={toggleOpen}
        footer={null}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Row justify="center">
            <QRCode value={address} size={200} />
          </Row>
          <Row justify="center">
            <Text code copyable>
              {address}
            </Text>
          </Row>
        </Space>
      </Modal>
    </>
  )
}

export default AddressModal
