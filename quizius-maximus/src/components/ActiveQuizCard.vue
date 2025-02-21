<script setup>
import { onMounted, ref } from 'vue';
import FireIcon from './icons/FireIcon.vue';
import GearIcon from './icons/GearIcon.vue';
import PersonIcon from './icons/PersonIcon.vue';
import PeopleIcon from './icons/PeopleIcon.vue';
import WaitingForPlayer2 from './results/WaitingForPlayer2.vue';
import SchnellComp from './gamemodes/SchnellComp.vue';
import SchnellCoop from './gamemodes/SchnellCoop.vue';

const props = defineProps({
    game: {
        type: Object,
        required: true
    },
    userUID: { // der angemeldete Spieler
        type: String,
        required: true
    }
});

const clickTarget = ref(null);
const isTargetDefined = ref(false);
const targetName = ref('');

const getStatusText = (status) => {
    switch (status) {
        case 1:
            return props.game.player1Username + " spielt";
        case 2:
            return "Suche Gegenspieler";
        case 3:
            return props.game.player2Username + " spielt";
        case 4:
            return "Ergebnisse anzeigen";
        default:
            return "Unbekannter Status";
    }
};

onMounted(() => {
    // Bestimme den Zielnamen basierend auf dem gameMode
    switch (props.game.gameMode) {
        case 'schnell_comp':
            targetName.value = 'schnellcomp';
            break;
        case 'schnell_coop':
            targetName.value = 'schnellcoop';
            break;
        case 'simul':
            targetName.value = 'simulation';
            break;
        case 'learn':
            targetName.value = 'learning';
            break;
        case 'theme_comp':
            targetName.value = 'themecomp';
            break;
        case 'theme_coop':
            targetName.value = 'themecoop';
            break;
        default:
            targetName.value = '';
    }

    if (props.game.gameState === 4 || props.game.gameState === 2) {
        clickTarget.value = { name: 'result', params: { gameMode: props.game.gameMode, gameDocId: props.game.id, gameState: props.game.gameState } };
    } else if (props.game.gameState === 1 && props.game.player1UID === props.userUID) {
        clickTarget.value = { name: targetName.value, params: { gameDocId: props.game.id, userUID: props.userUID, section: props.game.section } };
    } else if (props.game.gameState === 3 && props.game.player2UID === props.userUID) {
        clickTarget.value = { name: targetName.value, params: { gameDocId: props.game.id, userUID: props.userUID, section: props.game.section } };
    }
    isTargetDefined.value = true;
});
</script>

<template>
    <div class="col">
        <router-link v-if="isTargetDefined" class="btn w-100 p-0" :to="clickTarget">
            <div class="card border-info">
                <div class="card-header shadow-sm">
                    <h5 class="card-title">
                        <span v-if="game.gameMode === 'schnell_comp'">
                            <PersonIcon class="text-danger me-2" />Schnelles Quiz
                        </span>
                        <span v-if="game.gameMode === 'schnell_coop'">
                            <PeopleIcon class="text-success me-2" />Schnelles Quiz
                        </span>
                        <span v-if="game.gameMode === 'simul'">
                            <PersonIcon class="text-danger me-2" />Prüfungssimulation
                        </span>
                        <span v-if="game.gameMode === 'learn'">
                            <PeopleIcon class="text-success me-2" />Lernmodus
                        </span>
                        <span v-if="game.gameMode === 'theme_comp'">
                            <PersonIcon class="text-danger me-2" />Themenbasiertes Quiz
                        </span>
                        <span v-if="game.gameMode === 'theme_coop'">
                            <PeopleIcon class="text-success me-2" />Themenbasiertes Quiz
                        </span>
                    </h5>
                </div>
                <div class="card-body">
                    <p class="card-text">
                        ({{ game.moduleShortname }}) {{ game.moduleLongname }}
                        <span v-if="game.gameMode.includes('theme')">- Lektion {{ game.section }}</span><br>
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