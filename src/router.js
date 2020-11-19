import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home.vue'
import stats from '@/components/stats.vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/homepage/',
        },
        {
            path: '/homepage/',
            name: 'Homepage',
            component: Home
        },
        {
            path: '/stats/',
            name: 'Statics',
            component: stats
        }



    ],

})

