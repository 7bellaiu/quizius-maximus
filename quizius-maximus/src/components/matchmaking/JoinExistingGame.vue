<script setup>
//wird von Game angesteuert, um den SPieler einem bestehenden Spiel zuzuweisen
//liefert via emit die Id des entsprechenden Spiel-Documents an Game zurück
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
</template>