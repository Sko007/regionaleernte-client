import Router from 'vue-router'
const router = new Router({ mode: 'history' })
import { tokenExpiry, userRoles } from '~/config'
const state = () => ({
    user: null,
    roles: userRoles || [],
    zipcode: null
})

// getters
const getters = {
    hasRole: state => (role) => {
        return state.user ? state.roles.indexOf(state.user.role) >= state.roles.indexOf(role) : false;
    },
    token(state) {
        if (state.user)
            return 'Bearer ' + state.user.token;
    },
    getZip(state) {
        return state.zipcode;
    },
    isLoggedIn(state) { // Used at wish button
        if (!state.user || state.user == "undefined") {
            return false
        }
        else
            return true
    },
    getUser(state) {
        return state.user;
    }
}

// mutations
const mutations = {
    setUser(state, data) {
        state.user = data
        this.$cookies.set('currentUser', data)
    },
    setToken(state, data) {
        state.token = data
    },
    clearUser(state) {
        state.user = null
    },
    setZip(state, zipcode) {
        state.zipcode = zipcode
        this.$cookies.set("zipcode", zipcode)
        // localStorage.setItem('zipcode', zipcode)
    },
    storeZip(state, zipcode) {
        state.zipcode = zipcode
    }
}

const actions = {
    async fetch({ commit }) {
        try {
            const data = await this.$axios.$get('/users/me')
            commit('setUser', data)
            return data
        }
        catch (err) {
            commit('clearUser')
            commit('setErr', err, { root: true })
        }
    },
    async login({ commit }, payload) {
        try {
            const data = await this.$axios.$post('auth/local', payload)
            if (data) {
                commit('setUser', data.user)
                commit('setToken', data.token)
                this.$axios.setToken(data.token, 'Bearer')
                this.$cookies.set('Authorization', data.token, { maxAge: tokenExpiry, path: '/' })
                commit('setSuccess', "Successfully logged in.", { root: true })
                return data
            }
        } catch (err) {

            commit('setErr', err.response.data, { root: true })
        }
    },
    async signup({ commit }, payload) {
        try {
            const data = await this.$axios.$post('/users', payload)

            if (data.errors) {
                throw data.message
            } else {
                data.user.token = data.token
                return data
            }
        } catch (err) {
            if (err) {
                throw err
            }
        }
    },
    async login_google({ commit }, token) {
        return api.auth.google({ token })
            .then(response => {
                commit('setUser', response.data.user)
                commit('setToken', response.data.token)
                this.$cookies.set('Authorization', response.data.token, { maxAge: tokenExpiry, path: '/' })
                return response
            })
    },
    async forgotPassword({ commit }, payload) {
        try {
            const data = await this.$axios.$post('/users/forgot', payload)
            commit('setErr', data, { root: true });
        } catch (err) {
            commit('setErr', err.response.data, { root: true })
        }
    },
    async changePassword({ commit, rootState }, payload) {
        try {
            const data = await this.$axios.$put('/users/password', payload)
            commit('setErr', 'Password changed successfully', { root: true })
            // return data
        } catch (err) {
            commit('setErr', err.response.data, { root: true })
        }
    },
    async resetPassword({ commit }, payload) {
        try {
            const data = await this.$axios.$post('/users/reset/' + payload.id, payload)
            if (data) {
                commit('setInfo', data, { root: true })
                // router.push('/')
            }
            return data
        } catch (err) {
            commit('setErr', err, { root: true })
        }
    },
    async updateProfile({ commit, rootState }, { _id, name, email, phone }) {
        if (rootState.settings.demo) {
            commit('setInfo', 'Demo mode: Unable to update profile info', { root: true })
            return
        }
        try {
            const data = await this.$axios.$put('/users/profile', { name, email, phone })
            if (data) {
                commit('setUser', { name: data.name, email: data.email, phone: data.phone })
                this.$cookies.set('Authorization', data.token, { maxAge: tokenExpiry, path: '/' })
                commit('setInfo', 'Profile updated.', { root: true })
                return data
            }
        } catch (err) {
            commit('setErr', err, { root: true })
        }
    },
    logout({ commit }) {
        // console.log('logout..........');
        if (process.server) {
            app.$cookies.set('Authorization', null)
            app.$cookies.remove('Authorization')
            app.$cookies.set('currentUser', null)
            app.$cookies.remove('currentUser')
        } else {
            this.$cookies.set('Authorization', null) // Important to avoid path issue
            this.$cookies.remove('Authorization')
            this.$cookies.set('currentUser', null)
            this.$cookies.remove('currentUser')
        }
        // console.log('cookie removed........');
        commit('clearUser')
        commit('setToken', null)
        this.$axios.setToken(null)
        router.push('/')
    }
}
export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}