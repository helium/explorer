import React from 'react';
import { Layout, Row, Col, Card, List } from 'antd';
import SearchBar from '../components/SearchBar'
import BlocksList from '../components/BlocksList'
const { Header, Content, Footer } = Layout;

class Index extends React.Component {
  render() {
    const blockData = [

    ]


    return(
      <div>
        <Layout>
          <Header>
            <div className="logo" />YOLO
          </Header>

          <Content style={{ padding: '50px' }}>
            <div>
              <Row gutter={8}>
                <Col xs={8} offset={8}>
                    <SearchBar></SearchBar>
                </Col>
              </Row>
            </div>
            
            <div style={{ marginTop: '50px'}}>
              <Row gutter={8}>
                <Col xs={16} offset={4}>
                  <BlocksList></BlocksList>
                </Col>
              </Row>
            </div>
          </Content>

          <Footer style={{ textAlign: 'center' }}>Helium Systems Inc ©2020</Footer>
        </Layout>

      </div>
    )
  }
}

export default Index;
