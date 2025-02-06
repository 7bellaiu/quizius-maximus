<script setup>
import { ref, onMounted, computed } from "vue";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useRouter } from "vue-router";

/** REFERENCES */
const router = useRouter();
const toastRef = ref(null);

/** STATES */
const email = ref("");
const currentPassword = ref("");
const toastMessage = ref("");
const toastVariant = ref("");
const userLoggedIn = ref(false);
const isFormValid = computed(() => email.value.trim() && currentPassword.value.trim());

/** FUNCTIONS & HANDLERS */
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

const handleLogin = () => {
    signInWithEmailAndPassword(getAuth(), email.value, currentPassword.value)
        .then((data) => {
            console.log("Successfully logged in!", data);
        })
        .catch((error) => {
            console.error("Login failed!", error);
            toastMessage.value = "Login failed!";   //give no information bc hackers
            toastVariant.value = "danger";
            triggerToast();
        });
};

const triggerToast = () => {
    if (toastRef.value) {
        toastRef.value.showToast();
    }
};
</script>

<template>
    <main class="d-flex flex-column align-items-center">
        <div v-if="!userLoggedIn" class="p-3 mt-3 mb-3 form-wrapper">
            <h2 class="mb-3 text-center">Anmelden</h2>

            <form @submit.prevent="handleLogin">
                <div class="input-group mb-2">
                    <div class="input-group-text" aria-hidden="true">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            class="bi bi-envelope" viewBox="0 0 16 16">
                            <path
                                d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z" />
                        </svg>
                    </div>
                    <input type="email" class="form-control" id="email" placeholder="E-Mail" aria-label="E-Mail"
                        data-ddg-inputtype="credentials.email" v-model="email" required />
                </div>
                <div class="input-group mb-2">
                    <div class="input-group-text" aria-hidden="true">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            class="bi bi-lock" viewBox="0 0 16 16">
                            <path
                                d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1" />
                        </svg>
                    </div>
                    <input type="password" class="form-control" id="currentPassword" placeholder="Passwort"
                        aria-label="Passwort" data-ddg-inputtype="credentials.password.current"
                        v-model="currentPassword" required />
                </div>
                <div class="d-flex justify-content-between mt-3">
                    <router-link class="btn btn-outline-primary" to="/register">zur Registrierung</router-link>
                    <button class="btn btn-primary w-50" :disabled="!isFormValid">Anmelden</button>
                </div>
            </form>
            <Toast ref="toastRef" :message="toastMessage" :variant="toastVariant" />
        </div>

        <!-- Cards Section -->
        <div class="container mt-3">
            <div class="row justify-content-center">
                <div class="col-md-8 mb-3">
                    <div class="card border-info">
                        <div class="card-body text-center bg-info bg-opacity-75 text-bg-info">
                            <h4>Werde Teil der Community!</h4>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col-md-4 mb-3">
                    <div class="card border-info h-100">
                        <div class="card-body bg-info bg-opacity-25 text-center">
                            <strong>Lerne gemeinsam mit deinen Freund:innen und Komiliton:innen.</strong>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 mb-3">
                    <div class="card border-info h-100">
                        <div class="card-body bg-info bg-opacity-25 text-center">
                            <strong>Stellt euer Wissen gemeinsam oder gegeneinander unter Beweis.</strong>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col-md-4 mb-3">
                    <div class="card border-info h-100">
                        <div class="card-body bg-info bg-opacity-10 text-center">
                            <strong>Wähle zwischen Modulen und Lektionen was du konkret lernen möchtest - die Fragenkataloge
                                werden kontinuierlich aktualisiert und erweitert.</strong>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 mb-3">
                    <div class="card border-info h-100">
                        <div class="card-body bg-info bg-opacity-10 text-center">
                            <strong>Überwache deinen Wissensstand mithilfe deiner angezeigten Statistiken.</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped>
.form-wrapper {
    width: 100%;
    max-width: 400px;
}
</style>
