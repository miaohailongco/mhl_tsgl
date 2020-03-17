import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import "./css/default.css"
import axios from "./axios"
import msgBox from "./components/msgBox"
import modal from "./components/modal"
import dialog from "./components/dialog"
Vue.use(msgBox)
Vue.use(modal)
Vue.use(dialog)
Vue.prototype.$axios = axios;
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
