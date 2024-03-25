import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from './views/LandingPage.vue'
import About from './views/About.vue'
import Resources from './views/Resources.vue'
import Login from './views/LoginPage.vue'
import SignUp from './views/SignUpPage.vue'
import Home from './views/HomePage.vue'
import ForgetPassword from './views/ForgetPasswordPage.vue'

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
        path: '/Resources',
        name: 'Resources',
        component: Resources,
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
        path: '/Home',
        name: 'Home',
        component: Home,
    },
    {
        path: '/ForgetPassword',
        name: 'ForgetPassword',
        component: ForgetPassword,
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

export default router