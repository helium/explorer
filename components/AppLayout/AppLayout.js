import React from 'react'
import { Layout, Typography } from 'antd'
import NavHeader from './NavHeader'
import MetaTags from './MetaTags'

const { Content, Footer } = Layout
const { Text } = Typography

const AppLayout = ({
  children,
  title,
  pageTitle,
  description,
  openGraphImageAbsoluteUrl,
  url,
}) => {
  const layoutStyle = {
    fontFamily: 'Inter, sans-serif',
    fontStyle: 'normal',
    minHeight: '100vh',
    paddingTop: '120px',
  }
  return (
    <Layout style={layoutStyle}>
      <MetaTags
        title={title}
        pageTitle={pageTitle}
        description={description}
        openGraphImageAbsoluteUrl={openGraphImageAbsoluteUrl}
        url={url}
      />

      <NavHeader />

      <Content style={{ padding: '0px' }}>{children}</Content>

      <Footer style={{ textAlign: 'center', backgroundColor: '#101725' }}>
        <Text style={{ color: '#8182AB' }}>
          ©{new Date().getFullYear()} Helium Systems, Inc.
        </Text>
      </Footer>
    </Layout>
  )
}

export default AppLayout
