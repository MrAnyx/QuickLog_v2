import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
const { ipcRenderer } = window; 

Vue.config.productionTip = false
// Vue.use(require('vue-electron'))
// Vue.prototype.$electron = ipcRenderer


new Vue({
  router,
  store,
  vuetify,
  prototype: {
    $electron: ipcRenderer
  },
  render: h => h(App)
}).$mount('#app')
