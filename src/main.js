import Vue from 'vue';
import App from './App.vue';

import VueMaterial from "vue-material";
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';

import VueRouter from 'vue-router';
import Home from './components/Home.vue';


Vue.use(VueMaterial);
Vue.use(VueRouter);

Vue.config.productionTip = true;


const NotFound = { template: '<p>Page not found</p>' }

const router = new VueRouter({
    routes: [
        {
            path: '/home',
            name: 'homepage',
            component: Home
        }
    ]
})

router.redirect({
    '/': '/home'
})
new Vue({
    component: App,
    router: router
}).$mount('#app');