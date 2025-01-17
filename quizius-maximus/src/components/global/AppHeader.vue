<script setup>
import { ref, onMounted } from 'vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRoute } from 'vue-router';
import router from '@/router';

const route = useRoute();
const userLoggedIn = ref(false);

/** check whether user is logged in when loading this view*/
onMounted(() => {
    onAuthStateChanged(getAuth(), function (user) {
        if (!user) {
            userLoggedIn.value = false;
            if (route.fullPath !== '/imprint' && route.fullPath !== '/privacypolicy' && route.fullPath !== '/support' ) {
                router.push("/login");
            }
        } else {
            userLoggedIn.value = true;
        }
    });
});
</script>

<template>
    <header data-bs-theme="dark">
        <nav class="bg-dark navbar d-flex justify-content-between align-items-center px-3">
            <!-- Linksbündiger Bereich -->
            <div class="d-flex col-2 justify-content-start">
                <router-link to="/">
                    <AppLogo variant="dark" />
                </router-link>
            </div>

            <!-- Mittlerer Bereich (zentriert & größer) -->
            <div class="col-6 text-center">
                <router-link class="text-white text-decoration-none h2" id="quizius-maximus" to="/">
                    Quiz<span class="text-info">iu</span>s Maximus
                </router-link>
            </div>

            <!-- Rechtsbündiger Bereich -->
            <div class="d-flex col-2 justify-content-end">
                <button class="btn btn-dark navbar-toggler" type="button" data-bs-toggle="dropdown"
                    aria-expanded="false">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <ul class="dropdown-menu dropdown-menu-end text-center">
                    <li v-if="!userLoggedIn"><router-link class="dropdown-item" to="/login">Anmelden</router-link></li>
                    <li v-if="!userLoggedIn"><router-link class="dropdown-item" to="/register">Zur
                            Registrierung</router-link></li>
                    <li v-if="userLoggedIn"><router-link class="dropdown-item" to="/profile">Mein Profil</router-link>
                    </li>
                    <li v-if="userLoggedIn"><router-link class="dropdown-item" to="/modules">Quiz starten</router-link>
                    </li>
                    <li v-if="userLoggedIn"><router-link class="dropdown-item"
                            to="/questionnaires">Fragenkataloge</router-link></li>
                    <li v-if="!userLoggedIn">
                        <hr class="dropdown-divider" />
                    </li>
                    <li>
                        <router-link class="dropdown-item" to="/support">
                            Hilfe & Kontakt
                        </router-link>
                    </li>
                    <li v-if="userLoggedIn">
                        <hr class="dropdown-divider" />
                    </li>
                    <li v-if="userLoggedIn" class="d-flex justify-content-center">
                        <LogoutButton />
                    </li>
                </ul>
            </div>
        </nav>
    </header>

</template>

<style scoped>
#quizius-maximus {
    font-family: fantasy;
}
</style>
