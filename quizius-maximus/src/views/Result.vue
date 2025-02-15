<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import ResultSchnellComp from '@/components/results/ResultSchnellComp.vue';
import ResultSchnellCoop from '@/components/results/ResultSchnellCoop.vue';
import ResultSimulation from '@/components/results/ResultSimulation.vue';
import WaitingForPlayer2 from '@/components/results/WaitingForPlayer2.vue';
import ResultLearning from '@/components/results/ResultLearning.vue';
import ResultThemeComp from '@/components/results/ResultThemeComp.vue';
import ResultThemeCoop from '@/components/results/ResultThemeCoop.vue';

const route = useRoute();
// TODO: mit define Props umsetzen
const gameMode = route.params.gameMode;
const gameDocId = route.params.gameDocId;
const gameState = route.params.gameState;

// Dynamisches Rendering der entsprechenden Komponente basierend auf dem gameMode
const currentComponent = computed(() => {

    switch (gameState) {
        case "2":
            return WaitingForPlayer2;
        case "4":
            switch (gameMode) {
                case 'schnell_comp':
                    return ResultSchnellComp;
                case 'schnell_coop':
                    return ResultSchnellCoop;
                case 'simul':
                    return ResultSimulation;
                case 'learn':
                    return ResultLearning;
                case 'theme_comp':
                    return ResultThemeComp;
                case 'theme_coop':
                    return ResultThemeCoop;
                default:
                    return null;
            }
    }
});
</script>

<template>
    <component :is="currentComponent" :gameDocId="gameDocId" />
</template>