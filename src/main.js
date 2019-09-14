import Vue from 'vue';
import VueI18n from 'vue-i18n'
import App from './App.vue';
import router from './router';
import store from './store/';
import messages from './i18n/';

import './assets/style.scss';
import './filters/';

Vue.config.productionTip = true;

const i18n = new VueI18n({
  locale: store.state.currentLanguage,
  messages
});

new Vue({
  i18n,
  router,
  store,
  render: h => h(App),
  created: function () {
    if (this.$route.params.lang) {
      i18n.locale = this.$route.params.lang;
    }
  },
  watch: {
    '$route': function (newVal) {
      if (newVal.params.lang && newVal.params.lang !== i18n.locale) {
        i18n.locale = newVal.params.lang;
      }
    }
  }
}).$mount('#app');
