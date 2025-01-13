<script setup>
import Quiz from '@/components/quiz/Quiz.vue';

const props = defineProps({
    moduleId: {
        type: String,
        required: true,
    },
    moduleShortname: {
        type: String,
        required: true,
    },
    moduleLongname: {
        type: String,
        required: true
    },
    gameMode: {
        type: String,
        required: true
    },
});

// TODO: Matchmaking
</script>

<template>
    <main>
        <Quiz />
    </main>
</template>
