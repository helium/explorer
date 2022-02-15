import Document, { Html, Head, Main, NextScript } from 'next/document'

class ExplorerDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>__PAGE_META_TAGS__</Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default ExplorerDocument
