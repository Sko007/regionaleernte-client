import createPersistedState from 'vuex-persistedstate'
// TODO:
export default ({ store, isHMR }) => {
    if (isHMR) return

    process.client && window.onNuxtReady((nuxt) => {
        createPersistedState({
            paths: ['cartnew']
        })(store)
    })
}