import Vue from 'vue'
import Vuetify from 'vuetify'

var LRU = require("lru-cache")
const themeCache = LRU({
  max: 10,
  maxAge: 1000 * 60 * 60 // 1 hour
})

Vue.use(Vuetify, {
  options: {
    minifyTheme: function (css) {
      return process.env.NODE_ENV === 'production'
        ? css.replace(/[\s|\r\n|\r|\n]/g, '')
        : css
    },
    themeCache
  },
  theme: {
    primary: '#316ba1',
    accent: '#ce93d8',
    secondary: '#424242',
    info: '#0D47A1',
    warning: '#ffb300',
    error: '#B71C1C',
    success: '#2E7D32'
  }
})