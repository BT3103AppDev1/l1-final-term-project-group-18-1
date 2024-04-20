import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from './views/LandingPage.vue'
import About from './views/About.vue'
import Login from './views/LoginPage.vue'
import SignUp from './views/SignUpPage.vue'
import HomePage from './views/HomePage.vue'
import ForgetPassword from './views/ForgetPasswordPage.vue'
import Farm from './views/FarmPage.vue';
import Calendar from './views/CalendarPage.vue';
import Infographics from './views/Resource/Infographics.vue'
import BlueBinLocator from './views/Resource/BlueBinLocator.vue'
import Settings from './views/Settings/Settings.vue'
import EditProfile from './views/Settings/EditProfile.vue'
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
    {
        path: '/searchResult /:searchQuery', //passing searchQuery as well as a route parameter 
        name: 'searchResult',
        component: () => import('./views/home/searchResult.vue'), // this allow for java modules to load asynchronously, the component is loaded only when route is actually visited by user
        props: true // Enables the route to accept props, allowing the passing of searchQuery directly as a prop
      },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

export default router