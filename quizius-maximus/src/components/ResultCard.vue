<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    username: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
});

</script>

<template>
    <div class="card mb-3">
        <div class="card-body">
            <h5 class="card-title">Benutzername Punktzahl</h5>
            <p class="card-text">{{ username }} {{ score }}</p>
        </div>
    </div>
</template>