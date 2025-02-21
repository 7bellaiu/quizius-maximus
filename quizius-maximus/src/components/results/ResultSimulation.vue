<script setup>
import { ref, onMounted, computed } from 'vue';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firestoreDB } from "@/main";
import TrophyIcon from '@/components/icons/TrophyIcon.vue';
import { useRouter } from 'vue-router';
import EmojiSunglassesIcon from '../icons/EmojiSunglassesIcon.vue';
import EmojiFrownIcon from '../icons/EmojiFrownIcon.vue';
import EmojiTearIcon from '../icons/EmojiTearIcon.vue';
import EmojiSmileIcon from '../icons/EmojiSmileIcon.vue';
import PersonIcon from '../icons/PersonIcon.vue';

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

const calculateGrade = (percentage) => {
    // iu-Notenschlüssel
    if (percentage >= 96) return 1.0;
    if (percentage >= 91) return 1.3;
    if (percentage >= 86) return 1.7;
    if (percentage >= 81) return 2.0;
    if (percentage >= 76) return 2.3;
    if (percentage >= 71) return 2.7;
    if (percentage >= 66) return 3.0;
    if (percentage >= 61) return 3.3;
    if (percentage >= 56) return 3.7;
    if (percentage >= 50) return 4.0;
    return 5.0;
};

const determineUserStatus = computed(() => {
    if (!currentUser.value) return '';
    const userPlayer = sortedPlayers.value.find(player => player.username === currentUser.value.displayName);
    if (!userPlayer) return '';

    const percentage = (userPlayer.score / 20) * 100;
    const grade = calculateGrade(percentage);

    if (grade === 5.0) {
        return `Oh nein, leider durchgefallen! (Note: ${grade})`;
    } else {
        return `Herzlichen Glückwunsch! Du hast bestanden (Note: ${grade})`;
    }
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
    <div class="container">
        <h2 class="text-center mb-3 mt-3 p-3">
            <PersonIcon class="me-3 text-danger" width="30" height="30" />
            <span>Prüfungssimulation</span><br>
            Auswertung
        </h2>

        <div class="col-lg-6 col-md-8 mx-auto">
            <div class="card border-info">
                <div class="card-header bg-info bg-opacity-50 text-bg-info">
                    <h6 class="card-title">
                        <div class="row">
                            <div class="col-3">Platzierung</div>
                            <div class="col">Benutzername</div>
                            <div class="col-3">Punktzahl</div>
                        </div>
                    </h6>
                </div>

                <div class="card-body">
                    <div class="row" v-for="(player, index) in sortedPlayers" :key="index">
                        <div class="col-3 d-flex align-items-center">
                            <TrophyIcon class="text-warning me-2" v-if="player.rank === 1" />
                            <TrophyIcon class="text-secondary me-2" v-if="player.rank === 2" />
                            <strong> {{ player.rank }}. </strong>
                        </div>
                        <div class="col">{{ player.username }}</div>
                        <div class="col-3">{{ player.score }}</div>
                    </div>
                </div>

                <div class="card-footer bg-info bg-opacity-25 text-bg-info border-info text-center">
                    <strong>
                        <h4 v-if="determineUserStatus">{{ determineUserStatus }}</h4>
                        <EmojiSmileIcon class="me-2" width="100" height="100"
                            v-if="determineUserStatus.includes('Herzlichen Glückwunsch!')" />
                        <EmojiTearIcon class="me-2" width="100" height="100"
                            v-if="determineUserStatus.includes('Oh nein, leider durchgefallen!')" />
                    </strong>
                </div>
            </div>
        </div>

        <div class="d-flex justify-content-center mt-5">
            <router-link class="btn btn-outline-primary m-1" to="/activequizzes">Zurück</router-link>
            <button class="btn btn-primary m-1" @click="completeQuiz">Quiz abschließen</button>
        </div>
        <div class="mt-5"></div>
    </div>
</template>