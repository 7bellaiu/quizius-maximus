<script setup>
// Diese View prüft zunächst, ob es schon ein Spiel für das gewählte Modul gibt, bei dem ein zweiter SPieler gesucht wird (und der erste spieler nicht der angemeldete User ist)
// gibt eines: JoinGame Component ausführen
// gibt keins: CreateGame Component ausführen
//immer: gameDocumentId zurückbekommen und damit je nach gewähltem Spielmodus die entsprechende Component aufrufen
import { getAuth } from "firebase/auth";
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
const userUID = ref(null);
const userUsername = ref(null);

// Steuerung welche Spielmodus-Component getriggert wird
const displaySchnellComp = computed(() => props.gameMode == 'schnell_comp' && isMatchmakingCompleted)
const displaySchnellCoop = computed(() => props.gameMode == 'schnell_coop' && isMatchmakingCompleted)
const displayThemeComp = computed(() => props.gameMode == 'theme_comp' && isMatchmakingCompleted)
const displayThemeCoop = computed(() => props.gameMode == 'theme_coop' && isMatchmakingCompleted)
const displaySimul = computed(() => props.gameMode == 'simul' && isMatchmakingCompleted)
const displayLearn = computed(() => props.gameMode == 'learn' && isMatchmakingCompleted)
const isUserDataFetched = computed(() => userUID.value && userUsername.value);

// Funktion, um Benutzerdaten zu sammeln
const collectUserData = () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
        userUID.value = user.uid;
        userUsername.value = user.displayName || "Unbekannter Spieler";
        return true;
    } else {
        console.error("Kein Benutzer eingeloggt");
        return false;
    }
};

// Funktion zum Abrufen der Game-Daten
const fetchRunningGameDocId = () => {
    const existingGames = query(
        collection(firestoreDB, "games"),
        where("gameMode", "==", props.gameMode),
        where("moduleID", "==", props.moduleId),
        where("player2Status", "==", 0),
        where("player1UID", "!=", 'dfyxoVBXi7MXCZH53B27c4tRtEn2')
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
    if (!collectUserData()) {
        console.error("Benutzerdaten konnten nicht geladen werden!");
        //TODO: verzögerter push to Login-Site?
    } else if (!props.moduleId) {
        console.error("Keine moduleId übergeben!");
        // TODO: Routing zu Modulübersicht?
    } else {
        fetchRunningGameDocId();
    }

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
            <CreateNewGame v-if="isUserDataFetched && !gameFound && !isMatchmakingCompleted"
                @success="handleMatchmakingSuccess" @failed="handleMatchmakingFailed" :gameMode="props.gameMode"
                :moduleId="props.moduleId" :moduleShortname="props.moduleShortname"
                :moduleLongname="props.moduleLongname" :userUID="userUID" :userUsername="userUsername" />
            <JoinExistingGame v-if="isUserDataFetched && gameFound && !isMatchmakingCompleted"
                @success="handleMatchmakingSuccess" @failed="handleMatchmakingFailed" :gameDocId="gameDocId" />
        </div>

        <!-- Weiterleiten zum Spiel-Controller -->
        <div class="row">
            <SchnellComp v-if="displaySchnellComp && isMatchmakingCompleted" :gameDocId="matchmakingGameDocId" />
            <!-- <SchnellCoop v-if="displaySchnellCoop" :gameDocId="matchmakingGameDocId" /> -->
            <!-- <ThemeComp v-if="displayThemeComp" :gameDocId="matchmakingGameDocId" /> -->
            <!-- <ThemeCoop v-if="displayThemeCoop" :gameDocId="matchmakingGameDocId" /> -->
            <!-- <Simulation v-if="displaySimul" :gameDocId="matchmakingGameDocId" /> -->
            <!-- <Learning v-if="displayLearn" :gameDocId="matchmakingGameDocId" /> -->
        </div>
    </main>
</template>