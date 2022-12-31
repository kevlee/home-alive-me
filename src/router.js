
import Router from 'vue-router'
import Home from '@/components/Home.vue'
import stats from '@/components/stats.vue'


export default new Router({
    //history: Router.createWebHistory(),
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

