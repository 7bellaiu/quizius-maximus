import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue';
import LoginForm from '@/components/authentication/LoginForm.vue';
import RegisterForm from '@/components/authentication/RegisterForm.vue';
import PrivacyPolicy from '@/components/PrivacyPolicy.vue';
import Imprint from '@/components/Imprint.vue';
import Profile from '@/views/Profile.vue';
import Modules from '@/views/Modules.vue';
import Help from '@/views/Help.vue';
import Questionnaires from '@/views/Questionnaires.vue';
import EditQuestionnaire from '@/views/EditQuestionnaire.vue';
import CreateQuestionnaire from '@/views/CreateQuestionnaire.vue';
import CompetitiveGamemodes from '@/views/CompetitiveGamemodes.vue';

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
        {
            path: "/profile",
            name: "profile",
            component: Profile
        },
        {
            path: "/modules",
            name: "modules",
            component: Modules
        },
        {
            path: "/questionnaires",
            name: "questionnaires",
            component: Questionnaires
        },
        {
            path: "/editquestionnaire/:moduleid",
            name: "editquestionnaire",
            component: EditQuestionnaire,
            props: true
        },
        {
            path: '/createquestionnaire',
            name: 'createquestionnaire',
            component: CreateQuestionnaire
        },
        {
            path: "/support",
            name: "support",
            component: Help
        },
        {
            path: "/compgamemodes",
            name: "compgamemodes",
            component: CompetitiveGamemodes
        },
    ]
});

export default router;