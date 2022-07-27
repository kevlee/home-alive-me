
import * as Router from 'vue-router'
import Home from '@/components/Home.vue'
import stats from '@/components/stats.vue'


export default Router.createRouter({
    history: Router.createWebHistory(),
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

