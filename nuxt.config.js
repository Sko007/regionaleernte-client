const webpack = require('webpack')
const { PROXY, STRIPE_PUBLISHABLE_KEY, ANALYTICS_TRACKING_ID, head, manifest } = require("./config");

module.exports = {
  head,
  manifest,
  loading: '~/components/Loading.vue',
  css: ['~/assets/main.styl', '~/assets/transitions.css'],
  // stripe: {
  //   version: 'v3',
  //   publishableKey: STRIPE_PUBLISHABLE_KEY,
  // },
  plugins: [
    '~/plugins/vuetify',
    '~/plugins/axios.js',
    '~/plugins/filters.js',
    '~/plugins/social.js',
    '~/plugins/i18n.js',
    { src: '~plugins/veeValidate.js' },
    { src: '~/plugins/owl.js', ssr: false },
    { src: '~plugins/VueLazyload', ssr: false },
    { src: '~/plugins/scroll.js', ssr: false },
    { src: '~/plugins/swal.js', ssr: false },
    { src: '~plugins/localStorage.js', ssr: false }
  ],
  modules: [
    '@nuxtjs/sitemap',
    'nuxt-robots-module',
    '@nuxtjs/dotenv',
    '@nuxtjs/component-cache',
    '@nuxtjs/axios',
    // '@nuxtjs/pwa',
    'nuxt-validate',
    'nuxt-client-init-module',
    'cookie-universal-nuxt',
    ['@nuxtjs/google-analytics', { id: ANALYTICS_TRACKING_ID }],

    { src: 'nuxt-stripe-module', ssr: false }
  ],
  router: { middleware: ['auth', 'i18n'] }, // Should be called on every page request. This just check if user/cart exists,
  axios: {
    baseURL: '/api/',
    browserBaseURL: '/api/',
    proxy: true,
    credentials: true
  },
  proxy: {
    '/api': PROXY,
    '/auth': PROXY,
    '/img': PROXY,
    '/uploads': PROXY,
    '/groceries': PROXY,
  },
  // workbox: {
  //   runtimeCaching: [
  //     {
  //       urlPattern: PROXY + '/groceries/.*',
  //       handler: 'cacheFirst',
  //       method: 'GET',
  //       strategyOptions: { cacheableResponse: { statuses: [0, 200] } }
  //     },
  //     {
  //       urlPattern: 'https://fonts.googleapis.com/.*',
  //       handler: 'cacheFirst',
  //       method: 'GET',
  //       strategyOptions: { cacheableResponse: { statuses: [0, 200] } }
  //     },
  //     {
  //       urlPattern: 'https://fonts.gstatic.com/.*',
  //       handler: 'cacheFirst',
  //       method: 'GET',
  //       strategyOptions: { cacheableResponse: { statuses: [0, 200] } }
  //     },
  //   ]
  // },
  render: {
    gzip: { level: 1 },
    http2: { push: true },
    static: {
      maxAge: "1d",
      setHeaders(res, path) {
        if (path.includes("sw.js")) {
          res.setHeader("Cache-Control", `public, max-age=${15 * 60}`)
        }
      }
    },
    bundleRenderer: {
      shouldPrefetch: (file, type) => {
        return ['script', 'style', 'font'].includes(type)
      }
    }
  },
  build: {
    vendor: ['vue-i18n'],
    app: 'app.[chunkhash].js',
    chunk: '[name].[chunkhash].js',
    extractCSS: true,
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jquery: 'jquery',
        'window.jQuery': 'jquery',
        jQuery: 'jquery'
      })
    ]
  },
  sitemap: {
    path: '/sitemap.xml',
    cacheTime: 1000 * 60 * 15,
    gzip: true,
    generate: false,
    exclude: ['/my/**']
  }
}
