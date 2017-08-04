// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store';
import VueLazyLoad from 'vue-lazyload'; // 图片懒加载

Vue.config.productionTip = false

import '@/common/style/index.scss'; // 引入样式表

Vue.use(VueLazyLoad, {
  loading: require('./assets/avatar.png')
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
