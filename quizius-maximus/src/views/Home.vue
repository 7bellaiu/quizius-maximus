<script setup>
import { ref, onMounted } from 'vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import router from '@/router';

const userLoggedIn = ref(false);
const userName = ref("");

/** check whether user is logged in when loading this view*/
onMounted(() => {
    onAuthStateChanged(getAuth(), function (user) {
        if (!user) {
            userLoggedIn.value = false;
            router.push("/login");
        } else {
            userLoggedIn.value = true;
            // TODO: Alternative finden, hier ist der Name leer, weil Profil-Update erst nach Auth-Creation ... onAuthStateChanged triggert schneller
            // => nach initialer Username-Vergabe leer, ab dann immer gefüllt
            userName.value = user.displayName;
        }
    });
});
</script>

<template>
    <main class="d-flex flex-column align-items-center">
        <fieldset v-if="userLoggedIn" class="w-100 text-center mt-3">
            <legend>Willkommen zurück {{ userName }}!</legend>
        </fieldset>

        <div class="container mt-3">
            <div class="row justify-content-center">
                <div class="col-md-8 mb-3">
                    <div class="card border-info">
                        <div class="card-body text-center bg-info bg-opacity-10 text-bg-info">
                            <h4>How to</h4>
                            <router-link to="/support">
                                <p>Wie funktioniert Quizius Maximus?</p>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col-md-8 mb-3">
                    <div class="card border-info">
                        <div class="card-body bg-info bg-opacity-10 text-bg-info">
                            <h4 class="text-center">Coming Soon</h4>
                            <p>Das erwartet dich im nächsten Update: <br>
                                <strong>Prüfungssimulation:</strong> Auch Modulklausuren - Auswahl zwischen 45 min und
                                90 min, je
                                nachdem, ob beide geschrieben werden <br>
                                <strong>Lektionen:</strong> Module werden in Lektionen aufgeteilt, wodurch noch
                                spezifischer gelernt
                                werden kann (Themenbasiertes Quiz) <br>
                                <strong>Gruppenspiele:</strong> Spiele in größeren Gruppen von 3-10 Studierenden <br>
                                <strong>Avatare:</strong> erweiterte Auswahl an Avataren (besondere Avatare käuflich
                                erwerblich)
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="d-flex align-items-center mt-3 mb-5">
            <AppLogo variant="dark" />
            <h2 class="text-info mx-3">Wissen wie von Zauberhand in deinem Kopf</h2>
            <AppLogo variant="dark" />
        </div>

        <div class="mt-auto mb-3">
            <LogoutButton />
        </div>
    </main>
</template>