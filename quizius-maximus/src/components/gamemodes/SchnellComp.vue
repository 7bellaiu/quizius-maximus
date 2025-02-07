<script setup>
import { collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { firestoreDB } from "@/main";
import { computed, onMounted, ref } from 'vue';
import Quiz from '../quiz/Quiz.vue';
import { useRouter } from 'vue-router';

// Steuert ein Schnelles Spiel im Competitive Mode
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
const GAMEMODE_SCHNELL_COMP = "Kompetitiv - Schnelles Quiz";
const quizData = ref(null);
const questionsData = ref([]); // Speichert die Fragen
const isDataFetchCompleted = ref(false);
const displayErrorMessage = ref(false);
const errorMessageText = ref('');

// Erkennen, ob Spieler1 oder Spieler2 angemeldet ist
const isPlayer1 = computed(() => player1UID.value == props.userUID);
const player1UID = computed(() => quizData.value?.player1UID);

// Methode zum Abrufen der Spiel-Kopfdaten mit einer Spiel-ID
const fetchQuizDataById = (documentId) => {
    const gameDocRef = doc(firestoreDB, "games", documentId);

    return getDoc(gameDocRef)  // Rückgabe des Promises
        .then((gameDocSnap) => {
            if (gameDocSnap.exists()) {
                quizData.value = gameDocSnap.data(); // Speichert die Spieldaten
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
            if (!isPlayer1) {
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
            if (!isPlayer1) {
                router.push({
                    name: 'result',
                    params: {
                        gameMode: quizData.value?.gameMode,
                        gameDocId: props.gameDocId
                    }
                })
            } else {
                router.push('/activequizzes');
            }
        })
        .catch((error) => {
            // TODO: Stattdessen Toast
            console.error("Fehler beim Aktualisieren des Dokuments:", error);
            errorMessageText.value = "Fehler beim Aktualisieren des Dokuments.";
            displayErrorMessage.value = true;
        });
}

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
    <Quiz v-if="isDataFetchCompleted" :questions="questionsData" :game-mode-longtext="GAMEMODE_SCHNELL_COMP"
        @finished="handleFinished" />
    <h1 v-if="displayErrorMessage" class="text-center text-danger">{{ errorMessageText }}</h1>
</template>
