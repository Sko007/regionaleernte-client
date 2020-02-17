const pkg = require('./package')

// for live server
// const PROXY = (process.env.NODE_ENV === 'production') ? 'meine.regionaleernte.de' : 'http://localhost:3000'
// const WS_URL = (process.env.NODE_ENV === 'production') ? 'api.regionaleernte.de' : 'http://localhost:9000'

// for dev server
const PROXY = (process.env.NODE_ENV === 'production') ? 'meine.regionale-ernte.de' : 'http://localhost:3000'
const WS_URL = (process.env.NODE_ENV === 'production') ? 'api.regionale-ernte.de' : 'http://localhost:9000'

module.exports = {
  PROXY,
  WS_URL,
  STRIPE_PUBLISHABLE_KEY: 'pk_live_Fyde1xx4pRp6GOgXf4xg6Sng00EZrc7G45',
  // STRIPE_PUBLISHABLE_KEY: 'pk_test_puCr6M7gmWf9fUv5zCkOBnqw008LNopmpv',
  ANALYTICS_TRACKING_ID: 'UA-TRACKING_ID',
  GOOGLE_MAPS_API_KEY: 'YOUR_GOOGLE_MAPS_API_KEY',
  FACEBOOK_APP_ID: 'FACEBOOK_APP_ID',
  tokenExpiry: 60 * 60 * 24, // Login validity in seconds
  typingTimeout: 700, // Used for searching e.g. search.vue
  loadingTimeout: 500, // Used for showing the loading indicator at each page
  snackTimer: 5000,// Used for the snackbar
  recordsPerScroll: 50,
  clearCart: true, // Whether to clear the cart after order is placed. Useful while testing

  userRoles: ['user', 'vendor', 'manager', 'admin'], // This should be in ascending order of authority. e.g. In this case guest will not have access to any other role, where as admin will have the role of guest+user+vendor+manager+admin

  currency: {
    symbol: '€',
    code: 'EUR', // Shop currency
    paypal: 'EUR',// Paypal currency code *** Please choose from https://developer.paypal.com/docs/classic/api/currency_codes/
    exchange_rate: '1' // Paypal currency code(USD) / Shop currency (INR) ***  exchange_rate should not be 0 else it will generate divided by 0 error
  },
  menuItems: [
    { text: 'Dashboard', url: '/my', icon: 'dashboard', authenticate: 'manager', color: 'black', dashboard: true },
    { text: 'Orders', url: '/my/orders', icon: 'watch_later', authenticate: 'user', color: 'black', dashboard: true },
    { text: 'My Reviews', url: '/my/reviews', icon: 'stars', authenticate: 'user', color: 'black', dashboard: true },
    { text: 'My Address', url: '/my/address', icon: 'location_on', authenticate: 'user', color: 'black', dashboard: true },
    { text: 'Purchased Products', url: '/my/products', icon: 'shopping_cart', authenticate: 'user', color: 'black', dashboard: true },
    { text: 'Profile', url: '/account/profile', authenticate: 'user', icon: 'person_pin', color: 'black' },
    { text: 'Change Password', url: '/account/change-password', authenticate: 'user', icon: 'lock', color: 'black' }
  ],
  manifest: {
    name: 'REGIONALE-ERNTE',
    short_name: 'REGIONALE-ERNTE',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#ff0000'
  },
  head: {
    titleTemplate: '%s',
    title: pkg.description,
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Karla:400,700|Material+Icons' }
    ],
    meta: [
      { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'keyword', name: 'keyword', content: pkg.keyword },
      { hid: 'description', name: 'description', content: pkg.description },
      {
        hid: 'og:title',
        property: 'og:title',
        content: pkg.description,
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: pkg.description,
      },
      {
        hid: 'twitter:title',
        property: 'twitter:title',
        content: pkg.description,
      },
      {
        hid: 'twitter:description',
        property: 'twitter:description',
        content: pkg.description,
      },
      {
        hid: 'og:url',
        property: 'og:url',
        content: 'https://www.regionaleernte.de',
      },
    ],
    script: [
      { src: 'https://js.stripe.com/v3/' },
    ],
    noscript: [{ innerHTML: `We're sorry but REGIONALE-ERNTE doesn't work properly without JavaScript enabled. Please enable it to continue.` }],
    htmlAttrs: { lang: 'en' },
    __dangerouslyDisableSanitizers: ['script'],
  }
}
