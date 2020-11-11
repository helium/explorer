import Head from 'next/head'

const MetaTags = ({ title, description, openGraphImageFullUrl, url }) => {
  const metaTitle = title ? `${title} — Helium Explorer` : 'Helium Explorer'
  const metaDescription = description
    ? description
    : 'Helium Explorer is an open source block explorer providing detailed blockchain data from the Helium network'
  // TODO: uncomment image tags below once we have images to use
  const metaImage = openGraphImageFullUrl
    ? openGraphImageFullUrl
    : 'https://explorer.helium.com/images/og/default.jpg'
  const metaUrl = url ? url : 'https://explorer.helium.com'

  return (
    <>
      <Head>
        {/* General Meta Tags */}
        <meta charSet="utf-8" />
        <link rel="icon" href="https://explorer.helium.com/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <link
          rel="apple-touch-icon"
          href="https://explorer.helium.com/logo192.png"
        />
        <link rel="manifest" href="https://explorer.helium.com/manifest.json" />

        {/* Primary Meta Tags */}
        <title>{metaTitle}</title>

        <meta name="title" content={metaTitle} />
        <meta name="description" content={metaDescription} />

        {/* Item Props */}
        <meta itemProp="name" content={metaTitle} />
        <meta itemProp="description" content={metaDescription} />
        {/* <meta itemprop="image" content={metaDescription} /> */}

        {/* Twitter */}
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        {/* <meta name="twitter:image:src" content={metaImage} /> */}
        {/* <meta name="twitter:card" content="summary_large_image" /> */}
        <meta name="twitter:site" content="@helium" />

        {/* Open Graph / Facebook */}
        <meta name="og:title" content={metaTitle} />
        <meta name="og:description" content={metaDescription} />
        {/* <meta name="og:image" content={metaImage} /> */}
        <meta name="og:url" content={metaUrl} />
        <meta name="og:site_name" content="Helium Explorer" />
        <meta name="og:locale" content="en_US" />
        <meta name="og:type" content="website" />
      </Head>
    </>
  )
}

export default MetaTags
