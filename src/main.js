import * as Vue from 'vue'
import App from './App.vue'

import VueMaterial from "vue3-material"


import * as Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

import router from './router.js'


import svgicon from 'vue3-icon'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'

import * as AsyncComputed from 'vue3-async-computed'


const app = Vue.createApp(App)
app.use(AsyncComputed)
app.component("svg-icon", svgicon)

app.use(router)

app.use(Vuetify)
app.use(VueMaterial);
app.use(svgicon, {
    classPrefix: 'AppIcon-',
});


app.config.productionTip = true

app.mount('#app')
