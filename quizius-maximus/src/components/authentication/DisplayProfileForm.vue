<script setup>
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { onMounted, ref } from 'vue';

const userLoggedIn = ref(false);
const username = ref("");
const email = ref("");

onMounted(() => {
    onAuthStateChanged(getAuth(), function (user) {
        if (user) {
            userLoggedIn.value = true;
            username.value = user.displayName;
            email.value = user.email;
        }
    });
});
</script>

<template>
    <form>
        <!-- username -->
        <div class="input-group mb-2">
            <div class="input-group-text" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person"
                    viewBox="0 0 16 16">
                    <path
                        d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
                </svg>
            </div>
            <input type="text" class="form-control" id="username" placeholder="Benutzername" aria-label="Benutzername"
                data-ddg-inputtype="credentials.username" v-model="username" disabled>
        </div>
        <!-- email -->
        <div class="input-group mb-2">
            <div class="input-group-text" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                    class="bi bi-envelope" viewBox="0 0 16 16">
                    <path
                        d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z" />
                </svg>
            </div>
            <input type="email" class="form-control" id="email" placeholder="E-Mail" aria-label="E-Mail"
                data-ddg-inputtype="credentials.email" v-model="email" disabled />
        </div>
    </form>
</template>