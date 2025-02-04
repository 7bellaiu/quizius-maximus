<script setup>
import { onMounted, ref } from 'vue';
import FireIcon from './icons/FireIcon.vue';
import GearIcon from './icons/GearIcon.vue';

const props = defineProps({
    game: {
        type: Object,
        required: true
    },
    userUID: { //der angemeldete Spieler
        type: String,
        required: true
    }
});

const clickTarget = ref(null);
const isTargetDefined = ref(false);
const playerStatus = ref(null);

const getStatusText = (status) => {
    switch (status) {
        case 1:
            return "Spieler 1 spielt";
        case 2:
            return "Suche Gegenspieler";
        case 3:
            return "Spieler 2 spielt";
        case 4:
            return "Ergebnisse anzeigen";
        default:
            return "Unbekannter Status";
    }
};

onMounted(() => {
    if (props.game.gameState === 4) { // egal welcher gamemode, es wird immer auf Result.vue geroutet
        clickTarget.value = { name: 'result', params: { gameMode: props.game.gameMode, gameDocId: props.game.id } };
    } else {
        clickTarget.value = { name: 'schnellcomp', params: { gameDocId: props.game.id, userUID: props.userUID } };
    }
    isTargetDefined.value = true;
}
);
</script>

<template>
    <div class="col">
        <router-link v-if="isTargetDefined" class="btn w-100 p-0" :to="clickTarget">
            <div class="card border-info">
                <div class="card-header bg-info bg-opacity-50 text-bg-info">
                    <h5 class="card-title">
                        <span v-if="game.gameMode === 'schnell_comp'">Kompetitiv - Schnelles Spiel</span>
                        <span v-if="game.gameMode === 'schnell_coop'">Kooperativ - Schnelles Spiel</span>
                        <span v-if="game.gameMode === 'simul'">Kompetitiv - Prüfungssimulation</span>
                        <span v-if="game.gameMode === 'learn'">Kooperativ - Lernmodus</span>
                    </h5>
                </div>
                <div class="card-body">
                    <p class="card-text">
                        ({{ game.moduleShortname }}) {{ game.moduleLongname }}<br>
                        {{ game.player1Username }}
                        <FireIcon class="text-danger"
                            v-if="game.gameMode.includes('comp') || game.gameMode === 'simul'" />
                        <GearIcon class="text-success"
                            v-if="game.gameMode.includes('coop') || game.gameMode === 'learn'" />
                        {{ game.player2Username }}
                    </p>
                </div>
                <div class="card-footer bg-info bg-opacity-25 text-bg-info border-info">
                    <strong>Status:</strong> {{ getStatusText(game.gameState) }}
                </div>
            </div>
        </router-link>
    </div>
</template>