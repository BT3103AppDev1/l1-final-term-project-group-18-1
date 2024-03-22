import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from './components/LandingPage.vue'
import About from './components/About.vue'
import Infographics from './components/Infographics.vue'
import BlueBinLocator from './components/BlueBinLocator.vue'
import Login from './components/Login.vue'
import SignUp from './components/SignUp.vue'
import Settings from './components/Settings.vue'

const routes = [
    {
        path: '/',
        name: 'LandingPage',
        component: LandingPage,
    },

    {
        path: '/About',
        name: 'About',
        component: About,
    },

    {
        path: '/resources/Infographics',
        name: 'Infographics',
        component: Infographics, 
    },

    {
        path: '/resources/BlueBinLocator',
        name: 'BlueBinLocator',
        component: BlueBinLocator, 
    },

    {
        path: '/Login',
        name: 'Login',
        component: Login,
    },

    {
        path: '/SignUp',
        name: 'Sign Up',
        component: SignUp,
    },

    {
        path: '/Settings',
        name: 'Settings',
        component: Settings,
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

export default router