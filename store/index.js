import Vue from 'vue'
import Vuex from 'vuex'
import { menuItems } from '~/config'
Vue.use(Vuex);

export const strict = false

export const state = () => ({
  locales: [
    {
      code: 'de',
      name: 'DE'
    },
    {
      code: 'en',
      name: 'EN'
    }
  ],
  locale: 'de',
  menuItems,
  vendors: [],
  categories: [],
  settings: {},
  loading: false,
  error: {
    is: false,
    time: null,
    msg: null,
    type: 'info'
  },
  mainNav: false,
  showCart: false,
  selectedVendor: null,
  userAddress: null,
  searchWine: null,
  isError: null // Only required to inform App.vue that an error is there hence initiate the snackbar
})
export const getters = {
  loading(state) {
    return state.loading
  },
  error(state) {
    return state.error
  },

  mainNav(state, getters) {
    return state.mainNav;
  },
  showCart(state, getters) {
    return state.showCart;
  },
  vendors(state, getters) {
    return state.vendors;
  },
  selectedVendor(state) {
    return state.selectedVendor;
  },
  searchWine(state) {
    return state.searchWine;
  },
  userAddress(state) {
    return state.userAddress;
  }
}

export const mutations = {

  SET_LANG(state, locale) {
    if (state.locales.find(el => el.code === locale)) {
      state.locale = locale
    }
  },
  mainNav(state, payload) {
    state.mainNav = payload;
  },
  showCart(state, payload) {
    state.showCart = payload;
  },

  categories(state, payload) {
    state.categories = payload
  },
  settings(state, payload) {
    state.settings = payload
  },
  setLoading(state, payload) {
    state.loading = payload
  },
  setSuccess(state, msg) {
    state.error = {}
    state.error = {
      is: true,
      msg,
      time: Date.now(),
      type: 1,
      duration: 2
    }
  },
  setWarning(state, msg) {
    state.error = {}
    state.error = {
      is: true,
      msg,
      time: Date.now(),
      type: 2,
      duration: 3
    }
  },
  setErr(state, err) {
    state.error = {}
    state.error = {
      is: true,
      msg: err,
      time: Date.now(),
      type: 3,
      duration: 3
    }
  },
  setInfo(state, msg) {
    state.error = {}
    state.error = {
      is: true,
      msg,
      time: Date.now(),
      type: 4,
      duration: 2
    }
  },
  clearError(state) {
    state.error = {
      is: false,
      msg: '',
      time: Date.now(),
      type: 3,
      duration: 0
    }
  },
  vendors(state, payload) {
    state.vendors = payload;
  },
  selectedVendor(state, payload) {
    state.selectedVendor = payload;
  },
  searchWine(state, payload) {
    state.searchWine = payload;
  },
  userAddress(state, payload) {
    state.userAddress = payload;
    this.$cookies.set('userAddress', payload);
  }
}
export const actions = {
  async nuxtServerInit({ commit, dispatch }, { req }) {

    if (!app.$cookies)
      return
    const auth = app.$cookies.get('Authorization')
    const zipcode = app.$cookies.get("zipcode")
    const currentUser = app.$cookies.get('currentUser')
    const userAddress = app.$cookies.get('userAddress')
    // const cartItems = app.$cookies.get('sevino_items')
    // const cartVendors = app.$cookies.get('cart_vendors')

    commit('auth/setToken', auth)
    commit('auth/storeZip', zipcode)
    commit('auth/setUser', currentUser)
    commit('userAddress', userAddress)
    // commit('cart/storeCart', cartItems)
    // commit('cart/saveCartVendors', cartVendors)


    // Get settings and category from database
    try {
      let categories = await this.$axios.$get('categories', { params: { where: { active: true } } })
      commit('categories', categories)
    } catch (err) {
      commit('setErr', err, { root: true })
    }
    try {
      let settings = await this.$axios.$get('settings')
      commit('settings', settings[0])
      commit('SET_LANG', settings[0].language)
    } catch (err) {
      commit('setErr', err, { root: true })
    }

    // Authorization
    if (auth) {
      app.$axios.setToken(auth, 'Bearer')
      try {
        await dispatch('auth/fetch')
        return true
      }
      catch (error) {
        return false
      }
    } else {
      this.$axios.setToken(null)
      return false
    }
  },
  async nuxtClientInit({ commit, dispatch }, context) {

    // check if cookie is enabled
    document.cookie = "testcookie";
    let cookieEnabled = (document.cookie.indexOf("testcookie") != -1) ? true : false;

    if (!cookieEnabled) {
      // alert('Your browser disabled cookies. Please enable it in browser settings and try again.');
      return;
    }
    /////

    if (!this.$cookies) {
      return
    }
    const auth = this.$cookies.get('Authorization')
    const zipcode = this.$cookies.get("zipcode")
    const userAddress = this.app.$cookies.get('userAddress')
    const currentUser = this.app.$cookies.get('currentUser')
    // const cartVendors = this.app.$cookies.get('cart_vendors')
    // const cartItems = this.$cookies.get('sevino_items')

    commit('auth/setUser', currentUser)
    commit('auth/setToken', auth)
    commit('auth/storeZip', zipcode)
    commit('userAddress', userAddress)
    // commit('cart/storeCart', cartItems)
    // commit('cart/saveCartVendors', cartVendors)


    // Get settings and category from database
    try {
      let categories = await this.$axios.$get('categories', { params: { where: { active: true } } })
      commit('categories', categories)
    } catch (err) {
      commit('setErr', err, { root: true })
    }
    try {
      let settings = await this.$axios.$get('settings')
      commit('settings', settings[0])
      commit('SET_LANG', settings[0].language)
    } catch (err) {
      commit('setErr', err, { root: true })
    }

    // Authorization
    if (auth) {
      this.$axios.setToken(auth, 'Bearer')
      try {
        await dispatch('auth/fetch')
        return true
      }
      catch (error) {
        return false
      }
    } else {
      this.$axios.setToken(null)
      return false
    }
  }
}
