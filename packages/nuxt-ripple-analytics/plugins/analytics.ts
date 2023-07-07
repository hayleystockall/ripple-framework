import { defineNuxtPlugin, useAppConfig, useRuntimeConfig } from '#app'
import { getBreadcrumbs } from '#imports'
import { loadScript } from '@gtm-support/core'
import { trackEvent } from '../lib/tracker'

declare global {
  interface Window {
    dataLayer: any[]
  }
}

const setupDataLayer = () => {
  /*eslint-disable no-prototype-builtins */
  if (typeof window !== undefined && !window.hasOwnProperty('dataLayer')) {
    window.dataLayer = []
  }
}

const setupGTM = (GTM_ID: string) => {
  if (GTM_ID) {
    // Add tracking code to page with loadScript
    loadScript(GTM_ID, { defer: true, compatibility: false })
  }
}

const handleRouteChange = ({ route, site, page }) => {
  let pageBreadcrumbs = page?.breadcrumbs
    ? page?.breadcrumbs
    : getBreadcrumbs(route.fullPath, page?.title, site?.menus?.menuMain)

  if (Array.isArray(pageBreadcrumbs)) {
    pageBreadcrumbs = pageBreadcrumbs
      .filter((crumb) => crumb?.url !== '/')
      .map((crumb) => crumb.text)
  }

  const trimValue = (value: any) =>
    typeof value === 'string' ? value.trim() : value

  trackEvent({
    event: 'page_view',
    name: page?.title,
    page_url: route.fullPath,
    content_type: page?.type,
    search_term: trimValue(route.query?.q),
    site_section: page?.siteSection?.name,
    breadcrumbs: pageBreadcrumbs,
    platform_event: 'routeView'
  })
}

export default defineNuxtPlugin((nuxtApp) => {
  const appConfig = useAppConfig()?.ripple
  const runtimeConfig = useRuntimeConfig()?.public?.tide
  const eventListeners: Record<string, any> =
    appConfig?.analytics?.eventListeners

  /* @ts-ignore process is extended by webpack */
  if (process.client) {
    nuxtApp.hook('page:finish', () => {
      const route = useRoute()
      const site = nuxtApp.payload.data?.[`site-${runtimeConfig.site}`]
      const page = nuxtApp.payload.data?.[`page-${route.fullPath}`]
      let routeChangeCallback = handleRouteChange

      if (appConfig?.analytics?.routeChange === false) {
        return
      }
      if (typeof appConfig?.analytics?.routeChange === 'function') {
        routeChangeCallback = appConfig?.analytics?.routeChange
      }

      routeChangeCallback({ route, site, page })
    })

    nuxtApp.vueApp.use({
      install(app: any) {
        const rplEventBus = app._context?.provides?.$rplEvent
        setupDataLayer()
        setupGTM(runtimeConfig?.analytics?.GTM)
        if (rplEventBus && eventListeners) {
          /* Here we iterate over all imported events and add listeners to Mitt event bus */
          const evtKeys = Object.keys(eventListeners)
          if (evtKeys.length > 0) {
            evtKeys.forEach((key) => {
              rplEventBus.on(key, eventListeners[key]())
            })
          }
        } else {
          console.error(
            'Error: (ripple-analytics) could not instantiate rplEvent Bus for analytics'
          )
        }
      }
    })
  }
})
