<script setup>
import { getAuth, signOut } from 'firebase/auth';
</script>

<template>
    <button @click="signOut(getAuth());" class="btn btn-outline-danger">Ausloggen</button>
</template>