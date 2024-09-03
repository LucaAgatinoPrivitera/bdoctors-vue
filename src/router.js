import { createRouter, createWebHistory } from 'vue-router';

import AppHome from './views/HomeView.vue';
// import AppAbout from './views/AppAbout.vue';
// import AppDoctors from './views/AppDoctors.vue';
// import AppContact from './views/AppContact.vue';
import DoctorList from './views/DoctorListView.vue';
import DoctorDetailView from './views/DoctorDetailView.vue';



const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: AppHome
        },
        /*{
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
        },*/
        {
            path: '/doctors',
            name: 'doctorsList',
            component: DoctorList
        },
        {
            path: '/doctors/:id',
            name: 'doctorDetail',
            component: DoctorDetailView,
            props: true
        },
    ]
});
export { router };