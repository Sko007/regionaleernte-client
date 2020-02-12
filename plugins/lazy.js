import Vue from 'vue'
import VueLazyload from 'vue-lazyload'

Vue.use(VueLazyload, {
    preLoad: 0.9,
    error: '/300x300.svg', //https://placeholder.pics/svg/300/E1E1E1-E4E4E4/CACACA-F5F5F5/Loading...
    loading: '/300x300.svg',
    attempt: 1,
    // the default is ['scroll', 'wheel', 'mousewheel', 'resize', 'animationend', 'transitionend']
    listenEvents: ['scroll'],
    lazyComponent: true
})