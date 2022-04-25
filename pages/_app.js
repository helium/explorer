import '../wdyr'
import { BrowserRouter as Router } from 'react-router-dom'
import JavascriptTimeAgo from 'javascript-time-ago'
import '../styles/index.css'
import '../styles/Explorer.css'

import { StateProvider } from '../store/store'
import { SWRConfig } from 'swr'
import createPersistedState from 'use-persisted-state'

import en from 'javascript-time-ago/locale/en'
import { GAScript } from '../hooks/useGA'

import BannerContext from '../components/Common/Banner/BannerContext'
import ChangelogContext from '../components/Common/Changelog/ChangelogContext'
import ChangelogOverlay from '../components/Common/Changelog/ChangelogOverlay'
import { useChangelog } from '../hooks/useChangelog'
import AuthFilter from '../components/AuthFilter'

JavascriptTimeAgo.addLocale(en)
const useShowBannerState = createPersistedState('avg-earnings')

function MyApp({ Component, pageProps }) {
  const [showBanner, setShowBanner] = useShowBannerState(false)
  const hideBanner = () => setShowBanner(false)

  const {
    changelogState,
    changelogShown,
    showChangelog,
    hideChangelog,
    initializeChangelogItem,
    setChangelogItemAsSeen,
    setAllChangelogItemsAsSeen,
  } = useChangelog()

  return (
    // this #app div is used to increase the specificity of Tailwind's utility classes, making it easier to override styles without resorting to !important
    // the corresponding value is in /tailwind.config.js: important: "#app"
    <div id="app" suppressHydrationWarning>
      <AuthFilter>
        <BannerContext.Provider value={{ showBanner, hideBanner }}>
          <ChangelogContext.Provider
            value={{
              changelogState,
              changelogShown,
              showChangelog,
              hideChangelog,
              initializeChangelogItem,
              setChangelogItemAsSeen,
              setAllChangelogItemsAsSeen,
            }}
          >
            <ChangelogOverlay />
            <GAScript />
            {typeof window === 'undefined' ? null : (
              <Router>
                <StateProvider>
                  <SWRConfig
                    value={{
                      refreshInterval: 1000 * 60,
                      fetcher: (resource, init) =>
                        fetch(resource, init).then((res) => res.json()),
                    }}
                  >
                    <Component {...pageProps} />
                  </SWRConfig>
                </StateProvider>
              </Router>
            )}
            <script
              defer
              src="https://0m1ljfvm0g6j.statuspage.io/embed/script.js"
            />
          </ChangelogContext.Provider>
        </BannerContext.Provider>
      </AuthFilter>
    </div>
  )
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }

// export default withGA('G-258DXEWXY4', Router)(MyApp)
export default MyApp
