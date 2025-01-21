<script setup>
import { ref, onMounted } from "vue";
import { firestoreDB } from "@/main";
import { collection, query, where, getDocs, runTransaction, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const userUID = ref(null);
const userUsername = ref(null);
const message = ref("");


const createGame = async () => {
    try {
        const auth = getAuth();
        const user = auth.currentUser;

        userUID.value = user.uid;
        userUsername.value = user.displayName;

        await runTransaction(firestoreDB, async (transaction) => {
            // Erstelle ein neues Spiel-Dokument
            const newGameDoc = doc(collection(firestoreDB, "games"));
            transaction.set(newGameDoc, {
                currentQuestion: 1,
                gameMode: "competitive",
                gameType: "schnell",
                moduleID: "X4w1QpzxrFTQmyqdUR1o",
                moduleLongname: "Unternehmensführung",
                moduleShortname: "BUFG01-01",
                player1Status: 1,
                player1UID: userUID.value,
                player1Username: userUsername.value,
                player2Status: "",
                player2UID: "",
                player2Username: ""
            });

            // Hole die Dokument-ID aus der questionnaires Sammlung, wo die moduleID übereinstimmt
            const questionnairesModuleID = await getDocs(query(
                collection(firestoreDB, "questionnaires"),
                where("moduleID", "==", "X4w1QpzxrFTQmyqdUR1o")
            ));

            const moduleID = questionnairesModuleID.docs[0].id;

            // Hole 5 zufällige Fragen aus der Unterkollektion questions des gefundenen Dokuments
            const questionnairesQuestions = await getDocs(query(
                collection(firestoreDB, "questionnaires", moduleID, "questions")
            ));

            const randomQuestions = questionnairesQuestions.docs
                .map(doc => ({ ...doc.data() }))
                .sort(() => 0.5 - Math.random())
                .slice(0, 5);

            // Füge die Fragen zur Unterkollektion `questions` des neuen Spiels hinzu
            randomQuestions.forEach(question => {
                const gamesQuestions = doc(collection(newGameDoc, "questions"));
                transaction.set(gamesQuestions, {
                    ...question,
                    player1IsCorrect: false,
                    player2IsCorrect: false
                });
            });
        });

        message.value = "Neues Spiel erfolgreich erstellt.";
    } catch (error) {
        console.error("Fehler beim Erstellen des Spiels: ", error);
        message.value = `Fehler beim Erstellen des Spiels: ${error.message}`;
    }
};

onMounted(() => {
    const auth = getAuth();
    auth.onAuthStateChanged(user => {
        if (user) {
            userUID.value = user.uid;
            userUsername.value = user.displayName;
        }
    });
});
</script>

<template>
    <div>
        <button @click="createGame">Neues Spiel erstellen</button>
        <p>{{ message }}</p>
    </div>
</template>