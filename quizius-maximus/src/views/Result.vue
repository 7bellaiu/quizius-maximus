<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ResultCard from '@/components/ResultCard.vue';

const route = useRoute();
const router = useRouter();

const gameMode = route.params.gameMode;
const moduleShortname = route.params.moduleShortname;
const moduleLongname = route.params.moduleLongname;
const gameId = route.params.gameId;

const gameData = ref(null);
const player1Score = ref(0);
const player2Score = ref(0);

const buildResult = async () => {
    // TODO: Daten aus collection games selektieren
    gameData.value = {
        player1Username: 'Player1',
        player2Username: 'Player2',
        player1IsCorrect: [true, false, true],
        player2IsCorrect: [true, true, false]
    };
    player1Score.value = gameData.value.player1IsCorrect.filter(correct => correct).length;
    player2Score.value = gameData.value.player2IsCorrect.filter(correct => correct).length;
};

onMounted(buildResult);

const goBack = () => {
    router.push('/activequizzes');
};
</script>

<template>
    <div class="container mt-5">
        <h1>{{ gameMode }} - {{ moduleShortname }} {{ moduleLongname }} - Auswertung</h1>
        <ResultCard :username="gameData.player1Username" :score="player1Score" />
        <ResultCard :username="gameData.player2Username" :score="player2Score" />
        <div class="d-flex justify-content-between mt-3">
            <button class="btn btn-secondary" @click="goBack">Zurück</button>
            <button class="btn btn-danger">Quiz beenden</button>
        </div>
    </div>
</template>
