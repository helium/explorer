import React from 'react'
import { Progress } from 'antd'

const ExportProgress = ({ percent }) => {
  return <Progress type="circle" percent={percent} />
}

export default ExportProgress
