<script setup>
/** IMPORTS */
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, updateProfile, signOut } from "firebase/auth";
import Toast from "@/components/Toast.vue";

const DEFAULT_EMAIL_DOMAIN = '@iu-study.org';
const LEGACY_EMAIL_DOMAIN = '@iubh.de';

/** COMPONENT REFERENCES */
const router = useRouter();
const toastRef = ref(null);

/** STATES */
const username = ref("");
const newEmailLocalPart = ref("");
const newEmailDomainPart = ref(DEFAULT_EMAIL_DOMAIN);
const email = computed(() => `${newEmailLocalPart.value}${newEmailDomainPart.value}`);
const newPassword = ref("");
const confirmPassword = ref("");
const toastMessage = ref("");
const toastVariant = ref("");
const userLoggedIn = ref(false);
const flexCheckTerms = ref(false);
const flexCheckPrivacy = ref(false);

// Validation of Terms & Conditions && Privacy Policy
const isFormValid = computed(() => flexCheckTerms.value && flexCheckPrivacy.value);

/** check whether user is logged in when loading this view*/
onMounted(() => {
    onAuthStateChanged(getAuth(), function (user) {
        if (!user) {
            userLoggedIn.value = false;
        } else {
            userLoggedIn.value = true;
            router.push("/");
        }
    });
});

const register = () => {
    // VALIDATION
    if (newPassword.value !== confirmPassword.value) {
        toastMessage.value = "Die eingegebenen Passwörter stimmen nicht überein!";
        toastVariant.value = "warning"
        triggerToast();
        return;
    }
    if (username.value.trim() === '' || username.value.length < 10) {
        toastMessage.value = "Bitte geben Sie einen gültigen Benutzernamen ein! (mindestens 10 Zeichen)";
        toastVariant.value = "warning"
        triggerToast();
        return;
    }

    // USER CREATION
    createUserWithEmailAndPassword(getAuth(), email.value, newPassword.value)
        .then((data) => {
            const user = data.user;

            // Setze den displayName (Username)
            updateProfile(user, {
                displayName: username.value.trim()
            })
                .then(() => {
                    console.log('updateProfile: success');
                })
                .catch((profileError) => {
                    console.error('Fehler beim Setzen des Benutzernamens:', profileError);
                    toastMessage.value = "Registrierung erfolgreich, aber der Benutzername konnte nicht gespeichert werden.";
                    toastVariant.value = "warning";
                    triggerToast();
                });
        })
        .catch((error) => {
            // Fehler bei der Registrierung
            switch (error.code) {
                //TODO: Passwortrichtlinie erfordert entsprechende Nachricht, wenn nicht eingehalten, ggfs. via Formularvalidierung & Bootstrap?
                case "auth/password-does-not-meet-requirements":
                    toastMessage.value = 'Die Passwort-Vorgaben wurden nicht eingehalten: [Password must contain at least 12 characters, Password must contain a numeric character, Password must contain a non-alphanumeric character]';
                    break;
                case "auth/invalid-email":
                    toastMessage.value = 'Das Format der E-Mail ist ungültig!';
                    break;
                case "auth/email-already-in-use":
                    toastMessage.value = 'Zu dieser E-Mail ist bereits ein Konto hinterlegt!';
                    break;
                default:
                    toastMessage.value = error.code;
                    break;
            }
            toastVariant.value = "danger";
            triggerToast();
            console.error('User creation failed', error);
        });
};

/** UTILITY */
const triggerToast = () => {
    if (toastRef.value) {
        toastRef.value.showToast();
    }
};
</script>

<template>
    <main class="d-flex justify-content-center">
        <div v-if="!userLoggedIn" class="p-3 mt-3 mb-3 form-wrapper">
            <h2 class="mb-3 text-center">Registrieren</h2>

            <form @submit.prevent="register">
                <div class="input-group mb-2">
                    <div class="input-group-text" aria-hidden="true">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            class="bi bi-person" viewBox="0 0 16 16">
                            <path
                                d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
                        </svg>
                    </div>
                    <input type="text" class="form-control" id="username" placeholder="Benutzername"
                        aria-label="Benutzername" data-ddg-inputtype="credentials.username" v-model="username" required>
                </div>
                <div class="input-group mb-2">
                    <div class="input-group-text" aria-hidden="true">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            class="bi bi-envelope" viewBox="0 0 16 16">
                            <path
                                d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z" />
                        </svg>
                    </div>
                    <input type="text" class="form-control" id="email" placeholder="vorname.nachname"
                        aria-label="E-Mail" data-ddg-inputtype="credentials.email" v-model="newEmailLocalPart"
                        required />
                    <select class="input-group-text" aria-label="Default select example" v-model="newEmailDomainPart">
                        <option :value="DEFAULT_EMAIL_DOMAIN" selected>{{ DEFAULT_EMAIL_DOMAIN }}</option>
                        <option :value="LEGACY_EMAIL_DOMAIN">{{ LEGACY_EMAIL_DOMAIN }}</option>
                    </select>
                </div>
                <div class="input-group mb-2">
                    <div class="input-group-text" aria-hidden="true">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            class="bi bi-lock" viewBox="0 0 16 16">
                            <path
                                d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1" />
                        </svg>
                    </div>
                    <input type="password" class="form-control" id="newPassword" placeholder="Passwort"
                        aria-label="Passwort" data-ddg-inputtype="credentials.password.new" v-model="newPassword"
                        required />
                </div>
                <div v-if="newPassword.trim() !== ''" class="input-group mb-2">
                    <div class="input-group-text" aria-hidden="true">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            class="bi bi-lock" viewBox="0 0 16 16">
                            <path
                                d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1" />
                        </svg>
                    </div>
                    <input type="password" class="form-control" id="confirmPassword" placeholder="Passwort bestätigen"
                        aria-label="Passwort bestätigen" data-ddg-inputtype="credentials.password.confirmation"
                        v-model="confirmPassword" required />
                </div>
                <div v-if="confirmPassword.trim() !== ''" class="form-check mx-1">
                    <input class="form-check-input" type="checkbox" v-model="flexCheckTerms" id="flexCheckTerms"
                        required>
                    <label class="form-check-label" for="flexCheckTerms">
                        Ich stimme den <a href="">Nutzungsbedingungen</a> zu.
                    </label>
                </div>
                <div v-if="flexCheckTerms" class="form-check mx-1">
                    <input class="form-check-input" type="checkbox" v-model="flexCheckPrivacy" id="flexCheckPrivacy"
                        required>
                    <label class="form-check-label" for="flexCheckPrivacy">
                        Ich habe die <a href="">Datenschutzerklärung</a> gelesen.
                    </label>
                </div>
                <div class="d-flex justify-content-between mt-3">
                    <router-link class="btn btn-outline-primary" to="/login">zur Anmeldung</router-link>
                    <button class="btn btn-primary w-50" :disabled="!isFormValid">Registrieren</button>
                </div>
            </form>

            <!-- Erfolgs-/Fehlermeldung -->
            <Toast ref="toastRef" :message="toastMessage" :variant="toastVariant" />
        </div>
    </main>
</template>

<style scoped>
.form-wrapper {
    width: 100%;
    max-width: 400px;
}
</style>