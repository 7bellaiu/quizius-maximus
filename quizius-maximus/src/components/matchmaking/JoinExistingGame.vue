<script setup>
import { doc, getDoc, updateDoc, runTransaction } from 'firebase/firestore';
import { firestoreDB } from "@/main";
import { onMounted, ref } from 'vue';
//wird von Game angesteuert, um den SPieler einem bestehenden Spiel zuzuweisen
//liefert via emit die Id des entsprechenden Spiel-Documents an Game zurück

// Definition der Props & Emits von/für Parent
const props = defineProps({
    gameDocId: {
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

// Bestehendes Spiel beitreten
const joinExistingGame = () => {
    const gameDocId = doc(firestoreDB, "games", props.gameDocId);

    // Spiel zur GameId lesen
    getDoc(gameDocId)
        .then((game) => {
            if (game.empty) throw new Error("Spiel existiert nicht!");

            const gameData = game.data();
            // if (gameData.player2Status !== 0) throw new Error("Spiel ist bereits voll!");

            if (gameData.player1UID === props.userUID) throw new Error("Du kannst nicht gegen dich selbst spielen!");

            return updateDoc(gameDocId, { //TODO: mit Transaction durchführen
                player2UID: props.userUID,
                player2Username: props.userUsername,
                gameState: 3, // 1 Spieler1 spielt, 2 Spieler1 sucht Gegenspieler, 3 Spieler2 spielt, 4 Spiel beendet
            });
        })
        .then(() => {
            state.value.message = "Erfolgreich dem Spiel beigetreten.";
            emit("success", props.gameDocId);
        })
        .catch((error) => {
            console.error("Fehler beim Beitreten des Spiels:", error);
            state.value.message = "Fehler beim Beitreten des Spiels.";
            emit("failed", error);
        });
};

onMounted(() => {
    if (!props.userUID || !props.userUsername) { // Wenn Benutzerdaten nicht erfolgreich gesammelt
        state.value.message = "Benutzerdaten konnten nicht geladen werden.";
        emit("failed", "Benutzerdaten fehlen");
    } else {
        joinExistingGame(); // Spiel beitreten
    }
});

</script>

<template>
</template>