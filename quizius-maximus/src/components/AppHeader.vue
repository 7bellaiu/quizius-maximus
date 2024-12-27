<script setup>
import { ref, onMounted } from 'vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import router from '@/router';
import AppLogo from './AppLogo.vue';
import LogoutButton from './LogoutButton.vue';

const userLoggedIn = ref(false);

/** check whether user is logged in when loading this view*/
onMounted(() => {
    onAuthStateChanged(getAuth(), function (user) {
        if (!user) {
            userLoggedIn.value = false;
            router.push("/login");
        } else {
            userLoggedIn.value = true;
        }
    });
});
</script>

<template>
    <header class="navbar bg-dark p-2 d-flex justify-content-between" data-bs-theme="dark">
        <a href="/">
            <AppLogo variant="dark"/>
        </a>
        <a href="/" class="text-decoration-none" id="quizius-maximus">
            <span class="text-white p-1 h2">Quiz<span class="text-primary">iu</span>s Maximus</span>
        </a>
        <div v-if="!userLoggedIn" class="dropdown">
            <router-link type="button" class="btn btn-outline-primary" to="/register">Registrieren</router-link>
        </div>
        <div v-else>
            <button class="btn btn-dark navbar-toggler" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <span class="navbar-toggler-icon"></span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end  text-center">
                <li><router-link class="dropdown-item" to="/profile">Mein Profil</router-link></li>
                <li><router-link class="dropdown-item" to="/quizzes">Quiz starten</router-link></li>
                <li><router-link class="dropdown-item" to="/">Hilfe & Kontakt</router-link></li>
                <li>
                    <hr class="dropdown-divider" />
                </li>
                <li class="d-flex justify-content-center">
                     <LogoutButton />
                </li>
            </ul>
        </div>
    </header>
</template>

<style scoped>
#quizius-maximus {
    font-family: fantasy;
}
</style>
