import { createRouter, createWebHistory } from 'vue-router';

import AppHome from './views/HomeView.vue';
import DoctorList from './views/DoctorListView.vue';
import DoctorDetailView from './views/DoctorDetailView.vue';
import Contact from './views/Contact.vue';
import Review from './views/Review.vue';
import Register from './views/Register.vue';
import LogIn from './views/LogIn.vue';
import FilteredDoctor from './views/FilteredDoctor.vue';




const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: AppHome
        },

        {
            path: '/register',
            name: 'register',
            component: Register,
        },

        {
            path: '/login',
            name: 'login',
            component: LogIn,
        },


        {
            path: '/doctors',
            name: 'doctorsList',
            component: DoctorList
        },
        {
            path: '/doctors/:slug',
            name: 'doctorDetail',
            component: DoctorDetailView,
            props: true
        },
        {
            path: '/contact/:doctorId/:slug',
            name: 'contact',
            component: Contact
        },
        {
            path: '/review/:doctorId/:slug',
            name: 'review',
            component: Review
        },
        {
            path: '/search',
            name: 'search',
            component: FilteredDoctor
        }
    ]
});
export { router };