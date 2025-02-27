<script setup>
// Diese View prüft zunächst, ob es schon ein Spiel für das gewählte Modul gibt, bei dem ein zweiter Spieler gesucht wird (und der erste Spieler nicht der angemeldete User ist)
// gibt eines: JoinGame Component ausführen
// gibt keins: CreateGame Component ausführen
// immer: gameDocumentId zurückbekommen und damit je nach gewähltem Spielmodus die entsprechende Component aufrufen
import { getAuth } from "firebase/auth";
import { ref, onMounted, computed } from "vue";
import { firestoreDB } from "@/main";
import { collection, query, where, getDocs } from "firebase/firestore";
import CreateNewGame from "@/components/matchmaking/CreateNewGame.vue";
import JoinExistingGame from "@/components/matchmaking/JoinExistingGame.vue";
import SchnellComp from "@/components/gamemodes/SchnellComp.vue";
import SchnellCoop from "@/components/gamemodes/SchnellCoop.vue";
import Simulation from "@/components/gamemodes/Simulation.vue";
import Learning from "@/components/gamemodes/Learning.vue";
import ThemeComp from "@/components/gamemodes/ThemeComp.vue";
import ThemeCoop from "@/components/gamemodes/ThemeCoop.vue";

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
    section: {
        type: String,
        required: false
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
const displaySchnellComp = computed(() => props.gameMode == 'schnell_comp' && isMatchmakingCompleted.value)
const displaySchnellCoop = computed(() => props.gameMode == 'schnell_coop' && isMatchmakingCompleted.value)
const displayThemeComp = computed(() => props.gameMode == 'theme_comp' && isMatchmakingCompleted.value)
const displayThemeCoop = computed(() => props.gameMode == 'theme_coop' && isMatchmakingCompleted.value)
const displaySimul = computed(() => props.gameMode == 'simul' && isMatchmakingCompleted.value)
const displayLearn = computed(() => props.gameMode == 'learn' && isMatchmakingCompleted.value)
const isUserDataFetched = computed(() => userUID.value && userUsername.value);
const isFetchingGame = ref(true); // Variable, um den Abrufstatus zu verfolgen

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
// Async & await => Sicherstellen, dass die fetchRunningGameDocId-Funktion abgeschlossen ist, bevor entschieden wird
// ob ein neues Spiel erstellt oder einem bestehenden Spiel beigetreten wird
const fetchRunningGameDocId = async () => {
    let existingGamesQuery;

    if (props.gameMode === 'theme_comp' || props.gameMode === 'theme_coop') {
        existingGamesQuery = query(
            collection(firestoreDB, "games"),
            where("gameMode", "==", props.gameMode),
            where("moduleID", "==", props.moduleId),
            where("section", "==", props.section),
            where("gameState", "==", 2),
            where("player1UID", "!=", userUID.value)
        );
    } else {
        existingGamesQuery = query(
            collection(firestoreDB, "games"),
            where("gameMode", "==", props.gameMode),
            where("moduleID", "==", props.moduleId),
            where("gameState", "==", 2),
            where("player1UID", "!=", userUID.value)
        );
    }

    try {
        const existingGamesData = await getDocs(existingGamesQuery); // await => Sichergehen, dass gameFound-Variable korrekt gesetzt wird, bevor die Entscheidung getroffen wird
        gameFound.value = !existingGamesData.empty; // Setzt gameFound auf true oder false
        gameDocId.value = existingGamesData.empty ? null : existingGamesData.docs[0].id; // Speichert die ID, falls vorhanden
    } catch (error) {
        console.error("Fehler beim Abrufen des Spiels:", error);
    } finally {
        isFetchingGame.value = false; // fetchRunningGameDocId-Funktion abgeschlossen
    }
};

// Firestore-Daten abrufen, sobald die Komponente geladen wird
onMounted(async () => {
    if (!collectUserData()) {
        console.error("Benutzerdaten konnten nicht geladen werden!");
        // TODO: verzögerter push to Login-Site?
    } else if (!props.moduleId) {
        console.error("Keine moduleId übergeben!");
        // TODO: Routing zu Modulübersicht?
    } else {
        await fetchRunningGameDocId();
    }
});

const handleMatchmakingSuccess = (createdGameDocId) => {
    matchmakingGameDocId.value = createdGameDocId;
    console.log("Matchmaking erfolgreich: ", matchmakingGameDocId.value);
    isMatchmakingCompleted.value = true;
}

const handleMatchmakingFailed = (message) => {
    // TODO: Fehlermeldung an Spieler
    console.error(message);
}
</script>

<template>
    <main>
        <!-- TODO: Matchmaking -->
        <div class="row align-content-center">
            <CreateNewGame v-if="isUserDataFetched && !gameFound && !isMatchmakingCompleted && !isFetchingGame"
                @success="handleMatchmakingSuccess" @failed="handleMatchmakingFailed" :gameMode="props.gameMode"
                :moduleId="props.moduleId" :moduleShortname="props.moduleShortname"
                :moduleLongname="props.moduleLongname" :userUID="userUID" :userUsername="userUsername" :section="props.section" />
            <JoinExistingGame v-if="isUserDataFetched && gameFound && !isMatchmakingCompleted && !isFetchingGame"
                @success="handleMatchmakingSuccess" @failed="handleMatchmakingFailed" :gameDocId="gameDocId"
                :userUID="userUID" :userUsername="userUsername" />
        </div>

        <!-- Weiterleiten zum Spiel-Controller -->
        <div class="row">
            <SchnellComp v-if="displaySchnellComp && isMatchmakingCompleted" :gameDocId="matchmakingGameDocId"
                :userUID="userUID" />
            <SchnellCoop v-if="displaySchnellCoop && isMatchmakingCompleted" :gameDocId="matchmakingGameDocId"
                :userUID="userUID" />
            <ThemeComp v-if="displayThemeComp && isMatchmakingCompleted" :gameDocId="matchmakingGameDocId"
                :userUID="userUID" :section="props.section" />
            <ThemeCoop v-if="displayThemeCoop && isMatchmakingCompleted" :gameDocId="matchmakingGameDocId"
                :userUID="userUID" :section="props.section" />
            <Simulation v-if="displaySimul && isMatchmakingCompleted" :gameDocId="matchmakingGameDocId"
                :userUID="userUID" />
            <Learning v-if="displayLearn && isMatchmakingCompleted" :gameDocId="matchmakingGameDocId"
                :userUID="userUID" />
        </div>
    </main>
</template>