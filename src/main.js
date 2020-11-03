import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
const { ipcRenderer } = window;
import icons from "../node_modules/@mdi/font/css/materialdesignicons.css"
import fonts from "../public/fonts.css"

Vue.config.productionTip = false
Vue.prototype.$electron = ipcRenderer

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
