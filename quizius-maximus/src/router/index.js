import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue';
import LoginForm from '@/components/authentication/LoginForm.vue';
import RegisterForm from '@/components/authentication/RegisterForm.vue';
import PrivacyPolicy from '@/components/PrivacyPolicy.vue';
import Imprint from '@/components/Imprint.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",	//This is "where we are"
            name: "home", //Convention to name routes
            component: Home	//Component to be rendered if path is accessed
        },
        {
            path: "/login",
            name: "login",
            component: LoginForm
        },
        {
            path: "/register",
            name: "register",
            component: RegisterForm
        },
        {
            path: "/privacypolicy",
            name: "privacypolicy",
            component: PrivacyPolicy
        },
        {
            path: "/imprint",
            name: "imprint",
            component: Imprint
        },
    ]
});

export default router;