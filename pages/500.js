import Link from 'next/link'
import AppLayout, { Content } from '../components/AppLayout'
import { Row, Col, Typography, Card, Button } from 'antd'

export default function Custom404() {
  return (
    <>
      <AppLayout>
        <Content class="errorpage-body">
          <main class="ant-layout">
            <div class="App-header-white">
              <h1 class="App-header-white">500</h1>
              <h2 class="App-header-white-3">
                Oops! An unexpected server error occurred on our end (˘･_･˘)
              </h2>
            </div>
            <div class="links-list">
              <h3 class="App-header-white-2">Useful links:</h3>
              <ul>
                <li>
                  <Link href="https://www.helium.com/">
                    <a>Home</a>
                  </Link>
                </li>
                <li>
                  <Link href="https://www.helium.com/about">
                    <a>About</a>
                  </Link>
                </li>
                <li>
                  <Link href="https://www.helium.com/mine">
                    <a>Mine</a>
                  </Link>
                </li>
                <li>
                  <Link href="https://shop.helium.com/">
                    <a>Shop</a>
                  </Link>
                </li>
              </ul>
              <div class="App-header-green">
                <p1>
                  Join our
                  <span>
                    <a href="https://discord.com/invite/helium" target="_blank">
                      <img
                        src="https://cdn.worldvectorlogo.com/logos/discord-logo-color-wordmark-1.svg"
                        width="6%"
                        height="6%"
                      ></img>
                    </a>
                  </span>
                  for help!
                </p1>
              </div>
            </div>
            <div class="errorFiller"></div>
          </main>
        </Content>
      </AppLayout>
    </>
  )
}
