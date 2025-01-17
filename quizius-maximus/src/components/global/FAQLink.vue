<script setup>
const props = defineProps({
    text: {
        type: String,
        required: true
    }
})
</script>

<template>
    <router-link class="btn btn-light w-100 text-start" to="support">
        <small>{{ props.text }}</small>
    </router-link>
</template>