import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from './views/LandingPage.vue'
import About from './views/About.vue'
import Login from './views/LoginPage.vue'
import SignUp from './views/SignUpPage.vue'
import HomePage from './views/HomePage.vue'
import ForgetPassword from './views/ForgetPasswordPage.vue'
import Farm from './views/FarmPage.vue';
import Calendar from './views/Calendar/CalendarPage.vue';
import Infographics from './views/Resources/Infographics.vue'
import BlueBinLocator from './views/Resources/BlueBinLocator.vue'
import Settings from './views/Settings/Settings.vue'
import Profile from './views/Settings/Profile.vue'
import Notifications from './views/Settings/Notifications.vue'
import ContactUs from './views/Settings/ContactUs.vue'
import Social from './views/SocialPage.vue'

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
        path: '/verify-email',
        name: 'verify-email',
        component: () => import('@/components/EmailVerification.vue'),
        props: route => ({ email: route.query.email })
    },
    {
        path: '/Home',
        name: 'Home',
        component: HomePage,
    },
    {
        path: '/ForgetPassword',
        name: 'ForgetPassword',
        component: ForgetPassword,
    },

    {
        path: '/Farm',
        name: 'Farm',
        component: Farm,
        children: [
            {
              path: '/Social',
              component: Social,
            },
        ]
    },
    {
        path: '/Calendar',
        name: 'Calendar',
        component: Calendar,
    },
    {
        path: '/resources/Infographics',
        name: 'Infographics',
        component: Infographics,
    },

    {
        path: '/infographics/:id',
        name: 'PosterDetail',
        component: () => import('@/views/Resources/PosterDetail.vue')
    },

    {
        path: '/resources/BlueBinLocator',
        name: 'BlueBinLocator',
        component: BlueBinLocator,
    },
    {
        path: '/Settings',
        name: 'Settings',
        component: Settings,
        children: [
            {
              path: '/Profile',
              component: Profile,
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
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

export default router