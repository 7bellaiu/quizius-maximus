<script setup>
import { onMounted } from 'vue';

//wird von Game angesteuert, um ein neues Spiel in Firebase anzulegen
//liefert via emit die Id des entsprechenden Document an Game zurück

// for tests
const createdGameDocId = "BKsysKXVT2zooj1AAtty";

// Definition der Emits
const emit = defineEmits(["success", "failed"]);


// const createNewGame = async () => {
//     try {
//         await runTransaction(firestoreDB, async (transaction) => {
//             const newGameDoc = doc(collection(firestoreDB, "games"));
//             state.value.gameDocId = newGameDoc.id;
//             const { currentQuestion, userUID, userUsername } = state.value;
//             const { gameMode, moduleId, moduleLongname, moduleShortname } = props;

//             transaction.set(newGameDoc, {
//                 currentQuestion,
//                 gameMode,
//                 moduleID: moduleId,
//                 moduleLongname,
//                 moduleShortname,
//                 player1Status: 1,
//                 player1UID: userUID,
//                 player1Username: userUsername,
//                 player2Status: 0,
//                 player2UID: "",
//                 player2Username: ""
//             });

//             const questionnairesModuleID = await getDocs(query(
//                 collection(firestoreDB, "questionnaires"),
//                 where("moduleID", "==", moduleId)
//             ));

//             const moduleID = questionnairesModuleID.docs[0].id;

//             const questionnairesQuestions = await getDocs(query(
//                 collection(firestoreDB, "questionnaires", moduleID, "questions")
//             ));

//             const randomQuestions = questionnairesQuestions.docs
//                 .map(doc => ({ ...doc.data() }))
//                 .sort(() => 0.5 - Math.random())
//                 .slice(0, 5);

//             randomQuestions.forEach((question, index) => {
//                 const gamesQuestions = doc(collection(newGameDoc, "questions"));
//                 transaction.set(gamesQuestions, {
//                     ...question,
//                     player1IsCorrect: false,
//                     player2IsCorrect: false
//                 });

//                 if (index === 0) {
//                     state.value.questionData = question;
//                 }
//             });
//         });

//         state.value.message = "Neues Spiel erstellt.";
//     } catch (error) {
//         handleError(error, "Fehler der Spielerstellung.");
//     }
// };

onMounted(() => {
    // TODO: Übergabe der DocId nach erfolgreichem erstellen eines Spiels
    emit("success", createdGameDocId);
});

</script>

<template>
    <h1>Creating new Game</h1>
</template>