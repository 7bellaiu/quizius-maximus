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

        <div class="w-100 mt-4">
            <div class="card border-top border-bottom border-secondary">
                <div class="card-body bg-secondary bg-opacity-10 d-flex justify-content-between align-items-center">
                    <div class="col">
                        <router-link class="text-dark"
                            :to="{ name: 'questionnaire', params: { action: 'create', moduleid: 0 } }">
                            Neuen Fragenkatalog anlegen
                        </router-link>
                    </div>
                    <div class="col">
                        <router-link to="/questionnaires" class="text-dark">Fragenkataloge</router-link>
                    </div>
                    <div class="col-auto">
                        <router-link class="btn btn-info border-info text-white m-1" to="/modules">
                            Quiz starten
                        </router-link>
                    </div>
                </div>
            </div>
        </div>

        <fieldset v-if="userLoggedIn" class="w-100 text-center mt-4">
            <h2 class="mb-3 text-center">Herzlich Willkommen in der Community {{ userName }}!</h2>
        </fieldset>

        <div class="container mt-3">
            <div class="row justify-content-center">
                <div class="col-md-8 mb-3">
                    <div class="card border-info">
                        <div class="card-body text-center bg-info bg-opacity-10 text-bg-info">
                            <h4>How to</h4>
                            <router-link to="/support" class="text-dark">
                                <p>Wie funktioniert Quizius Maximus?</p>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row justify-content-center">
                <div class="col-md-4 mb-3">
                    <div class="card border-info">
                        <div class="card-body bg-info bg-opacity-50 text-bg-info">
                            <h4>Meine Quizze:</h4>
                            <p>Test</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 mb-3">
                    <div class="card border-info">
                        <div class="card-body bg-info bg-opacity-50 text-bg-info">
                            <h4>Neue Funktionen:</h4>
                            <p>Test</p>
                        </div>
                    </div>
                </div>
            </div>

        <div class="row justify-content-center">
            <div class="col-md-8 mb-3">
                <div class="card border-info">
                    <div class="card-body bg-info bg-opacity-10 text-bg-info">
                        <h4 class="text-center">Coming Soon</h4>
                        <p><u>Das erwartet dich in den nächsten Updates:</u><br>
                            <strong>Prüfungssimulation:</strong> Ergänzung von Modulklausuren - Auswahl zwischen 45
                            min und 90 min<br>
                            <strong>Gruppenspiele:</strong> Spiele in größeren Gruppen von 3-10 Studierenden <br>
                            <strong>Avatare:</strong> Erstellung eigener Avatare (besondere Avatare käuflich
                            erwerblich) <br>
                            <strong>Einführung von Berechtigungen:</strong> Wer darf was? - Individuelle Einstellung
                            für jeden Fragenkatalog bereits bei der Erstellung möglich, um festzulegen, wer
                            angelegte Fragenkataloge bearbeiten und löschen darf <br>
                            <strong>Personalisierte Fragenkataloge:</strong> Entscheide selbst, wer deine
                            Fragenkataloge sehen darf - nur du selbst oder auch die Community
                        </p>
                    </div>
                </div>
            </div>
        </div>
        </div>

        <div class="d-flex align-items-center mt-3 mb-5">
            <AppLogo variant="dark" />
            <h2 class="text-info mx-3">Wissen wie von Zauberhand in deinem Kopf</h2>
            <AppLogo variant="dark" style="transform: scaleX(-1);" />
        </div>

        <div class="mt-auto mb-3">
            <LogoutButton />
        </div>
    </main>
</template>