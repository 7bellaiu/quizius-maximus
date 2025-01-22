<script setup>
import { ref, onMounted } from "vue";
import { firestoreDB } from "@/main";
import { collection, query, where, getDocs, runTransaction, doc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import Quiz from '@/components/quiz/Quiz.vue';

const props = defineProps({
    moduleId: {
        type: String,
        required: true,
    },
    moduleShortname: {
        type: String,
        required: true,
    },
    moduleLongname: {
        type: String,
        required: true
    },
    gameMode: {
        type: String,
        required: true
    },
});

const state = ref({
    userUID: null,
    userUsername: null,
    message: "",
    currentQuestion: 0,
    questionData: null,
    gameDocId: null,
});

const handleError = (error, customMessage) => {
    console.error(customMessage, error);
    state.value.message = `${customMessage}: ${error.message}`;
};

const findOrCreateGame = async () => {
    try {
        const existingGames = query(
            collection(firestoreDB, "games"),
            where("gameMode", "==", props.gameMode),
            where("moduleID", "==", props.moduleId),
            where("player2Status", "==", 0)
        );

        const existingGamesData = await getDocs(existingGames);

        if (!existingGamesData.empty) {
            await joinExistingGame(existingGamesData.docs[0]); //Später als Schleife?
        } else {
            await createNewGame();
        }
    } catch (error) {
        handleError(error, "Fehler beim Erstellen des Spiels");
    }
};

const joinExistingGame = async (existingGameDoc) => {
    try {
        const { userUID, userUsername, currentQuestion } = state.value; //Destrukturierung für weniger const Anweisungen
        const existingGameData = existingGameDoc.data();

        // laufendes Spiel existiert => Überprüfung, ob aktueller Benutzer bereits als player1 eingetragen ist
        if (existingGameData.player1UID !== userUID) {
            // Benutzer ist nicht player1 => wird als player2 dem Spiel zugewiesen
            state.value.gameDocId = existingGameDoc.id;
            await updateDoc(existingGameDoc.ref, {
                player2UID: userUID,
                player2Username: userUsername,
                player2Status: 1
            });

            const questionsData = await getDocs(collection(existingGameDoc.ref, "questions"));
            state.value.questionData = questionsData.docs[currentQuestion].data();
            state.value.message = "Du wurdest einem bestehenden Spiel zugewiesen.";
        } else {
            // Benutzer ist bereits player1 => neues Spiel erstellen
            await createNewGame();
        }
    } catch (error) {
        handleError(error, "Fehler beim Spielbeitritt.");
    }
};

const createNewGame = async () => {
    try {
        await runTransaction(firestoreDB, async (transaction) => {
            const newGameDoc = doc(collection(firestoreDB, "games"));
            state.value.gameDocId = newGameDoc.id;
            const { currentQuestion, userUID, userUsername } = state.value;
            const { gameMode, moduleId, moduleLongname, moduleShortname } = props;

            transaction.set(newGameDoc, {
                currentQuestion,
                gameMode,
                moduleID: moduleId,
                moduleLongname,
                moduleShortname,
                player1Status: 1,
                player1UID: userUID,
                player1Username: userUsername,
                player2Status: 0,
                player2UID: "",
                player2Username: ""
            });

            const questionnairesModuleID = await getDocs(query(
                collection(firestoreDB, "questionnaires"),
                where("moduleID", "==", moduleId)
            ));

            const moduleID = questionnairesModuleID.docs[0].id;

            const questionnairesQuestions = await getDocs(query(
                collection(firestoreDB, "questionnaires", moduleID, "questions")
            ));

            const randomQuestions = questionnairesQuestions.docs
                .map(doc => ({ ...doc.data() }))
                .sort(() => 0.5 - Math.random())
                .slice(0, 5);

            randomQuestions.forEach((question, index) => {
                const gamesQuestions = doc(collection(newGameDoc, "questions"));
                transaction.set(gamesQuestions, {
                    ...question,
                    player1IsCorrect: false,
                    player2IsCorrect: false
                });

                if (index === 0) {
                    state.value.questionData = question;
                }
            });
        });

        state.value.message = "Neues Spiel erstellt.";
    } catch (error) {
        handleError(error, "Fehler der Spielerstellung.");
    }
};

onMounted(() => {
    const user = getAuth().currentUser;

    if (!user) {
        //Login anfordern
        // TODO: Weiterleitung auf Login-Fenster?
        alert('bitte neu einloggen!');
    }

    state.value.userUID = user.uid;
    state.value.userUsername = user.displayName;

    // TODO: Implementieren, dass Methode nur ausgeführt wird, wenn von Modules.vue geroutet wurde
    findOrCreateGame();
});

</script>

<template>
    <main>
        <p>{{ state.userUID }}</p>
        <p>{{ state.message }}</p>
        <Quiz :currentQuestionData="state.questionData" :currentQuestion="state.currentQuestion"
            :gameDocId="state.gameDocId" />
    </main>
</template>