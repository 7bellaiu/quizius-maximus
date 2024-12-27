<script setup>
const props = defineProps({
    variant: {
        type: String,
        default: "light"
    }
});
</script>

<template>
    <img v-if="props.variant == 'dark'" src="../assets/logo.png" alt="Logo" class="logo-img rounded-circle" />
    <img v-else-if="props.variant == 'light'" src="../assets/logo.png" alt="Logo" class="logo-img rounded-circle p-1 bg-dark"/>
</template>

<style scoped>
.logo-img {
    width: 15%;
    /* Relative Breite */
    height: auto;
    /* Erhält das Seitenverhältnis */
    min-width: 50px;
    /* Minimale Breite */
    max-width: 80px;
    /* Maximale Breite */
    min-height: 50px;
    /* Minimale Höhe */
    max-height: 80px;
    /* Maximale Höhe */
}
</style>