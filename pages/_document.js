import Document, { Html, Head, Main, NextScript } from 'next/document'
import MetaTags from '../components/AppLayout/MetaTags'

class ExplorerDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
          <MetaTags />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default ExplorerDocument
