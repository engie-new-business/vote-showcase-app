import Vue from 'vue';
import Router from 'vue-router';
import VueCookies from 'vue-cookies';
import Navbar from './components/navbar/Navbar';

import Home from './views/home/home.vue';
import Metamask from './views/metamask/metamask.vue';

Vue.use(Router);
Vue.use(VueCookies);

export default new Router({
    routes: [
        {
            path: '/',
            component: Navbar,
            beforeEnter: async (to, from, next) => {
                next();
            },
            children: [
                {
                  path: '/',
                  name: 'metamask',
                  component: Metamask,
                },
            ],
        },
    ],
});
