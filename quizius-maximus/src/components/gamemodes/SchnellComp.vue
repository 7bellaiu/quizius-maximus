<script setup>
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { firestoreDB } from "@/main";
import { computed, onMounted, ref } from 'vue';
import Quiz from '../quiz/Quiz.vue';

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
const MAX_QUESTIONS_SCHNELL_COMP = 5;
const GAMEMODE_SCHNELL_COMP = "Kompetitiv - Schnelles Spiel";
const quizData = ref(null);
const questionsData = ref([]); // Speichert die Fragen
const isPlayer1 = computed(() => player1UID.value == props.userUID);
const player1UID = computed(() => quizData.value?.player1UID);
const player2UID = computed(() => quizData.value?.player2UID);
const player1Status = computed(() => quizData.value?.player1Status);
const player2Status = computed(() => quizData.value?.player2Status);
const currentQuestion = computed(() => quizData.value?.currentQuestion);
const isDataFetchCompleted = computed(() => quizData.value && questionsData.value.length > 0);

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

onMounted(() => {
    // Zuerst Spiel-Daten abrufen, dann Fragen-Daten abrufen
    fetchQuizDataById(props.gameDocId)
        .then(() => {
            // Nur aufrufen, wenn fetchQuizDataById erfolgreich war
            fetchQuestions(props.gameDocId);
        });
});
</script>

<template>
    <Quiz v-if="isDataFetchCompleted" :questions="questionsData" :current-question="currentQuestion"
        :total-questions="MAX_QUESTIONS_SCHNELL_COMP" :game-mode="GAMEMODE_SCHNELL_COMP" />
</template>
