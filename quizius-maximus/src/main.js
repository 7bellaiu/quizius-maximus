import 'bootstrap/dist/js/bootstrap.bundle.js'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { initializeApp } from 'firebase/app'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

//global Vue components
import AppHeader from './components/global/AppHeader.vue'
import Toast from './components/global/Toast.vue'
import AppLogo from './components/global/AppLogo.vue'
import LogoutButton from './components/global/LogoutButton.vue'
import AppFooter from './components/global/AppFooter.vue'
import { getFirestore } from 'firebase/firestore'

//firebase config to access APIs
const firebaseConfig = {
    apiKey: "AIzaSyARCmMDIU5LPjBMj_v_tYrhcUh8Aloynpo",
    authDomain: "isef01-quizius-maximus-v2.firebaseapp.com",
    projectId: "isef01-quizius-maximus-v2",
    storageBucket: "isef01-quizius-maximus-v2.firebasestorage.app",
    messagingSenderId: "555791080708",
    appId: "1:555791080708:web:c890c0d237eb00c2764451"
};

const firebaseApp = initializeApp(firebaseConfig);
const firestoreDB = getFirestore(firebaseApp);

const app = createApp(App)
app.use(router);

//global registrtration of components
app.component('AppHeader', AppHeader);
app.component('Toast', Toast);
app.component('AppLogo', AppLogo);
app.component('LogoutButton', LogoutButton);
app.component('AppFooter', AppFooter);

app.mount('#app')

export { firestoreDB };
