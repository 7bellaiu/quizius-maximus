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

const userUID = ref(null);
const userUsername = ref(null);
const message = ref("");
const currentQuestion = ref(0);
const questionData = ref(null);
const gameDocId = ref(null);

const findOrCreateGame = async () => {
    try {
        const auth = getAuth();
        const user = auth.currentUser;

        userUID.value = user.uid;
        userUsername.value = user.displayName;

        // Überprüfung, ob laufendes Spiel existiert
        const existingGames = query(
            collection(firestoreDB, "games"),
            where("gameMode", "==", props.gameMode),
            where("moduleID", "==", props.moduleId),
            where("player2Status", "==", 0)
        );

        const existingGamesData = await getDocs(existingGames);

        if (!existingGamesData.empty) {
            // laufendes Spiel existiert => Überprüfung, ob aktueller Benutzer bereits als player1 eingetragen ist
            const existingGameDoc = existingGamesData.docs[0]; //Später als Schleife?
            const existingGameData = existingGameDoc.data();

            if (existingGameData.player1UID !== userUID.value) {
                // Benutzer ist nicht player1 => wird als player2 dem Spiel zugewiesen
                gameDocId.value = existingGameDoc.id;
                await updateDoc(existingGameDoc.ref, {
                    player2UID: userUID.value,
                    player2Username: userUsername.value,
                    player2Status: 1
                });

                // Erste Frage aus bestehenden Spiel abrufen
                const questionsData = await getDocs(collection(existingGameDoc.ref, "questions"));
                questionData.value = questionsData.docs[currentQuestion.value].data();
                message.value = "Sie wurden einem bestehenden Spiel zugewiesen.";
            } else {
                // Benutzer ist bereits player1 => neues Spiel erstellen
                await createNewGame();
            }
        } else {
            // Kein laufendes Spiel existiert => neues Spiel erstellen
            await createNewGame();
        }
    } catch (error) {
        console.error("Fehler beim Erstellen des Spiels: ", error);
        message.value = `Fehler beim Erstellen des Spiels: ${error.message}`;
    }
};

const createNewGame = async () => {
    await runTransaction(firestoreDB, async (transaction) => {
        const newGameDoc = doc(collection(firestoreDB, "games"));
        gameDocId.value = newGameDoc.id;
        transaction.set(newGameDoc, {
            currentQuestion: currentQuestion.value,
            gameMode: props.gameMode,
            moduleID: props.moduleId,
            moduleLongname: props.moduleLongname,
            moduleShortname: props.moduleShortname,
            player1Status: 1,
            player1UID: userUID.value,
            player1Username: userUsername.value,
            player2Status: 0,
            player2UID: "",
            player2Username: ""
        });

        const questionnairesModuleID = await getDocs(query(
            collection(firestoreDB, "questionnaires"),
            where("moduleID", "==", props.moduleId)
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
                questionData.value = question;
            }
        });
    });

    message.value = "Neues Spiel erstellt.";
};

onMounted(() => {
    const auth = getAuth();
    auth.onAuthStateChanged(user => {
        if (user) {
            userUID.value = user.uid;
            userUsername.value = user.displayName;
            findOrCreateGame(); // Methode wird autom. ausgeführt, wenn Games.vue durchlaufen wird
        }
    });
});
</script>

<template>
    <main>
        <p>{{ message }}</p>
        <Quiz :currentQuestionData="questionData" :currentQuestion="currentQuestion" :gameDocId="gameDocId" />
    </main>
</template>
