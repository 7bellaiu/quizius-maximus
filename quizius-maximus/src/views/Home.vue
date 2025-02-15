<script setup>
import { ref, onMounted } from 'vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { firestoreDB } from '@/main';
import { collection, query, where, getDocs, or } from 'firebase/firestore';
import router from '@/router';
import PersonIcon from '@/components/icons/PersonIcon.vue';
import PeopleIcon from '@/components/icons/PeopleIcon.vue';

const userLoggedIn = ref(false);
const userName = ref("");
const userUID = ref(null);
const games = ref([]);

/** check whether user is logged in when loading this view*/
onMounted(() => {
    onAuthStateChanged(getAuth(), function (user) {
        if (!user) {
            userLoggedIn.value = false;
            router.push("/login");
        } else {
            userLoggedIn.value = true;
            userName.value = user.displayName;
            userUID.value = user.uid;
            loadGames();
        }
    });
});

const loadGames = () => {
    if (userUID.value) {
        const gamesQuery = query(
            collection(firestoreDB, "games"),
            or(
                where("player1UID", "==", userUID.value),
                where("player2UID", "==", userUID.value)
            )
        );

        getDocs(gamesQuery)
            .then((gamesDoc) => {
                games.value = gamesDoc.docs.map(doc => {
                    const gameData = doc.data();
                    return { id: doc.id, ...gameData };
                }).filter(game => {
                    if (game.player1UID === userUID.value && game.player1Finished) {
                        return false;
                    }
                    if (game.player2UID === userUID.value && game.player2Finished) {
                        return false;
                    }
                    return true;
                });
            })
            .catch((error) => {
                console.error("Fehler beim Laden der Quizze: ", error);
            });
    }
};

const getStatusText = (game, status) => {
    switch (status) {
        case 1:
            return game.player1Username + " spielt";
        case 2:
            return "Suche Gegenspieler";
        case 3:
            return game.player2Username + " spielt";
        case 4:
            return "Ergebnisse anzeigen";
        default:
            return "Unbekannter Status";
    }
};
</script>

<template>
    <main class="d-flex flex-column align-items-center">
        <div class="w-100 mt-4">
            <div class="card border-0 rounded">
                <div class="card-body bg-secondary bg-opacity-10 d-flex justify-content-between align-items-center rounded">
                    <div class="col">
                        <router-link class="text-dark" :to="{ name: 'questionnaire', params: { action: 'create', moduleid: 0 } }">
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
                <div class="col-md-4 mb-3">
                    <div class="card border-0 rounded">
                        <div class="card-body text-center bg-info bg-opacity-10 text-bg-info rounded">
                            <h4>How to</h4>
                            <router-link to="/support" class="text-dark">
                                <p>Wie funktioniert Quizius Maximus?</p>
                            </router-link>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 mb-3">
                    <div class="card border-0 rounded">
                        <div class="card-body bg-info bg-opacity-10 text-bg-info rounded">
                            <h4>Neue Funktionen:</h4>
                            <p>Test</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row justify-content-center">
                <div class="col-md-8 mb-3">
                    <router-link to="/activequizzes" class="text-dark text-decoration-none">
                        <div class="card border-0 rounded">
                            <div class="card-body bg-info bg-opacity-50 text-bg-info rounded">
                                <h4>Meine Quizze:</h4>
                                <div v-for="game in games" :key="game.id" class="mb-2">
                                    <p>
                                        <span v-if="game.gameMode === 'schnell_comp'">
                                            <PersonIcon class="text-danger me-2" />Schnelles Quiz:
                                        </span>
                                        <span v-if="game.gameMode === 'schnell_coop'">
                                            <PeopleIcon class="text-success me-2" />Schnelles Quiz:
                                        </span>
                                        <span v-if="game.gameMode === 'simul'">
                                            <PersonIcon class="text-danger me-2" />Prüfungssimulation:
                                        </span>
                                        <span v-if="game.gameMode === 'learn'">
                                            <PeopleIcon class="text-success me-2" />Lernmodus:
                                        </span>({{ game.moduleShortname }}) {{ game.moduleLongname }}
                                        <br>
                                        <strong>Status:</strong> {{ getStatusText(game, game.gameState) }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </router-link>
                </div>
            </div>

            <div class="row justify-content-center">
                <div class="col-md-8 mb-3">
                    <div class="card border-0 rounded">
                        <div class="card-body bg-info bg-opacity-10 text-bg-info rounded">
                            <h4 class="text-center">Coming Soon</h4>
                            <u>Das erwartet dich in den nächsten Updates:</u>
                            <ul>
                                <li><strong>Prüfungssimulation:</strong> Ergänzung von Modulklausuren - Auswahl zwischen 45 min und 90 min</li>
                                <li><strong>Gruppenspiele:</strong> Spiele in größeren Gruppen von 3-10 Studierenden</li>
                                <li><strong>Avatare:</strong> Erstellung eigener Avatare (besondere Avatare käuflich erwerblich)</li>
                                <li><strong>Einführung von Berechtigungen:</strong> Wer darf was? - Individuelle Einstellung für jeden Fragenkatalog bereits bei der Erstellung möglich, um festzulegen, wer angelegte Fragenkataloge bearbeiten und löschen darf</li>
                                <li><strong>Personalisierte Fragenkataloge:</strong> Entscheide selbst, wer deine Fragenkataloge sehen darf - nur du selbst oder auch die Community</li>
                                <li><strong>Einfügen von Abbildungen:</strong> In Fragenkataloge können auch Abbildungen eingefügt werden</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="d-flex align-items-center mt-3 mb-5">
            <AppLogo variant="dark" />
            <h2 class="text-info text-center mx-3">Wissen wie von Zauberhand in deinem Kopf</h2>
            <AppLogo variant="dark" style="transform: scaleX(-1);" />
        </div>

        <div class="mt-auto mb-3">
            <LogoutButton />
        </div>
    </main>
</template>