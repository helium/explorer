import React from 'react'
import { Progress } from 'antd'

const ExportProgress = ({ percent }) => {
  return (
    <div style={{ textAlign: 'center' }}>
      <Progress type="circle" percent={percent} />
    </div>
  )
}

export default ExportProgress
