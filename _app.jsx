import { useEffect } from 'react'
import Head from 'next/head'
import { Router, useRouter } from 'next/router'
import { MDXProvider } from '@mdx-js/react'

import { Layout } from '@/components/Layout'
import * as mdxComponents from '@/components/mdx'
import { useMobileNavigationStore } from '@/components/MobileNavigation'
import posthog from 'posthog-js'

import '@/styles/tailwind.css'
import 'focus-visible'

function onRouteChange() {
  useMobileNavigationStore.getState().close()
}

Router.events.on('hashChangeStart', onRouteChange)
Router.events.on('routeChangeComplete', onRouteChange)
Router.events.on('routeChangeError', onRouteChange)

export default function App({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    // Init PostHog
    posthog.init('phc_HosujvcO5QzmU2MVvZo8AxWV0pplTZJLr3jEd8dRVPE', {
      api_host: 'https://analytics.openfort.xyz',
    })
    if (process.env.NODE_ENV === 'development') posthog.opt_out_capturing()
    // Track page views
    const handleRouteChange = () => posthog.capture('$pageview')
    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [])

  return (
    <>
      <Head>
        {router.pathname === '/' ? (
          <title>Openfort API Reference</title>
        ) : (
          <title>{`${pageProps.title} - Openfort Documentation`}</title>
        )}
        <meta name="description" content={pageProps.description} />
      </Head>
      <MDXProvider components={mdxComponents}>
        <Layout {...pageProps}>
          <Component {...pageProps} />
        </Layout>
      </MDXProvider>
    </>
  )
}
