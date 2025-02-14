<script setup>
import { collection, doc, getDocs, query, runTransaction, where } from 'firebase/firestore';
import { firestoreDB } from "@/main";
import { onMounted, ref } from 'vue';

// Definition der Props & Emits von/für Parent
const props = defineProps({
    gameMode: {
        type: String,
        required: true
    },
    moduleId: {
        type: String,
        required: true
    },
    moduleLongname: {
        type: String,
        required: true
    },
    moduleShortname: {
        type: String,
        required: true
    },
    userUID: {
        type: String,
        required: true
    },
    userUsername: {
        type: String,
        required: true
    }
});
const emit = defineEmits(["success", "failed"]);

// state
const state = ref({
    createdGameDocId: "",
    questionData: null,
    message: "",
});

const QUESTIONS_PER_GAMEMODE = {
    schnell: 5,
    theme: 5,
    simul: 20,
    learn: 0 // Initial auf 0 setzen, da die Anzahl dynamisch ermittelt wird - ALLE existierenden Fragen zum Modul
}

// Fragen zum Modul lesen  &  X Fragen je nach Spielmodus auswählen
const fetchQuestionsForModule = () => {
    const { moduleId, gameMode } = props;

    return getDocs(query(collection(firestoreDB, "questionnaires"), where("moduleID", "==", moduleId)))
        .then((questionnaires) => {
            if (questionnaires.empty) throw new Error("Kein Fragebogen gefunden!");
            const moduleID = questionnaires.docs[0].id;

            return getDocs(query(collection(firestoreDB, "questionnaires", moduleID, "questions")));
        })
        .then((questions) => {
            if (questions.empty) throw new Error("Keine Fragen gefunden!");

            // Wenn Spielmodus learn, alle Fragen auswählen
            if (gameMode === 'learn') {
                QUESTIONS_PER_GAMEMODE.learn = questions.docs.length;
            }

            const numQuestions = QUESTIONS_PER_GAMEMODE[gameMode] || 5; // Standard auf 5 Fragen

            // Zufällige X Fragen auswählen, basierend auf Spielmodus
            const selectedQuestions = questions.docs
                .map((doc) => ({ ...doc.data() }))
                .sort(() => 0.5 - Math.random()) // Shuffle
                .slice(0, numQuestions);

            state.value.questionData = selectedQuestions[0]; // Erste Frage speichern
            return selectedQuestions; // Gibt die Fragen zurück
        });
};

// Neues GameDoc anlagen
const createNewGame = () => {
    const newGameDoc = doc(collection(firestoreDB, "games"));
    state.value.gameDocId = newGameDoc.id;

    runTransaction(firestoreDB, (transaction) => {
        transaction.set(newGameDoc, {
            gameMode: props.gameMode,
            moduleID: props.moduleId,
            moduleLongname: props.moduleLongname,
            moduleShortname: props.moduleShortname,
            player1UID: props.userUID,
            player1Username: props.userUsername,
            player2UID: "",
            player2Username: "",
            gameState: 1,   //1 Spieler1 spielt, 2 Spieler1 sucht Gegenspieler, 3 Spieler2 spielt, 4 Spiel beendet
            player1Finished: false,
            player2Finished: false,
            player1Score: 0,
            player2Score: 0
        });

        return fetchQuestionsForModule().then((selectedQuestions) => {
            selectedQuestions.forEach((question) => {
                const gamesQuestions = doc(collection(newGameDoc, "questions"));
                transaction.set(gamesQuestions, {
                    ...question
                });
            });
        });
    })
        .then(() => {
            state.value.message = "Neues Spiel erstellt.";
            emit("success", state.value.gameDocId);
        })
        .catch((error) => {
            console.error("Fehler bei der Spiel-Erstellung:", error);
            state.value.message = "Fehler bei der Spiel-Erstellung.";
            emit("failed", error);
        });
};

onMounted(() => {
    if (!props.userUID || !props.userUsername) { // Wenn Benutzerdaten nicht erfolgreich gesammelt
        state.value.message = "Benutzerdaten konnten nicht geladen werden.";
        emit("failed", "Benutzerdaten fehlen");
    } else {
        createNewGame(); // Spiel erstellen
    }
});
</script>

<template>
</template>