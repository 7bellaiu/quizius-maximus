<script setup>
// Steuert ein Schnelles Spiel im Competitive Mode
const props = defineProps({
    gameId: {
        type: String,
        required: true
    }
});
</script>

<template>
    <h1> SchnellComp: {{ props.gameId }}</h1>
</template>