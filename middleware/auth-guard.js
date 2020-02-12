import { isUndefined, isNull } from 'lodash'
export default function ({ req, route, store, redirect }) {
  let token = store.state.user.token
  if (isUndefined(token) || token == 'undefined') {
    // console.log('auth guard..............', token, isUndefined(token), isNull(token))
    store.commit('login/showLoginModal', { show: true, initiator: '401' })/*redirect to home page if cancelled*/
    return
    // return redirect('/account/login')
  }
}