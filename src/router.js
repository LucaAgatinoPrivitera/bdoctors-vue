import { createRouter, createWebHistory } from 'vue-router';

import AppHome from './views/AppHome.vue';
import AppAbout from './views/AppAbout.vue';
import AppDoctors from './views/AppDoctors.vue';
import AppContact from './views/AppContact.vue';



const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: AppHome
        },
        {
            path: '/about',
            name: 'about',
            component: AppAbout
        },
        {
            path: '/doctor',
            name: 'project',
            component: AppDoctors
        },
        {
            path: '/contact',
            name: 'contact',
            component: AppContact
        },
    ]
});
export { router };