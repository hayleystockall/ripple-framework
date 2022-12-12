import { join } from 'pathe'
import type { RplTideModuleConfig } from './../types'
import {
  defineNuxtModule,
  addServerHandler,
  addComponent,
  addComponentsDir,
  addImportsDir,
  resolvePath,
  createResolver,
  installModule
} from '@nuxt/kit'
import { pascalCase } from 'change-case'
import type { Options } from 'http-proxy-middleware'

const loadComponents = async (key, path) => {
  const getComponentName = (name) => `Tide${pascalCase(name)}Page`
  if (Array.isArray(path)) {
    for (let i = 0; i < path.length; i++) {
      const filePath = await resolvePath(path[i])
      addComponent({ name: getComponentName(key), filePath, global: true })
    }
  }
  const filePath = await resolvePath(path)
  addComponent({ name: getComponentName(key), filePath, global: true })
}

const extendNuxtProxyConfig = (nuxtConfig, proxyOption: Options) => {
  let existingProxyItems: Options[] = []
  if (nuxtConfig.options?.proxy?.options) {
    if (Array.isArray(nuxtConfig.options?.proxy?.options)) {
      existingProxyItems = [...nuxtConfig.options.proxy.options]
    } else {
      existingProxyItems = [nuxtConfig.options.proxy.options]
    }
  }

  if (nuxtConfig.options.proxy) {
    nuxtConfig.options.proxy.options = [...existingProxyItems, proxyOption]
  } else {
    nuxtConfig.options.proxy = {
      options: [...existingProxyItems, proxyOption]
    }
  }
}

export default defineNuxtModule({
  meta: {
    name: 'ripple-tide-api',
    configKey: 'tide'
  },
  defaults: {
    contentApi: {
      site: '8888',
      baseUrl: 'https://develop.content.reference.sdp.vic.gov.au/',
      apiPrefix: 'api/v1',
      auth: {
        username: 'dpc',
        password: 'sdp'
      }
    },
    mapping: {
      content: {},
      site: ''
    },
    debug: false,
    proxy: {
      options: []
    }
  },
  async setup(options: RplTideModuleConfig, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    // Setup config from runtimeConfig and options
    if (nuxt.options.runtimeConfig.public['tideserver']) {
      options.contentApi.baseUrl =
        nuxt.options.runtimeConfig.public['tideserver']
    }
    if (nuxt.options.runtimeConfig.public['site']) {
      options.contentApi.site = nuxt.options.runtimeConfig.public['site']
    }

    for (const key in options.mapping.content) {
      const modulePath = await resolvePath(
        `${options.mapping.content[`${key}`]}`
      )
      options.mapping.content[`${key}`] = modulePath
      const module = await import(modulePath)
      if (module && module.hasOwnProperty('component')) {
        await loadComponents(key, module.component)
      }
    }
    if (typeof options.mapping.site === 'string') {
      options.mapping.site = await resolvePath(options.mapping.site)
    }

    nuxt.options.runtimeConfig.public.tide = options

    const webformProxy = {
      target: options.contentApi.baseUrl,
      changeOrigin: true,
      pathRewrite: {
        '^/api/tide/': '/api/v1/'
      },
      pathFilter: ['/api/tide/webform_submission/**']
    }

    extendNuxtProxyConfig(nuxt, webformProxy)

    await installModule('nuxt-proxy')

    // API endpoint handlers - See https://v3.nuxtjs.org/guide/directory-structure/server#api-routes
    addServerHandler({
      middleware: true,
      handler: resolve('./nuxt/handlers/tideMiddleware.js')
    })
    addServerHandler({
      route: '/api/tide/page',
      handler: resolve('./nuxt/handlers/pageHandler.js')
    })
    addServerHandler({
      route: '/api/tide/site',
      handler: resolve('./nuxt/handlers/siteHandler.js')
    })

    // Add nuxt components and composables to imports
    addComponentsDir({
      extensions: ['vue'],
      path: join(__dirname, './../src/nuxt/components'),
      prefix: 'tide',
      global: true
    })
    addImportsDir(join(__dirname, './../src/nuxt/composables'))

    // Add error page component
    nuxt.hook('app:resolve', (app) => {
      app.errorComponent = resolve('./../src/nuxt/components/ErrorPage.vue')
    })
  }
})
