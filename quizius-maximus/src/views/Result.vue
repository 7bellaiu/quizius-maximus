<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import ResultSchnellComp from '@/components/results/ResultSchnellComp.vue';
import ResultSchnellCoop from '@/components/results/ResultSchnellCoop.vue';
import ResultSimulation from '@/components/results/ResultSimulation.vue';

const route = useRoute();
const gameMode = route.params.gameMode;
const gameDocId = route.params.gameDocId;

// Dynamisches Rendering der entsprechenden Komponente basierend auf dem gameMode
const currentComponent = computed(() => {
    switch (gameMode) {
        case 'schnell_comp':
            return ResultSchnellComp;
        case 'schnell_coop':
            return ResultSchnellCoop;
        case 'simul':
            return ResultSimulation;
        default:
            return null;
    }
});
</script>

<template>
    <component :is="currentComponent" :gameDocId="gameDocId" />
</template>



<!-- <script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firestoreDB } from "@/main";
import TrophyIcon from '@/components/icons/TrophyIcon.vue';

const props = defineProps({
    gameMode: {
        type: String,
        required: true
    },
    moduleShortname: {
        type: String,
        required: true
    },
    moduleLongname: {
        type: String,
        required: true
    },
    gameId: {
        type: String,
        required: true
    }
});

const router = useRouter();
const gameData = ref(null);
const player1Score = ref(0);
const player2Score = ref(0);
const sortedPlayers = ref([]);
const currentUser = ref(null);

const buildResult = () => {
    const gameQuery = doc(firestoreDB, "games", props.gameId);
    getDoc(gameQuery)
        .then((gameDoc) => {
            if (gameDoc.exists()) {
                gameData.value = gameDoc.data();

                // Unterkollektion questions selektieren
                const questionsQuery = collection(gameQuery, "questions");
                return getDocs(questionsQuery);
            } else {
                throw new Error("Spiel nicht gefunden!");
            }
        })
        .then((questionsDoc) => {
            const questions = [];
            questionsDoc.forEach((doc) => {
                questions.push(doc.data());
            });

            // Scores berechnen
            player1Score.value = questions.filter(q => q.player1IsCorrect).length;
            player2Score.value = questions.filter(q => q.player2IsCorrect).length;

            // Spieler sortieren
            sortedPlayers.value = [
                { username: gameData.value.player1Username, score: player1Score.value },
                { username: gameData.value.player2Username, score: player2Score.value }
            ].sort((a, b) => b.score - a.score);

            // Platzierungen berechnen
            sortedPlayers.value.forEach((player, index) => {
                if (index > 0 && player.score === sortedPlayers.value[index - 1].score) {
                    player.rank = sortedPlayers.value[index - 1].rank;
                } else {
                    player.rank = index + 1;
                }
            });
        })
        .catch((error) => {
            console.error("Fehler beim Abrufen des Spiels:", error);
        });
};

const determineUserStatus = computed(() => {
    if (!currentUser.value) return '';
    const userPlayer = sortedPlayers.value.find(player => player.username === currentUser.value.displayName);
    if (!userPlayer) return '';

    const otherPlayer = sortedPlayers.value.find(player => player.username !== currentUser.value.displayName);
    if (userPlayer.rank === otherPlayer.rank) {
        return 'Unentschieden';
    }
    return userPlayer.rank === 1 ? 'Herzlichen Glückwunsch!' : 'Leider hat es diesmal nur für den 2. Platz gereicht!';
});

// Quiz abschließen Logik
const completeQuiz = () => {
   /*  const gameDocRef = doc(firestoreDB, "games", props.gameId);
    updateDoc(gameDocRef, {
        // Beispiel: Status des Spiels auf abgeschlossen setzen
        status: 'completed'
    })
        .then(() => {
            // Nach erfolgreicher Aktualisierung zur gewünschten Route navigieren
            router.push('/activequizzes');
        })
        .catch((error) => {
            console.error("Fehler beim Aktualisieren des Spiels:", error);
        }); */
};


onMounted(() => {
    buildResult();
    const auth = getAuth();
    currentUser.value = auth.currentUser;
});
</script>

<template>
    <h1 class="fw-light text-center mb-3 mt-5">
        <span v-if="props.gameMode === 'schnell_comp'">Kompetitiv - Schnelles Spiel</span>
        <span v-if="props.gameMode === 'schnell_coop'">Kooperativ - Schnelles Spiel</span><br>
        {{ props.moduleShortname }} {{ props.moduleLongname }}<br>
        Auswertung
    </h1>

    <div class="col-lg-6 col-md-8 mx-auto mt-5">
        <div class="card border-info">
            <div class="card-header bg-info bg-opacity-50 text-bg-info">
                <h5 class="card-title">
                    <div class="row">
                        <div class="col"><strong>Platzierung</strong></div>
                        <div class="col"><strong>Benutzername</strong></div>
                        <div class="col"><strong>Punktzahl</strong></div>
                    </div>
                </h5>
            </div>

            <div class="card-body">
                <p class="card-text">
                <div class="row" v-for="(player, index) in sortedPlayers" :key="index">
                    <div class="col d-flex align-items-center">
                        <TrophyIcon class="text-warning me-2" v-if="player.rank === 1" />
                        <TrophyIcon class="text-secondary me-2" v-if="player.rank === 2" />
                        <strong> {{ player.rank }}. </strong>
                    </div>
                    <div class="col">{{ player.username }}</div>
                    <div class="col">{{ player.score }}</div>
                </div>
                </p>
            </div>

            <div class="card-footer bg-info bg-opacity-25 text-bg-info border-info text-center">
                <strong>
                    <p v-if="determineUserStatus">{{ determineUserStatus }}</p>
                    <TrophyIcon
                        :class="determineUserStatus === 'Herzlichen Glückwunsch!' || determineUserStatus === 'Unentschieden' ? 'text-warning' : 'text-secondary'"
                        class="me-2" width="100" height="100" />
                </strong>
            </div>
        </div>
    </div>

    <div class="d-flex justify-content-center mt-3">
        <router-link class="btn btn-outline-primary m-1" to="/activequizzes">Zurück</router-link>
        <button class="btn btn-primary m-1" @click="completeQuiz">Quiz abschließen</button>
    </div>
</template> -->