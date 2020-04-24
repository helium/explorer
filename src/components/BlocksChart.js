import React, { Component } from 'react'
import { Table, Typography, Tooltip } from 'antd'
import Timestamp from 'react-timestamp'
import Client from '@helium/http'
import LoadMoreButton from './LoadMoreButton'
import classNames from 'classnames'

const { Text } = Typography


class BlocksList extends Component {
  state = {
    blocks: [],
    loading: true,
  }

  async componentDidMount() {
    const client = new Client()
    this.list = await client.blocks.list()
    this.loadBlocks()
  }

  loadBlocks = async () => {
    this.setState({ loading: true })
    const { blocks } = this.state
    const newBlocks = await this.list.take(20)
    this.setState({ blocks: [...blocks, ...newBlocks], loading: false })
  }

 

  render() {

     

    const { blocks, loading } = this.state

    const columns = [

      {
        dataIndex: 'transactionCount',
        key: 'transaction_count',
        render: (transactionCount , height) => (
          <Tooltip placement="bottom" title={transactionCount}><div style={{width: transactionCount, height: 38, backgroundColor: '#3F416D', float: 'right'}}/></Tooltip>
        ),
      },
     
    ]



    return (
      <>

        

         <Table

         showHeader="false"
         className="barchart"
          dataSource={blocks}
          columns={columns}
          rowKey="hash"
          pagination={false}
          loading={loading}
          scroll={{ x: true }}
        />

      </>
    )
  }
}

export default BlocksList
