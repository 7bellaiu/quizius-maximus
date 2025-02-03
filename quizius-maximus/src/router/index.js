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
import ActiveQuizzes from '@/views/ActiveQuizzes.vue';
import CompetitiveGamemodes from '@/views/CompetitiveGamemodes.vue';
import Game from '@/views/Game.vue';
import Questionnaire from '@/views/Questionnaire.vue';
import Result from '@/views/Result.vue';
import SchnellComp from '@/components/gamemodes/SchnellComp.vue';

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
            path: "/questionnaire/:action/:moduleid",
            name: "questionnaire",
            component: Questionnaire,
            props: true
        },
        {
            path: '/activequizzes',
            name: 'activequizzes',
            component: ActiveQuizzes
        },
        {
            path: "/schnellcomp/:gameDocId/:userUID",
            name: "schnellcomp",
            component: SchnellComp,
            props: true
        },
        {
            path: '/result/:gameMode/:gameDocId',
            name: 'result',
            component: Result,
            props: true
        },
        {
            path: "/support",
            name: "support",
            component: Help
        },
        {
            path: '/compgamemodes/:moduleId/:moduleShortname/:moduleLongname',
            name: 'compgamemodes',
            component: CompetitiveGamemodes,
            props: true,  // URL-Params --props---> view
        },
        {
            path: '/game/:moduleId/:moduleShortname/:moduleLongname/:gameMode',
            name: 'game',
            component: Game,
            props: true
        },
    ]
});

export default router;