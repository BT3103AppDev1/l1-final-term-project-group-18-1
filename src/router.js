import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from './components/LandingPage.vue'
import About from './components/About.vue'
import Login from './components/Login.vue'
import SignUp from './components/SignUp.vue'
import Resources from './components/Resources.vue'
import Settings from './components/Settings.vue'
import EditProfile from './components/EditProfile.vue'
import Notifications from './components/Notifications.vue'
import ContactUs from './components/ContactUs.vue'

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
        path: '/Resources',
        name: 'Resources',
        component: Resources,
    },

    {
        path: '/Settings',
        name: 'Settings',
        component: Settings,
        children: [
            {
              path: '/EditProfile',
              component: EditProfile,
            },
            {
                path: '/Notifications',
                component: Notifications,
              },
            {
            path: '/ContactUs',
            component: ContactUs,
            },
        ]
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

export default router