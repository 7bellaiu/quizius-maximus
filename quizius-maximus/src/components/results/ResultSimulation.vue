<script setup>
import { ref, onMounted, computed } from 'vue';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firestoreDB } from "@/main";
import TrophyIcon from '@/components/icons/TrophyIcon.vue';
import { useRouter } from 'vue-router';
import EmojiSunglassesIcon from '../icons/EmojiSunglassesIcon.vue';
import EmojiFrownIcon from '../icons/EmojiFrownIcon.vue';

const props = defineProps({
    gameDocId: {
        type: String,
        required: true
    }
});

const gameData = ref(null);
const sortedPlayers = ref([]);
const currentUser = ref(null);
const router = useRouter();

const buildResult = () => {
    getDoc(doc(firestoreDB, "games", props.gameDocId))
        .then(gameDoc => {
            if (gameDoc.exists()) {
                // Spieldaten sortieren für die Platzierungsvalidierung
                gameData.value = gameDoc.data();
                sortedPlayers.value = [
                    { username: gameData.value.player1Username, score: gameData.value.player1Score },
                    { username: gameData.value.player2Username, score: gameData.value.player2Score }
                ].sort((a, b) => b.score - a.score);

                // Platzierungen berechnen
                sortedPlayers.value.forEach((player, index) => {
                    if (index > 0 && player.score === sortedPlayers.value[index - 1].score) {
                        player.rank = sortedPlayers.value[index - 1].rank;
                    } else {
                        player.rank = index + 1;
                    }
                });
            } else {
                throw new Error("Spiel nicht gefunden!");
            }
        })
        .catch(error => {
            console.error("Fehler beim Laden der Spiel-Daten: ", error);
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
    const gameDocRef = doc(firestoreDB, "games", props.gameDocId);
    const auth = getAuth();
    const user = auth.currentUser;

    // Status des Spiels für aktuellen User auf abgeschlossen setzen
    const updateData = {};
    if (user.uid === gameData.value.player1UID) {
        updateData.player1Finished = true;
    } else if (user.uid === gameData.value.player2UID) {
        updateData.player2Finished = true;
    }

    updateDoc(gameDocRef, updateData)
        .then(() => {
            // collection statistics aktualisieren
            if (updateData.player1Finished || updateData.player2Finished) { // wenn ein User-Status finished ist -> Statistics nicht aktualisieren
                const statsDocRef = doc(firestoreDB, "statistics", user.uid);
                const opponentUID = user.uid === gameData.value.player1UID ? gameData.value.player2UID : gameData.value.player1UID;
                const opponentStatsDocRef = doc(firestoreDB, "statistics", opponentUID);

                return Promise.all([
                    updateStatistics(statsDocRef, user.uid, user.displayName),
                    updateStatistics(opponentStatsDocRef, opponentUID, user.uid === gameData.value.player1UID ? gameData.value.player2Username : gameData.value.player1Username)
                ]);
            }
        })
        .then(() => {
            // Nach erfolgreicher Aktualisierung zur ActiveQuizzes zurück navigieren
            router.push('/activequizzes');
        })
        .catch(error => {
            console.error("Fehler beim Aktualisieren des Spiels:", error);
        });
};

const updateStatistics = (statsDocRef, uid, username) => {
    return getDoc(statsDocRef)
        .then(statsDoc => {
            // neues Objekt: standardmäßig alle Werte auf 0 setzen
            const newStatsData = {
                userUID: uid,
                username: username,
                compCorrectAnswers: 0,
                compFalseAnswers: 0,
                coopCorrectAnswers: 0,
                coopFalseAnswers: 0
            };

            if (statsDoc.exists()) {
                const statsData = statsDoc.data();
                newStatsData.compCorrectAnswers = statsData.compCorrectAnswers;
                newStatsData.compFalseAnswers = statsData.compFalseAnswers;
                newStatsData.coopCorrectAnswers = statsData.coopCorrectAnswers;
                newStatsData.coopFalseAnswers = statsData.coopFalseAnswers;
            }

            if (uid === gameData.value.player1UID) {
                newStatsData.compCorrectAnswers += gameData.value.player1Score;
                newStatsData.compFalseAnswers += (20 - gameData.value.player1Score);
            } else if (uid === gameData.value.player2UID) {
                newStatsData.compCorrectAnswers += gameData.value.player2Score;
                newStatsData.compFalseAnswers += (20 - gameData.value.player2Score);
            }

            return setDoc(statsDocRef, newStatsData, { merge: true });
        });
};

onMounted(async () => {
    await buildResult();
    const auth = getAuth();
    currentUser.value = auth.currentUser;
});
</script>

<template>
    <h2 class="text-center mb-3 mt-4">
        <span>Kompetitiv - Prüfungssimulation</span><br>
        Auswertung
    </h2>

    <div class="col-lg-6 col-md-8 mx-auto mt-5">
        <div class="card border-info">
            <div class="card-header bg-info bg-opacity-50 text-bg-info">
                <h6 class="card-title">
                    <div class="row">
                        <div class="col"><strong>Platzierung</strong></div>
                        <div class="col"><strong>Benutzername</strong></div>
                        <div class="col"><strong>Punktzahl</strong></div>
                    </div>
                </h6>
            </div>

            <div class="card-body">
                <div class="row" v-for="(player, index) in sortedPlayers" :key="index">
                    <div class="col d-flex align-items-center">
                        <TrophyIcon class="text-warning me-2" v-if="player.rank === 1" />
                        <TrophyIcon class="text-secondary me-2" v-if="player.rank === 2" />
                        <strong> {{ player.rank }}. </strong>
                    </div>
                    <div class="col">{{ player.username }}</div>
                    <div class="col">{{ player.score }}</div>
                </div>
            </div>

            <div class="card-footer bg-info bg-opacity-25 text-bg-info border-info text-center">
                <strong>
                    <h4 v-if="determineUserStatus">{{ determineUserStatus }}</h4>
                    <EmojiSunglassesIcon class="me-2" width="100" height="100"
                        v-if="determineUserStatus === 'Herzlichen Glückwunsch!' || determineUserStatus === 'Unentschieden'" />
                    <EmojiFrownIcon class="me-2" width="100" height="100"
                        v-if="determineUserStatus === 'Leider hat es diesmal nur für den 2. Platz gereicht!'" />
                </strong>
            </div>
        </div>
    </div>

    <div class="d-flex justify-content-center mt-3">
        <router-link class="btn btn-outline-primary m-1" to="/activequizzes">Zurück</router-link>
        <button class="btn btn-primary m-1" @click="completeQuiz">Quiz abschließen</button>
    </div>
</template>