import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export const GAScript = () => {
  if (!GA_ID) return null

  return (
    <>
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
    </>
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

export default useGA
