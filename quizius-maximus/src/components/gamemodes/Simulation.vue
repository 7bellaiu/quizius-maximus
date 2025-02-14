<script setup>
import { collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { firestoreDB } from "@/main";
import { computed, onMounted, ref } from 'vue';
import Quiz from '../quiz/Quiz.vue';
import { useRouter } from 'vue-router';

// Steuert ein Schnelles Spiel im Prüfungssimulation Mode
const props = defineProps({
    gameDocId: {
        type: String,
        required: true
    },
    userUID: {
        type: String,
        required: true
    },
});

// state
const router = useRouter();
const GAMEMODE_SIMUL = "Kooperativ - Prüfungssimulation";
const quizData = ref(null);
const questionsData = ref([]); // Speichert die Fragen
const isDataFetchCompleted = ref(false);
const displayErrorMessage = ref(false);
const errorMessageText = ref('');

// Erkennen, ob Spieler1 oder Spieler2 angemeldet ist
const player1UID = ref(null);
const isPlayer1 = computed(() => player1UID.value === props.userUID);

// Methode zum Abrufen der Spiel-Kopfdaten mit einer Spiel-ID
const fetchQuizDataById = (documentId) => {
    const gameDocRef = doc(firestoreDB, "games", documentId);

    return getDoc(gameDocRef)  // Rückgabe des Promises
        .then((gameDocSnap) => {
            if (gameDocSnap.exists()) {
                quizData.value = gameDocSnap.data(); // Speichert die Spieldaten
                player1UID.value = quizData.value.player1UID; // Setzt player1UID
                console.log("Spieldaten:", quizData.value);
            } else {
                console.error("Kein Spiel mit dieser ID gefunden.");
            }
        })
        .catch((error) => {
            console.error("Fehler beim Abrufen der Spieldaten:", error);
        });
};

// Methode zum Abrufen der Fragen aus der Unterkollektion "questions"
const fetchQuestions = (documentId) => {
    const questionsRef = collection(firestoreDB, "games", documentId, "questions");

    return getDocs(questionsRef)  // Rückgabe des Promises
        .then((querySnapshot) => {
            questionsData.value = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            console.log("Fragen:", questionsData.value);
        })
        .catch((error) => {
            console.error("Fehler beim Abrufen der Fragen:", error);
        });
};

// Handler für Spieler-Score
const handleFinished = (playerScore) => {
    const gameDocRef = doc(firestoreDB, "games", props.gameDocId);

    // Dokument zur GameId lesen
    getDoc(gameDocRef)
        .then((gameDoc) => {
            if (!gameDoc.exists()) throw new Error("Spiel existiert nicht!");

            // Dokument aktualisieren
            if (!isPlayer1.value) {
                return updateDoc(gameDocRef, {
                    player2Score: playerScore,
                    gameState: 4
                });
            } else {
                return updateDoc(gameDocRef, {
                    player1Score: playerScore,
                    gameState: 2
                });
            }
        })
        .then(() => {
            if (!isPlayer1.value) {
                router.push({
                    name: 'result',
                    params: {
                        gameMode: quizData.value?.gameMode,
                        gameDocId: props.gameDocId,
                        gameState: 4
                    }
                });
            } else {
                router.push({
                    name: 'result',
                    params: {
                        gameMode: quizData.value?.gameMode,
                        gameDocId: props.gameDocId,
                        gameState: 2
                    }
                });
            }
        })
        .catch((error) => {
            console.error("Fehler beim Aktualisieren des Dokuments:", error);
            // TODO: Stattdessen Toast
            errorMessageText.value = "Fehler beim Aktualisieren des Dokuments.";
            displayErrorMessage.value = true;
        });
};

onMounted(() => {
    // Zuerst Spiel-Daten abrufen, dann Fragen-Daten abrufen
    fetchQuizDataById(props.gameDocId)
        .then(() => {
            // Nur aufrufen, wenn fetchQuizDataById erfolgreich war
            fetchQuestions(props.gameDocId)
                .then(() => {
                    isDataFetchCompleted.value = true;
                });
        });
});
</script>

<template>
    <Quiz v-if="isDataFetchCompleted" :questions="questionsData" :game-mode-longtext="GAMEMODE_SIMUL"
        @finished="handleFinished" />
    <h1 v-if="displayErrorMessage" class="text-center text-danger">{{ errorMessageText }}</h1>
</template>
