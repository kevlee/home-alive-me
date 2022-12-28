import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import router from './router.js'
import SvgIcon from 'vue-svgicon'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'
import AsyncComputed from 'vue-async-computed'

Vue.use(Vuetify)
Vue.use(AsyncComputed)
Vue.use(router)
Vue.use(SvgIcon, {
    tagName: 'svgicon'
});
Vue.config.productionTip = true

new Vue({
    router: router,
    render: h => h(App),
    vuetify: new Vuetify(),
}).$mount("#app");
