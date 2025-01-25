<script setup>
import { doc, getDoc } from 'firebase/firestore';
import { firestoreDB } from "@/main";
import { onMounted, ref } from 'vue';

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
const isPlayer1 = ref(false);
const isPlaying = ref(false);
const currentQuestion = ref(0);
const quizData = ref(null)


// Methode zum Abrufen der Spieldaten mit einer Spiel-ID
const fetchQuizDataById = (documentId) => {
    const gameDocRef = doc(firestoreDB, "games", documentId);

    getDoc(gameDocRef)
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

onMounted(() => {
    //Spiel-Daten aus Firestore laden
    fetchQuizDataById(props.gameDocId);

    // 1 Who am I? -> S1 || S2
    // Mein Status?
    // CurrentQuestion?

});
</script>

<template>
    <h1> SchnellComp: {{ props.gameDocId }}</h1>
    <h2> Spieler: {{ props.userUID }}</h2>
    <p v-if="!quizData">No Quiz Data found</p>
    <p v-else>{{ quizData }}</p>
</template>