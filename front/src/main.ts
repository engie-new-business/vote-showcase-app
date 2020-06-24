import Vue from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import VueAxios from 'vue-axios';
import VueClipboard from 'vue-clipboard2';
import './helpers/toast';

Vue.config.productionTip = false;
Vue.use(VueClipboard);

new Vue({
    router,
    render: (h) => h(App),
}).$mount('#app');

Vue.use(VueAxios, axios);
