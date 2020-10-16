import React, { Component } from 'react'
import Page from './Page'

export default () => (
  <Page backgroundColor="#0A1F39">
    <Wrapper>
      <HeaderImg />
      <Paragraph>
        Your browser is too small to display the Helium Network Visualizer.
        Check out our mobile apps to monitor the network on the go.
      </Paragraph>
      <AppPreview />
      <DownloadLinks />
    </Wrapper>
  </Page>
)

const Wrapper = ({ children }) => (
  <div>
    {children}
    <style jsx>{`
      div {
        height: 100vh;
        padding: 20px;
        padding-top: 50px;
      }
    `}</style>
  </div>
)

const HeaderImg = () => (
  <React.Fragment>
    <img src="/static/img/walletheader.svg" />
    <style jsx>{`
      img {
        width: 90%;
        margin-bottom: 10px;
      }
    `}</style>
  </React.Fragment>
)

const Paragraph = ({ children }) => (
  <p>
    {children}
    <style jsx>{`
      p {
        color: #92b8e8;
        margin: 0 auto;
        width: 100%;
        margin-bottom: 20px;
        font-weight: 100;
        font-size: 18px;
        line-height: 1.4;
        font-family: 'soleil', Helvetica, Arial, sans-serif;
      }
    `}</style>
  </p>
)

const DownloadLinks = () => (
  <div>
    <a href="https://apps.apple.com/app/id1450463605">
      <img src="/static/img/appstore.svg" />
    </a>
    <a href="https://play.google.com/store/apps/details?id=com.helium.wallet&hl=en_US">
      <img src="/static/img/googleplay.svg" />
    </a>
    <style jsx>{`
      div {
        display: flex;
        width: 100%;
        justify-content: center;
      }

      img {
        height: 50px;
        margin: 6px;
      }
    `}</style>
  </div>
)

const AppPreview = () => (
  <div>
    <style jsx>{`
      div {
        width: 100%;
        height: 40vh;
        background: url(/static/img/apps.png);
        background-size: 100% auto;
        margin-bottom: 20px;
      }
    `}</style>
  </div>
)
