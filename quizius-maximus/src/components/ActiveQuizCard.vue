<script setup>
import FireIcon from './icons/FireIcon.vue';
import GearIcon from './icons/GearIcon.vue';

const props = defineProps({
    game: {
        type: Object,
        required: true
    }
});

const getStatusText = (status, player2Username) => {
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

</script>

<template>
    <div class="col">
        <button type="button" class="btn w-100 p-0">
            <div class="card border-info">
                <div class="card-header bg-info bg-opacity-50 text-bg-info">
                    <h5 class="card-title">
                        <span v-if="game.gameMode === 'schnell_comp'">Kompetitiv - Schnelles Spiel</span>
                    </h5>

                </div>
                <div class="card-body">
                    <p class="card-text">
                        ({{ game.moduleShortname }}) {{ game.moduleLongname }}<br>
                        {{ game.player1Username }}
                            <FireIcon class="text-danger" v-if="game.gameMode.includes('comp') && game.player1Status !== 1"/>
                            <GearIcon class="text-danger" v-if="game.gameMode.includes('coop') && game.player1Status !== 1"/>
                            {{ game.player2Username }}
                    </p>
                </div>
                <div class="card-footer bg-info bg-opacity-25 text-bg-info border-info">
                    <strong>Status:</strong> {{ getStatusText(game.player1Status, game.player2Username) }}
                </div>
            </div>
        </button>
    </div>
</template>