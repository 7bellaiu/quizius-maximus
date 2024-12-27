<script setup>
import { ref, onMounted } from 'vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import router from '@/router';
import LogoutButton from '@/components/LogoutButton.vue';

const userLoggedIn = ref(false);
const userName = ref("");

/** check whether user is logged in when loading this view*/
onMounted(() => {
    onAuthStateChanged(getAuth(), function (user) {
        if (!user) {
            userLoggedIn.value = false;
            router.push("/login");
        } else {
            userLoggedIn.value = true;
            // TODO: Alternative finden, hier ist der Name leer, weil Profil-Update erst nach Auth-Creation ... onAuthStateChanged triggert schneller
            // => nach initialer Username-Vergabe leer, ab dann immer gefüllt
            userName.value = user.displayName;
        }
    });
});
</script>

<template>
    <main class="d-flex justify-content-center">
        <fieldset v-if="userLoggedIn">
            <legend>Willkommen zurück {{ userName }}!</legend>
            <div class="d-flex justify-content-center">
                <LogoutButton />
            </div>
        </fieldset>
    </main>
</template>