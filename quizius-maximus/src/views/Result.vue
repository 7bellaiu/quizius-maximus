<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { doc, getDoc } from 'firebase/firestore';
import { firestoreDB } from "@/main";

const props = defineProps({
    gameMode: {
        type: String,
        required: true
    },
    moduleShortname: {
        type: String,
        required: true
    },
    moduleLongname: {
        type: String,
        required: true
    },
    gameId: {
        type: String,
        required: true
    }
});

const router = useRouter();
const gameData = ref(null);
const player1Score = ref(0);
const player2Score = ref(0);

const buildResult = async () => {
    const gameDocRef = doc(firestoreDB, "games", props.gameId);
    const gameDoc = await getDoc(gameDocRef);
    if (gameDoc.exists()) {
        gameData.value = gameDoc.data();
        player1Score.value = gameData.value.player1IsCorrect.filter(correct => correct).length;
        player2Score.value = gameData.value.player2IsCorrect.filter(correct => correct).length;
    } else {
        console.error("Spiel nicht gefunden!");
    }
};

onMounted(buildResult);

const goBack = () => {
    router.push('/activequizzes');
};
</script>

<template>
    <div class="container mt-5">
        <h1>{{ props.gameMode }} - {{ props.moduleShortname }} {{ props.moduleLongname }} - Auswertung</h1>
        <div class="card mb-3">
            <div class="card border-info">
                <div class="card-header bg-info bg-opacity-50 text-bg-info">
                    <h5 class="card-title">Benutzername Punktzahl</h5>
                </div>
                <div class="card-body">
                    <p class="card-text" v-if="gameData">
                        {{ gameData.player1Username }}: {{ player1Score }}<br>
                        {{ gameData.player2Username }}: {{ player2Score }}
                    </p>
                </div>
            </div>
        </div>
        <div class="d-flex justify-content-between mt-3">
            <button class="btn btn-secondary" @click="goBack">Zurück</button>
            <button class="btn btn-danger">Quiz abschließen</button>
        </div>
    </div>
</template>