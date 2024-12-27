<script setup>
import { EmailAuthProvider, getAuth, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { computed, ref } from 'vue';

//communication with parent
const emit = defineEmits(["success", "cancel"])

//Toast utility
const toastRef = ref(null);
const toastMessage = ref("");
const TOAST_ERROR_VARIANT = "danger";

const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

const disableSaveButton = computed(() => !currentPassword.value.trim() || !newPassword.value.trim() || !confirmPassword.value.trim());

const handleUpdatePassword = () => {
    if (newPassword.value !== confirmPassword.value) {
        toastMessage.value = "Die eingegebenen Passwörter stimmen nicht überein!";
        triggerToast();
        return;
    }
    if (currentPassword.value === newPassword.value) {
        toastMessage.value = "Das neue und alte Passwort dürfen nicht identisch sein!";
        triggerToast();
        return;
    }


    const user = getAuth().currentUser;
    const email = user.email;

    reauthenticateWithCredential(user, EmailAuthProvider.credential(email, currentPassword.value))
        .then(() => {
            console.log('reauthentication succeeded');
            updatePassword(getAuth().currentUser, newPassword.value)
                .then(() => {
                    console.log('updatePassword succeeded');
                    emit("success", "Das Passwort wurde erfolgreich aktualisiert");
                })
                .catch((updatePasswordError) => {
                    switch (updatePasswordError.code) {
                        case 'auth/password-does-not-meet-requirements':
                            toastMessage.value = 'Die Passwort-Vorgaben wurden nicht eingehalten: [Password must contain at least 12 characters, Password must contain a numeric character, Password must contain a non-alphanumeric character]';
                            break;

                        default:
                            toastMessage.value = updatePasswordError.code;
                            break;
                    }
                    console.error('updatePasswordError: ', updatePasswordError);
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
    <form @submit.prevent="handleUpdatePassword">
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
        <!-- new password -->
        <div v-if="currentPassword.trim() !== ''" class="input-group mb-2">
            <div class="input-group-text" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-lock"
                    viewBox="0 0 16 16">
                    <path
                        d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1" />
                </svg>
            </div>
            <input type="password" class="form-control" id="newPassword" placeholder="Neues Passwort"
                aria-label="Neues Passwort" data-ddg-inputtype="credentials.password.new" v-model="newPassword"
                :disabled="currentPassword.trim() === ''" required />
        </div>
        <!-- confirm new password -->
        <div v-if="newPassword.trim() !== ''" class="input-group mb-2">
            <div class="input-group-text" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-lock"
                    viewBox="0 0 16 16">
                    <path
                        d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1" />
                </svg>
            </div>
            <input type="password" class="form-control" id="confirmPassword" placeholder="Neues Passwort bestätigen"
                aria-label="Neues Passwort bestätigen" data-ddg-inputtype="credentials.password.confirmation"
                v-model="confirmPassword" :disabled="newPassword.trim() === ''" required />
        </div>

        <div class="d-flex justify-content-between mt-3">
            <button @click="emit('cancel', 'Passwortänderung abgebrochen!');"
                class="btn btn-outline-danger">Abbrechen</button>
            <button class="btn btn-primary w-50" :disabled="disableSaveButton">Speichern</button>
        </div>
    </form>
    <!-- Fehlermeldung -->
    <Toast ref="toastRef" :message="toastMessage" :variant="TOAST_ERROR_VARIANT" />
</template>