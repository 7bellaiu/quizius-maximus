<script setup>
// Diese View prüft zunächst, ob es schon ein Spiel für das gewählte Modul gibt, bei dem ein zweiter SPieler gesucht wird (und der erste spieler nicht der angemeldete User ist)
// gibt eines: JoinGame Component ausführen
// gibt keins: CreateGame Component ausführen
//immer: gameDocumentId zurückbekommen und damit je nach gewähltem Spielmodus die entsprechende Component aufrufen
import { ref, onMounted, computed } from "vue";
import { firestoreDB } from "@/main";
import { collection, query, where, getDocs } from "firebase/firestore";
import CreateNewGame from "@/components/matchmaking/CreateNewGame.vue";
import JoinExistingGame from "@/components/matchmaking/JoinExistingGame.vue";
import SchnellComp from "@/components/gamemodes/SchnellComp.vue";

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

// Reaktive Variablen für den Zustand
const gameFound = ref(false);
const gameDocId = ref(null);
const isMatchmakingCompleted = ref(false)
const matchmakingGameDocId = ref("");

// Steuerung welche Spielmodus-Component getriggert wird
const displaySchnellComp = computed(() => props.gameMode == 'schnell_comp' && isMatchmakingCompleted)
const displaySchnellCoop = computed(() => props.gameMode == 'schnell_coop' && isMatchmakingCompleted)
const displayThemeComp = computed(() => props.gameMode == 'theme_comp' && isMatchmakingCompleted)
const displayThemeCoop = computed(() => props.gameMode == 'theme_coop' && isMatchmakingCompleted)
const displaySimul = computed(() => props.gameMode == 'simul' && isMatchmakingCompleted)
const displayLearn = computed(() => props.gameMode == 'learn' && isMatchmakingCompleted)

// Funktion zum Abrufen der Game-Daten
const fetchRunningGameDocId = () => {
    const existingGames = query(
        collection(firestoreDB, "games"),
        where("gameMode", "==", props.gameMode),
        where("moduleID", "==", props.moduleId),
        where("player2Status", "==", 0)
    );

    getDocs(existingGames)
        .then((existingGamesData) => {
            gameFound.value = !existingGamesData.empty; // Setzt gameFound auf true oder false
            gameDocId.value = existingGamesData.empty ? null : existingGamesData.docs[0].id; // Speichert die ID, falls vorhanden
        })
        .catch((error) => {
            console.error("Fehler beim Abrufen des Spiels:", error);
        });
};

// Firestore-Daten abrufen, sobald die Komponente geladen wird
onMounted(() => {
    fetchRunningGameDocId();
});

const handleMatchmakingSuccess = (createdGameDocId) => {
    matchmakingGameDocId.value = createdGameDocId;
    console.log("Matchmaking successfull: ", matchmakingGameDocId.value);
    isMatchmakingCompleted.value = true;
}

const handleMatchmakingFailed = (message) => {
    // TODO: Fehlermeldung an Spieler
    console.error(message);
}

// const state = ref({
//     userUID: null,
//     userUsername: null,
//     message: "",
//     currentQuestion: 0,
//     questionData: null,
//     gameDocId: null,
// });

// const handleError = (error, customMessage) => {
//     console.error(customMessage, error);
//     state.value.message = `${customMessage}: ${error.message}`;
// };

// const findOrCreateGame = async () => {
//     try {
//         const existingGames = query(
//             collection(firestoreDB, "games"),
//             where("gameMode", "==", props.gameMode),
//             where("moduleID", "==", props.moduleId),
//             where("player2Status", "==", 0)
//         );

//         const existingGamesData = await getDocs(existingGames);

//         if (!existingGamesData.empty) {
//             await joinExistingGame(existingGamesData.docs[0]); //Später als Schleife?
//         } else {
//             await createNewGame();
//         }
//     } catch (error) {
//         handleError(error, "Fehler beim Erstellen des Spiels");
//     }
// };



// onMounted(() => {
//     const user = getAuth().currentUser;

//     if (!user) {
//         //Login anfordern
//         // TODO: Weiterleitung auf Login-Fenster?
//         alert('bitte neu einloggen!');
//     }

//     state.value.userUID = user.uid;
//     state.value.userUsername = user.displayName;

//     // TODO: Implementieren, dass Methode nur ausgeführt wird, wenn von Modules.vue geroutet wurde
//     findOrCreateGame();
// });

</script>

<template>
    <main>
        <div class="row">
            <h1>{{ moduleId }}</h1>
            <p>
                {{ moduleShortname }} <br>
                {{ moduleLongname }} <br>
                {{ gameMode }}
            </p>
            <p>SchnellComp: {{ displaySchnellComp }}</p>
            <p>SchnellCoop: {{ displaySchnellCoop }}</p>
            <p>ThemeComp: {{ displayThemeComp }}</p>
            <p>ThemeCoop: {{ displayThemeCoop }}</p>
            <p>Simul: {{ displaySimul }}</p>
            <p>Learn: {{ displayLearn }}</p>
        </div>

        <!-- TODO: Matchmaking -->
        <div class="row">
            <CreateNewGame v-if="!gameFound && !isMatchmakingCompleted" @success="handleMatchmakingSuccess"
                @failed="handleMatchmakingFailed" />
            <JoinExistingGame v-if="gameFound && !isMatchmakingCompleted" :gameDocId="gameDocId"
                @success="handleMatchmakingSuccess" @failed="handleMatchmakingFailed" />
        </div>

        <!-- Weiterleiten zum Spiel-Controller -->
        <div class="row">
            <SchnellComp v-if="displaySchnellComp" :gameDocId="matchmakingGameDocId" />
            <!-- <SchnellCoop v-if="displaySchnellCoop" :gameDocId="matchmakingGameDocId" /> -->
            <!-- <ThemeComp v-if="displayThemeComp" :gameDocId="matchmakingGameDocId" /> -->
            <!-- <ThemeCoop v-if="displayThemeCoop" :gameDocId="matchmakingGameDocId" /> -->
            <!-- <Simulation v-if="displaySimul" :gameDocId="matchmakingGameDocId" /> -->
            <!-- <Learning v-if="displayLearn" :gameDocId="matchmakingGameDocId" /> -->
        </div>
    </main>
</template>