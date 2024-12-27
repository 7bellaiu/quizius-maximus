<script setup>
import { EmailAuthProvider, getAuth, reauthenticateWithCredential, updateCurrentUser, updatePassword, updateProfile } from 'firebase/auth';
import { computed, ref } from 'vue';
import DisplayProfileForm from "./DisplayProfileForm.vue";

//communication with parent
const emit = defineEmits(["success", "cancel"])

//Toast utility
const toastRef = ref(null);
const toastMessage = ref("");
const TOAST_ERROR_VARIANT = "danger";

const currentPassword = ref("");
const newUsername = ref("");

const disableSaveButton = computed(() => !currentPassword.value.trim() || !newUsername.value.trim());

const handleUpdateUsername = () => {
    if (newUsername.value.trim() === '' || newUsername.value.length < 10) {
        toastMessage.value = "Bitte geben Sie einen gültigen Benutzernamen ein! (mindestens 10 Zeichen)";
        triggerToast();
        return;
    }

    const user = getAuth().currentUser;
    const email = user.email;

    reauthenticateWithCredential(user, EmailAuthProvider.credential(email, currentPassword.value))
        .then(() => {
            console.log('reauthentication succeeded');
            updateProfile(user, { displayName: newUsername.value.trim() })
                .then(() => {
                    console.log('updateProfile succeeded');
                    emit("success", "Der Benutzername wurde erfolgreich aktualisiert");
                })
                .catch((updateUsernameError) => {
                    toastMessage.value = updateUsernameError.code;
                    console.error('updateUsernameError: ', updateUsernameError);
                    triggerToast();
                });
        })
        .catch((reauthenticationError) => {
            switch (reauthenticationError.code) {
                case 'auth/invalid-credential':
                    toastMessage.value = 'Das eingegebene aktuelle Passwort ist falsch!';
                    break;

                default:
                    toastMessage.value = reauthenticationError.code;
                    break;
            }
            console.error('reauthenticationError: ', reauthenticationError);
            triggerToast();
        });
}

const triggerToast = () => {
    if (toastRef.value) {
        toastRef.value.showToast();
    }
};

</script>

<template>
    <form @submit.prevent="handleUpdateUsername">
        <DisplayProfileForm />
        <!-- current password -->
        <div class="input-group mb-2">
            <div class="input-group-text" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-lock"
                    viewBox="0 0 16 16">
                    <path
                        d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1" />
                </svg>
            </div>
            <input type="password" class="form-control" id="currentPassword" placeholder="Aktuelles Passwort"
                aria-label="Aktuelles Passwort" data-ddg-inputtype="credentials.password.current"
                v-model="currentPassword" required />
        </div>
        <!-- new username -->
        <div class="input-group mb-2">
            <div class="input-group-text" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person"
                    viewBox="0 0 16 16">
                    <path
                        d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
                </svg>
            </div>
            <input type="text" class="form-control" id="newUsername" placeholder="Neuer Benutzername"
                aria-label="Neuer Benutzername" data-ddg-inputtype="credentials.username" v-model="newUsername"
                required>
        </div>

        <div class="d-flex justify-content-between mt-3">
            <button @click="emit('cancel', 'Änderung des Benutzernamens abgebrochen!');"
                class="btn btn-outline-danger">Abbrechen</button>
            <button class="btn btn-primary w-50" :disabled="disableSaveButton">Speichern</button>
        </div>
    </form>
    <!-- Fehlermeldung -->
    <Toast ref="toastRef" :message="toastMessage" :variant="TOAST_ERROR_VARIANT" />
</template>