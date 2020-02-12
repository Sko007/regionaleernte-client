import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);
import Router from 'vue-router'
const router = new Router({ mode: 'history' })
const state = (state) => ({
    show: false,
    showCategories: false,
    initiator: ''
})
const getters = {
    // loggedIn(state, rootState) {
    //     let isLoggedIn = false;
    //     console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', rootState);
    //     if (state.user && state.user.token != "undefined")
    //         isLoggedIn = true;
    //     return isLoggedIn;
    // }
}
const mutations = {
    showLoginModal(state, { show, initiator, btn }) {
        if (initiator)
            state.initiator = initiator
        // console.log('loginModal................', show, state.initiator, btn, show === false && state.initiator == 401 && btn === 'cancel')
        state.show = show;
        if (show === false && state.initiator == 401 && btn === 'cancel') {
            this.$router.push('/');
        }
        if (show === false && state.initiator == 'signup') {
            this.$router.push('/');
        }
    },
    showCategorymenu(state, show) {
        state.showCategories = show;
    }
}
export default {
    namespaced: true,
    state,
    getters,
    mutations
}
