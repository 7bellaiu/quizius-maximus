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
import SchnellCoop from '@/components/gamemodes/SchnellCoop.vue';
import Simulation from '@/components/gamemodes/Simulation.vue';
import Learning from '@/components/gamemodes/Learning.vue';
import SectionSelection from '@/components/gamemodes/SectionSelection.vue';
import ThemeComp from '@/components/gamemodes/ThemeComp.vue';
import ThemeCoop from '@/components/gamemodes/ThemeCoop.vue';

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
            path: "/schnellcoop/:gameDocId/:userUID",
            name: "schnellcoop",
            component: SchnellCoop,
            props: true
        },
        {
            path: "/simulation/:gameDocId/:userUID",
            name: "simulation",
            component: Simulation,
            props: true
        },
        {
            path: "/learning/:gameDocId/:userUID",
            name: "learning",
            component: Learning,
            props: true
        },
        {
            path: "/themecomp/:gameDocId/:userUID/:section",
            name: "themecomp",
            component: ThemeComp,
            props: true
        },
        {
            path: "/themecoop/:gameDocId/:userUID/:section",
            name: "themecoop",
            component: ThemeCoop,
            props: true
        },
        {
            path: '/result/:gameMode/:gameDocId/:gameState',
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
            path: '/game/:moduleId/:moduleShortname/:moduleLongname/:gameMode/:section?',
            name: 'game',
            component: Game,
            props: true
        },
        {
            path: '/sectionselection/:moduleId/:moduleShortname/:moduleLongname/:gameMode',
            name: 'sectionselection',
            component: SectionSelection,
            props: true
        },
    ]
});

export default router;