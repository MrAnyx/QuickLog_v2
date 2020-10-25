import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
const { ipcRenderer } = window;

Vue.config.productionTip = false

new Vue({
  router,
  store,
  prototype: {
    $electron: ipcRenderer
  },
  vuetify,
  render: h => h(App)
}).$mount('#app')
