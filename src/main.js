import elementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Vue from 'vue'
import App from './App'
import './assets/stylus/main.styl'
import router from './router'
import './assets/icon/iconfont.css'
import './assets/icon/iconfont.js'
import globalComponents from './util/globalComponents'
// import http from './util/http'
import http from './util/axios'
import Qs from 'qs'

Vue.prototype.$http = http
Vue.use(globalComponents)
Vue.use(elementUi)
Vue.prototype.$qs = Qs
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
