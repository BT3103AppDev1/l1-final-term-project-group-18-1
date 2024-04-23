import { createRouter, createWebHistory } from 'vue-router'
import About from './views/About.vue'
import Login from './views/LoginPage.vue'
import SignUp from './views/SignUpPage.vue'
import HomePage from './views/HomePage.vue'
import ForgetPassword from './views/ForgetPasswordPage.vue'
import Farm from './views/FarmPage.vue';
import Shop from './components/ShopModal.vue'
import CalendarPage from './views/Calendar/CalendarPage.vue';
import EventsPage from './views/Calendar/EventsPage.vue'
import Infographics from './views/Resources/Infographics.vue'
import ThriftLocator from './views/Resources/ThriftLocator.vue'
import Settings from './views/Settings/Settings.vue'
import Profile from './views/Settings/Profile.vue'
import Notifications from './views/Settings/Notifications.vue'
import ContactUs from './views/Settings/ContactUs.vue'
import SearchPage from './views/home/SearchPage.vue'
import SocialPage from './views/SocialPage.vue'
import AddReminderModal from '@/components/AddReminderModal.vue';
import ResourcesPage from './views/Resources/ResourcesPage.vue'
import EmailVerification from './views/EmailVerificationPage.vue'

const routes = [
    {
        path: '/',
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
        component: EmailVerification,
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
    },
    {
        path: '/SocialPage',
        name: 'SocialPage',
        component: SocialPage,
    },
    {
        path: '/Shop',
        name: 'Shop',
        component: Shop,
    },
    {
        path: '/Calendar',
        name: 'Calendar',
        component: CalendarPage,
    },
    {
        path: '/Events',
        name: 'Events',
        component: EventsPage,
        children: [
            {
                path: 'add-reminder',
                name: 'AddReminder',
                component: AddReminderModal,
            }
        ]
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
        path: '/resources/ThriftLocator',
        name: 'ThriftLocator',
        component: ThriftLocator,
    },
    {
        path: '/resources/ResourcesPage',
        name: 'ResourcesPage',
        component: ResourcesPage,
    }
    ,
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
    },
    {
        path: '/SearchPage/:searchQuery',
        name: 'SearchPage',
        component: SearchPage,
        props: true // Enables the route to accept props, allowing the passing of searchQuery directly as a prop
      },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

export default router