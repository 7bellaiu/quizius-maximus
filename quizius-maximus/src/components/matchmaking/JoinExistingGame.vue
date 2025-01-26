<script setup>
import { doc, runTransaction } from 'firebase/firestore';
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
            if (gameData.player2Status !== 0) throw new Error("Spiel ist bereits voll!");

            if (gameData.player1UID === props.userUID) throw new Error("Du kannst nicht gegen dich selbst spielen!");

            return runTransaction(firestoreDB, (transaction) => {
                transaction.update(gameDocId, {
                    player2UID: props.userUID,
                    player2Username: props.userUsername,
                    player2Status: 2 // Status auf Laufend setzen
                });
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

// const joinExistingGame = async (existingGameDoc) => {
//     try {
//         const { userUID, userUsername, currentQuestion } = state.value; //Destrukturierung für weniger const Anweisungen
//         const existingGameData = existingGameDoc.data();

//         // laufendes Spiel existiert => Überprüfung, ob aktueller Benutzer bereits als player1 eingetragen ist
//         if (existingGameData.player1UID !== userUID) {
//             // Benutzer ist nicht player1 => wird als player2 dem Spiel zugewiesen
//             state.value.gameDocId = existingGameDoc.id;
//             await updateDoc(existingGameDoc.ref, {
//                 player2UID: userUID,
//                 player2Username: userUsername,
//                 player2Status: 1
//             });

//             const questionsData = await getDocs(collection(existingGameDoc.ref, "questions"));
//             state.value.questionData = questionsData.docs[currentQuestion].data();
//             state.value.message = "Du wurdest einem bestehenden Spiel zugewiesen.";
//         } else {
//             // Benutzer ist bereits player1 => neues Spiel erstellen
//             await createNewGame();
//         }
//     } catch (error) {
//         handleError(error, "Fehler beim Spielbeitritt.");
//     }
// };
</script>

<template>
    <h1>Joining existing Game</h1>
        <p>{{ state.message }}</p>
</template>