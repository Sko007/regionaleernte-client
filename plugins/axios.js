export default ({ $axios, store }) => {
  // $axios.defaults.baseURL = 'https://api.com/api/'
  if (process.server) {
    return
  }
  $axios.interceptors.request.use(request => {
    // request.baseURL = 'https://api.com/api/'

    // Get token from auth.js store
    if (store.state.auth) {
      const token = store.state.auth.token

      // Update token axios header
      if (token) {
        request.headers.common['Authorization'] = 'Bearer ' + token
      }
    }
    return request
  })
}