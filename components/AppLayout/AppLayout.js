import React from 'react'
import { Layout, Typography } from 'antd'
import NavHeader from './NavHeader'
import MetaTags from './MetaTags'
import { useContext } from 'react'
import BannerContext from '../Banner/BannerContext'

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
  const { showBanner } = useContext(BannerContext)
  const layoutStyle = {
    fontFamily: 'Inter, sans-serif',
    fontStyle: 'normal',
    minHeight: '100vh',
    paddingTop: showBanner ? '120px' : '64px',
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
