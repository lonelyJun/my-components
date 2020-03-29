import Vue from 'vue'
import App from './App.vue'
import router from './router'
import MediaPlayerComponent from "../packages/index";

Vue.use(MediaPlayerComponent);
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')