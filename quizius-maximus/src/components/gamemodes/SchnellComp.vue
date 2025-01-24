<script setup>
// Steuert ein Schnelles Spiel im Competitive Mode
const props = defineProps({
    gameDocId: {
        type: String,
        required: true
    }
});
</script>

<template>
    <h1> SchnellComp: {{ props.gameDocId }}</h1>
</template>