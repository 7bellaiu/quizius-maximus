<script setup>
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
            <div class="card border-primary bg-primary text-white">
                <div class="card-body">
                    <h5 class="card-title">
                        <span v-if="game.gameMode === 'schnell_comp'">Kompetitiv - Schnelles Spiel</span>
                    </h5>
                    <p class="card-text">
                        ({{ game.moduleShortname }}) {{ game.moduleLongname }}<br>
                        {{ game.player1Username }}
                        <span v-if="game.gameMode.includes('comp') && game.player1Status !== 1">VS</span>
                        {{ game.player2Username }}<br>
                        Status: {{ getStatusText(game.player1Status, game.player2Username) }}
                    </p>
                </div>
            </div>
        </button>
    </div>
</template>