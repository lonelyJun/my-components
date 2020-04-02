import Vue from 'vue'
import App from './App.vue'
import router from './router'
import PictureResizeComponent from "../packages/index";

Vue.use(PictureResizeComponent);
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')