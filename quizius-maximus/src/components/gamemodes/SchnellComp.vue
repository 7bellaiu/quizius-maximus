<script setup>
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
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
const MAX_QUESTIONS_SCHNELL_COMP = 5;
const GAMEMODE_SCHNELL_COMP = "Kompetitiv - Schnelles Quiz";

const quizData = ref(null);
const questionsData = ref([]); // Speichert die Fragen
const player1Score = ref(0);
const player2Score = ref(0);
const displayScore = ref(false);

const isPlayer1 = computed(() => player1UID.value == props.userUID);
const player1UID = computed(() => quizData.value?.player1UID);
const player2UID = computed(() => quizData.value?.player2UID);
// const isDataFetchCompleted = computed(() => quizData.value && questionsData.value.length > 0);
const isDataFetchCompleted = ref(false);

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
    if (!isPlayer1.value) {
        //TODO: GameDoc aktualisieren
        //Score von Spieler 2 setzen
        player2Score.value = playerScore;
        //Game-Status setzen (->4 Ergebnis anzeigen)
        //TODO
        //Weiterleiten auf Result
        router.push({
            name: 'result',
            params: {
                gameMode: quizData.value?.gameMode,
                gameDocId: props.gameDocId
            }
        })
    } else {
        //TODO: GameDoc aktualisieren
        //1. Score von Spieler 1 setzen
        player1Score.value = playerScore;
        //2. Game-Status setzen (->2 Suche Gegner)
        //TODO 
        //Weiterleiten auf activequizzes
        router.push('/activequizzes');
    }
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
</template>
