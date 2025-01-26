<script setup>
import { onMounted, ref } from 'vue';
import FireIcon from './icons/FireIcon.vue';
import GearIcon from './icons/GearIcon.vue';

const props = defineProps({
    game: {
        type: Object,
        required: true
    },
    userUID: {  //der angemeldete Spieler
        type: String,
        required: true
    }
});

const clickTarget = ref(null);
const isTargetDefined = ref(false);

const getStatusText = (status, player2Username) => { // TODO: Status validieren, je nachdem ob UID in player1UID oder in Player2UID
    switch (status) {
        case 1:
            return "Suche Gegenspieler";
        case 2:
            return "Du bist dran!";
        case 3:
            return `Warte auf den Zug von ${player2Username}`;
        case 4:
            return "Ergebnisse anzeigen";
    }
};

onMounted(() => {
    switch (props.game.gameMode) {
        case 'schnell_comp':
            clickTarget.value = { name: 'schnellcomp', params: { gameDocId: props.game.id, userUID: props.userUID } };
            isTargetDefined.value = true;
            break;
        default: console.error('Zugriff auf gameMode fehlgeschlagen oder ungültiger gameMode: ', props.game);
            isTargetDefined.value = false;
            break;
    }
})
</script>

<template>
    <div class="col">
        <router-link v-if="isTargetDefined" class="btn w-100 p-0" :to="clickTarget">
            <div class="card border-info">
                <div class="card-header bg-info bg-opacity-50 text-bg-info">
                    <h5 class="card-title">
                        <span v-if="game.gameMode === 'schnell_comp'">Kompetitiv - Schnelles Spiel</span>
                        <span v-if="game.gameMode === 'schnell_coop'">Kooperativ - Schnelles Spiel</span>
                    </h5>

                </div>
                <div class="card-body">
                    <p class="card-text">
                        ({{ game.moduleShortname }}) {{ game.moduleLongname }}<br>
                        {{ game.player1Username }}
                        <FireIcon class="text-danger" v-if="game.gameMode.includes('comp')" />
                        <GearIcon class="text-success" v-if="game.gameMode.includes('coop')" />
                        {{ game.player2Username }}
                    </p>
                </div>
                <div class="card-footer bg-info bg-opacity-25 text-bg-info border-info">
                    <strong>Status:</strong> {{ getStatusText(game.player1Status, game.player2Username) }}
                </div>
            </div>
        </router-link>
    </div>
</template>