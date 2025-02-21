<script setup>
import { ref, onMounted, computed } from 'vue';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firestoreDB } from "@/main";
import TrophyIcon from '@/components/icons/TrophyIcon.vue';
import { useRouter } from 'vue-router';
import PersonArmsUpIcon from '../icons/PersonArmsUpIcon.vue';
import EmojiTearIcon from '../icons/EmojiTearIcon.vue';
import PeopleIcon from '../icons/PeopleIcon.vue';
import EmojiSmileIcon from '../icons/EmojiSmileIcon.vue';

const props = defineProps({
    gameDocId: {
        type: String,
        required: true
    }
});

const gameData = ref(null);
const currentUser = ref(null);
const router = useRouter();

const buildResult = () => {
    getDoc(doc(firestoreDB, "games", props.gameDocId))
        .then(gameDoc => {
            if (gameDoc.exists()) {
                gameData.value = gameDoc.data();
            } else {
                throw new Error("Spiel nicht gefunden!");
            }
        })
        .catch(error => {
            console.error("Fehler beim Laden der Spiel-Daten: ", error);
        });
};

// Prozentanteil der gemeinsam erzielten Punkte errechnen
const totalQuestions = 10;
const correctAnswers = computed(() => {
    if (gameData.value) {
        return gameData.value.player1Score + gameData.value.player2Score;
    }
    return 0;
});
const correctPercentage = computed(() => {
    return ((correctAnswers.value / totalQuestions) * 100).toFixed(1);
});

const resultMessage = computed(() => {
    if (correctPercentage.value >= 50) {
        return `Herzlichen Glückwunsch! Ihr habt ${correctPercentage.value}% erreicht!`;
    } else {
        return `Oh nein! Ihr habt leider nur ${correctPercentage.value}% erreicht!`;
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
                newStatsData.coopCorrectAnswers = statsData.coopCorrectAnswers;
                newStatsData.coopFalseAnswers = statsData.coopFalseAnswers;
                newStatsData.compCorrectAnswers = statsData.compCorrectAnswers;
                newStatsData.compFalseAnswers = statsData.compFalseAnswers;
            }

            if (uid === gameData.value.player1UID) {
                newStatsData.coopCorrectAnswers += gameData.value.player1Score;
                newStatsData.coopFalseAnswers += (5 - gameData.value.player1Score);
            } else if (uid === gameData.value.player2UID) {
                newStatsData.coopCorrectAnswers += gameData.value.player2Score;
                newStatsData.coopFalseAnswers += (5 - gameData.value.player2Score);
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
    <h2 class="text-center mb-3 mt-3 p-3">
        <PeopleIcon class="me-3 text-success" width="30" height="30" />
        <span>Schnelles Quiz</span><br>
        Auswertung
    </h2>

    <div v-if="gameData" class="d-flex justify-content-center">
        <div class="card border-info m-2"
            v-for="(player, index) in [gameData.player1Username, gameData.player2Username]" :key="index"
            style="width: 18rem;">
            <div class="card-header bg-info bg-opacity-50 text-bg-info">
                <h6 class="card-title">
                    <div class="row">
                        <div class="col">
                            <h6>Benutzername</h6>
                        </div>
                        <div class="col">
                            <h6>Punktzahl</h6>
                        </div>
                    </div>
                </h6>
            </div>

            <div class="card-body">
                <div class="row">
                    <div class="col">{{ player }}</div>
                    <div class="col">{{ index === 0 ? gameData.player1Score : gameData.player2Score }}</div>
                </div>
            </div>
        </div>
    </div>

    <div v-if="gameData" class="bg-opacity-25 text-center mt-3">
        <strong>
            <h4>{{ resultMessage }}</h4>
            <EmojiSmileIcon class="me-2" width="100" height="100"
                v-if="resultMessage.includes('Herzlichen Glückwunsch!')" />
            <EmojiTearIcon class="me-2" width="100" height="100" v-if="resultMessage.includes('Oh nein!')" />
        </strong>
    </div>

    <div class="d-flex justify-content-center mt-5">
        <router-link class="btn btn-outline-primary m-1" to="/activequizzes">Zurück</router-link>
        <button class="btn btn-primary m-1" @click="completeQuiz">Quiz abschließen</button>
    </div>
    <div class="mt-5"></div>
</template>