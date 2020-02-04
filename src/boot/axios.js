import axios from 'axios'
import _ from 'lodash'

export default async ({ Vue }) => {
  Vue.prototype.$axios = axios
  Vue.prototype.$lodash = _
}