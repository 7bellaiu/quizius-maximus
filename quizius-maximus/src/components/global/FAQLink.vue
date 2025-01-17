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
        <div class="lead">
            {{ props.text }}
        </div>
    </router-link>
</template>