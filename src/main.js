import Vue from 'vue';
import App from './App.vue';

import VueMaterial from "vue-material";
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';
import 'vue-material/dist/vue-material.css'

import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

import router from './router.js';


import * as svgicon from 'vue-svgicon';

Vue.use(Vuetify)
Vue.use(VueMaterial);
Vue.use(svgicon, {
    classPrefix: 'AppIcon-',
});


Vue.config.productionTip = true;

new Vue({
    router: router,
    render: h => h(App),
    vuetify: new Vuetify() ,
}).$mount("#app");

