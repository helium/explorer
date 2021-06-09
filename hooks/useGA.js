import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import Head from 'next/head'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export const GAScript = () => {
  if (!GA_ID) return null

  return (
    <Head>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
      `,
        }}
      />
    </Head>
  )
}

const useGA = () => {
  const history = useHistory()

  const trackPageview = () => {
    window.gtag('config', GA_ID, {
      page_path: window.location.pathname,
    })
  }

  useEffect(() => {
    if (!history || !GA_ID) return
    trackPageview()
    history.listen(trackPageview)
  }, [history])
}

export const trackEvent = (action) => {
  if (!window || !GA_ID) return
  window.gtag('event', action)
}

export default useGA
