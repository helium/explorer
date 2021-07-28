import dynamic from 'next/dynamic'
import { useHistory, useLocation } from 'react-router'
import { Helmet } from 'react-helmet'
import Header from '../components/Nav/Header'
import Page from '../components/CoverageMap/Page'
import MetaTags from '../components/AppLayout/MetaTags'
import MapLayersBox from '../components/Map/MapLayersBox'
import { latestCoverageUrl } from '../commonjs/coverage'
import useKeydown from '../hooks/useKeydown'
import useGA from '../hooks/useGA'
import Head from 'next/head'
import NotFoundInfoBox from '../components/InfoBox/NotFoundInfoBox'

const Map = dynamic(() => import('../components/Map/Map'), {
  ssr: false,
  loading: () => <div />,
})

const Custom404 = ({ coverageUrl }) => {
  useGA()
  const history = useHistory()
  const location = useLocation()

  useKeydown({
    Escape: () => {
      history.push(location.pathname.split('/').slice(0, -1).join('/') || '/')
    },
  })

  return (
    <Page className="overflow-hidden">
      <Head>
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v2.3.0/mapbox-gl.css"
          rel="stylesheet"
        />
      </Head>
      <MetaTags
        title={'404 — Not Found'}
        description={`View an interactive map of the Helium network and all the hotspots currently active around the world`}
        openGraphImageAbsoluteUrl={
          'https://explorer.helium.com/images/og/coverage.png'
        }
        url={'https://explorer.helium.com/coverage'}
      />
      <Helmet>
        <title>404 – Not Found</title>
      </Helmet>
      <Header />
      <Map coverageUrl={coverageUrl} />
      <NotFoundInfoBox />
      <MapLayersBox />

      <style jsx global>{`
        #__next,
        #app,
        #app article {
          height: 100%;
        }

        html,
        body {
          overscroll-behavior: none;
        }
      `}</style>
    </Page>
  )
}

export async function getStaticProps() {
  const coverageUrl = await latestCoverageUrl()
  return {
    props: { coverageUrl },
    revalidate: 60,
  }
}

export default Custom404
