import React from 'react'
import { Layout, Typography } from 'antd'
import NavHeader from './NavHeader'
import MetaTags from './MetaTags'
import Typekit from 'react-typekit'

const { Content, Footer } = Layout
const { Text } = Typography

const layoutStyle = {
  fontFamily: 'Inter, sans-serif',
  fontStyle: 'normal',
  minHeight: '100vh',
  marginTop: '64px',
}

const AppLayout = (props) => (
  <Layout style={layoutStyle}>
    <MetaTags
      title={props.title}
      pageTitle={props.pageTitle}
      description={props.description}
      openGraphImageAbsoluteUrl={props.openGraphImageAbsoluteUrl}
      url={props.url}
    />

    <NavHeader />

    <Content style={{ padding: '0px' }}>{props.children}</Content>

    <Footer style={{ textAlign: 'center', backgroundColor: '#101725' }}>
      <Text style={{ color: '#8182AB' }}>
        ©{new Date().getFullYear()} Helium Systems, Inc.
      </Text>
    </Footer>
  </Layout>
)

export default AppLayout
