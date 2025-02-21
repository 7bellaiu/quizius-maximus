<script setup>
import { ref, onMounted } from "vue";
import { firestoreDB } from "@/main";
import { collection, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import DisplayProfileForm from "@/components/authentication/DisplayProfileForm.vue";
import ChangeUsernameForm from "@/components/authentication/ChangeUsernameForm.vue";
import ChangePasswordForm from "@/components/authentication/ChangePasswordForm.vue";
import PeopleIcon from "@/components/icons/PeopleIcon.vue";
import PersonIcon from "@/components/icons/PersonIcon.vue";
import PersonCircleIcon from "@/components/icons/PersonCircleIcon.vue";

const toastRef = ref(null);
const toastMessage = ref("");
const toastVariant = ref("");

const displayData = ref(true);
const changePassword = ref(false);
const changeUsername = ref(false);

const coopCorrectAnswers = ref(0);
const coopFalseAnswers = ref(0);
const compCorrectAnswers = ref(0);
const compFalseAnswers = ref(0);

const leaderboard = ref([]);

const handleChangePassword = () => {
    displayData.value = false;
    changeUsername.value = false;
    changePassword.value = true;
}

const handleChangeUsername = () => {
    displayData.value = false;
    changeUsername.value = true;
    changePassword.value = false;
}

const handleCancelEmit = (message) => {
    displayData.value = true;
    changeUsername.value = false;
    changePassword.value = false;
    toastMessage.value = message;
    toastVariant.value = "warning"
    triggerToast();
}

const handleSuccessEmit = (message) => {
    displayData.value = true;
    changePassword.value = false;
    changeUsername.value = false
    toastMessage.value = message;
    toastVariant.value = "success";
    triggerToast();
}

const triggerToast = () => {
    if (toastRef.value) {
        toastRef.value.showToast();
    }
};

// Funktion, um Benutzerdaten zu sammeln
const collectUserData = () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
        return {
            userUID: user.uid,
            userUsername: user.displayName || "Unbekannter Spieler"
        };
    } else {
        console.error("Kein Benutzer eingeloggt");
        return null;
    }
};

const fetchStatistics = async () => {
    const statisticsQuery = collection(firestoreDB, "statistics");
    const querySnapshot = await getDocs(statisticsQuery);

    const auth = getAuth();
    const currentUser = auth.currentUser;

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (currentUser && data.userUID === currentUser.uid) {
            coopCorrectAnswers.value = data.coopCorrectAnswers;
            coopFalseAnswers.value = data.coopFalseAnswers;
            compCorrectAnswers.value = data.compCorrectAnswers;
            compFalseAnswers.value = data.compFalseAnswers;
        }
    });

    // Berechne die Rangliste
    const leaderboardData = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const totalCorrectAnswers = data.coopCorrectAnswers + data.compCorrectAnswers;
        leaderboardData.push({ username: data.username || "Unbekannter Spieler", totalCorrectAnswers });
    });

    // Sortiere die Rangliste nach der Anzahl der richtigen Antworten und wähle die Top 10 aus
    leaderboard.value = leaderboardData
        .sort((a, b) => b.totalCorrectAnswers - a.totalCorrectAnswers)
        .slice(0, 10);
};

onMounted(() => {
    onAuthStateChanged(getAuth(), (user) => {
        if (user) {
            fetchStatistics();
        }
    });
});
</script>

<template>
    <main>
        <section class="row justify-content-center">
            <article class="p-3 mt-3 mb-3 form-wrapper">
                <h2 class="mb-3 text-center">Mein Profil</h2>
                <DisplayProfileForm v-if="displayData" />
                <ChangePasswordForm v-else-if="changePassword" @success="handleSuccessEmit"
                    @cancel="handleCancelEmit" />
                <ChangeUsernameForm v-else-if="changeUsername" @success="handleSuccessEmit"
                    @cancel="handleCancelEmit" />
                <div v-if="!changeUsername && !changePassword" class="d-flex justify-content-between mt-3">
                    <button @click="handleChangePassword" class="btn btn-secondary" :disabled="changePassword">Passwort
                        ändern</button>
                    <button @click="handleChangeUsername" class="btn btn-primary"
                        :disabled="changeUsername">Benutzername
                        ändern</button>
                </div>
                <Toast ref="toastRef" :message="toastMessage" :variant="toastVariant" />
            </article>

            <h3 class="mt-2 text-center">Statistiken</h3>
            <!-- Meine Quizze -->
            <div class="row justify-content-center mt-3">
                <div class="col-md-4 mb-5">
                    <div class="card border-info m-2 h-100">
                        <div class="card-header bg-info bg-opacity-50 text-bg-info">
                            <h5 class="card-title">
                                <strong>Meine Quizze</strong>
                            </h5>
                        </div>
                        <div class="card-body">
                            <PeopleIcon class="text-success me-2" /><strong>Kooperativ:</strong>
                            <p>Anzahl richtige Fragen: {{ coopCorrectAnswers }}</p>
                            <p>Anzahl falsche Fragen: {{ coopFalseAnswers }}</p>
                            <PersonIcon class="text-danger me-2" /><strong>Kompetitiv:</strong>
                            <p>Anzahl richtige Fragen: {{ compCorrectAnswers }}</p>
                            <p>Anzahl falsche Fragen: {{ compFalseAnswers }}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 mb-5">
                    <div class="card border-info m-2 h-100">
                        <div class="card-header bg-info bg-opacity-50 text-bg-info">
                            <h5 class="card-title">
                                <strong>Rangliste - Top 10</strong>
                            </h5>
                        </div>
                        <div class="card-body">
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Benutzername</th>
                                        <th scope="col">Punktzahl</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(user, index) in leaderboard" :key="user.username">
                                        <th scope="row">{{ index + 1 }}</th>
                                        <td>
                                            <PersonCircleIcon class="text-secondary me-2" />{{ user.username }}
                                        </td>
                                        <td>{{ user.totalCorrectAnswers }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
</template>

<style scoped>
.form-wrapper {
    width: 100%;
    max-width: 400px;
}
</style>