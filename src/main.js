import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/';

import './assets/style.scss';
import './filters/';

Vue.config.productionTip = true;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
